'use client';

import { VibeDashboard } from '@/components/dashboard/VibeDashboard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function B2BDashboardPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white py-12 px-6">
      {/* Universal Grain */}
      <div className="grain-overlay pointer-events-none fixed inset-0 z-50 opacity-[0.05]" />
      
      {/* Top Nav */}
      <header className="fixed top-0 left-0 w-full p-6 md:p-10 z-40 pointer-events-none">
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-mono uppercase tracking-widest pointer-events-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Personal
        </Link>
      </header>

      <div className="pt-20">
        <VibeDashboard />
      </div>
    </main>
  );
}
