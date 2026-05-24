import { createClient } from './src/utils/supabase/client'
const supabase = createClient()
const x = supabase.from('chat_sessions')
x.select('*')
