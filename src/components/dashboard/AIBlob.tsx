'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export type BlobState = 'idle' | 'listening' | 'processing' | 'speaking';

interface AIBlobProps {
  state: BlobState;
  frameData: {
    idle: string[];
    listening: string[];
    speaking: string[];
    processing: string[];
  };
  hasFrames: boolean;
}

// Canvas-based frame player for the extracted animation frames
function FramePlayer({
  frames,
  fps,
}: {
  frames: string[];
  fps: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIndexRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    if (!frames.length) return;

    // Preload images
    imagesRef.current = frames.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    frameIndexRef.current = 0;

    const interval = 1000 / fps;

    const draw = (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !imagesRef.current.length) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (timestamp - lastTimeRef.current >= interval) {
        const img = imagesRef.current[frameIndexRef.current];
        if (img.complete) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        frameIndexRef.current = (frameIndexRef.current + 1) % imagesRef.current.length;
        lastTimeRef.current = timestamp;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [frames, fps]);

  return (
    <canvas
      ref={canvasRef}
      width={512}
      height={512}
      className="w-full h-full object-contain"
      style={{ borderRadius: 'inherit' }}
    />
  );
}

// CSS+GSAP morphing blob fallback (used when no video frames available)
function GsapBlob({ state }: { state: BlobState }) {
  const blobRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const floatTlRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    if (!blobRef.current) return;

    // Kill previous timelines cleanly
    tlRef.current?.kill();
    floatTlRef.current?.kill();
    gsap.killTweensOf(blobRef.current);

    const el = blobRef.current;
    const tl = gsap.timeline({ repeat: -1 });
    tlRef.current = tl;

    if (state === 'idle') {
      // Reset rotation and scale from other states
      gsap.set(el, { rotate: 0, scaleX: 1, scaleY: 1 });

      tl.to(el, {
        borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%',
        duration: 3.5,
        ease: 'sine.inOut',
      })
        .to(el, {
          borderRadius: '70% 30% 52% 48% / 60% 40% 60% 40%',
          duration: 4,
          ease: 'sine.inOut',
        })
        .to(el, {
          borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%',
          duration: 3.5,
          ease: 'sine.inOut',
        });

      // Gentle floating
      const floatTl = gsap.timeline({ repeat: -1, yoyo: true });
      floatTlRef.current = floatTl;
      floatTl.to(el, { y: -12, duration: 2.8, ease: 'sine.inOut' });

    } else if (state === 'listening') {
      gsap.to(el, { y: 0, duration: 0.4, ease: 'power2.out' });
      gsap.set(el, { rotate: 0 });

      tl.to(el, {
        borderRadius: '50% 50% 50% 50% / 50% 50% 50% 50%',
        scale: 1.1,
        duration: 0.55,
        ease: 'power1.inOut',
      })
        .to(el, {
          borderRadius: '46% 54% 48% 52% / 53% 47% 53% 47%',
          scale: 0.94,
          duration: 0.55,
          ease: 'power1.inOut',
        });

    } else if (state === 'processing') {
      gsap.to(el, { y: 0, duration: 0.3, ease: 'power2.out' });

      tl.to(el, {
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        rotate: 180,
        duration: 0.75,
        ease: 'power2.inOut',
      })
        .to(el, {
          borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%',
          rotate: 360,
          duration: 0.75,
          ease: 'power2.inOut',
        });

    } else if (state === 'speaking') {
      gsap.to(el, { y: 0, duration: 0.3, ease: 'power2.out' });
      gsap.set(el, { rotate: 0 });

      tl.to(el, {
        borderRadius: '25% 75% 40% 60% / 70% 30% 70% 30%',
        scaleX: 1.18,
        scaleY: 0.83,
        duration: 0.22,
        ease: 'elastic.out(1, 0.3)',
      })
        .to(el, {
          borderRadius: '75% 25% 65% 35% / 35% 65% 35% 65%',
          scaleX: 0.83,
          scaleY: 1.18,
          duration: 0.26,
          ease: 'elastic.out(1, 0.3)',
        })
        .to(el, {
          borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%',
          scaleX: 1,
          scaleY: 1,
          duration: 0.2,
          ease: 'sine.inOut',
        });
    }
  }, [state]);

  // Animate the glow layer color when state changes
  useGSAP(() => {
    if (!glowRef.current) return;
    const glowMap: Record<BlobState, string> = {
      idle: '#0d9488',
      listening: '#06b6d4',
      processing: '#7c3aed',
      speaking: '#10b981',
    };
    gsap.to(glowRef.current, {
      '--glow-color': glowMap[state],
      duration: 0.6,
      ease: 'power2.inOut',
    });
  }, [state]);

  const gradientMap: Record<BlobState, string> = {
    idle: 'from-teal-500/70 via-emerald-400/50 to-cyan-300/60',
    listening: 'from-cyan-400/80 via-blue-400/60 to-sky-300/70',
    processing: 'from-violet-500/80 via-purple-400/60 to-indigo-400/70',
    speaking: 'from-emerald-400/80 via-teal-300/60 to-green-300/70',
  };

  const shadowMap: Record<BlobState, string> = {
    idle: 'shadow-teal-500/40',
    listening: 'shadow-cyan-400/50',
    processing: 'shadow-purple-500/50',
    speaking: 'shadow-emerald-400/50',
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer ambient glow */}
      <div
        ref={glowRef}
        className={`absolute inset-[-20%] rounded-full blur-3xl opacity-40 transition-all duration-700 bg-gradient-to-tr ${gradientMap[state]}`}
      />
      {/* Secondary ring glow */}
      <div
        className={`absolute inset-[-8%] rounded-full blur-xl opacity-25 transition-all duration-500 bg-gradient-to-br ${gradientMap[state]}`}
      />
      {/* Core morphing blob */}
      <div
        ref={blobRef}
        className={`relative w-[85%] h-[85%] bg-gradient-to-tr shadow-2xl ${gradientMap[state]} ${shadowMap[state]}`}
        style={{
          borderRadius: '50%',
          willChange: 'transform, border-radius',
          backdropFilter: 'blur(2px)',
        }}
      >
        {/* Inner shimmer highlight */}
        <div
          className="absolute inset-[12%] rounded-full opacity-30 bg-gradient-to-br from-white/60 to-transparent"
          style={{ willChange: 'transform' }}
        />
      </div>
    </div>
  );
}

export default function AIBlob({ state, frameData, hasFrames }: AIBlobProps) {
  const fpsMap: Record<BlobState, number> = {
    idle: 12,
    listening: 18,
    processing: 24,
    speaking: 20,
  };

  if (hasFrames && frameData[state].length > 0) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Ambient glow behind video frames */}
        <div
          className={`absolute inset-0 rounded-full blur-3xl opacity-30 transition-all duration-700 ${
            state === 'idle'
              ? 'bg-teal-500'
              : state === 'listening'
              ? 'bg-cyan-400'
              : state === 'processing'
              ? 'bg-purple-500'
              : 'bg-emerald-400'
          }`}
        />
        <div className="relative w-[90%] h-[90%] rounded-full overflow-hidden">
          <FramePlayer frames={frameData[state]} fps={fpsMap[state]} />
        </div>
      </div>
    );
  }

  return <GsapBlob state={state} />;
}
