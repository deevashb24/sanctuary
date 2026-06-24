import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exercises',
  robots: { index: false, follow: false },
};

export default function ExercisesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
