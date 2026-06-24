'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import { createClient } from '@/utils/supabase/client';
import { Activity, ShieldCheck, Sparkles } from 'lucide-react';

// Dynamically import the 3D scene (SSR disabled — WebGL requires browser)
const MindscapeScene = dynamic(() => import('@/components/dashboard/MindscapeScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border border-teal-400/20 animate-ping" />
    </div>
  ),
});

// ── State label map ──────────────────────
const STATE_LABELS: Record<number, { label: string; sub: string; color: string }> = {
  1:  { label: 'Serene',     sub: 'Deep calm. You are at peace.',              color: '#2dd4bf' },
  2:  { label: 'Tranquil',   sub: 'Relaxed and centered.',                     color: '#38bdf8' },
  3:  { label: 'Calm',       sub: 'Steady breath, clear mind.',                color: '#60a5fa' },
  4:  { label: 'Balanced',   sub: 'Gently present.',                           color: '#818cf8' },
  5:  { label: 'Neutral',    sub: 'Neither stressed nor relaxed.',             color: '#a78bfa' },
  6:  { label: 'Restless',   sub: 'A little on edge.',                         color: '#c084fc' },
  7:  { label: 'Tense',      sub: 'Noticeable tension building.',              color: '#e879f9' },
  8:  { label: 'Stressed',   sub: 'Your system is activated.',                 color: '#f97316' },
  9:  { label: 'Overwhelmed',sub: 'It feels like too much right now.',        color: '#ef4444' },
  10: { label: 'Crisis',     sub: 'Please breathe. You are not alone.',        color: '#dc2626' },
};

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>('Friend');
  const [stressLevel, setStressLevel] = useState<number>(3);
  const [pendingStress, setPendingStress] = useState<number>(3);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sessionTime, setSessionTime] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name?.split(' ')[0] || 'Friend');
      }
    }
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update session clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setSessionTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // Commit stress level change (brief delay so the orb finishes spinning)
  const commitStress = useCallback((val: number) => {
    setPendingStress(val);
    setIsTransitioning(true);
    setTimeout(() => {
      setStressLevel(val);
      setIsTransitioning(false);
    }, 300);
  }, []);

  const stateInfo = STATE_LABELS[stressLevel] ?? STATE_LABELS[5];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: '#000a0c' }}
    >
      {/* ── Grain texture overlay ── */}
      <div className="grain-overlay pointer-events-none fixed inset-0 z-10 opacity-[0.04]" />

      {/* ── Ambient color bleed (reacts to stress) ── */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        animate={{
          background: stressLevel >= 8
            ? 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(124,58,237,0.12) 0%, transparent 70%)'
            : stressLevel >= 5
              ? 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)'
              : 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(45,212,191,0.07) 0%, transparent 70%)',
        }}
        transition={{ duration: 2.4, ease: 'easeInOut' }}
      />

      {/* ── Grid lines ── */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06] z-0"
        style={{
          backgroundImage: 'linear-gradient(to right, #1a2e30 1px, transparent 1px), linear-gradient(to bottom, #1a2e30 1px, transparent 1px)',
          backgroundSize: '5rem 5rem',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 60%, transparent 100%)',
        }}
      />

      {/* ── App Shell ── */}
      <div className="flex h-screen overflow-hidden relative z-20">

        {/* ───────── Sidebar ───────── */}
        <nav
          className="hidden md:flex flex-col py-12 gap-8 h-screen w-20 fixed left-0 top-0 border-r z-50 items-center"
          style={{ background: 'rgba(0,10,12,0.7)', borderColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}
        >
          {/* Logo icon */}
          <div className="flex flex-col items-center gap-1.5 mb-4">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.2)' }}
            >
              <span className="material-symbols-outlined text-[20px] text-teal-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                spa
              </span>
            </div>
          </div>

          {/* Nav icons */}
          <div className="flex flex-col gap-5 flex-1">
            {[
              { href: '/dashboard', icon: 'home', active: true, tip: 'Home' },
              { href: '/chat', icon: 'auto_awesome', tip: 'AI Companion' },
              { href: '/exercises', icon: 'self_improvement', tip: 'Exercises' },
              { href: '/b2b/dashboard', icon: 'bar_chart', tip: 'Team Vibe' },
              { href: '/onboard', icon: 'self_care', tip: 'Check-In' },
              { href: '/insights', icon: 'psychology', tip: 'Insights' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                title={item.tip}
                className="group relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200"
                style={{
                  background: item.active ? 'rgba(45,212,191,0.12)' : 'transparent',
                  border: item.active ? '1px solid rgba(45,212,191,0.25)' : '1px solid transparent',
                }}
              >
                <span
                  className="material-symbols-outlined text-[20px] transition-colors duration-200"
                  style={{
                    color: item.active ? '#2dd4bf' : 'rgba(255,255,255,0.25)',
                    fontVariationSettings: item.active ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {item.icon}
                </span>
                {/* Tooltip */}
                <div className="absolute left-14 hidden group-hover:block px-2 py-1 rounded text-xs font-mono whitespace-nowrap z-50"
                  style={{ background: 'rgba(0,10,12,0.95)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                  {item.tip}
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom */}
          <div className="flex flex-col gap-4">
            <button
              onClick={() => router.push('/settings')}
              title="Settings"
              className="flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 hover:bg-white/5"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ color: 'rgba(255,255,255,0.2)' }}>settings</span>
            </button>
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 hover:bg-red-500/10"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ color: 'rgba(239,68,68,0.5)' }}>logout</span>
            </button>
          </div>
        </nav>

        {/* ───────── Main ───────── */}
        <main className="flex-1 md:ml-20 relative overflow-hidden">
          <div className="flex flex-col h-full">

            {/* ── Top bar ── */}
            <header
              className="flex items-center justify-between px-6 md:px-10 py-5 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
            >
              <div>
                <div className="flex items-center gap-1.5 mb-1" style={{ color: '#2dd4bf' }}>
                  <Sparkles size={11} />
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase">Secure Session · {sessionTime}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-light" style={{ color: '#f8fafc' }}>
                  {greeting()}, {userName}.
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full text-xs"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}
                >
                  <div className="flex items-center gap-1.5">
                    <Activity size={12} className="text-emerald-400 animate-pulse" />
                    <span className="font-mono">Real-Time AI</span>
                  </div>
                  <div className="w-px h-3 bg-white/10" />
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-teal-400" />
                    <span className="font-mono">RLS Active</span>
                  </div>
                </div>
              </div>
            </header>

            {/* ── Hero: 3D Orb + Stress Control ── */}
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-0 overflow-hidden min-h-0">

              {/* Left — State info (desktop) */}
              <motion.div
                className="hidden lg:flex flex-col justify-center pl-10 xl:pl-16 w-72 shrink-0"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-mono tracking-[0.25em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      Mindscape State
                    </p>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={stressLevel}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                      >
                        <h2
                          className="text-4xl font-light mb-2 tracking-tight"
                          style={{ color: stateInfo.color }}
                        >
                          {stateInfo.label}
                        </h2>
                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          {stateInfo.sub}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Stress indicator bars */}
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-mono tracking-widest uppercase mb-3" style={{ color: 'rgba(255,255,255,0.18)' }}>
                      Intensity Level
                    </p>
                    <div className="flex items-end gap-1 h-8">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <motion.div
                          key={n}
                          className="flex-1 rounded-full"
                          animate={{
                            height: n <= stressLevel ? `${20 + (n / 10) * 80}%` : '15%',
                            background: n <= stressLevel ? stateInfo.color : 'rgba(255,255,255,0.06)',
                            opacity: n <= stressLevel ? 1 : 0.4,
                          }}
                          transition={{ duration: 0.6, delay: n * 0.03 }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="space-y-2">
                    <Link
                      href="/exercises/breathe"
                      className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm transition-all duration-200 group"
                      style={{ background: 'rgba(45,212,191,0.06)', border: '1px solid rgba(45,212,191,0.12)', color: 'rgba(255,255,255,0.6)' }}
                    >
                      <span className="material-symbols-outlined text-[16px] text-teal-400">air</span>
                      <span>Box Breathing</span>
                      <span className="ml-auto text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>4 min</span>
                    </Link>
                    <Link
                      href="/chat"
                      className="flex items-center gap-3 py-3 px-4 rounded-xl text-sm transition-all duration-200"
                      style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.12)', color: 'rgba(255,255,255,0.6)' }}
                    >
                      <span className="material-symbols-outlined text-[16px]" style={{ color: '#818cf8' }}>auto_awesome</span>
                      <span>Talk to AI</span>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Center — 3D Orb Canvas */}
              <div className="flex-1 relative flex items-center justify-center min-h-0 w-full">
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <MindscapeScene stressLevel={stressLevel} />
                </motion.div>

                {/* Center label (mobile) */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:hidden text-center pointer-events-none">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={stressLevel}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="text-xl font-light"
                      style={{ color: stateInfo.color }}
                    >
                      {stateInfo.label}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Right — Controls */}
              <motion.div
                className="hidden lg:flex flex-col justify-center pr-10 xl:pr-16 w-72 shrink-0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="space-y-7">
                  {/* Stress slider */}
                  <div>
                    <p className="text-[10px] font-mono tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
                      How stressed do you feel?
                    </p>
                    <input
                      id="dashboard-stress-slider"
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={pendingStress}
                      onChange={(e) => commitStress(Number(e.target.value))}
                      className="vibe-slider w-full"
                      style={{
                        '--slider-accent': stateInfo.color,
                      } as React.CSSProperties}
                    />
                    <div className="flex justify-between mt-2">
                      {[1, 5, 10].map((n) => (
                        <span key={n} className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
                          {n === 1 ? 'Calm' : n === 5 ? 'Moderate' : 'Crisis'}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Weekly rhythm */}
                  <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-[16px] text-teal-400" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                      <p className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>Weekly Rhythm</p>
                    </div>
                    <div className="flex justify-between items-end">
                      {(['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const).map((day, i) => {
                        const done = [0, 1, 3].includes(i);
                        const today = i === 4;
                        return (
                          <div key={`${day}-${i}`} className="flex flex-col items-center gap-1.5">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px]"
                              style={{
                                background: done ? 'rgba(45,212,191,0.15)' : today ? 'rgba(99,210,255,0.15)' : 'transparent',
                                border: done ? '1px solid rgba(45,212,191,0.4)' : today ? '1px solid rgba(99,210,255,0.4)' : '1px solid rgba(255,255,255,0.06)',
                                color: done ? '#2dd4bf' : today ? '#63d2ff' : 'rgba(255,255,255,0.2)',
                              }}
                            >
                              {done && <span className="material-symbols-outlined text-[10px]">check</span>}
                              {today && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse block" />}
                            </div>
                            <span className="text-[8px] font-mono uppercase" style={{ color: today ? '#63d2ff' : 'rgba(255,255,255,0.15)' }}>{day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Exercise quick-access */}
                  <div>
                    <p className="text-[10px] font-mono tracking-widest uppercase mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>Exercises</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { href: '/exercises/breathe', icon: 'air', label: 'Breathe', color: '#2dd4bf' },
                        { href: '/exercises/reframe', icon: 'psychology', label: 'Reframe', color: '#a78bfa' },
                        { href: '/exercises/vibe', icon: 'mood', label: 'Vibe', color: '#fbbf24' },
                        { href: '/exercises/focus', icon: 'timer', label: 'Focus', color: '#34d399' },
                        { href: '/exercises/vault', icon: 'lock', label: 'Vault', color: '#5eead4' },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex flex-col items-center gap-2 py-3 rounded-xl text-center transition-all duration-200 hover:scale-[1.02]"
                          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <span className="material-symbols-outlined text-[18px]" style={{ color: item.color, fontVariationSettings: "'wght' 200" }}>{item.icon}</span>
                          <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── Mobile bottom bar ── */}
            <div
              className="md:hidden flex items-center justify-around px-4 py-4 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,10,12,0.8)', backdropFilter: 'blur(20px)' }}
            >
              {/* Mobile stress slider */}
              <div className="flex-1 px-4">
                <input
                  id="dashboard-stress-slider-mobile"
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={pendingStress}
                  onChange={(e) => commitStress(Number(e.target.value))}
                  className="vibe-slider w-full"
                  style={{ '--slider-accent': stateInfo.color } as React.CSSProperties}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[8px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>Calm</span>
                  <span className="text-[8px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>Crisis</span>
                </div>
              </div>
              <Link href="/exercises" className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-[20px]" style={{ color: '#2dd4bf' }}>self_improvement</span>
                <span className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>Exercises</span>
              </Link>
              <Link href="/chat" className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-[20px]" style={{ color: '#a78bfa' }}>auto_awesome</span>
                <span className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>AI</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
