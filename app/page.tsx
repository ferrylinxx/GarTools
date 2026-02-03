'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [previewType, setPreviewType] = useState<'audio' | 'video'>('audio');
  const [previewStage, setPreviewStage] = useState<'before' | 'after'>('before');
  const particles = useMemo(() => {
    const frac = (n: number) => n - Math.floor(n);
    return Array.from({ length: 30 }, (_, i) => {
      const seed = (i + 1) * 9871.123;
      const left = frac(Math.sin(seed) * 10000) * 100;
      const top = frac(Math.sin(seed * 1.7) * 10000) * 100;
      const delay = frac(Math.sin(seed * 2.3) * 10000) * 4;
      const duration = 3 + frac(Math.sin(seed * 3.1) * 10000) * 5;
      return {
        left: `${left}%`,
        top: `${top}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      };
    });
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      title: 'Audio Enhancer',
      description: 'Improve audio quality with normalization, noise reduction, and EQ',
      gradient: 'from-pink-500 to-rose-500',
      href: '/audio-enhancer',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
      title: 'Video to GIF Converter',
      description: 'Convert video segments to animated GIFs with custom settings',
      gradient: 'from-yellow-500 to-orange-500',
      href: '/gif-converter',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
      title: 'Batch Converter',
      description: 'Convert multiple files simultaneously with queue management',
      gradient: 'from-green-500 to-emerald-500',
      href: '/converter',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: 'Video Compressor',
      description: 'Compress videos with platform-specific presets for optimal quality',
      gradient: 'from-cyan-500 to-blue-500',
      href: '/compressor',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Analytics Dashboard',
      description: 'Track your usage statistics and processing history with detailed insights',
      gradient: 'from-indigo-500 to-purple-500',
      href: '/analytics',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Premium Plans',
      description: 'Unlock advanced features with flexible monthly or yearly subscriptions',
      gradient: 'from-amber-500 to-yellow-500',
      href: '/pricing',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Safe & Secure',
      description: 'We don\u2019t store uploaded files. We collect minimal technical data (logs, analytics, ad cookies) to run and improve the service.',
      gradient: 'from-red-500 to-rose-500',
      href: '/privacy',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section - Ultra Premium */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 pt-20">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/50 via-purple-500/50 to-pink-500/50 animate-gradient-shift"></div>
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        {/* Multiple Animated Gradient Orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-white/30 to-blue-300/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-[550px] h-[550px] bg-gradient-to-br from-pink-300/30 to-white/30 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-cyan-300/20 to-blue-300/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-gradient-to-br from-yellow-300/20 to-orange-300/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob" style={{ animationDelay: '3s' }}></div>

        {/* Floating Icons - Enhanced */}
        <div className="absolute top-32 left-10 opacity-30 animate-float-enhanced">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-50"></div>
            <svg className="relative w-20 h-20 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
              <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z"/>
            </svg>
          </div>
        </div>
        <div className="absolute top-48 right-20 opacity-30 animate-float-enhanced animation-delay-2000">
          <div className="relative">
            <div className="absolute inset-0 bg-teal-500 rounded-2xl blur-xl opacity-50"></div>
            <svg className="relative w-20 h-20 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
        </div>
        <div className="absolute bottom-32 left-1/4 opacity-30 animate-float-enhanced animation-delay-4000">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-xl opacity-50"></div>
            <svg className="relative w-16 h-16 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        </div>
        <div className="absolute top-1/2 right-10 opacity-25 animate-float-enhanced" style={{ animationDelay: '1.5s' }}>
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 rounded-2xl blur-xl opacity-50"></div>
            <svg className="relative w-16 h-16 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
            </svg>
          </div>
        </div>

        {/* Particle Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((style, i) => (
            <div
              key={i}
              className="particle text-white"
              style={style}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-48">
          <div className="text-center">
            {/* Premium Badge with Glow */}
            <div className={`inline-block mb-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse-scale"></div>
                <span className="relative inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-black bg-white/20 backdrop-blur-xl text-white border-2 border-white/40 shadow-2xl hover:scale-110 transition-all cursor-default">
                  <svg className="w-6 h-6 text-yellow-300 animate-bounce-enhanced" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-shimmer text-lg">
                    🏆 #1 GarTools Worldwide
                  </span>
                  <svg className="w-6 h-6 text-yellow-300 animate-bounce-enhanced" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Main Heading - Ultra Premium - TEMPORARILY MODIFIED FOR ADSENSE */}
            <h1 className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white mb-10 leading-[0.9] px-2 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="block mb-6 text-5xl sm:text-6xl md:text-7xl font-bold text-white/80">
                Process & Convert
              </span>
              <span className="block relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-white via-blue-100 to-white blur-2xl opacity-50"></span>
                <span className="relative bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  Your Media
                </span>
              </span>
              <span className="block mt-8 text-5xl sm:text-6xl md:text-7xl">
                <span className="inline-block animate-bounce-enhanced">⚡</span>
                <span className="text-shimmer mx-4">In Seconds</span>
                <span className="inline-block animate-bounce-enhanced" style={{ animationDelay: '0.2s' }}>⚡</span>
              </span>
            </h1>

            {/* Subtitle - Enhanced */}
            <p className={`text-2xl sm:text-3xl md:text-4xl text-white/90 mb-14 max-w-5xl mx-auto leading-relaxed font-bold px-4 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="block mb-4 text-white">Fast • Free • 15+ Advanced Tools</span>
              <span className="block text-xl sm:text-2xl text-white/70 font-medium">
                Audio Enhancer, GIF Converter, Batch Processing & More! <span className="text-yellow-300 font-black">🚀</span>
              </span>
            </p>

            {/* CTA Buttons - TEMPORARILY HIDDEN FOR ADSENSE */}
            <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center px-4 w-full sm:w-auto transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Link
                href="/pricing"
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-12 py-7 text-2xl font-black overflow-hidden rounded-2xl transition-all duration-500 hover:scale-110 animate-glow-pulse"
              >
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50 to-white"></div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                {/* Content */}
                <span className="relative z-10 flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <svg className="relative w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                    View Pricing
                  </span>
                  <svg className="w-7 h-7 text-purple-600 group-hover:translate-x-3 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/tools"
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-12 py-7 text-2xl font-black overflow-hidden rounded-2xl transition-all duration-500 hover:scale-110"
              >
                {/* Glass Background */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border-2 border-white/30"></div>

                {/* Animated Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="absolute inset-[2px] bg-white/10 backdrop-blur-xl rounded-2xl"></div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                {/* Content */}
                <span className="relative z-10 flex items-center gap-4 text-white">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <svg className="relative w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <span className="group-hover:text-green-300 transition-colors">Explore Tools</span>
                  <svg className="w-7 h-7 group-hover:translate-x-3 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Trust Badges - Premium Design */}
            <div className={`mt-20 flex flex-wrap justify-center items-center gap-5 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {[
                { icon: '🚫', text: 'No Registration', color: 'from-green-400 to-emerald-400', glow: 'green' },
                { icon: '💯', text: 'Free tools available', color: 'from-blue-400 to-cyan-400', glow: 'blue' },
                { icon: '🎯', text: 'No Intrusive Ads', color: 'from-purple-400 to-pink-400', glow: 'purple' },
                { icon: '🔒', text: 'Secure', color: 'from-orange-400 to-red-400', glow: 'orange' },
              ].map((badge, index) => (
                <div
                  key={index}
                  className="group relative animate-slide-in-bottom"
                  style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${badge.color} rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>

                  {/* Badge */}
                  <div className="relative flex items-center gap-3 px-7 py-4 glass-morphism border-2 border-white/30 rounded-full text-white font-black hover:scale-110 transition-all duration-300 cursor-default">
                    <span className="text-2xl group-hover:scale-125 transition-transform">{badge.icon}</span>
                    <span className={`text-base bg-gradient-to-r ${badge.color} bg-clip-text text-transparent`}>
                      {badge.text}
                    </span>
                    <svg className="w-5 h-5 text-green-300 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats - Ultra Premium Cards */}
            <div className={`mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto items-stretch transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {[
                { value: '250K+', label: 'Files Processed', icon: '📥', gradient: 'from-blue-500 via-cyan-500 to-blue-600', glow: 'blue' },
                { value: '99.9%', label: 'Uptime', icon: '⚡', gradient: 'from-yellow-500 via-orange-500 to-yellow-600', glow: 'yellow' },
                { value: '15+', label: 'Formats', icon: '🎬', gradient: 'from-purple-500 via-pink-500 to-purple-600', glow: 'purple' },
                { value: '24/7', label: 'Available', icon: '🌐', gradient: 'from-green-500 via-emerald-500 to-green-600', glow: 'green' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group text-center perspective-card animate-zoom-in"
                  style={{ animationDelay: `${1 + index * 0.1}s` }}
                >
                  <div className="relative perspective-card-inner">
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>

                    {/* Card */}
                    <div className="relative glass-morphism border-2 border-white/30 rounded-3xl p-10 hover:border-white/50 transition-all duration-500 overflow-hidden h-full min-h-[240px] flex flex-col items-center justify-center">
                      {/* Animated Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Icon with Glow */}
                        <div className="relative inline-block mb-6">
                          <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                          <div className="relative text-6xl group-hover:scale-125 transition-transform duration-500">
                            {stat.icon}
                          </div>
                        </div>

                        {/* Value */}
                        <div className={`text-6xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300`}>
                          {stat.value}
                        </div>

                        {/* Label */}
                        <div className="text-base font-black text-white/80 uppercase tracking-widest group-hover:text-white transition-colors min-h-[48px] flex items-center justify-center text-center">
                          {stat.label}
                        </div>
                      </div>

                      {/* Corner Decoration */}
                      <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full group-hover:opacity-20 transition-opacity`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Ultra Premium */}
      <section className="relative py-40 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, #3b82f6 1px, transparent 1px),
              linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Enhanced */}
          <div className="text-center mb-24 animate-slide-in-top">
            {/* Badge */}
            <div className="inline-block mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <span className="relative px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-full text-base font-black uppercase tracking-wider shadow-2xl inline-block hover:scale-105 transition-transform cursor-default">
                  ✨ Powerful Features
                </span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 mb-8 leading-tight">
              <span className="block mb-4">Everything You Need,</span>
              <span className="block text-shimmer text-7xl sm:text-8xl lg:text-9xl">
                All in One Place
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-2xl sm:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-bold">
              Powerful features designed to make your experience
              <span className="relative inline-block mx-2">
                <span className="absolute inset-0 bg-purple-200 blur-lg opacity-50"></span>
                <span className="relative text-purple-600 font-black">seamless</span>
              </span>
              and
              <span className="relative inline-block mx-2">
                <span className="absolute inset-0 bg-blue-200 blur-lg opacity-50"></span>
                <span className="relative text-blue-600 font-black">lightning-fast</span>
              </span>
              🚀
            </p>
          </div>

          {/* Features Grid - Ultra Premium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className="group relative animate-zoom-in block"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Outer Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>

                {/* Card Container */}
                <div className="relative card-premium p-10 rounded-3xl border-2 border-gray-200/50 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 overflow-hidden h-full min-h-[360px] flex flex-col">
                  {/* Animated Gradient Border */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <div className="absolute inset-[2px] bg-white dark:bg-gray-900 rounded-3xl"></div>

                  {/* Inner Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                  {/* Content */}
                  <div className="relative z-10 flex-1">
                    {/* Icon with Enhanced Glow */}
                    <div className="relative inline-block mb-8">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                      <div className={`relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}>
                        <div className="text-3xl">{feature.icon}</div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className={`text-3xl font-black text-gray-900 mb-5 transition-all duration-500 group-hover:bg-gradient-to-r ${feature.gradient} group-hover:bg-clip-text group-hover:text-transparent group-hover:scale-105`}>
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed text-lg font-medium group-hover:text-gray-700 transition-colors">
                      {feature.description}
                    </p>

                    {/* Hover Arrow */}
                    <div className="mt-6 flex items-center gap-2 text-transparent group-hover:text-purple-600 transition-colors">
                      <span className="font-bold text-sm">Learn more</span>
                      <svg className="w-5 h-5 transform translate-x-0 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className={`absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-full group-hover:opacity-15 transition-opacity duration-500`}></div>
                  <div className={`absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr ${feature.gradient} opacity-5 rounded-full group-hover:opacity-15 transition-opacity duration-500`}></div>

                  {/* Bottom Accent Line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl`}></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="relative py-32 bg-gradient-to-b from-white via-emerald-50/30 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #10B981 1px, transparent 1px), linear-gradient(to bottom, #10B981 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="relative group inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <span className="relative px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white rounded-full text-base font-black uppercase tracking-wider shadow-2xl hover:scale-105 transition-all">
                🧰 Our Toolset
              </span>
            </div>
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 mb-8 leading-tight">
              <span className="block mb-4">About</span>
              <span className="block text-shimmer text-7xl sm:text-8xl lg:text-9xl">Our Tools</span>
            </h2>
            <p className="text-2xl sm:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
              Build a workflow that fits your needs with
              <span className="relative inline-block mx-3">
                <span className="absolute inset-0 bg-emerald-200 blur-lg opacity-50"></span>
                <span className="relative text-emerald-600 font-black">precision tools</span>
              </span>
              for your files.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {[
              {
                title: 'Pick Your Toolkit',
                description: 'Combine conversion, compression, enhancement, and metadata editing in one place.',
                icon: '🧩',
                gradient: 'from-emerald-500 to-teal-500'
              },
              {
                title: 'Tune the Output',
                description: 'Set presets for quality, size, and format with clear controls.',
                icon: '🎚️',
                gradient: 'from-teal-500 to-cyan-500'
              },
              {
                title: 'Ship Faster',
                description: 'Process files quickly with optimized pipelines and clean output naming.',
                icon: '🚀',
                gradient: 'from-cyan-500 to-blue-500'
              },
            ].map((card, index) => (
              <div
                key={index}
                className="group relative animate-zoom-in"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                <div className="relative bg-white rounded-3xl p-10 border-2 border-gray-200/60 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <div className="absolute inset-[2px] bg-white rounded-3xl"></div>

                  <div className="relative z-10">
                    <div className="text-6xl mb-6 group-hover:scale-125 transition-transform duration-500">{card.icon}</div>
                    <h3 className="text-3xl font-black text-gray-900 mb-4">{card.title}</h3>
                    <p className="text-lg text-gray-600 font-medium leading-relaxed">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Platforms Section */}
      <section className="relative py-32 bg-gradient-to-b from-white via-purple-50/30 to-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #A855F7 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="relative group inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <span className="relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-full text-base font-black uppercase tracking-wider shadow-2xl hover:scale-105 transition-all">
                🌐 Universal Support
              </span>
            </div>
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 mb-8 leading-tight">
              <span className="block mb-4">Works With</span>
              <span className="block text-shimmer text-7xl sm:text-8xl lg:text-9xl">
                Common Formats
              </span>
            </h2>
            <p className="text-2xl sm:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
              Support for common
              <span className="relative inline-block mx-3">
                <span className="absolute inset-0 bg-purple-200 blur-lg opacity-50"></span>
                <span className="relative text-purple-600 font-black">audio & video</span>
              </span>
              formats
            </p>
          </div>

          {/* Platforms Grid - TEMPORARILY HIDDEN FOR ADSENSE */}
          <div className="hidden grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'MP4', icon: '🎞️', color: 'from-blue-500 to-cyan-500', supported: true },
              { name: 'MP3', icon: '🎧', color: 'from-purple-500 to-pink-500', supported: true },
              { name: 'WAV', icon: '🔊', color: 'from-green-500 to-emerald-500', supported: true },
              { name: 'FLAC', icon: '💎', color: 'from-amber-500 to-yellow-500', supported: true },
              { name: 'WEBM', icon: '🌐', color: 'from-indigo-500 to-purple-500', supported: true },
              { name: 'AVI', icon: '📼', color: 'from-pink-500 to-rose-500', supported: true },
              { name: 'MOV', icon: '🎬', color: 'from-teal-500 to-emerald-500', supported: true },
              { name: 'OGG', icon: '🎵', color: 'from-orange-500 to-red-500', supported: true },
            ].map((platform, index) => (
              <div
                key={index}
                className="group relative animate-zoom-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Outer Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>

                {/* Card */}
                <div className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 overflow-hidden ${
                  platform.supported ? 'border-gray-200/50 hover:border-transparent' : 'border-gray-200/30 opacity-60'
                }`}>
                  {/* Animated Gradient Border (only for supported) */}
                  {platform.supported && (
                    <>
                      <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      <div className="absolute inset-[2px] bg-white rounded-3xl"></div>
                    </>
                  )}

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-500">
                      {platform.icon}
                    </div>

                    {/* Name */}
                    <h3 className={`text-xl font-black text-gray-900 mb-2 transition-all duration-500 ${
                      platform.supported ? `group-hover:bg-gradient-to-r ${platform.color} group-hover:bg-clip-text group-hover:text-transparent` : ''
                    }`}>
                      {platform.name}
                    </h3>

                    {/* Status Badge */}
                    {platform.supported ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Soon
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Preview Section */}
      <section className="relative py-32 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #3B82F6 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="relative group inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <span className="relative px-8 py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 text-white rounded-full text-base font-black uppercase tracking-wider shadow-2xl hover:scale-105 transition-all">
                🎚️ Before / After Preview
              </span>
            </div>
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 mb-6 leading-tight">
              <span className="block mb-4">Hear & See</span>
              <span className="block text-shimmer text-7xl sm:text-8xl lg:text-9xl">The Difference</span>
            </h2>
            <p className="text-2xl sm:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
              Toggle between before and after to preview how your media improves in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-stretch">
            <div className="relative bg-white rounded-3xl border-2 border-blue-200/60 p-10 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10"></div>

              <div className="relative z-10">
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="inline-flex rounded-2xl bg-blue-50 p-2 border border-blue-200/60">
                    <button
                      className={`px-5 py-2 rounded-xl text-sm font-black transition-all ${previewType === 'audio' ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-700'}`}
                      onClick={() => setPreviewType('audio')}
                    >
                      🎧 Audio
                    </button>
                    <button
                      className={`px-5 py-2 rounded-xl text-sm font-black transition-all ${previewType === 'video' ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-700'}`}
                      onClick={() => setPreviewType('video')}
                    >
                      🎬 Video
                    </button>
                  </div>

                  <div className="inline-flex rounded-2xl bg-gray-50 p-2 border border-gray-200">
                    <button
                      className={`px-5 py-2 rounded-xl text-sm font-black transition-all ${previewStage === 'before' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-700'}`}
                      onClick={() => setPreviewStage('before')}
                    >
                      Before
                    </button>
                    <button
                      className={`px-5 py-2 rounded-xl text-sm font-black transition-all ${previewStage === 'after' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-700'}`}
                      onClick={() => setPreviewStage('after')}
                    >
                      After
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border-2 border-blue-200/60 bg-gradient-to-br from-blue-50 to-white p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="font-black text-gray-900 text-2xl">
                      {previewType === 'audio' ? 'Audio Enhancer' : 'Video Compressor'}
                    </div>
                    <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${previewStage === 'after' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {previewStage === 'after' ? 'Enhanced' : 'Original'}
                    </div>
                  </div>

                  <div className="relative h-40 rounded-2xl bg-white border border-blue-100 overflow-hidden">
                    <div className={`absolute inset-0 ${previewStage === 'after' ? 'opacity-100' : 'opacity-60'} transition-opacity duration-500`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-blue-400/20"></div>
                      <div className="absolute bottom-6 left-6 right-6 h-20 grid grid-cols-12 gap-2 items-end">
                        {[12, 28, 18, 40, 24, 34, 20, 38, 16, 30, 22, 36].map((h, i) => (
                          <div key={i} className="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-md" style={{ height: `${h}px` }}></div>
                        ))}
                      </div>
                    </div>
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 right-4 text-xs font-bold text-blue-600">
                        {previewType === 'audio' ? 'Noise Reduced • Balanced EQ' : 'Smaller Size • Sharp Detail'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm font-semibold text-gray-600">
                    <div className="bg-white/70 rounded-2xl p-4 border border-blue-100">
                      {previewStage === 'after' ? 'Cleaner peaks, balanced levels' : 'Uneven levels, background noise'}
                    </div>
                    <div className="bg-white/70 rounded-2xl p-4 border border-blue-100">
                      {previewStage === 'after' ? 'Optimized size without artifacts' : 'Larger size, uncompressed export'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {[
                { title: 'Instant Preview', text: 'Toggle the results and compare in real time.', icon: '⚡' },
                { title: 'Smart Presets', text: 'Apply clean presets tuned for common use cases.', icon: '🎛️' },
                { title: 'Export Ready', text: 'Get results sized for social, web, or archival.', icon: '✅' },
              ].map((item, index) => (
                <div key={index} className="relative bg-white rounded-3xl border-2 border-blue-200/60 p-8 shadow-xl">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-lg font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Performance Benchmarks Section */}
      <section className="relative py-32 bg-gradient-to-b from-white via-purple-50/30 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #8B5CF6 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="relative group inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <span className="relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-full text-base font-black uppercase tracking-wider shadow-2xl hover:scale-105 transition-all">
                📈 Performance Benchmarks
              </span>
            </div>
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 mb-6 leading-tight">
              <span className="block mb-4">Speed &</span>
              <span className="block text-shimmer text-7xl sm:text-8xl lg:text-9xl">Efficiency</span>
            </h2>
            <p className="text-2xl sm:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
              Real‑world averages from typical conversions and exports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {[
              { value: '1.8s', label: 'Avg. Task Time', note: 'Small files, standard presets', icon: '⏱️' },
              { value: '42%', label: 'Avg. Size Reduction', note: 'Balanced compression', icon: '📉' },
              { value: '8x', label: 'Batch Throughput', note: 'Queue optimized', icon: '🚀' },
            ].map((stat, index) => (
              <div key={index} className="relative bg-white rounded-3xl border-2 border-purple-200/60 p-8 shadow-xl h-full flex flex-col items-center text-center">
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  {stat.value}
                </div>
                <div className="text-xl font-black text-gray-900 mb-2 uppercase tracking-wider">
                  {stat.label}
                </div>
                <div className="text-gray-600 font-medium">{stat.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick FAQ Section */}
      <section className="relative py-32 bg-gradient-to-b from-white via-yellow-50/30 to-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #F59E0B 1px, transparent 1px), linear-gradient(to bottom, #F59E0B 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="relative group inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <span className="relative px-8 py-4 bg-gradient-to-r from-yellow-600 via-orange-600 to-yellow-600 text-white rounded-full text-base font-black uppercase tracking-wider shadow-2xl hover:scale-105 transition-all">
                ❓ Quick Answers
              </span>
            </div>
            <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 mb-8 leading-tight">
              <span className="block mb-4">Got Questions?</span>
              <span className="block text-shimmer text-7xl sm:text-8xl lg:text-9xl">
                We've Got Answers
              </span>
            </h2>
          </div>

          {/* FAQ Items */}
          <div className="space-y-6">
            {[
              {
                question: 'Is it really free?',
                answer: 'Yes! 100% free forever. No hidden fees, no subscriptions, no credit card required.',
                icon: '💰'
              },
              {
                question: 'Do I need to register?',
                answer: 'Nope! Just upload a file and process it. No account needed.',
                icon: '🚫'
              },
              {
                question: 'What quality can I process or export?',
                answer: 'We support high-quality exports including HD and Full HD for video, and up to 320kbps for audio, depending on the tool.',
                icon: '🎬'
              },
              {
                question: 'Is it safe and legal?',
                answer: 'Yes, our service is safe. Please only process content you own or have the rights to use.',
                icon: '🔒'
              },
              {
                question: 'How fast is processing?',
                answer: 'Very fast! Most tasks complete in seconds, depending on file size and settings.',
                icon: '⚡'
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="group relative animate-slide-in-bottom"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

                {/* Card */}
                <div className="relative bg-white rounded-3xl p-8 border-2 border-gray-200/50 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden">
                  {/* Animated Gradient Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-[2px] bg-white rounded-3xl"></div>

                  {/* Content */}
                  <div className="relative z-10 flex items-start gap-6">
                    {/* Icon */}
                    <div className="text-5xl group-hover:scale-125 transition-transform duration-500 flex-shrink-0">
                      {faq.icon}
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-yellow-600 group-hover:to-orange-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                        {faq.question}
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed font-medium">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All FAQ Link */}
          <div className="text-center mt-16">
            <Link
              href="/faq"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-black overflow-hidden rounded-2xl transition-all duration-500 hover:scale-110"
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600"></div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

              {/* Content */}
              <span className="relative z-10 flex items-center gap-3 text-white">
                <span>View All FAQs</span>
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-40 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-20 left-10 opacity-10 animate-float">
          <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        <div className="absolute bottom-20 right-10 opacity-10 animate-float animation-delay-2000">
          <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-block mb-8">
            <span className="px-8 py-4 bg-white/20 backdrop-blur-xl text-white rounded-full text-sm font-black uppercase tracking-wider border-2 border-white/30 shadow-2xl">
              🚀 Get Started Today
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white mb-8 leading-tight">
            Start Processing
            <span className="block mt-4 bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent drop-shadow-2xl">
              In Seconds
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-2xl sm:text-3xl text-white/90 mb-16 max-w-4xl mx-auto font-bold leading-relaxed">
            Join <span className="text-yellow-300 text-4xl font-black">250K+</span> happy users worldwide 🌍
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              href="/tools"
              className="group relative inline-flex items-center justify-center px-12 py-7 text-2xl font-black text-purple-600 bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-110 shadow-2xl hover:shadow-white/50 hover-lift"
            >
              <span className="relative z-10 flex items-center gap-4">
                <svg className="w-8 h-8 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 00-1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Explore Tools
                </span>
                <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">No Credit Card</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Cancel Anytime</span>
              </div>
            </div>
          </div>
      </section>
    </div>
  );
}
