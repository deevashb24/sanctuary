import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

// Initialize the SDK. It automatically picks up GEMINI_API_KEY from environment variables.
const ai = new GoogleGenAI({})

import { apiRateLimiter } from '@/utils/rate-limit'

// Zod Schema
const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(2000, "Message is too long"),
  sessionId: z.string().uuid("Invalid session ID format")
});

export async function POST(req: Request) {
  try {
    const jsonBody = await req.json()
    const parsed = chatRequestSchema.safeParse(jsonBody)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload', details: parsed.error.issues }, { status: 400 })
    }

    const { message, sessionId } = parsed.data

    // Server-side auth check
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (error) {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
            }
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const rateLimitResult = apiRateLimiter(user.id)
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
    }

    // Fetch previous messages for context
    const { data: previousMessages } = await supabase
      .from('messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    const contents: Array<{ role: string; parts: { text: string }[] }> = []

    if (previousMessages) {
      for (const msg of previousMessages) {
        // Map 'assistant' from DB to 'model' for Gemini
        const mappedRole = msg.role === 'assistant' ? 'model' : 'user';
        contents.push({
          role: mappedRole,
          parts: [{ text: msg.content }]
        })
      }
    }

    // Insert user's new message into DB
    await supabase.from('messages').insert({
      session_id: sessionId,
      user_id: user.id,
      role: 'user',
      content: message
    })

    // Add current message to contents array
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    })

    const systemInstruction = "You are Sanctuary, a compassionate, empathetic, and professional AI mental health companion. You listen to the user without judgment, offer gentle reflections, and help them process their emotions. Keep your responses concise (2-3 paragraphs max) and conversational. Do not provide medical diagnoses or prescribe medication. If the user appears to be in an emergency, recommend they seek professional help."

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    })

    const replyText = response.text || "I'm having trouble understanding right now.";

    // Insert assistant's reply into DB
    await supabase.from('messages').insert({
      session_id: sessionId,
      user_id: user.id,
      role: 'assistant',
      content: replyText
    })

    return NextResponse.json({ reply: replyText })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
