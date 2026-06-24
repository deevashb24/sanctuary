'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MoodConfig {
  emoji: string;
  label: string;
  description: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  accentColor: string;
}

const MOOD_MAP: Record<number, MoodConfig> = {
  1: {
    emoji: '🌑',
    label: 'Very Low',
    description: 'Heavy and disconnected',
    gradientFrom: '#0a0a1a',
    gradientVia: '#0d1117',
    gradientTo: '#111827',
    accentColor: 'rgba(99,102,241,0.6)',
  },
  2: {
    emoji: '🌒',
    label: 'Low',
    description: 'Quiet and withdrawn',
    gradientFrom: '#0d0d1f',
    gradientVia: '#111827',
    gradientTo: '#1f2937',
    accentColor: 'rgba(99,102,241,0.6)',
  },
  3: {
    emoji: '🌓',
    label: 'Struggling',
    description: 'A bit rough today',
    gradientFrom: '#0f172a',
    gradientVia: '#1e1b4b',
    gradientTo: '#1e293b',
    accentColor: 'rgba(139,92,246,0.65)',
  },
  4: {
    emoji: '🌔',
    label: 'Meh',
    description: 'Somewhere in the middle',
    gradientFrom: '#1a1533',
    gradientVia: '#2e1065',
    gradientTo: '#0f172a',
    accentColor: 'rgba(167,139,250,0.65)',
  },
  5: {
    emoji: '🌕',
    label: 'Neutral',
    description: 'Not bad, not great',
    gradientFrom: '#1e293b',
    gradientVia: '#0f3460',
    gradientTo: '#16213e',
    accentColor: 'rgba(99,210,255,0.65)',
  },
  6: {
    emoji: '🌖',
    label: 'Okay',
    description: 'Getting there slowly',
    gradientFrom: '#0c4a6e',
    gradientVia: '#075985',
    gradientTo: '#1e293b',
    accentColor: 'rgba(56,189,248,0.7)',
  },
  7: {
    emoji: '🌗',
    label: 'Good',
    description: 'Feeling steady and grounded',
    gradientFrom: '#052e16',
    gradientVia: '#064e3b',
    gradientTo: '#0c4a6e',
    accentColor: 'rgba(52,211,153,0.7)',
  },
  8: {
    emoji: '🌘',
    label: 'Great',
    description: 'Energy is flowing well',
    gradientFrom: '#14532d',
    gradientVia: '#15803d',
    gradientTo: '#0f766e',
    accentColor: 'rgba(74,222,128,0.7)',
  },
  9: {
    emoji: '☀️',
    label: 'Excellent',
    description: 'Bright and motivated',
    gradientFrom: '#78350f',
    gradientVia: '#b45309',
    gradientTo: '#15803d',
    accentColor: 'rgba(251,191,36,0.75)',
  },
  10: {
    emoji: '🌟',
    label: 'Radiant',
    description: 'Absolutely thriving!',
    gradientFrom: '#7c2d12',
    gradientVia: '#c2410c',
    gradientTo: '#a16207',
    accentColor: 'rgba(251,146,60,0.8)',
  },
};

interface MoodLog {
  id: string;
  mood_score: number;
  created_at: string;
}

interface VibeCheckMoodTrackerProps {
  onGradientChange?: (from: string, via: string, to: string) => void;
}

