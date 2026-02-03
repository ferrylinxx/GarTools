export default function ChangelogPage() {
  const releases = [

    {
      version: '5.0.0',
      date: '2026-01-29',
      type: 'major',
      title: 'Rebrand, Blog Expansion & Platform Cleanup',
      changes: [
        {
          category: 'Brand & Domain',
          items: [
            'Updated primary domain to fgarola.es across metadata and sitemap',
            'Refined brand copy to reflect a media toolkit instead of exports',
          ],
        },
        {
          category: 'Blog System',
          items: [
            'Expanded blog with long-form tool guides and playbooks',
            'Improved blog layout with featured post, read time, and visual effects',
            'Added markdown rendering with improved typography styling',
          ],
        },
        {
          category: 'Landing Page',
          items: [
            'Added Before/After preview section with interactive toggle',
            'Added performance benchmarks section',
            'Improved feature cards with direct links to tools',
          ],
        },
        {
          category: 'Policy & Compliance',
          items: [
            'Removed export-oriented language from key pages and documentation',
            'Updated Terms and FAQ to emphasize legal, rights-based usage',
          ],
        },
        {
          category: 'Stability',
          items: [
            'Resolved hydration mismatch by stabilizing dynamic particle layout',
            'Hardened analytics tracking so it never breaks the UI',
          ],
        },
      ],
    },

    {
      version: '3.2.0',
      date: '2025-10-24',
      type: 'major',
      title: 'AI Transcription & Translation Overhaul - Premium Features',
      changes: [
        {
          category: 'AI Transcription Improvements',
          items: [
            'Segmented transcription view with individual timestamps (MM:SS format)',
            'Toggle between "Segments" and "Full Text" viewing modes',
            'Each segment displayed in beautiful card with hover effects',
            'Optimized OpenAI Whisper model with temperature=0 for maximum accuracy',
            'Verbose JSON response format for detailed segment data',
            'Enhanced UI with gradient backgrounds and modern design',
            'Better text organization and readability',
          ],
        },
        {
          category: 'AI Translation Feature',
          items: [
            'Integrated OpenAI GPT-3.5-turbo for high-quality translation',
            'Support for 15+ languages (Spanish, English, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Hindi, Dutch, Polish, Turkish)',
            'One-click translation directly from transcription results',
            'Beautiful translation UI with gradient blue/indigo design',
            'Fallback to MyMemory API if OpenAI unavailable',
            'Professional translation quality preserving tone and context',
            'Temperature 0.3 for accurate, consistent translations',
          ],
        },
        {
          category: 'Universal Search Quick Export',
          items: [
            'One-click MP3 export directly from search results',
            'Server-Sent Events (SSE) for real-time progress tracking',
            'Loading states with spinner animation on export button',
            'Automatic browser export when conversion complete',
            'Smart filename generation from artist and title',
            'Enhanced user experience with toast notifications',
          ],
        },
        {
          category: 'MP3 Metadata Enhancement',
          items: [
            'Smart title cleaning (removes "Official Video", "Lyrics", etc.)',
            'Artist/title parsing from video titles',
            'Complete ID3 metadata tags (title, artist, album, year)',
            'Album artwork displays correctly in all music players',
            'Proper APIC tag structure with Buffer encoding',
            'Enhanced metadata using node-id3 library',
          ],
        },
        {
          category: 'Bug Fixes',
          items: [
            'Fixed OpenAI Whisper "Could not parse multipart form" error',
            'Switched to node-fetch@2 with form-data for API compatibility',
            'Fixed album artwork not showing in MP3 files',
            'Fixed incorrect MP3 filenames (now uses artist - title format)',
            'Fixed translation API failures with OpenAI GPT integration',
            'Resolved SSE controller "already closed" errors',
          ],
        },
        {
          category: 'Technical Improvements',
          items: [
            'Dynamic imports for form-data and node-fetch compatibility',
            'Optimized Whisper API parameters for best results',
            'Enhanced error handling with detailed logging',
            'Better file stream handling for large audio files',
            'Improved temporary file management',
            'Added comprehensive debug logging throughout',
          ],
        },
      ],
    },
    {
      version: '3.0.0',
      date: '2025-10-23',
      type: 'major',
      title: 'MAJOR UPDATE - 6 New Professional Tools Added',
      changes: [
        {
          category: 'New Tools',
          items: [
            'Format Converter (/converter) - Convert between video/audio formats (MP4, AVI, MKV, WEBM, MOV, MP3, AAC, FLAC, WAV, OGG)',
            'Music Identifier (/music-identifier) - Shazam-like music identification from audio files',
            'Metadata Editor (/metadata-editor) - Edit ID3 tags and album artwork with batch support',
            'AI Transcription (/transcribe) - Convert audio/video to text with OpenAI Whisper',
            'AI Translator (/translate) - Translate text and subtitle files (15+ languages)',
          ],
        },
        {
          category: 'Navigation Enhancement',
          items: [
            'New "Tools" dropdown menu in desktop navigation',
            'Tools section in mobile menu with 6 new tools',
            'Purple → pink → rose gradient theme for Tools',
            'Organized categories: Exports and Tools',
            'Active page indicators for all tools',
            'Smooth animations and transitions',
          ],
        },
        {
          category: 'Technical Improvements',
          items: [
            'Added 8 new API routes for tool functionality',
            'Installed 10+ new dependencies (uuid, music-metadata, openai, etc.)',
            'Automatic file cleanup for temp files',
            'Real-time progress tracking',
            'Fallback methods when API keys not configured',
            'Secure file handling with unique filenames',
          ],
        },
        {
          category: 'Design System',
          items: [
            'Consistent premium UI/UX across all 6 new tools',
            'Unique gradient color schemes per tool',
            'Glass-morphism backgrounds throughout',
            'Gradient orbs with float animations',
            'Dotted pattern backgrounds',
            'Glow effects and shine effects',
            'Premium info cards with icons',
          ],
        },
        {
          category: 'Features',
          items: [
            'Format Converter: High-quality conversion using FFmpeg',
            'Music Identifier: Powered by AudD API with metadata display',
            'Metadata Editor: Batch editing with artwork support',
            'Universal Search: Grid display with thumbnails and one-click export',
            'AI Transcription: 100+ languages, SRT export with timestamps',
            'AI Translator: Text and subtitle translation with timestamp preservation',
          ],
        },
      ],
    },
    {
      version: '2.6.0',
      date: '2025-10-17',
      type: 'minor',
      title: 'UX Enhancements - Scroll to Top & Bug Fixes',
      changes: [
        {
          category: 'New Features',
          items: [
            'Added floating Scroll to Top button with gradient design',
            'Smooth scroll animation to top of page',
            'Button appears after scrolling 300px',
            'Glow effect with pulse animation',
            'Tooltip on hover showing "Back to Top"',
            'Bounce-in animation on appearance',
          ],
        },
        {
          category: 'Bug Fixes',
          items: [
            'Fixed Features section hover bug (text disappearing)',
            'Changed hover effect to gradient text instead of white',
            'Improved visual feedback on feature cards',
          ],
        },
        {
          category: 'UI/UX Improvements',
          items: [
            'Complete Changelog page redesign with premium styling',
            'Timeline view with gradient vertical line',
            'Version badges with type-specific colors',
            'Category icons for better organization',
            'Glass-morphism cards throughout',
            'Staggered animations for releases',
            'Improved typography and spacing',
          ],
        },
      ],
    },
    {
      version: '2.5.0',
      date: '2025-10-17',
      type: 'minor',
      title: 'Major Navigation Enhancement - Premium Menu Design',
      changes: [
        {
          category: 'Navigation Enhancements',
          items: [
            'Complete navbar redesign with gradient backgrounds',
            'Enhanced logo with two-line branding and tagline',
            'Premium Exports dropdown with glass-morphism',
            'Gradient hover effects on all navigation links',
            'Larger mobile menu button with better touch targets',
            'Full gradient mobile menu header with dotted pattern',
            'Glass-morphism cards for mobile menu options',
            'Enhanced mobile menu footer with branding',
            'Gradient backdrop blur for mobile menu',
            'Smooth 500ms transitions throughout',
          ],
        },
        {
          category: 'UI/UX Improvements',
          items: [
            'Consistent glass-morphism design pattern',
            'Enhanced gradient color scheme (blue → purple → pink)',
            'Better z-index management for overlays',
            'Improved accessibility with ARIA labels',
            'Optimized hover states with gradient overlays',
            'Better spacing and padding throughout',
            'Enhanced shadow effects with color tints',
          ],
        },
      ],
    },
    {
      version: '2.4.0',
      date: '2025-10-17',
      type: 'minor',
      title: 'Complete Design Overhaul - Premium UI/UX',
      changes: [
        {
          category: 'UI/UX Improvements',
          items: [
            'Hero section with bold gradient background',
            'Dotted pattern overlay for texture',
            'Animated white orbs with mix-blend-overlay',
            'Glass-morphism badge with backdrop-blur',
            'Trust badges with glass-morphism',
            'Stats section with gradient backgrounds',
            'Features section modernized with gradients',
            'Testimonials with premium design',
            'Impactful CTA section',
            'Footer completely redesigned',
          ],
        },
        {
          category: 'Performance',
          items: [
            'GPU-accelerated animations',
            'Optimized backdrop-blur usage',
            'Efficient gradient rendering',
          ],
        },
      ],
    },
    {
      version: '4.0.0',
      date: '2025-01-17',
      type: 'major',
      title: 'Mobile Optimization, Enhanced Navigation & Blog System',
      changes: [
        {
          category: 'Mobile Optimization',
          items: [
            'Comprehensive mobile optimization across all pages',
            'Ensured minimum 16px font size for body text on mobile',
            'Implemented 44x44px minimum touch targets for all interactive elements',
            'Fixed horizontal scrolling issues on small screens',
            'Optimized hero section text sizes for mobile (4xl → 8xl responsive)',
            'Added responsive button sizing (full-width on mobile)',
            'Optimized animations for mobile performance',
            'Added safe area support for devices with notches',
            'Implemented mobile-specific CSS optimizations',
            'Reduced animation complexity on mobile devices',
          ],
        },
        {
          category: 'Navigation Enhancements',
          items: [
            'Complete navigation menu redesign with premium features',
            'Added icons to all navigation links for better visual hierarchy',
            'Implemented smooth slide-in mobile menu from right side',
            'Added backdrop overlay when mobile menu is open',
            'Implemented body scroll lock when menu is active',
            'Added staggered animations for mobile menu items',
            'Enhanced desktop navigation with icon + label design',
            'Improved active state indicators with gradient borders',
            'Added mobile menu header with branding',
            'Implemented auto-close on route change',
            'Enhanced touch targets for mobile menu (larger tap areas)',
          ],
        },
        {
          category: 'Blog System',
          items: [
            'Created dynamic blog post pages with [id] routing',
            'Added 3 comprehensive blog posts with real, helpful content',
            'Implemented beautiful blog post layout with hero sections',
            'Added author bio sections to blog posts',
            'Created related posts section',
            'Added social media share buttons (Facebook, Twitter, WhatsApp)',
            'Implemented tags system for blog posts',
            'Added read time and date metadata',
            'Created category filtering on blog listing page',
            'Optimized blog posts for mobile reading',
            'Added proper typography with prose classes',
          ],
        },
        {
          category: 'UI/UX Improvements',
          items: [
            'Fixed dark/light theme toggle functionality',
            'Enhanced home page with tri-color gradients (blue → purple → pink)',
            'Added 10+ new CSS animations (float, pulse-glow, shimmer, etc.)',
            'Improved typography hierarchy across all pages',
            'Enhanced button designs with better hover effects',
            'Added glassmorphic effects to cards and containers',
            'Implemented hover-lift utility class',
            'Enhanced stats section with emoji icons and cards',
            'Improved feature cards with gradient borders',
            'Added smooth scroll behavior',
            'Implemented focus-visible for accessibility',
          ],
        },
        {
          category: 'Performance',
          items: [
            'Optimized CSS with mobile-specific media queries',
            'Reduced animation duration on mobile for better performance',
            'Implemented efficient backdrop-blur usage',
            'Optimized scrollbar styling for mobile (6px width)',
            'Added proper box-sizing for all elements',
            'Prevented layout shift with consistent sizing',
          ],
        },
        {
          category: 'Bug Fixes',
          items: [
            'Fixed theme toggle not applying dark class correctly',
            'Fixed horizontal overflow on mobile devices',
            'Resolved hydration errors in theme provider',
            'Fixed missing closing tags in page.tsx',
            'Corrected blog post routing and linking',
          ],
        },
      ],
    },
    {
      version: '3.0.0',
      date: '2025-01-16',
      type: 'major',
      title: 'Multi-Platform Support & Major UI Overhaul',
      changes: [
        {
          category: 'New Features',
          items: [
            'Implemented dark/light theme toggle',
            'Added toast notifications system',
            'Implemented real-time export progress with SSE',
            'Added circular progress indicator',
            'Implemented export cancellation',
          ],
        },
        {
          category: 'UI/UX Improvements',
          items: [
            'Complete UI redesign with modern glassmorphism effects',
            'Added smooth page transitions',
            'Implemented skeleton loaders',
            'Added animated export progress cards',
            'Enhanced color palette with gradients',
          ],
        },
        {
          category: 'New Pages',
          items: [
            'Added Blog page with articles and tutorials',
            'Created Terms of Service page',
            'Created Privacy Policy page',
            'Added Contact page with form',
            'Added Changelog page (this page!)',
          ],
        },
        {
          category: 'Performance',
          items: [
            'Implemented streaming exports (40-70% faster)',
            'Optimized memory usage with streams',
            'Added automatic retry logic',
          ],
        },
      ],
    },
    {
      version: '2.0.0',
      date: '2025-01-15',
      type: 'major',
      title: 'Speed Optimization & Multi-Page Website',
      changes: [
        {
          category: 'Performance',
          items: [
            'Optimized yt-dlp with concurrent fragments (4x parallelization)',
            'Increased buffer size to 16K',
            'Added performance monitoring and timing',
            '40-70% faster exports across all video lengths',
          ],
        },
        {
          category: 'UI Enhancements',
          items: [
            'Created modern landing page with hero section',
            'Added professional navigation bar',
            'Implemented comprehensive footer',
            'Added custom animations (fade-in, slide-up, blob)',
            'Implemented gradient backgrounds and effects',
          ],
        },
        {
          category: 'New Pages',
          items: [
            'Created About page with mission and tech stack',
            'Added FAQ page with 15 common questions',
          ],
        },
      ],
    },
    {
      version: '1.5.0',
      date: '2025-01-10',
      type: 'minor',
      title: 'Quality Selection & Error Handling',
      changes: [
        {
          category: 'Features',
          items: [
            'Added quality selection for MP3 (64-320 kbps)',
            'Added quality selection for MP4 (360p-1080p)',
            'Implemented automatic quality detection',
            'Added file size preview for each quality',
          ],
        },
        {
          category: 'Bug Fixes',
          items: [
            'Fixed React hydration error',
            'Improved error messages',
            'Fixed export failures with certain videos',
          ],
        },
      ],
    },
    {
      version: '1.0.0',
      date: '2024-12-20',
      type: 'major',
      title: 'Initial Release',
      changes: [
        {
          category: 'Core Features',
          items: [
            'Basic quality selection',
            'yt-dlp integration',
            'FFmpeg audio conversion',
          ],
        },
        {
          category: 'UI',
          items: [
            'Simple single-page interface',
            'URL input and format selection',
            'Export button with basic status',
          ],
        },
      ],
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major':
        return 'bg-gradient-to-r from-purple-600 to-pink-600';
      case 'minor':
        return 'bg-gradient-to-r from-blue-600 to-cyan-600';
      case 'patch':
        return 'bg-gradient-to-r from-green-600 to-emerald-600';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'New Features':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        );
      case 'UI/UX Improvements':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        );
      case 'Performance':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'Bug Fixes':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'New Pages':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        {/* Dotted Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(99, 102, 241) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          {/* Icon with Glow */}
          <div className="inline-block mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-60 animate-pulse-glow"></div>
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 rounded-3xl shadow-2xl">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Changelog
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-semibold mb-4">
            Track all updates, improvements, and new features
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {releases.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-bold">Releases</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-blue-500 to-purple-500"></div>
            <div className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {releases.reduce((acc, r) => acc + r.changes.reduce((a, c) => a + c.items.length, 0), 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-bold">Changes</div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line with Gradient */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600 rounded-full hidden md:block shadow-lg shadow-purple-500/50"></div>

          {/* Releases */}
          <div className="space-y-16">
            {releases.map((release, index) => (
              <div key={release.version} className="relative group animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Timeline Dot */}
                <div className="absolute left-6 top-8 w-5 h-5 bg-white rounded-full border-4 border-purple-600 shadow-lg shadow-purple-500/50 hidden md:block z-10"></div>

                {/* Version Badge */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  <div className={`relative ${getTypeColor(release.type)} text-white px-8 py-4 rounded-2xl font-black text-xl shadow-2xl flex items-center space-x-4 overflow-hidden group-hover:scale-105 transition-transform duration-500`}>
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    <span className="relative z-10">v{release.version}</span>
                    <span className="relative z-10 text-sm opacity-90 font-bold px-3 py-1 bg-white/20 rounded-lg">{release.type.toUpperCase()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-bold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{release.date}</span>
                  </div>
                </div>

                {/* Release Card */}
                <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-gray-200 dark:border-gray-700 md:ml-20 overflow-hidden group-hover:shadow-purple-500/20 transition-all duration-500">
                  {/* Gradient Border on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>

                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {release.title}
                  </h2>

                  {/* Changes */}
                  <div className="space-y-8">
                    {release.changes.map((changeGroup, idx) => (
                      <div key={idx} className="relative">
                        {/* Category Header */}
                        <div className="flex items-center space-x-3 mb-4 group/category">
                          <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-600 dark:text-blue-400 group-hover/category:scale-110 transition-transform duration-300">
                            {getCategoryIcon(changeGroup.category)}
                          </div>
                          <h3 className="text-2xl font-black text-gray-900 dark:text-white">{changeGroup.category}</h3>
                        </div>

                        {/* Items */}
                        <ul className="space-y-3 ml-2">
                          {changeGroup.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start space-x-3 text-gray-700 dark:text-gray-300 group/item">
                              <div className="flex-shrink-0 mt-1">
                                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              </div>
                              <span className="text-base leading-relaxed font-medium">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-20 relative group animate-fade-in">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>

          {/* Card */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 shadow-2xl text-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '30px 30px'
              }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Stay Updated
              </h2>

              {/* Description */}
              <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-semibold">
                Follow our blog for detailed release notes, tutorials, and tips
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/tools"
                  className="group/btn inline-flex items-center justify-center px-8 py-4 text-lg font-black text-purple-600 bg-white rounded-2xl hover:bg-gray-100 transition-all duration-500 hover:scale-105 shadow-2xl w-full sm:w-auto"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Visit Blog
                  <svg className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>

                <a
                  href="/"
                  className="group/btn inline-flex items-center justify-center px-8 py-4 text-lg font-black text-white bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl hover:bg-white/30 transition-all duration-500 hover:scale-105 shadow-2xl w-full sm:w-auto"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
