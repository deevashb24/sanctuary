-- ==========================================
-- EXERCISES SUITE MIGRATION
-- Run this in your Supabase SQL Editor after supabase-schema.sql
-- ==========================================

-- ──────────────────────────────────────────
-- 1. MOOD LOGS TABLE (for Vibe Check Tracker)
-- ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.mood_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own mood logs" ON public.mood_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own mood logs" ON public.mood_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood logs" ON public.mood_logs
  FOR DELETE USING (auth.uid() = user_id);

-- ──────────────────────────────────────────
-- 2. FOCUS POINTS COLUMN (for Mindful Focus Timer)
-- ──────────────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS focus_points INTEGER NOT NULL DEFAULT 0;

-- ──────────────────────────────────────────
-- 3. FOCUS SESSIONS TABLE (audit log)
-- ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes IN (5, 10, 20)),
  points_earned INTEGER NOT NULL DEFAULT 10,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own focus sessions" ON public.focus_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own focus sessions" ON public.focus_sessions
  FOR SELECT USING (auth.uid() = user_id);
