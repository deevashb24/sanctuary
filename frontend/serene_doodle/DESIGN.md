---
name: Serene Doodle
colors:
  surface: '#001719'
  surface-dim: '#001719'
  surface-bright: '#034045'
  surface-container-lowest: '#001113'
  surface-container-low: '#002022'
  surface-container: '#002427'
  surface-container-high: '#002f33'
  surface-container-highest: '#003b40'
  on-surface: '#b8ebf1'
  on-surface-variant: '#c0c7d0'
  inverse-surface: '#b8ebf1'
  inverse-on-surface: '#00363b'
  outline: '#8a919a'
  outline-variant: '#40484f'
  surface-tint: '#92ccff'
  primary: '#b2daff'
  on-primary: '#003351'
  primary-container: '#7cc0f8'
  on-primary-container: '#004e77'
  inverse-primary: '#036496'
  secondary: '#76dd76'
  on-secondary: '#00390a'
  secondary-container: '#007920'
  on-secondary-container: '#9bff97'
  tertiary: '#ffcf4a'
  on-tertiary: '#3e2e00'
  tertiary-container: '#e3b320'
  on-tertiary-container: '#5c4700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#92ccff'
  on-primary-fixed: '#001e31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#92fa8f'
  secondary-fixed-dim: '#76dd76'
  on-secondary-fixed: '#002204'
  on-secondary-fixed-variant: '#005313'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#f1c02f'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#001719'
  on-background: '#b8ebf1'
  surface-variant: '#003b40'
  background-deep: '#122B61'
  background-ambient: '#4B6CC9'
  ink-dark: '#0D2527'
  soft-white: '#F8FAFC'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  margin-mobile: 24px
  margin-desktop: 64px
  gutter: 16px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is a synthesis of atmospheric depth and approachable organic warmth. It targets individuals seeking a mental health sanctuary that feels both professionally meditative and personally whimsical. The brand personality is empathetic, tranquil, and non-judgmental.

The visual style is **Atmospheric Minimalist with Organic Accents**. It leverages the expansive, immersive background depth typical of meditation apps while layering UI elements that feel "hand-crafted" and low-pressure. By combining deep, infinite gradients with soft, illustrative components, the system reduces cognitive load and creates a safe digital environment for reflection and growth.

## Colors

The palette is designed to transition the user from the external world into a focused internal state. The core experience relies on a **dark mode default**, using "background-deep" and "background-ambient" to create lush, immersive gradients that mimic the twilight sky or deep water.

Primary and secondary colors are pulled from a pastel spectrum to ensure high legibility against dark backgrounds without being harsh. The "neutral" color is a deep, desaturated teal used for container surfaces to maintain the atmospheric mood. Use the "tertiary" gold sparingly for "moments of delight" or successful completion states. Avoid pure black; use "ink-dark" for high-contrast text or borders.

## Typography

This design system utilizes **Plus Jakarta Sans** for its friendly, modern, and open apertures, which contribute to a welcoming tone. Tracking is intentionally generous in body copy to increase white space and reduce visual crowding.

For technical or secondary data (like timers, dates, or progress stats), **Space Mono** provides a "notebook" or "journal" feel that complements the hand-drawn aesthetic. Large display titles should use tighter letter spacing for a grounded look, while body text should remain airy. Always prioritize line height to ensure maximum readability during moments of stress.

## Layout & Spacing

The layout follows a **fluid grid** model with significant emphasis on "Safe Areas" and negative space. Components should never feel cramped; if in doubt, increase the padding.

- **Mobile:** A single-column layout with 24px side margins. Elements are stacked with "stack-md" vertical rhythm.
- **Desktop:** A centered max-width container (1024px) to prevent eye strain. Use multi-column layouts only for dashboard views, maintaining wide 64px gutters.
- **Reflow:** Cards and interactive tiles should expand to fill the width of the container while maintaining a maximum height to ensure the atmospheric background remains visible.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layers** and **Glassmorphism**, rather than traditional heavy shadows. Surfaces should feel like translucent vellum floating over the background gradient.

1.  **Floor Level:** The base gradient background.
2.  **Surface Level:** Semi-transparent containers (Background Teal at 40-60% opacity) with a subtle `16px` backdrop blur.
3.  **Accent Level:** Interaction states use soft glow effects (outer glows using the component's own color at 20% opacity) to signify focus without harsh borders.
4.  **Organic Details:** Use thin, "hand-drawn" style strokes (1px to 2px) on the top edge of cards to provide a tactile, sketched definition.

## Shapes

The shape language is **Rounded and Organic**. Avoid sharp corners entirely. All containers use a minimum radius of `rounded-lg` (16px) to maintain a soft, friendly appearance.

Buttons and interaction chips should lean toward "pill-shaped" (rounded-xl) to evoke a sense of smoothness and comfort. Occasionally, secondary decorative elements should use slightly irregular, "blob" shapes to reinforce the hand-drawn, organic narrative of the design system.

## Components

- **Buttons:** Primary buttons are pill-shaped, filled with "Primary Blue," using dark "Ink" text for maximum clarity. Secondary buttons use a ghost style with a 1.5px organic, slightly non-uniform stroke.
- **Cards:** Use "Glassmorphism" surfaces. Borders should be low-contrast (Soft White at 10% opacity). Card headers should use "Title MD" for an approachable hierarchy.
- **Input Fields:** Search and text inputs are soft-rounded troughs with semi-transparent backgrounds. The active state should trigger a soft outer glow in the Primary color.
- **Chips & Tags:** Small, pill-shaped markers for moods or activities. These use "Secondary Green" or "Tertiary Gold" with low-opacity fills.
- **Progress Indicators:** Use thick, rounded lines or "hand-sketched" circular rings to track meditation or habit progress.
- **Mood Selector:** A unique component featuring custom "doodle" style icons that pulse gently when hovered, utilizing the organic shape language.