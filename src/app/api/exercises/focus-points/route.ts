import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { z } from 'zod'

const POINTS_PER_SESSION = 10

const focusSchema = z.object({
  duration_minutes: z.number().int().refine((v) => [5, 10, 20].includes(v), {
    message: 'Duration must be 5, 10, or 20 minutes',
  }),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = focusSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { duration_minutes } = parsed.data

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch { /* called from Server Component */ }
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Log the focus session
    await supabase.from('focus_sessions').insert({
      user_id: user.id,
      duration_minutes,
      points_earned: POINTS_PER_SESSION,
    })

    // Increment focus_points on profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('focus_points')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    const newPoints = (profile.focus_points ?? 0) + POINTS_PER_SESSION

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ focus_points: newPoints })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update focus points' }, { status: 500 })
    }

    return NextResponse.json({
      focus_points: newPoints,
      points_earned: POINTS_PER_SESSION,
    }, { status: 200 })
  } catch (error) {
    console.error('Focus points API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch { /* called from Server Component */ }
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('focus_points')
      .eq('id', user.id)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch focus points' }, { status: 500 })
    }

    return NextResponse.json({ focus_points: data?.focus_points ?? 0 })
  } catch (error) {
    console.error('Focus points GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
