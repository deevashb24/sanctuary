import { createClient } from './src/utils/supabase/client'
const supabase = createClient()
supabase.from('chat_sessions').select('*')
