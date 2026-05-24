import { Database } from './src/types/supabase'
import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient<Database>('http://1', '2')
const x = supabase.from('chat_sessions')
x.select('*')
