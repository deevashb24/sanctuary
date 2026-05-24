import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { TopNavBar } from "@/components/layout/TopNavBar";

export default function LandingPage() {

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden min-h-screen">
      <TopNavBar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-stack-lg md:pt-24 pb-stack-lg md:pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row items-center gap-stack-lg">
          <div className="flex-1 space-y-stack-md z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/30 text-sage-deep font-label-sm text-label-sm mb-4">
              <span className="material-symbols-outlined text-[16px]">
                favorite
              </span>
              <span>Compassionate, privacy-first AI</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-ink-stone leading-tight">
              Your Mind Needs a{" "}
              <span className="text-sage-deep relative">
                Companion
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-amber-soft opacity-50"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 20"
                >
                  <path
                    d="M0 10 Q 50 20 100 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></path>
                </svg>
              </span>
              , <br className="hidden md:block" /> Not Just a Tracker.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto md:mx-0">
              Experience a mental wellness journey that listens, understands,
              and grows with you. Safe, private, and rooted in care.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/login">
                <Button className="px-8 py-6 text-lg w-full sm:w-auto">
                  Start Your Journey
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative w-full max-w-md mx-auto md:max-w-none mt-12 md:mt-0 flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-sage-light/30 via-primary-container/20 to-amber-soft/20 rounded-full blur-3xl opacity-60"></div>
            <div className="relative w-64 h-64 md:w-80 md:h-80 organic-shape bg-gradient-to-br from-surface-container-lowest to-surface-container shadow-2xl flex items-center justify-center border-4 border-surface-container-lowest">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOrFeMrD2RftWvNnYeo1-5gPrbqrdjxmCQdnsPvNSacTZIshPHc-_ZFSUGTcW4vvTzHU9uDm_iuluGyd4fLKgjCzFlEY8YOabtnyBK7oRPOzjzOLN-BMtDUw9_Nuf6zV7HXLc6zvpNI9ILD4tVmBnpKH7KOJ6vXCUALYDG0p7yEp-d2sqpk0gMV0T58-d3jo-br5SaKLDZ99weEQ9fRZQrJXTEnY4kSq6AXooMiFGLXT0YnqzW5ytmVybDCimva1HMce7LBKYEsjc"
                alt="Chat Orb Concept"
                fill
                priority
                className="object-cover organic-shape opacity-80 mix-blend-overlay"
                sizes="(max-width: 768px) 256px, 320px"
              />
              <div className="absolute -right-4 md:-right-12 top-1/4 bg-surface-container-lowest p-3 rounded-xl ambient-shadow border border-outline-variant/20 flex items-center gap-3 transform rotate-3">
                <div className="w-8 h-8 rounded-full bg-sage-light/30 flex items-center justify-center text-sage-deep">
                  <span className="material-symbols-outlined text-[18px]">
                    spa
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="w-16 h-2 bg-surface-container rounded-full"></div>
                  <div className="w-10 h-2 bg-surface-container rounded-full"></div>
                </div>
              </div>
              <div className="absolute -left-4 md:-left-8 bottom-1/4 bg-surface-container-lowest p-3 rounded-xl ambient-shadow border border-outline-variant/20 flex items-center gap-3 transform -rotate-2">
                <div className="space-y-1 text-right">
                  <div className="w-12 h-2 bg-surface-container rounded-full ml-auto"></div>
                  <div className="w-16 h-2 bg-amber-soft/40 rounded-full ml-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Why Section */}
        <section className="py-stack-lg md:py-24 bg-surface-container-low/50">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center space-y-stack-md">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-ink-stone">
              Democratizing Emotional Intelligence
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto">
              We noticed a gap in mental health support. Too often, apps feel
              clinical, sterile, or merely track symptoms without offering
              genuine comfort. Sanctuary was built to be an empathetic companion—a
              safe space to explore your feelings without judgment.
            </p>
            <div className="flex justify-center gap-4 text-sage-deep mt-8">
              <span className="material-symbols-outlined text-[32px] opacity-70">
                psychology
              </span>
              <span className="material-symbols-outlined text-[32px] opacity-70">
                favorite_border
              </span>
              <span className="material-symbols-outlined text-[32px] opacity-70">
                self_improvement
              </span>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section
          className="py-stack-lg md:py-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto"
          id="how-it-works"
        >
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-ink-stone">
              Your Journey to Calm
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Three gentle steps to understand yourself better.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Step 1 */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 ambient-shadow border border-sage-light/30 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-soft/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-sage-deep font-headline-lg text-headline-lg mb-6">
                1
              </div>
              <h3 className="font-label-md text-label-md text-ink-stone text-lg mb-2">
                Check-in
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Pause and identify how you're feeling using our intuitive,
                color-mapped mood wheel.
              </p>
              <div className="aspect-square bg-cream-bg rounded-2xl flex items-center justify-center p-4 border border-outline-variant/20">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzMpA6OXW43EYOrROp-G8AgZsWm7CCgb_irdKHB_Hd0vYKCwATpzGu-TOxKmWG7H5ifKlluUntMomcMZ4j0Tg3bMBibv7eOt7BXqhoOpwEzoTGnDDNmNnFA0yC1TH3XTfi4aREGbtXietSj_cgmLvJMAQJdK6Pp-8H3I8OVa8a9dN7eKzNhcPzJWUbrylpGz14v4fn2jbSLdd1EjzoeqGh8zp2Tr30uUMvENYFsbzciTCaQLUkb_44L35IWLeUkyd7wIZ53q-a-SE"
                    alt="Mood Wheel Doodle"
                    fill
                    className="object-contain p-4 opacity-60 mix-blend-multiply"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 ambient-shadow border border-sage-light/30 relative overflow-hidden group md:-translate-y-4">
              <div className="absolute top-0 left-0 w-32 h-32 bg-sage-light/20 rounded-br-full -z-10 transition-transform group-hover:scale-110"></div>
              <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-sage-deep font-headline-lg text-headline-lg mb-6">
                2
              </div>
              <h3 className="font-label-md text-label-md text-ink-stone text-lg mb-2">
                Connect
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Chat with your AI companion in a secure space. It listens deeply
                and responds with care.
              </p>
              <div className="aspect-square bg-cream-bg rounded-2xl p-4 border border-outline-variant/20 flex flex-col gap-3 justify-end">
                <div className="bg-surface-container-lowest p-3 rounded-2xl rounded-bl-sm self-start text-sm shadow-sm border border-outline-variant/10 max-w-[80%]">
                  I'm feeling overwhelmed today.
                </div>
                <div className="bg-sage-light/20 p-3 rounded-2xl rounded-br-sm self-end text-sm text-sage-deep border border-sage-light/30 max-w-[80%]">
                  I hear you. Let's take a slow breath together. What feels
                  heaviest right now?
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-surface-container-lowest rounded-[2rem] p-8 ambient-shadow border border-sage-light/30 relative overflow-hidden group">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-coral-muted/10 rounded-tl-full -z-10 transition-transform group-hover:scale-110"></div>
              <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-sage-deep font-headline-lg text-headline-lg mb-6">
                3
              </div>
              <h3 className="font-label-md text-label-md text-ink-stone text-lg mb-2">
                Reflect &amp; Grow
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Discover gentle patterns in your thoughts over time with our
                soothing dashboard.
              </p>
              <div className="aspect-square bg-cream-bg rounded-2xl p-4 border border-outline-variant/20 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDElvdAf6oVhqB31_VnWDCmvjX8IaF-pEAnJNDNaYevL84_pCVUrPvjZcQDjElUDl9gFVc9Oh6FU1UhnrRzVZxhE2xAAstal9eeHNZ2Ynerg66rj6SfWbu_LWzpKr-wNlzS0si4RH8qFkaLD64su8RPPE_HPMCn3ziWipmbnRPD7DK_vLSlsFTiVnaZ3zwmrZSMYIkOAL8ZWywiAxflED9jWvirdrady2bgp5QDahNAVX58sbXaZrBrk1F4J_C-SMTHcd9KRINFGpo"
                    alt="Patterns Dashboard Doodle"
                    fill
                    className="object-cover rounded-xl opacity-70 mix-blend-multiply"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CBT & Trust Section */}
        <section className="py-stack-lg md:py-24 bg-sage-deep text-surface-container-lowest">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg">
                Rooted in Science, Delivered with Care.
              </h2>
              <p className="font-body-lg text-body-lg text-sage-light/90">
                Sanctuary’s conversations are gently guided by the principles of
                Cognitive Behavioral Therapy (CBT). We help you identify thought
                patterns, reframe negativity, and ground yourself in the present
                moment—all through natural, flowing dialogue.
              </p>
              <ul className="space-y-4 mt-8">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-soft">
                    spa
                  </span>
                  <span>Evidence-based grounding techniques</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-soft">
                    sync
                  </span>
                  <span>Gentle cognitive reframing</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-soft">
                    lock
                  </span>
                  <span>Total privacy and local data encryption</span>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest/10 p-6 rounded-2xl backdrop-blur-sm border border-surface-container-lowest/20 flex flex-col items-center text-center gap-3">
                <span className="material-symbols-outlined text-[48px] text-amber-soft font-light">
                  all_inclusive
                </span>
                <span className="font-label-md text-label-md">
                  Continuous Support
                </span>
              </div>
              <div className="bg-surface-container-lowest/10 p-6 rounded-2xl backdrop-blur-sm border border-surface-container-lowest/20 flex flex-col items-center text-center gap-3 mt-8">
                <span className="material-symbols-outlined text-[48px] text-coral-muted font-light">
                  shield_lock
                </span>
                <span className="font-label-md text-label-md">
                  Private Space
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-margin-mobile md:px-margin-desktop text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-surface-container-low -z-10"></div>
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="font-headline-xl text-headline-xl text-ink-stone">
              Ready to find your calm?
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Join our gentle community and start exploring your mind with a
              compassionate companion.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link href="/login">
                <Button className="px-8 py-6 text-lg">
                  Login / Join the Beta
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
