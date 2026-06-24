import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

/**
 * Next.js 16 Proxy (replaces the deprecated `middleware` convention).
 * The exported function must be named `proxy` (default or named export).
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - Static media  (svg, png, jpg, jpeg, gif, webp)
     * - auth/callback (must reach the route handler unauthenticated to
     *                  exchange the OAuth code before a session exists)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
