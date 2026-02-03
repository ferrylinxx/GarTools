import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GarTools Blog - Guides, Workflows & Media Tips',
  description: 'Long-form guides and workflows for GarTools. Learn how to convert, compress, enhance, and organize media with proven processes.',
  alternates: { canonical: 'https://fgarola.es/blog' },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
