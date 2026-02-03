import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About GarTools - Media Toolkit for Creators',
  description: 'Learn about GarTools, our mission, and the media tools we build for creators and teams.',
  alternates: { canonical: 'https://fgarola.es/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
