'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BoxBreathingPacer from '@/components/exercises/BoxBreathingPacer';

export default function BreathePage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 60% 40%, rgba(99,210,255,0.07) 0%, transparent 60%), linear-gradient(160deg, #000d10 0%, #001219 40%, #001a2c 100%)',
      }}
    >
      {/* Grain overlay */}
      <div className="grain-overlay pointer-events-none fixed inset-0 z-0" />

      {/* Ambient glows */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none" style={{ background: 'rgba(99,210,255,0.04)' }} />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(45,212,191,0.04)' }} />

      {/* Top nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <Link href="/exercises" className="flex items-center gap-2 text-on-surface-variant/60 hover:text-soft-white transition-colors text-sm font-mono">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Exercises
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-on-surface-variant/40 tracking-widest uppercase">Box Breathing · 4-4-4-4</span>
        </div>
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-on-surface-variant/50 hover:text-soft-white transition-colors text-sm font-mono">
          <span className="material-symbols-outlined text-[18px]">home</span>
        </button>
      </nav>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg">
          <BoxBreathingPacer />
        </div>
      </main>

      {/* Footer callout */}
      <footer className="relative z-10 text-center pb-8">
        <p className="text-[10px] font-mono text-on-surface-variant/25 tracking-widest uppercase">
          Sanctuary · Breathwork
        </p>
      </footer>
    </div>
  );
}
