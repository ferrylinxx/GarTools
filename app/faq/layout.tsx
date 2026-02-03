import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - GarTools',
  description: 'Answers to common questions about GarTools tools, workflows, formats, and legal use.',
  alternates: { canonical: 'https://fgarola.es/faq' },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
