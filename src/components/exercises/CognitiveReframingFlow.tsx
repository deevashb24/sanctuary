'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type StepKey = 'event' | 'belief' | 'factOrAssumption' | 'reframe';

interface FormState {
  event: string;
  belief: string;
  factOrAssumption: 'fact' | 'assumption' | null;
  reframe: string;
}

const STEPS: {
  key: StepKey;
  step: number;
  title: string;
  subtitle: string;
  type: 'textarea' | 'toggle' | 'final';
  placeholder?: string;
  accent: string;
}[] = [
  {
    key: 'event',
    step: 1,
    title: 'What happened?',
    subtitle: 'Describe the situation as objectively as possible. Just the facts.',
    type: 'textarea',
    placeholder: 'e.g. My presentation did not go as planned...',
    accent: 'rgba(99,210,255,0.7)',
  },
  {
    key: 'belief',
    step: 2,
    title: 'What are you telling yourself about it?',
    subtitle: 'Capture the automatic thought that came up — no filter needed.',
    type: 'textarea',
    placeholder: 'e.g. I always mess things up. Everyone thinks I am incompetent...',
    accent: 'rgba(139,92,246,0.7)',
  },
  {
    key: 'factOrAssumption',
    step: 3,
    title: 'Is that a fact, or an assumption?',
    subtitle: 'A fact is something objectively verifiable. An assumption is a story we tell ourselves.',
    type: 'toggle',
    accent: 'rgba(251,191,36,0.7)',
  },
  {
    key: 'reframe',
    step: 4,
    title: "Let's reframe it.",
    subtitle: 'Write a kinder, more balanced thought. What would you say to a friend in this situation?',
    type: 'final',
    placeholder: 'e.g. I had a rough moment, but one presentation does not define my abilities...',
    accent: 'rgba(45,212,191,0.7)',
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function CognitiveReframingFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormState>({
    event: '',
    belief: '',
    factOrAssumption: null,
    reframe: '',
  });
  const [saved, setSaved] = useState(false);

  const currentStep = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;
  const isFirstStep = stepIndex === 0;

  const canAdvance = () => {
    if (currentStep.key === 'event') return form.event.trim().length > 0;
    if (currentStep.key === 'belief') return form.belief.trim().length > 0;
    if (currentStep.key === 'factOrAssumption') return form.factOrAssumption !== null;
    if (currentStep.key === 'reframe') return form.reframe.trim().length > 0;
    return false;
  };

  const goNext = () => {
    if (!canAdvance()) return;
    setDirection(1);
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goPrev = () => {
    setDirection(-1);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const handleSave = () => {
    const reflection = {
      savedAt: new Date().toISOString(),
      ...form,
    };
    const key = `sanctuary_reframe_${Date.now()}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(reflection));
    }
    setSaved(true);
  };

  const handleReset = () => {
    setStepIndex(0);
    setDirection(1);
    setForm({ event: '', belief: '', factOrAssumption: null, reframe: '' });
    setSaved(false);
  };

  if (saved) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-full gap-8 text-center px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.2) 0%, transparent 70%)', border: '1px solid rgba(45,212,191,0.3)' }}
        >
          <span className="material-symbols-outlined text-[36px] text-teal-400" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </motion.div>

        <div className="space-y-3">
          <h2 className="text-3xl font-light text-soft-white">Reflection saved.</h2>
          <p className="text-on-surface-variant max-w-sm mx-auto leading-relaxed">
            You challenged a difficult thought and found a kinder truth. That takes courage.
          </p>
        </div>

        {/* Summary card */}
        <div className="w-full max-w-md p-6 rounded-2xl space-y-4 text-left"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <p className="text-[10px] tracking-widest uppercase font-mono text-teal-400 mb-1">Reframe</p>
            <p className="text-soft-white text-sm leading-relaxed">{form.reframe}</p>
          </div>
          <div className="w-full h-px bg-soft-white/8" />
          <div>
            <p className="text-[10px] tracking-widest uppercase font-mono text-on-surface-variant/50 mb-1">
              Categorized as
            </p>
            <span className="text-xs px-3 py-1 rounded-full font-mono"
              style={{
                background: form.factOrAssumption === 'assumption' ? 'rgba(251,191,36,0.1)' : 'rgba(139,92,246,0.1)',
                border: `1px solid ${form.factOrAssumption === 'assumption' ? 'rgba(251,191,36,0.3)' : 'rgba(139,92,246,0.3)'}`,
                color: form.factOrAssumption === 'assumption' ? '#fbbf24' : '#a78bfa',
              }}>
              {form.factOrAssumption}
            </span>
          </div>
        </div>

        <button
          id="reframe-start-again"
          onClick={handleReset}
          className="px-8 py-3 rounded-full text-sm font-body-md tracking-wider transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
        >
          Start a new reflection
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col min-h-full w-full max-w-xl mx-auto px-4">
      {/* Step Dots */}
      <div className="flex items-center justify-center gap-3 pt-2 pb-8">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.key}
            className="rounded-full transition-all duration-300"
            animate={{
              width: i === stepIndex ? 24 : 8,
              background: i === stepIndex
                ? s.accent
                : i < stepIndex
                  ? 'rgba(255,255,255,0.25)'
                  : 'rgba(255,255,255,0.1)',
            }}
            style={{ height: 8 }}
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep.key}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="absolute inset-0 flex flex-col"
          >
            {/* Step number badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <span
                className="text-[10px] font-mono tracking-[0.25em] uppercase px-3 py-1 rounded-full"
                style={{
                  background: `rgba(${currentStep.accent.replace('rgba(', '').replace('0.7)', '0.12)')})`,
                  border: `1px solid ${currentStep.accent.replace('0.7', '0.25')}`,
                  color: currentStep.accent,
                }}
              >
                Step {currentStep.step} of {STEPS.length}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-2xl md:text-3xl font-light text-soft-white mb-2 leading-tight"
            >
              {currentStep.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-on-surface-variant leading-relaxed mb-8"
            >
              {currentStep.subtitle}
            </motion.p>

            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex-1"
            >
              {(currentStep.type === 'textarea' || currentStep.type === 'final') && (
                <textarea
                  id={`reframe-input-${currentStep.key}`}
                  className="w-full h-40 resize-none rounded-2xl p-5 text-soft-white text-sm leading-relaxed outline-none transition-all duration-300 placeholder:text-on-surface-variant/30"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${
                      (form[currentStep.key as 'event' | 'belief' | 'reframe'] as string).length > 0
                        ? currentStep.accent.replace('0.7', '0.3')
                        : 'rgba(255,255,255,0.08)'
                    }`,
                  }}
                  placeholder={currentStep.placeholder}
                  value={form[currentStep.key as 'event' | 'belief' | 'reframe'] as string}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [currentStep.key]: e.target.value }))
                  }
                  autoFocus
                />
              )}

              {currentStep.type === 'toggle' && (
                <div className="flex flex-col sm:flex-row gap-4">
                  {(['fact', 'assumption'] as const).map((option) => (
                    <motion.button
                      key={option}
                      id={`reframe-toggle-${option}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setForm((f) => ({ ...f, factOrAssumption: option }))}
                      className="flex-1 p-6 rounded-2xl text-left transition-all duration-300 relative overflow-hidden"
                      style={{
                        background: form.factOrAssumption === option
                          ? option === 'fact'
                            ? 'rgba(139,92,246,0.12)'
                            : 'rgba(251,191,36,0.12)'
                          : 'rgba(255,255,255,0.04)',
                        border: form.factOrAssumption === option
                          ? option === 'fact'
                            ? '1px solid rgba(139,92,246,0.4)'
                            : '1px solid rgba(251,191,36,0.4)'
                          : '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {form.factOrAssumption === option && (
                        <motion.div
                          layoutId="toggle-selection"
                          className="absolute inset-0 rounded-2xl"
                          style={{
                            background: option === 'fact'
                              ? 'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.08) 0%, transparent 70%)'
                              : 'radial-gradient(circle at 30% 30%, rgba(251,191,36,0.08) 0%, transparent 70%)',
                          }}
                        />
                      )}
                      <div className="relative z-10">
                        <span className="material-symbols-outlined text-[28px] mb-3 block"
                          style={{
                            color: option === 'fact' ? '#a78bfa' : '#fbbf24',
                            fontVariationSettings: `'FILL' ${form.factOrAssumption === option ? 1 : 0}`,
                          }}>
                          {option === 'fact' ? 'verified' : 'help'}
                        </span>
                        <p className="text-soft-white font-medium capitalize text-lg mb-1">{option}</p>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {option === 'fact'
                            ? 'It can be proven true or false with evidence.'
                            : 'It is an interpretation or prediction without proof.'}
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between py-6">
        <motion.button
          id="reframe-back"
          onClick={goPrev}
          disabled={isFirstStep}
          whileTap={{ scale: 0.97 }}
          className="px-6 py-2.5 rounded-full text-sm font-body-md tracking-wider transition-all disabled:opacity-20"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          ← Back
        </motion.button>

        {isLastStep ? (
          <motion.button
            id="reframe-save"
            onClick={handleSave}
            disabled={!canAdvance()}
            whileTap={{ scale: 0.97 }}
            whileHover={canAdvance() ? { scale: 1.02 } : {}}
            className="px-8 py-3 rounded-full text-sm font-body-md tracking-wider transition-all disabled:opacity-30"
            style={{
              background: canAdvance()
                ? 'linear-gradient(135deg, rgba(45,212,191,0.2) 0%, rgba(99,210,255,0.15) 100%)'
                : 'rgba(255,255,255,0.04)',
              border: canAdvance() ? '1px solid rgba(45,212,191,0.3)' : '1px solid rgba(255,255,255,0.08)',
              color: canAdvance() ? '#5eead4' : 'rgba(255,255,255,0.3)',
            }}
          >
            Save Reflection ✓
          </motion.button>
        ) : (
          <motion.button
            id="reframe-next"
            onClick={goNext}
            disabled={!canAdvance()}
            whileTap={{ scale: 0.97 }}
            whileHover={canAdvance() ? { scale: 1.02 } : {}}
            className="px-8 py-3 rounded-full text-sm font-body-md tracking-wider transition-all disabled:opacity-30"
            style={{
              background: canAdvance()
                ? `linear-gradient(135deg, ${currentStep.accent.replace('0.7', '0.15')} 0%, ${currentStep.accent.replace('0.7', '0.08')} 100%)`
                : 'rgba(255,255,255,0.04)',
              border: canAdvance()
                ? currentStep.accent.replace('0.7', '0.3').replace('rgba', 'rgba').replace(/\)$/, ')').replace('rgba(', '1px solid rgba(').replace(/^1px solid /, '1px solid ')
                : '1px solid rgba(255,255,255,0.08)',
              color: canAdvance() ? '#f8fafc' : 'rgba(255,255,255,0.3)',
            }}
          >
            Continue →
          </motion.button>
        )}
      </div>
    </div>
  );
}
