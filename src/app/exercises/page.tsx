'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

const EXERCISES = [
  {
    href: '/exercises/breathe',
    id: 'exercise-card-breathe',
    icon: 'air',
    title: 'Box Breathing',
    subtitle: 'Calm your nervous system',
    duration: '4 min',
    tag: 'Breathwork',
    gradient: 'linear-gradient(135deg, rgba(99,210,255,0.12) 0%, rgba(45,212,191,0.06) 100%)',
    border: 'rgba(99,210,255,0.2)',
    glow: 'rgba(99,210,255,0.08)',
    tagColor: 'rgba(99,210,255,0.15)',
    tagText: '#63d2ff',
    iconColor: '#63d2ff',
    description:
      'The 4-4-4-4 box breathing technique activates the parasympathetic nervous system, reducing cortisol and anchoring your focus.',
  },
  {
    href: '/exercises/reframe',
    id: 'exercise-card-reframe',
    icon: 'psychology',
    title: 'Cognitive Reframing',
    subtitle: 'Challenge unhelpful thoughts',
    duration: '5 – 10 min',
    tag: 'CBT',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.06) 100%)',
    border: 'rgba(139,92,246,0.2)',
    glow: 'rgba(139,92,246,0.08)',
    tagColor: 'rgba(139,92,246,0.15)',
    tagText: '#a78bfa',
    iconColor: '#a78bfa',
    description:
      'A guided CBT journaling flow to identify, examine, and reframe the automatic thoughts keeping you stuck in a loop.',
  },
  {
    href: '/exercises/vibe',
    id: 'exercise-card-vibe',
    icon: 'mood',
    title: 'Vibe Check',
    subtitle: 'Log your emotional state',
    duration: '< 1 min',
    tag: 'Mood Tracking',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(251,146,60,0.06) 100%)',
    border: 'rgba(251,191,36,0.2)',
    glow: 'rgba(251,191,36,0.06)',
    tagColor: 'rgba(251,191,36,0.15)',
    tagText: '#fbbf24',
    iconColor: '#fbbf24',
    description:
      `A quick cinematic mood slider that dynamically shifts your environment's color palette and saves your check-in.`,
  },
  {
    href: '/exercises/focus',
    id: 'exercise-card-focus',
    icon: 'timer',
    title: 'Mindful Focus',
    subtitle: 'Deep work, gamified',
    duration: '5 · 10 · 20 min',
    tag: 'Productivity',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.1) 0%, rgba(45,212,191,0.06) 100%)',
    border: 'rgba(52,211,153,0.2)',
    glow: 'rgba(52,211,153,0.06)',
    tagColor: 'rgba(52,211,153,0.12)',
    tagText: '#34d399',
    iconColor: '#34d399',
    description:
      'A minimalist countdown with a circular progress ring. Complete sessions uninterrupted to earn Focus Points.',
  },
  {
    href: '/exercises/vault',
    id: 'exercise-card-vault',
    icon: 'lock',
    title: 'Accountability Vault',
    subtitle: 'Stake-to-Disconnect',
    duration: '15 · 30 · 60 min',
    tag: 'Web3',
    gradient: 'linear-gradient(135deg, rgba(20,184,166,0.1) 0%, rgba(16,185,129,0.06) 100%)',
    border: 'rgba(20,184,166,0.2)',
    glow: 'rgba(20,184,166,0.06)',
    tagColor: 'rgba(20,184,166,0.12)',
    tagText: '#5eead4',
    iconColor: '#5eead4',
    description:
      'Lock up SOL before a focus session. Leave the tab and your stake is slashed. Complete it and earn rewards.',
  },
];

