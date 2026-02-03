import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tools - GarTools Media Toolkit',
  description: 'Explore all GarTools utilities for conversion, compression, enhancement, transcription, and metadata editing.',
  alternates: { canonical: 'https://fgarola.es/tools' },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