export default function VibeCheckMoodTracker({ onGradientChange }: VibeCheckMoodTrackerProps) {
  const [score, setScore] = useState(5);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentLogs, setRecentLogs] = useState<MoodLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  const mood = MOOD_MAP[score];

  useEffect(() => {
    onGradientChange?.(mood.gradientFrom, mood.gradientVia, mood.gradientTo);
  }, [score, mood.gradientFrom, mood.gradientVia, mood.gradientTo, onGradientChange]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/exercises/mood');
        if (res.ok) {
          const { data } = await res.json();
          setRecentLogs(data ?? []);
        }
      } catch {
        // silently fail
      } finally {
        setLoadingLogs(false);
      }
    }
    fetchLogs();
  }, [saved]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/exercises/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood_score: score }),
      });

      if (res.status === 401) {
        setError('Sign in to save your mood.');
        return;
      }
      if (!res.ok) {
        setError('Could not save. Try again.');
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Connection error. Try again.');
    } finally {
      setSaving(false);
    }
  }, [score]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScore(Number(e.target.value));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto gap-8">

      {/* Mood Display */}
      <div className="text-center space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={score}
            initial={{ scale: 0.6, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-6xl"
          >
            {mood.emoji}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`label-${score}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-2xl font-light text-soft-white">{mood.label}</h3>
            <p className="text-sm text-on-surface-variant mt-1">{mood.description}</p>
          </motion.div>
        </AnimatePresence>

        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-2xl font-light tabular-nums"
          style={{
            background: `${mood.accentColor.replace('0.6', '0.1').replace('0.65', '0.1').replace('0.7', '0.1').replace('0.75', '0.1').replace('0.8', '0.1')}`,
            border: `1px solid ${mood.accentColor.replace('0.6', '0.25').replace('0.65', '0.25').replace('0.7', '0.25').replace('0.75', '0.25').replace('0.8', '0.25')}`,
          }}
        >
          <span style={{ color: mood.accentColor }}>{score}</span>
          <span className="text-on-surface-variant text-sm font-mono">/10</span>
        </div>
      </div>

      {/* Custom Slider */}
      <div className="w-full space-y-3">
        <div className="relative w-full">
          {/* Track labels */}
          <div className="flex justify-between mb-2">
            <span className="text-[10px] font-mono text-on-surface-variant/40 uppercase tracking-wider">Low</span>
            <span className="text-[10px] font-mono text-on-surface-variant/40 uppercase tracking-wider">High</span>
          </div>

          <input
            id="vibe-slider"
            type="range"
            min={1}
            max={10}
            step={1}
            value={score}
            onChange={handleSliderChange}
            className="vibe-slider w-full"
            style={{
              '--slider-accent': mood.accentColor,
            } as React.CSSProperties}
          />

          {/* Tick marks */}
          <div className="flex justify-between mt-2 px-0.5">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <span
                key={n}
                className="text-[9px] font-mono tabular-nums transition-all duration-200"
                style={{ color: n === score ? mood.accentColor : 'rgba(255,255,255,0.2)' }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex flex-col items-center gap-3 w-full">
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div
              key="saved"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-mono"
              style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }}
            >
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Vibe logged — {score}/10
            </motion.div>
          ) : (
            <motion.button
              key="save-btn"
              id="vibe-save"
              onClick={handleSave}
              disabled={saving}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              className="w-full py-3.5 rounded-full text-sm font-body-md tracking-wider transition-all disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${mood.accentColor.replace(/[\d.]+\)$/, '0.15)')} 0%, ${mood.accentColor.replace(/[\d.]+\)$/, '0.08)')} 100%)`,
                border: `1px solid ${mood.accentColor.replace(/[\d.]+\)$/, '0.3)')}`,
                color: '#f8fafc',
              }}
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="material-symbols-outlined text-[16px]"
                  >
                    progress_activity
                  </motion.span>
                  Saving...
                </span>
              ) : (
                'Save My Vibe ✦'
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400/80 font-mono"
          >
            {error}
          </motion.p>
        )}
      </div>

      {/* Sparkline History */}
      {!loadingLogs && recentLogs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <p className="text-[10px] text-on-surface-variant/40 uppercase font-mono tracking-widest mb-3">
            Recent check-ins
          </p>
          <div className="flex items-end gap-2 h-12">
            {recentLogs.slice().reverse().map((log, i) => {
              const heightPct = (log.mood_score / 10) * 100;
              const dotMood = MOOD_MAP[log.mood_score];
              return (
                <motion.div
                  key={log.id}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex-1 rounded-full origin-bottom relative group"
                  style={{
                    height: `${Math.max(heightPct, 8)}%`,
                    background: dotMood.accentColor.replace(/[\d.]+\)$/, '0.4)'),
                    minHeight: 4,
                  }}
                  title={`${log.mood_score}/10`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[8px] font-mono text-on-surface-variant/30">Oldest</span>
            <span className="text-[8px] font-mono text-on-surface-variant/30">Latest</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
