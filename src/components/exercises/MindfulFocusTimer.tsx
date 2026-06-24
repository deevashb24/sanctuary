'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type TimerState = 'idle' | 'running' | 'paused' | 'complete';

const DURATION_OPTIONS = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '20 min', value: 20 },
];

const POINTS_PER_SESSION = 10;

function formatTime(seconds: number): { mm: string; ss: string } {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return {
    mm: String(m).padStart(2, '0'),
    ss: String(s).padStart(2, '0'),
  };
}

// SVG circle constants
const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  distance: number;
  size: number;
}

function generateConfetti(count = 24): ConfettiParticle[] {
  const colors = ['#b2daff', '#5eead4', '#a78bfa', '#fbbf24', '#f472b6', '#34d399'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 10,
    y: 50 + (Math.random() - 0.5) * 10,
    color: colors[i % colors.length],
    angle: (i / count) * 360,
    distance: 80 + Math.random() * 60,
    size: 4 + Math.random() * 6,
  }));
}

export default function MindfulFocusTimer() {
  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [wasPaused, setWasPaused] = useState(false);
  const [focusPoints, setFocusPoints] = useState<number | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);
  const [awardingPoints, setAwardingPoints] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalSeconds = selectedMinutes * 60;
  const elapsed = totalSeconds - secondsLeft;
  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  // Fetch current focus points on mount
  useEffect(() => {
    fetch('/api/exercises/focus-points')
      .then((r) => r.json())
      .then(({ focus_points }) => setFocusPoints(focus_points ?? 0))
      .catch(() => {});
  }, [awardingPoints]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleComplete = useCallback(async () => {
    clearTimer();
    setTimerState('complete');
    setConfetti(generateConfetti(28));

    if (!wasPaused) {
      setAwardingPoints(true);
      try {
        const res = await fetch('/api/exercises/focus-points', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ duration_minutes: selectedMinutes }),
        });
        if (res.ok) {
          const { points_earned } = await res.json();
          setPointsEarned(points_earned ?? POINTS_PER_SESSION);
        }
      } catch { /* silently fail */ }
      finally {
        setAwardingPoints(false);
      }
    }
  }, [clearTimer, wasPaused, selectedMinutes]);

  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearTimer();
    }

    return clearTimer;
  }, [timerState, handleComplete, clearTimer]);

  const handleStart = () => {
    setTimerState('running');
    setWasPaused(false);
  };

  const handlePause = () => {
    setTimerState('paused');
    setWasPaused(true);
  };

  const handleResume = () => {
    setTimerState('running');
  };

  const handleReset = () => {
    clearTimer();
    setTimerState('idle');
    setSecondsLeft(selectedMinutes * 60);
    setWasPaused(false);
    setPointsEarned(0);
    setConfetti([]);
  };

  const handleSelectDuration = (mins: number) => {
    if (timerState !== 'idle') return;
    setSelectedMinutes(mins);
    setSecondsLeft(mins * 60);
  };

  const { mm, ss } = formatTime(secondsLeft);

  // Pulse color based on remaining time
  const getRingColor = () => {
    if (timerState === 'complete') return '#34d399';
    if (wasPaused) return 'rgba(251,191,36,0.7)';
    if (progress < 0.5) return '#b2daff';
    if (progress < 0.8) return '#a78bfa';
    return '#f472b6';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full gap-8 select-none">

      {/* Focus Points Badge */}
      {focusPoints !== null && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: 'rgba(178,218,255,0.06)', border: '1px solid rgba(178,218,255,0.12)' }}
        >
          <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            diamond
          </span>
          <span className="text-xs font-mono text-primary tabular-nums">
            {focusPoints} Focus Points
          </span>
        </motion.div>
      )}

      {/* Duration Selector */}
      <div className="flex items-center gap-3">
        {DURATION_OPTIONS.map(({ label, value }) => (
          <motion.button
            key={value}
            id={`focus-duration-${value}`}
            onClick={() => handleSelectDuration(value)}
            disabled={timerState !== 'idle'}
            whileTap={{ scale: 0.95 }}
            className="px-5 py-2 rounded-full text-sm font-mono tracking-wider transition-all disabled:cursor-default"
            style={{
              background: selectedMinutes === value
                ? 'rgba(178,218,255,0.12)'
                : 'rgba(255,255,255,0.04)',
              border: selectedMinutes === value
                ? '1px solid rgba(178,218,255,0.3)'
                : '1px solid rgba(255,255,255,0.08)',
              color: selectedMinutes === value ? '#b2daff' : 'rgba(255,255,255,0.35)',
            }}
          >
            {label}
          </motion.button>
        ))}
      </div>

      {/* Timer Ring + Clock */}
      <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }}>

        {/* Confetti burst */}
        <AnimatePresence>
          {confetti.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: p.size,
                height: p.size,
                background: p.color,
                left: '50%',
                top: '50%',
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                opacity: 0,
                scale: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </AnimatePresence>

        {/* SVG Ring */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 280 280"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Track */}
          <circle
            cx="140" cy="140" r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="3"
          />

          {/* Progress */}
          <motion.circle
            cx="140" cy="140" r={RADIUS}
            fill="none"
            stroke={getRingColor()}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.5, ease: 'linear' }}
            style={{ filter: `drop-shadow(0 0 8px ${getRingColor()})` }}
          />
        </svg>

        {/* Clock face */}
        <div className="relative z-10 flex flex-col items-center gap-1">
          <AnimatePresence mode="wait">
            {timerState === 'complete' ? (
              <motion.div
                key="complete"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="flex flex-col items-center gap-2"
              >
                <span
                  className="material-symbols-outlined text-[64px] text-emerald-400"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                {!wasPaused && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(178,218,255,0.1)', border: '1px solid rgba(178,218,255,0.2)' }}
                  >
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      diamond
                    </span>
                    <span className="text-xs font-mono text-primary">
                      +{pointsEarned} Focus Points
                    </span>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="clock"
                className="flex items-end gap-1"
              >
                <motion.span
                  key={mm}
                  initial={{ opacity: 0.4, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono font-thin tabular-nums leading-none"
                  style={{ fontSize: 72, color: timerState === 'idle' ? 'rgba(255,255,255,0.3)' : '#f8fafc', letterSpacing: '-0.04em' }}
                >
                  {mm}
                </motion.span>
                <span
                  className="font-mono font-thin text-5xl pb-2 leading-none"
                  style={{ color: timerState === 'running' ? getRingColor() : 'rgba(255,255,255,0.2)' }}
                >
                  :
                </span>
                <motion.span
                  key={ss}
                  initial={{ opacity: 0.4, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono font-thin tabular-nums leading-none"
                  style={{ fontSize: 72, color: timerState === 'idle' ? 'rgba(255,255,255,0.3)' : '#f8fafc', letterSpacing: '-0.04em' }}
                >
                  {ss}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* State label */}
          <AnimatePresence mode="wait">
            <motion.p
              key={timerState}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-[10px] font-mono tracking-[0.25em] uppercase mt-1"
              style={{
                color: timerState === 'running'
                  ? getRingColor()
                  : timerState === 'complete'
                    ? '#34d399'
                    : timerState === 'paused'
                      ? '#fbbf24'
                      : 'rgba(255,255,255,0.2)',
              }}
            >
              {timerState === 'idle' && 'ready'}
              {timerState === 'running' && 'focusing'}
              {timerState === 'paused' && '⚠ paused — streak voided'}
              {timerState === 'complete' && (wasPaused ? 'completed (paused)' : '✦ perfect session')}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {timerState === 'idle' && (
          <motion.button
            id="focus-start"
            onClick={handleStart}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className="px-10 py-3.5 rounded-full text-sm font-body-md tracking-wider"
            style={{
              background: 'linear-gradient(135deg, rgba(178,218,255,0.15) 0%, rgba(167,139,250,0.1) 100%)',
              border: '1px solid rgba(178,218,255,0.2)',
              color: '#b2daff',
            }}
          >
            ▶  Begin Focus
          </motion.button>
        )}

        {timerState === 'running' && (
          <>
            <motion.button
              id="focus-pause"
              onClick={handlePause}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 rounded-full text-sm font-body-md tracking-wider"
              style={{
                background: 'rgba(251,191,36,0.08)',
                border: '1px solid rgba(251,191,36,0.2)',
                color: '#fbbf24',
              }}
            >
              ⏸  Pause
            </motion.button>
            <motion.button
              id="focus-stop"
              onClick={handleReset}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-full text-sm font-body-md tracking-wider"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              ✕
            </motion.button>
          </>
        )}

        {timerState === 'paused' && (
          <>
            <motion.button
              id="focus-resume"
              onClick={handleResume}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3 rounded-full text-sm font-body-md tracking-wider"
              style={{
                background: 'rgba(251,191,36,0.08)',
                border: '1px solid rgba(251,191,36,0.2)',
                color: '#fbbf24',
              }}
            >
              ▶  Resume
            </motion.button>
            <motion.button
              id="focus-reset-paused"
              onClick={handleReset}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-3 rounded-full text-sm font-body-md"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              Reset
            </motion.button>
          </>
        )}

        {timerState === 'complete' && (
          <motion.button
            id="focus-again"
            onClick={handleReset}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 rounded-full text-sm font-body-md tracking-wider"
            style={{
              background: 'rgba(52,211,153,0.08)',
              border: '1px solid rgba(52,211,153,0.2)',
              color: '#34d399',
            }}
          >
            ↺  Focus Again
          </motion.button>
        )}
      </div>

      {/* No-pause tip */}
      {timerState === 'idle' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[11px] text-on-surface-variant/35 font-mono tracking-widest uppercase text-center max-w-xs"
        >
          Complete without pausing to earn +{POINTS_PER_SESSION} focus points
        </motion.p>
      )}
    </div>
  );
}
