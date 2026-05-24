"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function TopNavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`full-width top-0 z-50 sticky transition-all duration-300 ${
        scrolled
          ? "shadow-sm bg-surface-container-lowest/90 backdrop-blur-md"
          : "bg-background"
      }`}
    >
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-base max-w-container-max mx-auto w-full">
        <div className="flex items-center gap-2">
          <div
            aria-label="Sanctuary minimalist orb logo"
            className="w-8 h-8 rounded-full bg-gradient-to-br from-sage-light to-amber-soft opacity-80"
          ></div>
          <span className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-sage-deep tracking-tight">
            Sanctuary
          </span>
        </div>
        <nav className="hidden md:flex gap-gutter items-center">
          <a
            href="#how-it-works"
            className="text-ink-stone font-label-md text-label-md hover:text-coral-muted transition-colors duration-200"
          >
            How it Works
          </a>
        </nav>
        <div className="flex items-center gap-stack-sm">
          <Link
            href="/login"
            className="hidden md:block text-ink-stone font-label-md text-label-md hover:text-coral-muted transition-colors duration-200"
          >
            Login
          </Link>
          <Link href="/login">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
