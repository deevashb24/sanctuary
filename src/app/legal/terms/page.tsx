import React from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="bg-surface-container-lowest text-on-background min-h-screen">
      <header className="bg-surface-container-low dark:bg-surface-container-low full-width border-b border-outline-variant z-50 sticky top-0">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-stack-sm max-w-container-max mx-auto w-full">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-headline-lg text-headline-lg font-semibold text-ink-stone dark:text-surface-variant hover:text-sage-deep transition-colors">
              Trust &amp; Transparency Center
            </Link>
          </div>
          <nav className="hidden md:flex gap-gutter items-center">
            <Link
              href="/legal/privacy"
              className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="text-primary font-bold hover:text-primary transition-colors opacity-80 font-label-sm text-label-sm"
            >
              Terms
            </Link>
            <Link
              href="/legal/safety"
              className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors"
            >
              Safety
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <aside className="hidden lg:block lg:col-span-3">
            <nav className="legal-sidebar sticky top-[100px] h-[calc(100vh-120px)] overflow-y-auto pr-6 border-r border-outline-variant">
              <h3 className="font-label-md text-label-md text-sage-deep mb-stack-md uppercase tracking-wider">
                Contents
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    className="text-primary font-medium transition-colors font-body-md text-body-md flex items-center gap-2"
                    href="#terms"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Terms of Service
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          <article className="lg:col-span-8 lg:col-start-5 legal-content">
            <div className="mb-stack-lg">
              <p className="font-label-sm text-label-sm text-outline mb-2">
                Effective Date: October 24, 2024
              </p>
              <h1 className="font-headline-xl text-headline-xl text-sage-deep mb-8">
                Terms of Service
              </h1>
              <p className="text-body-lg font-body-lg text-ink-stone mb-6 leading-relaxed">
                By using Sanctuary, you agree to these Terms of Service. Please read them carefully.
              </p>
            </div>
            <section id="terms" className="mb-12">
               <p className="mb-6 line-height-[1.8] text-ink-stone">
                 (Terms of service content goes here)
               </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
