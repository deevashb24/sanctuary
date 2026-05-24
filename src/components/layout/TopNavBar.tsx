"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
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
          ? "border-b border-outline-variant bg-surface-container-lowest/90 backdrop-blur-md"
          : "bg-background"
      }`}
    >
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-base max-w-container-max mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-sage-light to-amber-soft p-[1px]">
            <div className="h-full w-full rounded-[7px] bg-surface-container-lowest flex items-center justify-center">
              <Shield className="h-4 w-4 text-sage-deep" />
            </div>
          </div>
          <span className="font-headline-lg-mobile md:font-headline-lg text-lg font-semibold text-sage-deep tracking-tight">
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
