import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { ToastProvider } from "./components/Toast";
import { AuthProvider } from "./contexts/AuthContext";
import { UsageLimitsProvider } from "./contexts/UsageLimitsContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GarTools - Media Processing, Conversion & Enhancement",
  description: "GarTools helps you process and enhance media with fast conversion, compression, transcription, and more. Secure, easy to use, no registration required.",
  keywords: [
    "media tools",
    "GarTools",
    "Gar Tools",
    "GarTools online",
    "GarTools app",
    "GarTools toolkit",
    "GarTools media tools",
    "GarTools converter",
    "GarTools compressor",
    "GarTools enhancer",
    "media processing",
    "media processing online",
    "online media processing",
    "media processing app",
    "media processing platform",
    "media processing service",
    "digital media tools",
    "creative media tools",
    "creator tools",
    "video converter",
    "audio converter",
    "batch converter",
    "file converter",
    "online file converter",
    "free file converter",
    "fast file converter",
    "bulk converter",
    "batch file converter",
    "multi file converter",
    "media converter",
    "online media converter",
    "video file converter",
    "audio file converter",
    "format converter",
    "format conversion",
    "mp4 converter",
    "mp3 converter",
    "wav converter",
    "aac converter",
    "flac converter",
    "m4a converter",
    "ogg converter",
    "webm converter",
    "mov converter",
    "avi converter",
    "video compressor",
    "audio compressor",
    "compressor online",
    "video compression",
    "audio compression",
    "compress video",
    "compress audio",
    "reduce video size",
    "reduce audio size",
    "shrink video file",
    "shrink audio file",
    "video size reducer",
    "audio size reducer",
    "video optimizer",
    "audio optimizer",
    "bitrate compressor",
    "mp4 compressor",
    "mp3 compressor",
    "webm compressor",
    "mov compressor",
    "audio enhancer",
    "audio cleanup",
    "noise reduction",
    "audio enhancement",
    "enhance audio",
    "audio repair",
    "audio restoration",
    "audio equalizer",
    "audio normalization",
    "volume normalization",
    "remove background noise",
    "voice enhancement",
    "speech enhancement",
    "podcast audio enhancer",
    "transcription",
    "speech to text",
    "audio to text",
    "transcribe audio",
    "transcribe video",
    "audio transcription",
    "video transcription",
    "automatic transcription",
    "AI transcription",
    "speech recognition",
    "subtitle generator",
    "caption generator",
    "subtitle translator",
    "subtitle translation",
    "video translator",
    "subtitle converter",
    "subtitle editor",
    "subtitle maker",
    "srt editor",
    "srt converter",
    "vtt converter",
    "caption translator",
    "metadata editor",
    "ID3 tag editor",
    "tag editor",
    "music identifier",
    "song identifier",
    "audio identification",
    "metadata editor online",
    "audio metadata editor",
    "video metadata editor",
    "mp3 tag editor",
    "music tag editor",
    "album art editor",
    "cover art editor",
    "id3 editor",
    "metadata cleanup",
    "gif converter",
    "video to gif",
    "gif maker",
    "mp4 to gif",
    "gif creator",
    "gif converter online",
    "animated gif",
    "convert video to gif",
    "trim video to gif",
    "online media tools",
    "free media tools",
    "fast media converter",
    "media toolkit",
    "convert audio formats",
    "convert video formats",
    "compress video online",
    "enhance audio online",
    "free converter",
    "free compressor",
    "free media converter",
    "fast online tools",
    "web based media tools",
    "browser media tools",
    "cloud media tools",
    "media processing SaaS",
    "creator workflow tools",
    "content creator tools",
    "media workflow automation",
    "media pipeline",
    "media optimization",
    "media export",
    "media presets",
    "batch processing",
    "bulk processing",
    "convert audio online",
    "convert video online",
    "compress video for web",
    "compress video for social",
    "optimize video for web",
    "optimize audio for web",
    "export for YouTube",
    "export for Instagram",
    "export for TikTok",
    "export for Facebook",
    "export for X",
    "export for podcasts",
    "export for social media",
    "fast processing",
    "high quality conversion",
    "lossless conversion",
    "quality presets",
    "media format support",
    "file format support",
    "codec converter",
    "media compatibility",
    "video format converter",
    "audio format converter",
    "subtitle tool",
    "caption tool",
    "online transcription tool",
    "online subtitle tool",
    "online gif tool",
    "online audio enhancer",
    "online video compressor",
    "online batch converter",
    "secure media tools",
    "privacy focused tools",
    "no signup tools",
    "no registration tools",
  ],
  authors: [{ name: "GarTools Team" }],
  creator: "GarTools",
  publisher: "GarTools",
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    apple: [{ url: '/favicon.ico', type: 'image/x-icon' }],
    shortcut: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GarTools',
  },
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fgarola.es',
    title: 'GarTools - Media Processing, Conversion & Enhancement',
    description: 'Process and enhance your media with fast conversion, compression, transcription, and more.',
    siteName: 'GarTools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GarTools - Media Processing, Conversion & Enhancement',
    description: 'Process and enhance your media with fast conversion, compression, transcription, and more.',
    creator: '@gartools',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  alternates: {
    canonical: 'https://fgarola.es',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "GarTools",
    "description": "Process and enhance your media with fast conversion, compression, transcription, and more.",
    "url": "https://fgarola.es",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Convert audio and video formats",
      "Enhance and compress media",
      "Transcribe audio to text",
      "Translate subtitles",
      "No registration required",
      "Free tools available"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6269718356198501"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-78MPEJ624P"
          strategy="afterInteractive"
        />
        <Script
          id="ga-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                wait_for_update: 500
              });
              gtag('js', new Date());
              gtag('config', 'G-78MPEJ624P');
            `,
          }}
        />

        {/* Statcounter */}
        <Script
          id="statcounter-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var sc_project=13142300;
              var sc_invisible=1;
              var sc_security="2b193ed0";
            `,
          }}
        />
        <Script
          async
          src="https://www.statcounter.com/counter/counter.js"
          strategy="afterInteractive"
        />
        <noscript>
          <div className="statcounter">
            <a
              title="Web Analytics Made Easy - Statcounter"
              href="https://statcounter.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="statcounter"
                src="https://c.statcounter.com/13142300/0/2b193ed0/1/"
                alt="Web Analytics Made Easy - Statcounter"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </a>
          </div>
        </noscript>

        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="GarTools" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GarTools" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#3B82F6" />

        {/* Favicon Links */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <UsageLimitsProvider>
            <ToastProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
                <ScrollToTop />
              </div>
            </ToastProvider>
          </UsageLimitsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
