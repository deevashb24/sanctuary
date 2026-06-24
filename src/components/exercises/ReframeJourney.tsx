'use client';

import React, { useRef, useState, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Register plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// ──────────────────────────────────────────────
// Custom Text Splitter Helper
// Splits a string into spans by words to allow
// GSAP to animate each word individually.
// ──────────────────────────────────────────────
function SplitWords({ text, className = '' }: { text: string; className?: string }) {
  if (!text.trim()) return null;
  const words = text.split(/\s+/);
  return (
    <div className={`flex flex-wrap gap-x-2 gap-y-1 ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="split-word inline-block relative whitespace-pre">
          {word}
        </span>
      ))}
    </div>
  );
}

export function ReframeJourney() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Content states
  const [initialThought, setInitialThought] = useState('');
  const [analysisType, setAnalysisType] = useState<'fact' | 'assumption' | null>(null);
  const [reframedThought, setReframedThought] = useState('');
  
  // We use this to lock the text for splitting once the user scrolls past section 1
  const [lockedThought, setLockedThought] = useState('');

  // ──────────────────────────────────────────────
  // GSAP Animations
  // ──────────────────────────────────────────────
  useGSAP(() => {
    if (!containerRef.current) return;
    
    // --- 1. Background Color Shift ---
    // Section 1 -> Section 2 (Dark -> Moody Teal)
    gsap.to(containerRef.current, {
      backgroundColor: '#0a1f24',
      scrollTrigger: {
        trigger: '#section-2',
        start: 'top bottom',
        end: 'top center',
        scrub: true,
      }
    });

    // Section 2 -> Section 3 (Moody Teal -> Bright Emerald/Teal)
    gsap.to(containerRef.current, {
      backgroundColor: '#064e3b', // Deep emerald
      scrollTrigger: {
        trigger: '#section-3',
        start: 'top bottom',
        end: 'top center',
        scrub: true,
      }
    });

    // --- 2. Pinning & Shattering Text ---
    // Pin Section 2 so it stays while we scroll
    ScrollTrigger.create({
      trigger: '#section-2',
      start: 'top top',
      end: '+=100%', // pin for 1 viewport height
      pin: true,
      anticipatePin: 1,
    });

    // Animate the shattered words in Section 2
    // We want them to start centered, then explode outward as we scroll through the pinned section
    const words = gsap.utils.toArray<HTMLElement>('.split-word');
    if (words.length > 0) {
      // Randomize destination for each word
      words.forEach((word) => {
        const randomX = (Math.random() - 0.5) * window.innerWidth * 1.5;
        const randomY = (Math.random() - 0.5) * window.innerHeight * 1.5;
        const randomRot = (Math.random() - 0.5) * 360;
        
        gsap.to(word, {
          x: randomX,
          y: randomY,
          rotation: randomRot,
          opacity: 0,
          filter: 'blur(10px)',
          scale: Math.random() * 2 + 0.5,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: '#section-2',
            start: 'top top',
            end: '+=80%', // finish exploding before unpinning
            scrub: true,
          }
        });
      });
    }

    // --- 3. Fade in Section 2 Content ---
    gsap.fromTo('.sec-2-content', 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#section-2',
          start: 'top 40%',
          end: 'top 10%',
          scrub: true,
        }
      }
    );

  }, { scope: containerRef, dependencies: [lockedThought] });

  // When leaving section 1, lock the thought so it can be shattered
  // We use a scroll listener specifically to detect when to lock the state
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: '#section-1',
      start: 'bottom 80%',
      onEnter: () => {
        // Lock the thought for splitting when we start scrolling down
        if (initialThought.trim() && lockedThought !== initialThought) {
          setLockedThought(initialThought);
        }
      },
      onEnterBack: () => {
        // Unlock if they scroll back up to edit
        setLockedThought('');
      }
    });
    return () => st.kill();
  }, [initialThought, lockedThought]);

  const handleSave = () => {
    // In a real app, save to Supabase. Here we mock it.
    localStorage.setItem('reframe_last', JSON.stringify({
      initial: initialThought,
      type: analysisType,
      reframed: reframedThought,
      date: new Date().toISOString()
    }));
    router.push('/dashboard');
  };

  return (
    <div 
      ref={containerRef}
      className="w-full text-white relative transition-colors duration-100 ease-linear"
      style={{ backgroundColor: '#020617' }} // Start dark slate
    >
      {/* Universal Grain */}
      <div className="grain-overlay pointer-events-none fixed inset-0 z-50 opacity-[0.05]" />

      {/* Top Nav */}
      <header className="fixed top-0 left-0 w-full p-6 md:p-10 z-50">
        <Link 
          href="/exercises"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-mono uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit Journey
        </Link>
      </header>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SECTION 1: Input Phase */}
      <section id="section-1" className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10 pt-20 pb-40">
        <div className="w-full max-w-3xl flex flex-col items-center">
          <p className="text-teal-400 font-mono text-sm tracking-[0.2em] uppercase mb-8">Step 1 — Release</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-center leading-tight mb-12">
            What&apos;s weighing on your mind right now?
          </h1>
          <textarea
            value={initialThought}
            onChange={(e) => setInitialThought(e.target.value)}
            placeholder="Type your thought here..."
            className="w-full bg-transparent text-2xl md:text-3xl text-center font-light text-white/90 placeholder:text-white/20 resize-none outline-none overflow-hidden"
            rows={4}
            autoFocus
          />
          
          <div className={`mt-16 text-white/30 flex flex-col items-center gap-2 transition-opacity duration-700 ${initialThought.length > 5 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-sm font-mono uppercase tracking-widest">Scroll to process</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────── */}
      {/* SECTION 2: The Shatter & Challenge Phase */}
      <section id="section-2" className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10 overflow-hidden">
        
        {/* The shattered text layer (absolute center) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-full max-w-3xl text-center text-3xl font-light text-white/40">
            {lockedThought && <SplitWords text={lockedThought} />}
          </div>
        </div>

        {/* The new prompt layer */}
        <div className="sec-2-content relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
          <p className="text-teal-300 font-mono text-sm tracking-[0.2em] uppercase mb-8">Step 2 — Challenge</p>
          <h2 className="text-4xl md:text-5xl font-light leading-tight mb-12">
            Look at the pieces. Is that thought a proven fact, or an assumption?
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={() => setAnalysisType('fact')}
              className={`flex-1 py-6 rounded-2xl border transition-all duration-300 ${
                analysisType === 'fact' 
                  ? 'bg-teal-500/20 border-teal-500/50 text-white' 
                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
              }`}
            >
              <h3 className="text-xl font-medium mb-1">It&apos;s a Fact</h3>
              <p className="text-xs font-mono opacity-60">I have undeniable proof.</p>
            </button>
            <button
              onClick={() => setAnalysisType('assumption')}
              className={`flex-1 py-6 rounded-2xl border transition-all duration-300 ${
                analysisType === 'assumption' 
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-white' 
                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
              }`}
            >
              <h3 className="text-xl font-medium mb-1">It&apos;s an Assumption</h3>
              <p className="text-xs font-mono opacity-60">I might be projecting.</p>
            </button>
          </div>

          <div className={`mt-20 text-white/30 flex flex-col items-center gap-2 transition-opacity duration-700 ${analysisType ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-sm font-mono uppercase tracking-widest">Continue downwards</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────── */}
      {/* SECTION 3: The Reframe Phase */}
      <section id="section-3" className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10 pt-20">
        <div className="w-full max-w-3xl flex flex-col items-center text-center">
          <p className="text-emerald-300 font-mono text-sm tracking-[0.2em] uppercase mb-8">Step 3 — Resolve</p>
          <h2 className="text-4xl md:text-5xl font-light leading-tight mb-12">
            Write a new, balanced thought.
          </h2>
          
          <div className="w-full relative">
            <textarea
              value={reframedThought}
              onChange={(e) => setReframedThought(e.target.value)}
              placeholder="e.g. Even though things are difficult right now, I am capable of handling this..."
              className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-xl md:text-2xl font-light text-white placeholder:text-white/30 resize-none outline-none focus:border-emerald-500/50 transition-colors shadow-2xl"
              rows={4}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={reframedThought.length < 5}
            className={`mt-12 flex items-center gap-3 px-8 py-4 rounded-full text-sm font-mono uppercase tracking-widest transition-all duration-300 ${
              reframedThought.length >= 5
                ? 'bg-emerald-500 text-emerald-950 hover:bg-emerald-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            Complete Journey
          </button>
        </div>
      </section>

    </div>
  );
}
