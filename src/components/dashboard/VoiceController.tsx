'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef, useCallback } from 'react';
import AIBlob, { BlobState } from './AIBlob';
import { Mic, Square, Loader2, WifiOff } from 'lucide-react';

// Generate a stable session ID for this browser session
function getOrCreateSessionId(): string {
  const key = 'sanctuary_voice_session_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

// Frame ranges mapped to animation states
// These ranges will be populated once frames are extracted from the video.
// Format: frames[stateKey] = ['/ASSETS/TALKING_ANIMATION/frames/webp/frame_XXXX.webp', ...]
type FrameData = {
  idle: string[];
  listening: string[];
  speaking: string[];
  processing: string[];
};

// Build frame URLs from the public directory
function buildFrameUrls(basePath: string, start: number, end: number, pad: number = 4): string[] {
  const frames: string[] = [];
  for (let i = start; i <= end; i++) {
    const padded = String(i).padStart(pad, '0');
    frames.push(`${basePath}/frame_${padded}.jpg`);
  }
  return frames;
}

// Detect if converted jpg frames exist by attempting to load a sentinel frame
async function detectFrames(): Promise<{ hasFrames: boolean; totalFrames: number }> {
  try {
    const res = await fetch('/ASSETS/TALKING_ANIMATION/frames/webp/frame_0001.jpg', { method: 'HEAD' });
    if (res.ok) {
      // Try to infer total by binary search (max 200 frames)
      let lo = 1, hi = 200, last = 1;
      while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        const padded = String(mid).padStart(4, '0');
        const r = await fetch(`/ASSETS/TALKING_ANIMATION/frames/webp/frame_${padded}.jpg`, { method: 'HEAD' });
        if (r.ok) { last = mid; lo = mid + 1; }
        else { hi = mid - 1; }
      }
      return { hasFrames: true, totalFrames: last };
    }
  } catch (_) { /* noop */ }
  return { hasFrames: false, totalFrames: 0 };
}

function buildFrameData(totalFrames: number): FrameData {
  const base = '/ASSETS/TALKING_ANIMATION/frames/webp';
  if (totalFrames === 0) return { idle: [], listening: [], speaking: [], processing: [] };

  // Divide total frames into 4 zones for different states
  // Idle: first ~30%, Listening: 30–50%, Processing: 50–65%, Speaking: 65–100%
  const idleEnd = Math.max(1, Math.floor(totalFrames * 0.30));
  const listenEnd = Math.max(idleEnd + 1, Math.floor(totalFrames * 0.50));
  const procEnd = Math.max(listenEnd + 1, Math.floor(totalFrames * 0.65));

  return {
    idle: buildFrameUrls(base, 1, idleEnd),
    listening: buildFrameUrls(base, idleEnd + 1, listenEnd),
    processing: buildFrameUrls(base, listenEnd + 1, procEnd),
    speaking: buildFrameUrls(base, procEnd + 1, totalFrames),
  };
}

const EMPTY_FRAMES: FrameData = { idle: [], listening: [], speaking: [], processing: [] };

