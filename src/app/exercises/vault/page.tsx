'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SolanaProvider } from '@/components/providers/SolanaProvider';
import { VaultTimer } from '@/components/exercises/VaultTimer';

export default function VaultPage() {
  return (
    <SolanaProvider>
      <div 
        className="min-h-screen relative overflow-hidden" 
        style={{ background: '#000a0c' }}
      >
        {/* Grain texture overlay */}
        <div className="grain-overlay pointer-events-none fixed inset-0 z-10 opacity-[0.04]" />
        
        {/* Grid lines */}
        <div 
          className="pointer-events-none fixed inset-0 opacity-[0.06] z-0"
          style={{ 
            backgroundImage: 'linear-gradient(to right, #1a2e30 1px, transparent 1px), linear-gradient(to bottom, #1a2e30 1px, transparent 1px)',
            backgroundSize: '5rem 5rem',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 60%, transparent 100%)',
          }}
        />

        {/* Top bar */}
        <header className="absolute top-0 left-0 w-full p-6 md:p-10 z-50 flex items-center justify-between">
          <Link 
            href="/exercises"
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-mono uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Exercises
          </Link>
        </header>

        {/* Main Content */}
        <main className="relative z-20 flex min-h-screen items-center justify-center p-6">
          <VaultTimer />
        </main>

      </div>
    </SolanaProvider>
  );
}
