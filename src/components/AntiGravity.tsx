'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface AntiGravityProps {
  children: React.ReactNode;
}

export default function AntiGravity({ children }: AntiGravityProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Generates a random organic floating effect
    gsap.to(containerRef.current, {
      y: "random(-15, -30)", // Floats upward randomly
      x: "random(-5, 5)",    // Slight horizontal drift
      rotation: "random(-2, 2)", // Subtle tilt
      duration: "random(2.5, 4)", // Random speed for organic feel
      yoyo: true, // Reverses the animation smoothly
      repeat: -1, // Loops infinitely
      ease: "sine.inOut", // Buttery smooth easing
    });
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      style={{ display: 'inline-block', willChange: 'transform' }}
    >
      {children}
    </div>
  );
}
