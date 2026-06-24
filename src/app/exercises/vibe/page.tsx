'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import VibeCheckMoodTracker from '@/components/exercises/VibeCheckMoodTracker';

export default function VibePage() {
  const router = useRouter();
  const [gradient, setGradient] = useState({
    from: '#1e293b',
    via: '#0f3460',
    to: '#16213e',
  });

  const handleGradientChange = useCallback((from: string, via: string, to: string) => {
    setGradient({ from, via, to });
  }, []);

  return (
    <motion.div
      className="min-h-screen flex flex-col relative overflow-hidden"
      animate={{
        background: `radial-gradient(ellipse at 50% 40%, ${gradient.via}55 0%, transparent 60%), linear-gradient(160deg, ${gradient.from} 0%, ${gradient.via} 50%, ${gradient.to} 100%)`,
      }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
    >
      {/* Grain overlay */}
      <div className="grain-overlay pointer-events-none fixed inset-0 z-0" />

      {/* Dynamic ambient glow */}
      <motion.div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none"
        animate={{ background: `${gradient.via}20` }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />

      {/* Top nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <Link href="/exercises" className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-sm font-mono">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Exercises
        </Link>
        <div>
          <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Vibe Check · Mood Log</span>
        </div>
        <button onClick={() => router.push('/dashboard')} className="text-white/40 hover:text-white/80 transition-colors">
          <span className="material-symbols-outlined text-[18px]">home</span>
        </button>
      </nav>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8 gap-10">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light text-white/90">How are you feeling?</h1>
          <p className="text-sm text-white/40 font-mono">Drag the slider and let the world know your vibe</p>
        </div>

        {/* Component */}
        <div className="w-full max-w-lg">
          <VibeCheckMoodTracker onGradientChange={handleGradientChange} />
        </div>
      </main>

      <footer className="relative z-10 text-center pb-8">
        <p className="text-[10px] font-mono text-white/20 tracking-widest uppercase">
          Sanctuary · Daily Mood
        </p>
      </footer>
    </motion.div>
  );
}
