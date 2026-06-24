import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Supabase OAuth Callback Handler
 *
 * After Google (or any provider) redirects back, Supabase appends a `code`
 * query param. This route exchanges that code for a real session cookie.
 * Without this, Google OAuth silently fails — the user is redirected but
 * never actually authenticated.
 *
 * Supabase dashboard → Authentication → URL Configuration must have:
 *   Site URL:          http://localhost:3001  (or your production URL)
 *   Redirect URLs:     http://localhost:3001/auth/callback
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'
  const origin = requestUrl.origin

  if (code) {
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
            } catch {
              // Called from a Server Component — safe to ignore,
              // middleware will keep the session alive.
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Successful login — redirect to intended destination
      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error('[auth/callback] Code exchange failed:', error.message)
  }

  // Something went wrong — send to login with an error hint
  return NextResponse.redirect(
    `${origin}/login?error=auth_callback_failed`
  )
}
