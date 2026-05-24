import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sanctuary.vercel.app'),
  title: {
    default: "Sanctuary | Your Mind Needs a Companion, Not Just a Tracker",
    template: "%s | Sanctuary"
  },
  description: "A safe place for your mind to rest. AI-guided mental wellness companion.",
  openGraph: {
    title: "Sanctuary | Mental Wellness Companion",
    description: "Experience a mental wellness journey that listens, understands, and grows with you. Safe, private, and rooted in care.",
    url: 'https://sanctuary.vercel.app',
    siteName: 'Sanctuary',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanctuary',
    description: 'A safe place for your mind to rest.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${jakarta.variable} font-sans antialiased bg-background text-on-background`}>
        {children}
      </body>
    </html>
  );
}
