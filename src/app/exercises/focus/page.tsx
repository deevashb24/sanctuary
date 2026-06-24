'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MindfulFocusTimer from '@/components/exercises/MindfulFocusTimer';

export default function FocusPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 60%, rgba(52,211,153,0.05) 0%, transparent 55%), linear-gradient(160deg, #000a0a 0%, #001210 40%, #00100a 100%)',
      }}
    >
      {/* Grain overlay */}
      <div className="grain-overlay pointer-events-none fixed inset-0 z-0" />

      {/* Ambient */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[180px] pointer-events-none" style={{ background: 'rgba(52,211,153,0.03)' }} />
      <div className="fixed bottom-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(45,212,191,0.03)' }} />

      {/* Top nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <Link href="/exercises" className="flex items-center gap-2 text-on-surface-variant/60 hover:text-soft-white transition-colors text-sm font-mono">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Exercises
        </Link>
        <div>
          <span className="text-[10px] font-mono text-on-surface-variant/40 tracking-widest uppercase">Mindful Focus · Deep Work</span>
        </div>
        <button onClick={() => router.push('/dashboard')} className="text-on-surface-variant/50 hover:text-soft-white transition-colors">
          <span className="material-symbols-outlined text-[18px]">home</span>
        </button>
      </nav>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <MindfulFocusTimer />
        </div>
      </main>

      <footer className="relative z-10 text-center pb-8">
        <p className="text-[10px] font-mono text-on-surface-variant/25 tracking-widest uppercase">
          Sanctuary · Focus Sessions
        </p>
      </footer>
    </div>
  );
}
