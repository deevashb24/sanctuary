import Link from "next/link";
import React from "react";

export function Footer() {
  return (
    <footer className="bg-sage-deep dark:bg-ink-stone w-full mt-stack-lg border-t-0">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-mobile md:px-margin-desktop py-stack-lg max-w-container-max mx-auto w-full">
        <div className="col-span-1 md:col-span-1 space-y-4 md:col-span-4 mb-stack-md">
          <span className="font-headline-lg text-headline-lg font-bold text-surface-container-lowest block mb-4">
            Sanctuary
          </span>
          <p className="font-label-sm text-label-sm text-surface-container-lowest opacity-90 mb-4">
            ©️ {new Date().getFullYear()} Sanctuary Wellness. If you are in crisis, please call or text 988.
          </p>
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-wrap gap-4 md:justify-end">
          <Link href="#" className="font-label-sm text-label-sm text-surface-variant opacity-80 hover:text-amber-soft hover:opacity-100 transition-all">
            About Us
          </Link>
          <Link href="#" className="font-label-sm text-label-sm text-surface-variant opacity-80 hover:text-amber-soft hover:opacity-100 transition-all">
            Careers
          </Link>
          <Link href="/legal/privacy" className="font-label-sm text-label-sm text-surface-variant opacity-80 hover:text-amber-soft hover:opacity-100 transition-all">
            Privacy Policy
          </Link>
          <Link href="/legal/terms" className="font-label-sm text-label-sm text-surface-variant opacity-80 hover:text-amber-soft hover:opacity-100 transition-all">
            Terms of Service
          </Link>
          <Link href="#" className="font-label-sm text-label-sm text-surface-variant opacity-80 hover:text-amber-soft hover:opacity-100 transition-all">
            Help Center
          </Link>
          <Link href="#" className="font-label-sm text-label-sm text-surface-variant opacity-80 hover:text-amber-soft hover:opacity-100 transition-all">
            Safety Resources
          </Link>
        </div>
      </div>
    </footer>
  );
}
