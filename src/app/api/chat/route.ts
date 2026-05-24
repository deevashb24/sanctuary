import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

// Initialize the SDK. It automatically picks up GEMINI_API_KEY from environment variables.
const ai = new GoogleGenAI({})

// Basic In-Memory Rate Limiting
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 10 * 1000; // 10 seconds
const MAX_REQUESTS = 5;

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
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://dummy-url.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key',
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
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate Limiting Check
    const now = Date.now();
    const rateLimitData = rateLimitMap.get(user.id) ?? { count: 0, lastReset: now };

    if (now - rateLimitData.lastReset > RATE_LIMIT_WINDOW) {
      rateLimitData.count = 1;
      rateLimitData.lastReset = now;
    } else {
      rateLimitData.count++;
    }

    rateLimitMap.set(user.id, rateLimitData);

    if (rateLimitData.count > MAX_REQUESTS) {
      return NextResponse.json({ error: 'Too many requests. Please try again in a few seconds.' }, { status: 429 })
    }

    // Retrieve previous messages for this session to provide context
    const { data: previousMessages } = await supabase
      .from('chat_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(20) // Keep context window manageable

    let contents: Array<{ role: string; parts: { text: string }[] }> = []
    
    if (previousMessages) {
      contents = previousMessages.filter(m => m.role === 'user' || m.role === 'assistant').map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user', // Gemini uses 'model', not 'assistant'
        parts: [{ text: m.content }]
      }))
    }
    
    // Add the current message
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

    return NextResponse.json({ reply: response.text })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
