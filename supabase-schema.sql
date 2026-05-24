-- Supabase Starter Schema SQL Script
-- Run this in your Supabase SQL Editor (SQL Editor -> New Query -> Paste & Run)

-- ==========================================
-- 1. PROFILES TABLE & SECURITY
-- ==========================================

-- Create a table for user profiles linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ==========================================
-- 2. AUTOMATE PROFILE CREATION ON SIGN-UP
-- ==========================================

-- Create a trigger function that automatically inserts a profile on new auth user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    new.email,
    -- Generate a default unique username from email prefix + short uuid part if not provided
    COALESCE(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1) || '_' || substring(new.id::text from 1 for 4)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the function as a trigger to the auth.users table
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 3. STORAGE CONFIGURATION & POLICIES
-- ==========================================

-- Create a public bucket for user uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for the public uploads bucket
CREATE POLICY "Public Read Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can upload files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own uploaded files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'uploads' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own uploaded files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'uploads' AND auth.uid() = owner);

-- ==========================================
-- 4. EMOTION LOGS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.emotion_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  emotion TEXT NOT NULL,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.emotion_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own emotion logs" ON public.emotion_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own emotion logs" ON public.emotion_logs
  FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- 5. CHAT SESSIONS & MESSAGES TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own chat sessions" ON public.chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own chat sessions" ON public.chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" ON public.chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'crisis')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own messages" ON public.messages
  FOR SELECT USING (auth.uid() = user_id);