export default function VoiceController() {
  const [appState, setAppState] = useState<BlobState>('idle');
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasFrames, setHasFrames] = useState(false);
  const [frameData, setFrameData] = useState<FrameData>(EMPTY_FRAMES);
  const [micPermission, setMicPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const sessionIdRef = useRef<string>('');
  const stateRef = useRef<BlobState>('idle');

  // Keep stateRef in sync
  useEffect(() => { stateRef.current = appState; }, [appState]);

  const speakReply = useCallback(function speakReply(text: string) {
    if (!synthRef.current || !text) {
      setAppState('idle');
      return;
    }

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Pick a calm, natural voice
    const pickVoice = () => {
      const voices = synthRef.current?.getVoices() ?? [];
      return (
        voices.find((v) => v.name.includes('Google US English')) ||
        voices.find((v) => v.name === 'Samantha') ||
        voices.find((v) => v.lang === 'en-US') ||
        voices[0]
      );
    };

    const voice = pickVoice();
    if (voice) utterance.voice = voice;
    if (!voice && synthRef.current?.getVoices().length === 0) {
      // voices not loaded yet — retry once voices load
      synthRef.current.onvoiceschanged = () => {
        const v = pickVoice();
        if (v) utterance.voice = v;
        synthRef.current?.speak(utterance);
      };
    }

    utterance.rate = 0.93;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setAppState('speaking');
    utterance.onend = () => setAppState('idle');
    utterance.onerror = () => setAppState('idle');

    synthRef.current.speak(utterance);
  }, []);

  const dispatchToBackend = useCallback(async (message: string) => {
    setAppState('processing');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          sessionId: sessionIdRef.current,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const text: string = data.reply || data.message || '';
      setReply(text);
      speakReply(text);
    } catch (err: unknown) {
      console.error('Backend error:', err);
      const errorObj = err as Error;
      setError(errorObj.message || 'Failed to reach Sanctuary AI.');
      setAppState('idle');
    }
  }, [speakReply]);

  // One-time initialization
  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }

    // Detect video frames asynchronously
    detectFrames().then(({ hasFrames: hf, totalFrames }) => {
      if (hf) {
        setHasFrames(true);
        setFrameData(buildFrameData(totalFrames));
      }
    });

    // Setup speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setTimeout(() => setMicPermission('denied'), 0);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setAppState('listening');
      setError(null);
      setTranscript('');
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = async (event: any) => {
      const text: string = event.results[0][0].transcript;
      setTranscript(text);
      setAppState('processing');
      await dispatchToBackend(text);
    };

    rec.onend = () => {
      // Only go to processing if we're still listening (no result came in)
      if (stateRef.current === 'listening') {
        setAppState('idle');
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setMicPermission('denied');
        setError('Microphone access was denied. Please allow mic permissions in your browser.');
      } else {
        setError(`Voice recognition error: ${event.error}`);
      }
      setAppState('idle');
    };

    recognitionRef.current = rec;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const handleToggle = useCallback(() => {
    const current = stateRef.current;

    if (current === 'idle') {
      // Start listening
      if (synthRef.current?.speaking) synthRef.current.cancel();
      try {
        recognitionRef.current?.start();
        setMicPermission('granted');
      } catch (e: unknown) {
        const errorObj = e as Error;
        if (errorObj.name !== 'InvalidStateError') {
          setError('Could not start voice recognition.');
        }
      }
    } else if (current === 'listening') {
      // Manual stop
      recognitionRef.current?.stop();
      setAppState('idle');
    } else if (current === 'speaking') {
      // Interrupt speech
      synthRef.current?.cancel();
      setAppState('idle');
    }
  }, []);

  // State label and description copy
  const stateInfo: Record<BlobState, { label: string; sub: string }> = {
    idle: {
      label: 'Sanctuary Companion',
      sub:
        micPermission === 'denied'
          ? 'Microphone access denied. Please allow mic access and refresh.'
          : 'Tap the orb to begin your session.',
    },
    listening: {
      label: 'Listening…',
      sub: 'Speak clearly. Recording stops when you pause.',
    },
    processing: {
      label: 'Processing…',
      sub: 'Analyzing your thoughts with care.',
    },
    speaking: {
      label: 'Sanctuary is speaking',
      sub: 'Tap to interrupt at any time.',
    },
  };

  const isDisabled = appState === 'processing';

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-2xl mx-auto px-4">
      {/* ── Blob Container ── */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        <AIBlob state={appState} frameData={frameData} hasFrames={hasFrames} />

        {/* Listening ring pulse overlay */}
        {appState === 'listening' && (
          <div className="absolute inset-[-12%] rounded-full border-2 border-cyan-400/40 animate-ping pointer-events-none" />
        )}
        {appState === 'listening' && (
          <div className="absolute inset-[-18%] rounded-full border border-cyan-400/20 animate-ping pointer-events-none" style={{ animationDelay: '0.3s' }} />
        )}
      </div>

      {/* ── Status Text ── */}
      <div className="text-center space-y-2 px-4">
        <h3 className="text-xl md:text-2xl font-semibold tracking-wide text-soft-white transition-all duration-300">
          {stateInfo[appState].label}
        </h3>
        <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed transition-all duration-300">
          {stateInfo[appState].sub}
        </p>

        {/* Transcript bubble */}
        {transcript && appState !== 'idle' && (
          <div className="mt-4 px-4 py-2 rounded-2xl bg-surface-container-low/60 border border-soft-white/10 text-sm text-on-surface-variant italic max-w-sm mx-auto">
            &ldquo;{transcript}&rdquo;
          </div>
        )}

        {/* Reply preview (subtle) */}
        {reply && appState === 'speaking' && (
          <div className="mt-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10 text-xs text-primary/70 max-w-sm mx-auto leading-relaxed line-clamp-3">
            {reply}
          </div>
        )}
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error/10 border border-error/20 text-error text-sm max-w-sm text-center">
          <WifiOff size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Main CTA Button ── */}
      <button
        id="sanctuary-voice-btn"
        onClick={handleToggle}
        disabled={isDisabled}
        aria-label={
          appState === 'idle'
            ? 'Start voice session'
            : appState === 'listening'
            ? 'Stop listening'
            : 'Processing'
        }
        className={[
          'relative group flex items-center justify-center rounded-full transition-all duration-500 shadow-2xl',
          'w-20 h-20 border',
          isDisabled
            ? 'cursor-not-allowed opacity-40 bg-surface-container border-soft-white/10'
            : appState === 'listening'
            ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:scale-105 active:scale-95'
            : appState === 'speaking'
            ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-400 hover:bg-emerald-500/20 hover:scale-105 active:scale-95'
            : 'bg-primary text-on-primary border-primary/20 hover:scale-110 active:scale-95 hover:shadow-primary/30',
        ].join(' ')}
      >
        {/* Hover glow ring */}
        {!isDisabled && (
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 scale-100 group-hover:scale-125 transition-all duration-500 pointer-events-none blur-md bg-current" />
        )}

        <span className="relative z-10">
          {appState === 'idle' && <Mic size={30} />}
          {appState === 'listening' && <Square size={28} className="fill-current" />}
          {appState === 'processing' && <Loader2 size={28} className="animate-spin" />}
          {appState === 'speaking' && <Square size={28} className="fill-current" />}
        </span>
      </button>

      {/* Mic permission denied fallback */}
      {micPermission === 'denied' && (
        <p className="text-xs text-on-surface-variant/60 text-center max-w-xs">
          Enable microphone access in your browser settings, then refresh this page.
        </p>
      )}
    </div>
  );
}
