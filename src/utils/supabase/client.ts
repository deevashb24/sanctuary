import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'
import { SupabaseClient } from '@supabase/supabase-js'

export function createClient(): SupabaseClient<Database> {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://dummy-url.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key'
  )
}
