'use client';

import Link from 'next/link';

export default function ToolsPage() {
  const tools = [
    {
      name: 'Audio Enhancer',
      description: 'Improve audio quality with normalization, noise reduction, and EQ',
      href: '/audio-enhancer',
      icon: '🎵',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      name: 'Video to GIF',
      description: 'Convert video segments to animated GIFs with custom settings',
      href: '/gif-converter',
      icon: '🎬',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      name: 'Batch Converter',
      description: 'Convert multiple files simultaneously with queue management',
      href: '/converter',
      icon: '📦',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Video Compressor',
      description: 'Compress videos with platform-specific presets for optimal quality',
      href: '/compressor',
      icon: '🗜️',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      name: 'Metadata Editor',
      description: 'Edit audio and video metadata, tags, and cover art',
      href: '/metadata-editor',
      icon: '✏️',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      name: 'Music Identifier',
      description: 'Identify songs from audio files using advanced recognition',
      href: '/music-identifier',
      icon: '🎼',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Transcribe Audio',
      description: 'Convert speech to text with high accuracy',
      href: '/transcribe',
      icon: '📝',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      name: 'Translate Subtitles',
      description: 'Translate subtitles to multiple languages',
      href: '/translate',
      icon: '🌐',
      gradient: 'from-teal-500 to-green-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              All Tools
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our complete suite of media processing tools
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <Link
              key={index}
              href={tool.href}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Gradient Border on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`}></div>
              
              {/* Icon */}
              <div className="text-6xl mb-4">{tool.icon}</div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {tool.name}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {tool.description}
              </p>
              
              {/* Arrow Icon */}
              <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                <span>Try it now</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12">
            <h2 className="text-4xl font-black text-white mb-4">
              Need More Features?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Upgrade to unlock advanced features and higher limits
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-3 bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              View Pricing Plans
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

