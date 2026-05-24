export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          timezone: string | null
          created_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          timezone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          timezone?: string | null
          created_at?: string
        }
        Relationships: []
      }
      mood_logs: {
        Row: {
          id: string
          user_id: string
          primary_emotion: string
          secondary_emotion: string | null
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          primary_emotion: string
          secondary_emotion?: string | null
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          primary_emotion?: string
          secondary_emotion?: string | null
          note?: string | null
          created_at?: string
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          title: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          created_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          user_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