export default function ExercisesPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen text-on-surface antialiased relative overflow-x-hidden"
      style={{ background: 'linear-gradient(135deg, #001719 0%, #002f33 50%, #0D2527 100%)' }}
    >
      {/* Grain overlay */}
      <div className="grain-overlay pointer-events-none fixed inset-0 z-0" />

      {/* Atmospheric glows */}
      <div className="fixed top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none" style={{ background: 'rgba(75,108,201,0.08)' }} />
      <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(45,212,191,0.05)' }} />

      {/* Grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20 z-0"
        style={{
          backgroundImage: 'linear-gradient(to right, #1a2e30 1px, transparent 1px), linear-gradient(to bottom, #1a2e30 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 60%, transparent 100%)',
        }}
      />

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* ── Sidebar ── */}
        <nav className="hidden md:flex flex-col py-12 gap-6 bg-surface-container-low/60 backdrop-blur-xl h-screen w-64 fixed left-0 top-0 border-r border-soft-white/10 z-50">
          <div className="px-6 mb-4 flex flex-col items-center text-center gap-2">
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Sanctuary</h1>
            <p className="font-label-caps text-label-caps text-on-surface-variant/70 uppercase">Stay Grounded</p>
          </div>

          <div className="flex flex-col gap-2 flex-1 px-4">
            {[
              { href: '/dashboard', icon: 'spa', label: 'Daily Flow' },
              { href: '/chat', icon: 'auto_awesome', label: 'Sanctuary AI' },
              { href: '/exercises', icon: 'self_improvement', label: 'Exercises', active: true },
              { href: '/onboard', icon: 'self_care', label: 'Check-In' },
              { href: '/insights', icon: 'psychology', label: 'Insights' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 py-3 pl-4 font-body-md hover:bg-primary-container/10 transition-all duration-200 group border-l-4 ${
                  item.active
                    ? 'text-primary font-bold border-primary'
                    : 'text-on-surface-variant hover:text-primary border-transparent'
                }`}
              >
                <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {item.icon}
                </span>
                <span className="group-hover:translate-x-1 duration-200">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2 px-4 pb-6">
            <button onClick={() => router.push('/settings')} className="flex items-center gap-4 py-2 text-on-surface-variant pl-4 hover:text-primary hover:bg-primary-container/10 transition-all duration-200">
              <span className="material-symbols-outlined text-[20px]">settings</span>
              <span className="font-body-md text-sm">Settings</span>
            </button>
          </div>
        </nav>

        {/* ── Main Content ── */}
        <main className="flex-1 md:ml-64 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 md:px-16 py-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center gap-2 text-teal-400 text-[10px] font-semibold tracking-[0.2em] uppercase mb-3">
                <span className="material-symbols-outlined text-[14px]">self_improvement</span>
                <span>Mindfulness Suite</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-light text-soft-white mb-3 leading-tight">
                Exercises
              </h1>
              <p className="text-on-surface-variant text-lg max-w-xl leading-relaxed">
                Science-backed mental wellness practices. Choose a session and let the environment guide you.
              </p>
            </motion.div>

            {/* Exercise Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {EXERCISES.map((ex, i) => (
                <motion.div
                  key={ex.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                >
                  <Link
                    href={ex.href}
                    id={ex.id}
                    className="group block p-7 rounded-3xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01]"
                    style={{
                      background: ex.gradient,
                      border: `1px solid ${ex.border}`,
                      boxShadow: `0 0 40px ${ex.glow}`,
                    }}
                  >
                    {/* Hover shimmer */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${ex.glow.replace('0.08', '0.15').replace('0.06', '0.12')}, transparent 60%)`,
                      }}
                    />

                    <div className="relative z-10">
                      {/* Tag + duration row */}
                      <div className="flex items-center justify-between mb-5">
                        <span
                          className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full"
                          style={{ background: ex.tagColor, color: ex.tagText }}
                        >
                          {ex.tag}
                        </span>
                        <span className="text-[10px] font-mono text-on-surface-variant/40 tracking-wider">
                          {ex.duration}
                        </span>
                      </div>

                      {/* Icon */}
                      <span
                        className="material-symbols-outlined text-[36px] mb-4 block transition-transform duration-300 group-hover:scale-110"
                        style={{ color: ex.iconColor, fontVariationSettings: "'wght' 200" }}
                      >
                        {ex.icon}
                      </span>

                      {/* Title */}
                      <h2 className="text-xl font-medium text-soft-white mb-1 group-hover:text-white transition-colors">
                        {ex.title}
                      </h2>
                      <p className="text-sm font-light" style={{ color: ex.iconColor }}>
                        {ex.subtitle}
                      </p>

                      <p className="text-xs text-on-surface-variant/60 leading-relaxed mt-3">
                        {ex.description}
                      </p>

                      {/* CTA arrow */}
                      <div className="flex items-center gap-1.5 mt-5 text-xs font-mono tracking-wider"
                        style={{ color: ex.tagText }}>
                        <span>Begin session</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom callout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10 p-5 rounded-2xl text-center"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <p className="text-xs text-on-surface-variant/40 font-mono tracking-wider">
                All exercises are private and end-to-end secured by row-level security.
                Your data never leaves your account.
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
