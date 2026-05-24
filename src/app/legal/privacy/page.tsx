"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".legal-sidebar a");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.remove("text-primary", "font-medium");
              link.classList.add(
                "text-on-surface-variant",
                "hover:text-sage-deep"
              );
              const dot = link.querySelector("span");
              if (dot) {
                dot.classList.remove("bg-primary", "w-1.5", "h-1.5");
                dot.classList.add("bg-sage-light", "w-1", "h-1");
              }
            });

            const activeLink = document.querySelector(
              `.legal-sidebar a[href="#${entry.target.id}"]`
            );
            if (activeLink) {
              activeLink.classList.remove(
                "text-on-surface-variant",
                "hover:text-sage-deep"
              );
              activeLink.classList.add("text-primary", "font-medium");
              const activeDot = activeLink.querySelector("span");
              if (activeDot) {
                activeDot.classList.remove("bg-sage-light", "w-1", "h-1");
                activeDot.classList.add("bg-primary", "w-1.5", "h-1.5");
              }
            }
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

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
              className="text-primary font-bold hover:text-primary transition-colors opacity-80 font-label-sm text-label-sm"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="text-on-surface-variant font-label-sm text-label-sm hover:text-primary transition-colors"
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
          {/* Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-3">
            <nav className="legal-sidebar sticky top-[100px] h-[calc(100vh-120px)] overflow-y-auto pr-6 border-r border-outline-variant">
              <h3 className="font-label-md text-label-md text-sage-deep mb-stack-md uppercase tracking-wider">
                Contents
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    className="text-on-surface-variant hover:text-sage-deep transition-colors font-body-md text-body-md flex items-center gap-2"
                    href="#introduction"
                  >
                    <span className="w-1 h-1 rounded-full bg-sage-light"></span>
                    Introduction
                  </a>
                </li>
                <li>
                  <a
                    className="text-primary font-medium transition-colors font-body-md text-body-md flex items-center gap-2"
                    href="#data-collection"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    1. Data Collection
                  </a>
                </li>
                <li>
                  <a
                    className="text-on-surface-variant hover:text-sage-deep transition-colors font-body-md text-body-md flex items-center gap-2"
                    href="#user-consent"
                  >
                    <span className="w-1 h-1 rounded-full bg-sage-light"></span>
                    2. User Consent
                  </a>
                </li>
                <li>
                  <a
                    className="text-on-surface-variant hover:text-sage-deep transition-colors font-body-md text-body-md flex items-center gap-2"
                    href="#data-usage"
                  >
                    <span className="w-1 h-1 rounded-full bg-sage-light"></span>
                    3. Data Usage
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Legal Text Document */}
          <article className="lg:col-span-8 lg:col-start-5 legal-content">
            <div className="mb-stack-lg">
              <p className="font-label-sm text-label-sm text-outline mb-2">
                Effective Date: October 24, 2024
              </p>
              <h1 className="font-headline-xl text-headline-xl text-sage-deep mb-8">
                Privacy Policy
              </h1>
              <p className="text-body-lg font-body-lg text-ink-stone mb-6 leading-relaxed">
                We are committed to maintaining your trust by protecting your
                personal information. This document outlines our practices in a
                clear, readable format.
              </p>
            </div>

            <section id="introduction" className="mb-12">
              <h2 className="font-headline-lg text-headline-lg text-sage-deep mt-12 mb-4">
                Introduction
              </h2>
              <p className="mb-6 line-height-[1.8] text-ink-stone">
                At Sanctuary, we believe that transparency is the foundation of
                trust. This Privacy Policy is designed to clearly articulate how
                we collect, use, and protect your data when you interact with
                our platform. We have moved away from dense legalese to provide
                you with a plain-language explanation of your rights and our
                responsibilities.
              </p>
              <p className="mb-6 line-height-[1.8] text-ink-stone">
                Our approach is rooted in the principle of minimal
                collection—we only gather the information absolutely necessary
                to provide you with a serene, personalized experience.
              </p>
            </section>

            <section id="data-collection" className="mb-12">
              <h2 className="font-headline-lg text-headline-lg text-sage-deep mt-12 mb-4">
                1. Data Collection
              </h2>
              <p className="mb-6 line-height-[1.8] text-ink-stone">
                When you use Sanctuary, we collect information that helps us
                tailor your experience. This includes:
              </p>
              <ul className="mb-6 pl-6 list-disc text-ink-stone space-y-2">
                <li className="line-height-[1.8]">
                  <strong>Account Information:</strong> Name, email address, and
                  basic profile details you voluntarily provide during
                  registration.
                </li>
                <li className="line-height-[1.8]">
                  <strong>Usage Data:</strong> Anonymous metrics regarding how
                  you navigate our platform, such as feature interaction rates
                  and session duration.
                </li>
                <li className="line-height-[1.8]">
                  <strong>Device Information:</strong> General details about the
                  device and browser you are using to ensure optimal rendering
                  of our services.
                </li>
              </ul>
              <p className="mb-6 line-height-[1.8] text-ink-stone">
                We do not collect sensitive biometrics or background location
                data without explicit, contextual prompting.
              </p>
            </section>

            <section id="user-consent" className="mb-12">
              <h2 className="font-headline-lg text-headline-lg text-sage-deep mt-12 mb-4">
                2. User Consent
              </h2>
              <p className="mb-6 line-height-[1.8] text-ink-stone">
                Consent is central to our data philosophy. We operate on an
                "opt-in" rather than "opt-out" basis for any data sharing beyond
                core functionality.
              </p>
              <p className="mb-6 line-height-[1.8] text-ink-stone">
                You maintain control over your information at all times. Within
                your account settings, you can manage your preferences, request
                a full export of your data, or initiate account deletion. We
                honor all deletion requests within 30 days, ensuring your
                digital footprint on our platform is thoroughly erased.
              </p>
            </section>

            <section id="data-usage" className="mb-12">
              <h2 className="font-headline-lg text-headline-lg text-sage-deep mt-12 mb-4">
                3. Data Usage
              </h2>
              <p className="mb-6 line-height-[1.8] text-ink-stone">
                The information we gather is employed exclusively to enhance
                your experience. Specifically, we use your data to:
              </p>
              <ul className="mb-6 pl-6 list-disc text-ink-stone space-y-2">
                <li className="line-height-[1.8]">
                  Deliver and maintain our core services reliably.
                </li>
                <li className="line-height-[1.8]">
                  Personalize content to better align with your wellness journey.
                </li>
                <li className="line-height-[1.8]">
                  Communicate important updates regarding platform security or
                  policy changes.
                </li>
                <li className="line-height-[1.8]">
                  Analyze aggregated, non-personally identifiable trends to
                  improve our design and functionality.
                </li>
              </ul>
              <p className="mb-6 line-height-[1.8] text-ink-stone">
                We do not, under any circumstances, sell your personal data to
                third-party advertisers or data brokers.
              </p>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
