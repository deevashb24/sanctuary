'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface PremiumFloatingProps {
  children: React.ReactNode;
  variant?: 'ambient' | 'fast-drift' | 'weightless' | 'magnetic';
  enableMouseParallax?: boolean;
  intensity?: number;
}

/**
 * PremiumFloating Component
 * @param {('ambient'|'fast-drift'|'weightless'|'magnetic')} variant - The style of motion.
 * @param {boolean} enableMouseParallax - Adds subtle tracking of the user's cursor.
 * @param {number} intensity - Multiplier for the distance traveled (default: 1).
 */
export default function PremiumFloating({ 
  children, 
  variant = 'ambient', 
  enableMouseParallax = false,
  intensity = 1 
}: PremiumFloatingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // 1. Core Floating Animations (GSAP Context)
  useGSAP(() => {
    const element = innerRef.current;
    if (!element) return;

    // Clear any existing partial tweens
    gsap.killTweensOf(element);

    // Configuration Matrix for Professional Presets
    const configs = {
      'ambient': {
        y: -12 * intensity,
        x: 4 * intensity,
        rotation: -1.5 * intensity,
        duration: 3.5,
        ease: 'sine.inOut'
      },
      'fast-drift': {
        y: -35 * intensity,
        x: -15 * intensity,
        rotation: 4 * intensity,
        duration: 1.8,
        ease: 'power1.inOut'
      },
      'weightless': {
        y: -25 * intensity,
        x: 20 * intensity,
        rotation: -6 * intensity,
        duration: 5,
        ease: 'slow(0.7, 0.7, false)' // Creates a drift-and-hold weightless feel
      }
    };

    // 'magnetic' variant doesn't idle float aggressively, it relies heavily on mouse interaction
    if (variant === 'magnetic') {
      gsap.to(element, {
        y: -4,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
      return;
    }

    const config = configs[variant] || configs['ambient'];

    // Multi-axis independent timing to prevent a mechanical "robotic" look
    gsap.to(element, {
      y: config.y,
      duration: config.duration,
      yoyo: true,
      repeat: -1,
      ease: config.ease
    });

    gsap.to(element, {
      x: config.x,
      duration: config.duration * 1.3, // Offset duration breaks the rhythm organically
      yoyo: true,
      repeat: -1,
      ease: config.ease
    });

    gsap.to(element, {
      rotation: config.rotation,
      duration: config.duration * 1.7,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

  }, { dependencies: [variant, intensity], scope: containerRef });

  // 2. Premium Mouse Tracking / Parallax (Vanilla JS combined with GSAP QuickTo for performance)
  useEffect(() => {
    if (!enableMouseParallax && variant !== 'magnetic') return;

    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    // quickTo is highly optimized for mousemove events (no layout thrashing)
    const xTo = gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const containerX = e.clientX - rect.left;
      const containerY = e.clientY - rect.top;
      
      if (variant === 'magnetic') {
        // Pulls directly toward the cursor within its bounding box
        const pullX = (containerX - rect.width / 2) * 0.35 * intensity;
        const pullY = (containerY - rect.height / 2) * 0.35 * intensity;
        xTo(pullX);
        yTo(pullY);
      } else if (enableMouseParallax) {
        // Moves subtly in opposition to cursor for depth/parallax layers
        const driftX = (containerX - window.innerWidth / 2) * -0.03 * intensity;
        const driftY = (containerY - window.innerHeight / 2) * -0.03 * intensity;
        xTo(driftX);
        yTo(driftY);
      }
    };

    const handleMouseLeave = () => {
      // Smoothly snap back to origin when mouse departs
      xTo(0);
      yTo(0);
    };

    if (variant === 'magnetic') {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    } else {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enableMouseParallax, variant, intensity]);

  return (
    <div 
      ref={containerRef} 
      className="inline-block"
      style={{ perspective: '1000px' }} // Enables clean 3D rendering space
    >
      <div ref={innerRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
