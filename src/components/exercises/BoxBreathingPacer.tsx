'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Phase = 'idle' | 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

interface PhaseConfig {
  label: string;
  sublabel: string;
  duration: number; // ms
  targetScale: number;
  targetOpacity: number;
  glowColor: string;
}

const PHASES: PhaseConfig[] = [
  {
    label: 'Inhale',
    sublabel: 'breathe in slowly',
    duration: 4000,
    targetScale: 1.55,
    targetOpacity: 0.9,
    glowColor: '99, 210, 255',
  },
  {
    label: 'Hold',
    sublabel: 'retain the breath',
    duration: 4000,
    targetScale: 1.55,
    targetOpacity: 1,
    glowColor: '139, 92, 246',
  },
  {
    label: 'Exhale',
    sublabel: 'release slowly',
    duration: 4000,
    targetScale: 1,
    targetOpacity: 0.5,
    glowColor: '45, 212, 191',
  },
  {
    label: 'Hold',
    sublabel: 'rest in stillness',
    duration: 4000,
    targetScale: 1,
    targetOpacity: 0.4,
    glowColor: '99, 102, 241',
  },
];

const PHASE_NAMES: Phase[] = ['inhale', 'hold-in', 'exhale', 'hold-out'];

export default function BoxBreathingPacer() {
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [orbScale, setOrbScale] = useState(1);
  const [orbOpacity, setOrbOpacity] = useState(0.5);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseIndexRef = useRef(0);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  const runCountdown = useCallback((duration: number) => {
    const seconds = duration / 1000;
    setCountdown(seconds);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const advancePhase = useCallback(function advancePhase() {
    const nextIndex = (phaseIndexRef.current + 1) % 4;
    phaseIndexRef.current = nextIndex;
    setPhaseIndex(nextIndex);

    if (nextIndex === 0) {
      setCycles((c) => c + 1);
    }

    const phase = PHASES[nextIndex];
    setOrbScale(phase.targetScale);
    setOrbOpacity(phase.targetOpacity);
    runCountdown(phase.duration);

    timerRef.current = setTimeout(advancePhase, phase.duration);
  }, [runCountdown]);

  const startSession = useCallback(() => {
    setIsRunning(true);
    phaseIndexRef.current = 0;
    setPhaseIndex(0);
    setCycles(0);

    const firstPhase = PHASES[0];
    setOrbScale(firstPhase.targetScale);
    setOrbOpacity(firstPhase.targetOpacity);
    runCountdown(firstPhase.duration);

    timerRef.current = setTimeout(advancePhase, firstPhase.duration);
  }, [advancePhase, runCountdown]);

  const stopSession = useCallback(() => {
    clearTimers();
    setIsRunning(false);
    setPhaseIndex(0);
    setCountdown(4);
    setOrbScale(1);
    setOrbOpacity(0.5);
  }, [clearTimers]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const currentPhase = PHASES[phaseIndex];
  const currentPhaseName: Phase = isRunning ? PHASE_NAMES[phaseIndex] : 'idle';

  return (
    <div className="flex flex-col items-center justify-center min-h-full gap-10 select-none">

      {/* Stats Row */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/60 font-mono">Cycles</p>
          <p className="text-2xl font-light text-soft-white tabular-nums">{cycles}</p>
        </div>
        <div className="w-px h-8 bg-soft-white/10" />
        <div className="text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/60 font-mono">
            {isRunning ? 'Seconds' : 'Technique'}
          </p>
          <p className="text-2xl font-light text-soft-white tabular-nums">
            {isRunning ? countdown : '4-4-4-4'}
          </p>
        </div>
        <div className="w-px h-8 bg-soft-white/10" />
        <div className="text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-on-surface-variant/60 font-mono">Method</p>
          <p className="text-2xl font-light text-soft-white">Box</p>
        </div>
      </div>

      {/* Orb Container */}
      <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>

        {/* Outer ambient rings */}
        {isRunning && (
          <>
            <motion.div
              className="absolute rounded-full border border-white/5"
              animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 300, height: 300 }}
            />
            <motion.div
              className="absolute rounded-full border border-white/5"
              animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              style={{ width: 310, height: 310 }}
            />
          </>
        )}

        {/* Progress ring SVG */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 320 320">
          <circle
            cx="160" cy="160" r="145"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1.5"
          />
          {isRunning && (
            <motion.circle
              cx="160" cy="160" r="145"
              fill="none"
              stroke={`rgba(${currentPhase.glowColor}, 0.5)`}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 145}`}
              animate={{ strokeDashoffset: [0, -(2 * Math.PI * 145)] }}
              transition={{
                duration: currentPhase.duration / 1000,
                ease: 'linear',
                repeat: 0,
              }}
              key={`ring-${phaseIndex}-${cycles}`}
            />
          )}
        </svg>

        {/* The Orb */}
        <motion.div
          className="relative rounded-full backdrop-blur-md border border-white/10 flex flex-col items-center justify-center overflow-hidden"
          style={{
            width: 180,
            height: 180,
            background: `radial-gradient(circle at 35% 35%, rgba(${currentPhase.glowColor}, 0.25) 0%, rgba(0,23,25,0.7) 70%)`,
            boxShadow: isRunning
              ? `0 0 60px 20px rgba(${currentPhase.glowColor}, 0.18), 0 0 120px 40px rgba(${currentPhase.glowColor}, 0.06), inset 0 0 40px rgba(${currentPhase.glowColor}, 0.1)`
              : '0 0 30px 5px rgba(178,218,255,0.05)',
          }}
          animate={{
            scale: orbScale,
            opacity: orbOpacity,
          }}
          transition={{
            duration: currentPhase.duration / 1000,
            ease: currentPhaseName === 'inhale' || currentPhaseName === 'exhale'
              ? [0.43, 0.13, 0.23, 0.96]
              : 'easeInOut',
          }}
        >
          {/* Inner glow shimmer */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle at 40% 30%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
            }}
          />

          {/* Phase Label inside orb */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhaseName}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-1 relative z-10"
            >
              {isRunning ? (
                <>
                  <span className="text-soft-white font-light text-xl tracking-wide">
                    {currentPhase.label}
                  </span>
                  <span className="text-on-surface-variant/60 text-[10px] tracking-[0.15em] uppercase font-mono">
                    {currentPhase.sublabel}
                  </span>
                </>
              ) : (
                <span className="material-symbols-outlined text-[32px] text-primary/70" style={{ fontVariationSettings: "'FILL' 0" }}>
                  air
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        <motion.button
          id="breathe-start-stop"
          onClick={isRunning ? stopSession : startSession}
          className="px-10 py-3.5 rounded-full font-body-md text-sm tracking-wider relative overflow-hidden group"
          style={{
            background: isRunning
              ? 'rgba(255,255,255,0.04)'
              : 'linear-gradient(135deg, rgba(178,218,255,0.15) 0%, rgba(45,212,191,0.1) 100%)',
            border: isRunning ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(178,218,255,0.2)',
            color: isRunning ? 'rgba(255,255,255,0.5)' : '#b2daff',
          }}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
        >
          <span className="relative z-10">
            {isRunning ? '✕  Stop Session' : '▶  Begin Breathing'}
          </span>
        </motion.button>

        {isRunning && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] text-on-surface-variant/40 tracking-widest uppercase font-mono"
          >
            Close your eyes and follow the orb
          </motion.p>
        )}
      </div>

      {/* Phase guide */}
      {!isRunning && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3"
        >
          {['Inhale 4s', 'Hold 4s', 'Exhale 4s', 'Hold 4s'].map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: `rgba(${PHASES[i].glowColor}, 0.7)` }}
                />
                <span className="text-[9px] text-on-surface-variant/40 font-mono uppercase tracking-wider whitespace-nowrap">
                  {label}
                </span>
              </div>
              {i < 3 && <div className="w-4 h-px bg-soft-white/10" />}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
