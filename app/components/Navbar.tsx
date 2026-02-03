'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, userProfile, signOut, loading } = useAuth();

  // Handle scroll for sticky navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsActionsOpen(false);
    setIsToolsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setIsActionsOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const actionOptions = [];

  // Organized tool categories
  const toolCategories = [
    {
      name: 'Conversion Tools',
      tools: [
        {
          href: '/converter',
          label: 'Format Converter',
          description: 'Convert video/audio formats',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          ),
        },
        {
          href: '/gif-converter',
          label: 'GIF Converter',
          description: 'Video to GIF',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          ),
        },
        {
          href: '/compressor',
          label: 'Video Compressor',
          description: 'Compress videos',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          ),
        },
      ],
    },
    {
      name: 'Audio Tools',
      tools: [
        {
          href: '/audio-enhancer',
          label: 'Audio Enhancer',
          description: 'Improve quality',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ),
        },
        {
          href: '/music-identifier',
          label: 'Music Identifier',
          description: 'Identify songs',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          ),
        },
        {
          href: '/metadata-editor',
          label: 'Metadata Editor',
          description: 'Edit ID3 tags',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          ),
        },
      ],
    },
    {
      name: 'AI & Advanced',
      tools: [
        {
          href: '/transcribe',
          label: 'AI Transcription',
          description: 'Audio to text',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          ),
        },
        {
          href: '/translate',
          label: 'AI Translator',
          description: 'Translate text',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          ),
        },
        
      ],
    },
  ];

  // Main navigation links (reduced for cleaner menu)
  const navLinks = [
    {
      href: '/',
      label: 'Home',
      icon: (
        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      href: '/pricing',
      label: 'Pricing',
      icon: (
        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  const isActive = (path: string) => pathname === path;
  const homeLink = navLinks.find((link) => link.href === '/');
  const otherLinks = navLinks.filter((link) => link.href !== '/');
  // Check if current page is any tool page
  const allToolPaths = toolCategories.flatMap(category => category.tools.map(tool => tool.href));
  const isToolPage = allToolPaths.includes(pathname);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-2xl shadow-2xl shadow-purple-500/10 py-2'
          : 'bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-xl shadow-xl py-0'
      }`}
    >
      {/* Gradient Border Bottom */}
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-50'}`}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-500 ${isScrolled ? 'h-16' : 'h-20'}`}>
          {/* Logo */}
          <Link
            href="/"
            onClick={scrollToTop}
            className="flex items-center space-x-3 group relative"
            aria-label="GarTools Home"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500 animate-pulse-glow"></div>

              {/* Icon Container */}
              <div className={`relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl group-hover:shadow-purple-500/50 group-hover:scale-110 transition-all duration-500 ${isScrolled ? 'p-2.5' : 'p-3'}`}>
                <svg className={`text-white transition-all duration-500 ${isScrolled ? 'w-6 h-6' : 'w-8 h-8'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
            </div>

            {/* Brand Text */}
            <div className="flex flex-col">
              <span className={`font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-all duration-500 ${isScrolled ? 'text-xl' : 'text-2xl'}`}>
                GarTools
              </span>
              <span className={`text-xs font-bold text-gray-500 transition-all duration-500 ${isScrolled ? 'opacity-0 h-0' : 'opacity-100'}`}>
                Fast & Free
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 lg:gap-3">
            {actionOptions.length > 0 && (
              <div className="relative" ref={actionsRef}>
                <button
                  onClick={() => setIsActionsOpen(!isActionsOpen)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsActionsOpen(!isActionsOpen);
                    }
                  }}
                  className="group relative inline-flex items-center gap-2 px-3 lg:px-5 py-2.5 lg:py-3 rounded-2xl font-bold text-xs lg:text-sm uppercase tracking-wide transition-all duration-500 overflow-hidden text-gray-700 hover:text-white"
                  aria-expanded={isActionsOpen}
                  aria-haspopup="true"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <svg className="w-4 h-4 lg:w-5 lg:h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="relative z-10 hidden lg:inline">Actions</span>
                  <svg
                    className={`w-4 h-4 relative z-10 transition-transform duration-500 ${isActionsOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isActionsOpen && (
                  <div className="absolute top-full left-0 mt-3 w-80 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-purple-100 overflow-hidden animate-slide-down z-50">
                    <div className="px-6 py-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b-2 border-purple-100">
                      <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider">Choose Platform</h3>
                    </div>

                    {actionOptions.map((option, index) => (
                      <Link
                        key={option.href}
                        href={option.href}
                        onClick={() => setIsActionsOpen(false)}
                        className={`group relative flex items-start gap-4 px-6 py-5 transition-all duration-500 overflow-hidden ${
                          isActive(option.href)
                            ? option.color === 'red'
                              ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                              : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                            : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50'
                        } ${index !== actionOptions.length - 1 ? 'border-b border-gray-100' : ''}`}
                      >
                        <div className={`p-3 rounded-2xl transition-all duration-500 ${
                          isActive(option.href)
                            ? 'bg-white/20 text-white'
                            : option.color === 'red'
                              ? 'bg-red-100 text-red-600 group-hover:bg-red-200'
                              : 'bg-green-100 text-green-600 group-hover:bg-green-200'
                        }`}>
                          {option.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className={`font-black text-lg flex items-center gap-2 ${isActive(option.href) ? 'text-white' : 'text-gray-900'}`}>
                            {option.label}
                            {isActive(option.href) && (
                              <svg className="w-5 h-5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className={`text-sm mt-1 font-semibold ${isActive(option.href) ? 'text-white/90' : 'text-gray-600'}`}>
                            {option.description}
                          </div>
                        </div>

                        {!isActive(option.href) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {homeLink && (
              <Link
                href={homeLink.href}
                className={`group relative inline-flex items-center gap-2 px-3 lg:px-5 py-2.5 lg:py-3 rounded-2xl font-bold text-xs lg:text-sm uppercase tracking-wide transition-all duration-500 overflow-hidden ${
                  isActive(homeLink.href)
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/50 scale-105'
                    : 'text-gray-700 hover:text-white'
                }`}
              >
                {!isActive(homeLink.href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                )}

                <span className="relative z-10">{homeLink.icon}</span>
                <span className="relative z-10">{homeLink.label}</span>

                {isActive(homeLink.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/50 rounded-full"></div>
                )}
              </Link>
            )}

            {/* Tools Dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsToolsOpen(!isToolsOpen);
                  }
                }}
                className={`group relative inline-flex items-center gap-2 px-3 lg:px-5 py-2.5 lg:py-3 rounded-2xl font-bold text-xs lg:text-sm uppercase tracking-wide transition-all duration-500 overflow-hidden ${
                  isToolPage
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-2xl shadow-pink-500/50 scale-105'
                    : 'text-gray-700 hover:text-white'
                }`}
                aria-expanded={isToolsOpen}
                aria-haspopup="true"
              >
                {/* Hover Background */}
                {!isToolPage && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                )}

                {/* Content */}
                <svg className="w-4 h-4 lg:w-5 lg:h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="relative z-10 hidden lg:inline">Tools</span>
                <svg
                  className={`w-3 h-3 lg:w-4 lg:h-4 relative z-10 transition-transform duration-500 ${isToolsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>

                {/* Active Indicator */}
                {isToolPage && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/50 rounded-full"></div>
                )}
              </button>

              {/* Mega Menu with Categories */}
              {isToolsOpen && (
                <div className="absolute top-full left-0 mt-3 w-[720px] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-pink-100 overflow-hidden animate-slide-down z-50">
                  {/* Dropdown Header */}
                  <div className="px-6 py-4 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border-b-2 border-pink-100">
                    <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider">Choose Tool</h3>
                  </div>

                  {/* Categories Grid */}
                  <div className="grid grid-cols-3 gap-4 p-6">
                    {toolCategories.map((category, categoryIndex) => (
                      <div key={category.name} className="space-y-3">
                        {/* Category Header */}
                        <div className="px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                          <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider">
                            {category.name}
                          </h4>
                        </div>

                        {/* Category Tools */}
                        <div className="space-y-2">
                          {category.tools.map((tool) => (
                            <Link
                              key={tool.href}
                              href={tool.href}
                              onClick={() => setIsToolsOpen(false)}
                              className={`group relative flex items-start gap-3 p-3 rounded-xl transition-all duration-300 ${
                                isActive(tool.href)
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                  : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
                              }`}
                            >
                              {/* Icon */}
                              <div className={`p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${
                                isActive(tool.href)
                                  ? 'bg-white/20 text-white'
                                  : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
                              }`}>
                                {tool.icon}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className={`font-bold text-sm flex items-center gap-1 ${
                                  isActive(tool.href) ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {tool.label}
                                  {isActive(tool.href) && (
                                    <svg className="w-4 h-4 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <div className={`text-xs mt-0.5 font-medium ${
                                  isActive(tool.href) ? 'text-white/90' : 'text-gray-600'
                                }`}>
                                  {tool.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Regular Nav Links */}
            {otherLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative inline-flex items-center gap-2 px-3 lg:px-5 py-2.5 lg:py-3 rounded-2xl font-bold text-xs lg:text-sm uppercase tracking-wide transition-all duration-500 overflow-hidden ${
                  isActive(link.href)
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/50 scale-105'
                    : 'text-gray-700 hover:text-white'
                }`}
              >
                {/* Hover Background */}
                {!isActive(link.href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                )}

                {/* Content */}
                <span className="relative z-10">{link.icon}</span>
                <span className="relative z-10">{link.label}</span>

                {/* Active Indicator */}
                {isActive(link.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/50 rounded-full"></div>
                )}
              </Link>
            ))}

            {/* User Menu / Login Button */}
            {!loading && (
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="group relative inline-flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all duration-500 overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
                        {userProfile?.avatar_url ? (
                          <img
                            src={userProfile.avatar_url}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-black">{user.email?.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <span className="hidden lg:inline">{userProfile?.name || user.email?.split('@')[0]}</span>
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute top-full right-0 mt-3 w-64 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-emerald-100 overflow-hidden animate-slide-down z-50">
                        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center overflow-hidden border-2 border-white shadow-lg">
                              {userProfile?.avatar_url ? (
                                <img
                                  src={userProfile.avatar_url}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-lg font-black text-white">{user.email?.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-black text-gray-700 truncate">{userProfile?.name || user.email?.split('@')[0]}</p>
                              <p className="text-xs text-gray-500 font-semibold truncate">{user.email}</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 font-semibold capitalize">
                            {userProfile?.subscription_tier || 'free'} Plan
                          </p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/pricing"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-6 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all"
                          >
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-bold text-gray-700">Upgrade Plan</span>
                          </Link>
                          <Link
                            href="/analytics"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-6 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all"
                          >
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="font-bold text-gray-700">My Analytics</span>
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-6 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all"
                          >
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-bold text-gray-700">My Profile</span>
                          </Link>
                          <button
                            onClick={() => {
                              signOut();
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-6 py-3 hover:bg-red-50 transition-all text-left border-t-2 border-gray-100 mt-2"
                          >
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="font-bold text-red-600">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="group relative inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm uppercase tracking-wide transition-all duration-500 overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl hover:shadow-2xl hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Login</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`group relative p-4 rounded-2xl transition-all duration-500 overflow-hidden ${
                isMenuOpen
                  ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/50 scale-110'
                  : 'text-gray-700 hover:text-white'
              }`}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              {/* Hover Background */}
              {!isMenuOpen && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              )}

              {/* Icon */}
              <svg
                className="w-7 h-7 relative z-10 transition-transform duration-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/70 via-purple-900/30 to-black/70 backdrop-blur-md md:hidden animate-fade-in z-[9998]"
          onClick={() => setIsMenuOpen(false)}
          onTouchEnd={() => setIsMenuOpen(false)}
          aria-hidden="true"
          role="button"
          tabIndex={-1}
        />
      )}

      {/* Mobile Menu Slide-in Panel */}
      <div
        className={`fixed inset-0 w-full h-[100dvh] bg-gradient-to-b from-white via-purple-50/30 to-white backdrop-blur-2xl shadow-2xl md:hidden transform transition-all duration-500 ease-out overflow-y-auto border-l-2 border-purple-200 z-[9999] ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="relative flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Content */}
            <div className="relative flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-2xl blur-lg opacity-50"></div>
                <div className="relative bg-white/20 backdrop-blur-xl p-3 rounded-2xl border-2 border-white/30">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-white block">Menu</span>
                <span className="text-xs font-bold text-white/80">Navigation</span>
              </div>
            </div>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="relative p-3 rounded-2xl bg-white/20 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white/30 transition-all duration-300"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Links */}
          <nav className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {actionOptions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                    <span className="text-sm font-black text-gray-700 uppercase tracking-wider">Actions</span>
                  </div>
                  <div className="space-y-3">
                    {actionOptions.map((option, index) => (
                      <Link
                        key={option.href}
                        href={option.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`group relative flex items-start gap-4 px-5 py-5 rounded-2xl font-bold text-base transition-all duration-500 overflow-hidden ${
                          isActive(option.href)
                            ? option.color === 'red'
                              ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-2xl shadow-red-500/30 scale-105'
                              : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-2xl shadow-green-500/30 scale-105'
                            : 'bg-white/50 backdrop-blur-xl border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:scale-105'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className={`p-3 rounded-xl transition-all duration-500 ${
                          isActive(option.href)
                            ? 'bg-white/20 text-white'
                            : option.color === 'red'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-green-100 text-green-600'
                        }`}>
                          {option.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{option.label}</span>
                            {isActive(option.href) && (
                              <svg className="w-5 h-5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className={`text-sm mt-1 font-semibold ${isActive(option.href) ? 'text-white/90' : 'text-gray-600'}`}>
                            {option.description}
                          </div>
                        </div>

                        {!isActive(option.href) && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gradient-to-r from-blue-200 via-purple-200 to-pink-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 py-1 bg-white rounded-full text-xs font-bold text-gray-500 uppercase tracking-wider">Pages</span>
                </div>
              </div>

              {/* Other Links */}
              <div className="space-y-3">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`group relative flex items-center gap-4 px-5 py-5 rounded-2xl font-bold text-base transition-all duration-500 overflow-hidden ${
                      isActive(link.href)
                        ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/30 scale-105'
                        : 'bg-white/50 backdrop-blur-xl border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:scale-105'
                    }`}
                    style={{ animationDelay: `${(actionOptions.length + index) * 50}ms` }}
                  >
                    {/* Icon */}
                    <div className={`p-3 rounded-xl transition-all duration-500 ${
                      isActive(link.href)
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {link.icon}
                    </div>

                    {/* Label */}
                    <span className="text-lg">{link.label}</span>

                    {/* Active Indicator */}
                    {isActive(link.href) && (
                      <svg className="w-5 h-5 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}

                    {/* Hover Effect */}
                    {!isActive(link.href) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
              {/* Tools Section */}
              <div>
                <div className="flex items-center gap-2 px-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-black text-gray-700 uppercase tracking-wider">Tools</span>
                </div>
                <div className="space-y-4">
                  {toolCategories.map((category, categoryIndex) => (
                    <div key={category.name} className="space-y-2">
                      {/* Category Header */}
                      <div className="px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                        <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider">
                          {category.name}
                        </h4>
                      </div>

                      {/* Category Tools */}
                      <div className="space-y-2">
                        {category.tools.map((tool, toolIndex) => (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`group relative flex items-start gap-3 px-4 py-4 rounded-xl font-bold text-base transition-all duration-300 overflow-hidden ${
                              isActive(tool.href)
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                : 'bg-white/50 backdrop-blur-xl border-2 border-gray-200 text-gray-700 hover:border-pink-300'
                            }`}
                            style={{ animationDelay: `${(categoryIndex * 4 + toolIndex) * 50}ms` }}
                          >
                            {/* Icon Container */}
                            <div className={`p-2.5 rounded-lg transition-all duration-300 flex-shrink-0 ${
                              isActive(tool.href)
                                ? 'bg-white/20 text-white'
                                : 'bg-purple-100 text-purple-600'
                            }`}>
                              {tool.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{tool.label}</span>
                                {isActive(tool.href) && (
                                  <svg className="w-4 h-4 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <div className={`text-xs mt-0.5 font-medium ${isActive(tool.href) ? 'text-white/90' : 'text-gray-600'}`}>
                                {tool.description}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

          </nav>

          {/* Mobile Menu Footer */}
          <div className="relative p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            {/* Content */}
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="p-2 bg-white/20 backdrop-blur-xl rounded-xl border-2 border-white/30">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <span className="text-xl font-black text-white">GarTools</span>
              </div>
              <p className="text-sm font-bold text-white/90 mb-2">Fast, Free & Reliable</p>
              <p className="text-xs text-white/70">Process media instantly with smart tools</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
