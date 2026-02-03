'use client';

import { useState } from 'react';
import Head from 'next/head';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What tools are available?',
      answer: 'We offer a suite of media tools including format conversion, compression, audio enhancement, transcription, subtitle translation, GIF creation, metadata editing, and music identification.',
    },
    {
      question: 'Is this service free?',
      answer: 'Yes! The core tools are free to use. Some advanced features may require higher usage limits depending on your plan.',
    },
    {
      question: 'Do I need to create an account?',
      answer: 'No account is required to use the basic tools. You can sign in to access analytics and usage tracking.',
    },
    {
      question: 'What formats are supported?',
      answer: 'We support popular audio and video formats like MP4, MP3, WAV, FLAC, AAC, OGG, AVI, MKV, MOV, and WebM.',
    },
    {
      question: 'Is it safe to use?',
      answer: 'We don’t collect unnecessary personal data. Files are processed securely and temporary files are cleaned up after processing.',
    },
    {
      question: 'Can I process copyrighted content?',
      answer: 'Only if you have the rights or permission to use the content. Please respect copyright laws and platform terms.',
    },
    {
      question: 'Why is processing taking long?',
      answer: 'Processing time depends on file size, format, and selected quality settings. Larger or higher-quality files take longer.',
    },
    {
      question: 'Does this work on mobile devices?',
      answer: 'Yes, the interface is fully responsive and works on modern mobile and desktop browsers.',
    },
    {
      question: 'Where can I report a bug?',
      answer: 'Use the contact page to report issues. Include file type, size, steps to reproduce, and any error messages.',
    },
  ];

  // Generate FAQ structured data for SEO
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      {/* FAQ Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about our media tools
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 animate-slide-up">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-2xl"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
                  {faq.question}
                </span>
                <svg
                  className={`w-6 h-6 text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl text-center animate-fade-in">
          <h2 className="text-4xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Can&apos;t find the answer you&apos;re looking for? Try our tools and see how easy it is!
          </p>
          <a
            href="/tools"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            Explore Tools
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        {/* Quick Tips */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: 'Fast Processing',
              description: 'Optimized for speed with parallel processing',
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ),
              title: '100% Secure',
              description: 'We collect minimal technical data (logs, analytics, ad cookies) to run and improve the service.',
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'High Quality Exports',
              description: 'HD video and high-bitrate audio options',
            },
          ].map((tip, index) => (
            <div
              key={index}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl text-white mb-4 inline-block">
                {tip.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tip.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
