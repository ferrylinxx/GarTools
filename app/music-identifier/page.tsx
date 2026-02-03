'use client';

import { useState, useRef } from 'react';
import { useToast } from '../components/Toast';
import UsageLimitBanner from '../components/UsageLimitBanner';
import ToolUsageGuide from '../components/ToolUsageGuide';
import { useUsageLimits } from '../hooks/useUsageLimits';
import { Analytics } from '../lib/analytics';

interface SongInfo {
  title: string;
  artist: string;
  album?: string;
  releaseDate?: string;
  duration?: number;
  artwork?: string;
}

export default function MusicIdentifierPage() {
  const [file, setFile] = useState<File | null>(null);
  const [identifying, setIdentifying] = useState(false);
  const [songInfo, setSongInfo] = useState<SongInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { showToast } = useToast();
  const { limitReached, incrementUsage } = useUsageLimits('identification');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac'];
      
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
        showToast('error', 'Please select a valid audio file (MP3, WAV, OGG, M4A, AAC)');
        return;
      }

      setFile(selectedFile);
      setSongInfo(null);
      showToast('success', `File selected: ${selectedFile.name}`);
    }
  };

  const handleIdentify = async () => {
    if (!file) {
      showToast('error', 'Please select an audio file first');
      return;
    }

    // Check usage limit
    if (limitReached) {
      showToast('error', 'Daily identification limit reached! Upgrade your plan to continue.');
      return;
    }

    // Increment usage
    const result = await incrementUsage();
    if (!result.success) {
      showToast('error', result.error || 'Failed to track usage');
      return;
    }

    setIdentifying(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/identify-music', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to identify song');
      }

      const data = await response.json();
      setSongInfo(data);

      // Track analytics
      Analytics.trackIdentification({
        fileSize: file.size / (1024 * 1024), // Convert to MB
        success: true,
        songTitle: data.title,
        artist: data.artist,
      });

      showToast('success', `Song identified: ${data.title} by ${data.artist} 🎵`);
    } catch (error) {
      console.error('Identification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to identify song';

      // Track analytics error
      Analytics.trackIdentification({
        fileSize: file.size / (1024 * 1024),
        success: false,
        errorMessage: errorMessage,
      });

      showToast('error', errorMessage);

      // Show helpful message in console
      console.log('💡 Tip: The music identifier works best with:');
      console.log('   - Popular songs that are in the AudD database');
      console.log('   - Clear audio without background noise');
      console.log('   - Audio files with good quality');
      console.log('   - You can get a free AudD API key at https://audd.io/');
    } finally {
      setIdentifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 pt-24 relative overflow-hidden">
      {/* Background Decorations - ULTRA ENHANCED */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Mesh Gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/50 via-purple-500/50 to-pink-500/50 animate-gradient-shift"></div>
        </div>

        {/* Gradient Orbs - MORE & BIGGER */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[450px] h-[450px] bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-indigo-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-40 right-10 w-[300px] h-[300px] bg-purple-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div style={{
            backgroundImage: `
              linear-gradient(to right, rgb(99, 102, 241) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(99, 102, 241) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating Music Notes */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-20 animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          >
            {['🎵', '🎶', '🎼', '🎹'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header - ULTRA ENHANCED */}
        <div className="text-center mb-12 animate-fade-in">
          {/* Icon with MEGA Glow */}
          <div className="inline-block mb-8 relative group">
            {/* Multiple Glow Layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-60 animate-pulse-glow"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-40 animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>

            {/* Icon Container with 3D Effect */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 rounded-3xl shadow-2xl group-hover:scale-110 transition-all duration-500 card-3d">
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

              {/* Icon with Animation */}
              <svg className="w-24 h-24 text-white relative z-10 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>

              {/* Corner Decorations */}
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/50 rounded-tr-lg"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/50 rounded-bl-lg"></div>
            </div>
          </div>

          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-full border-2 border-indigo-500/30 mb-6 animate-glow-pulse">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
            <span className="text-sm font-black text-indigo-600">AI-POWERED RECOGNITION</span>
          </div>

          {/* Title with Enhanced Gradient */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-6 leading-none">
            <span className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto] drop-shadow-2xl">
              Music
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-pink-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto] drop-shadow-2xl" style={{ animationDelay: '0.5s' }}>
              Identifier
            </span>
          </h1>

          {/* Subtitle with Shimmer */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-bold mb-6 leading-relaxed">
            Identify <span className="text-shimmer bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-black">any song</span> from audio file with <span className="text-shimmer bg-gradient-to-r from-pink-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-black">instant recognition</span> 🎵
          </p>

          {/* Stats - ENHANCED */}
          <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
            <div className="group text-center animate-zoom-in stagger-1">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent px-6 py-2">Millions</div>
              </div>
              <div className="text-sm text-gray-600 font-bold mt-2">Songs Database</div>
            </div>
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-purple-300 to-transparent"></div>
            <div className="group text-center animate-zoom-in stagger-2">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent px-6 py-2">⚡</div>
              </div>
              <div className="text-sm text-gray-600 font-bold mt-2">Instant Recognition</div>
            </div>
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-pink-300 to-transparent"></div>
            <div className="group text-center animate-zoom-in stagger-3">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent px-6 py-2">100%</div>
              </div>
              <div className="text-sm text-gray-600 font-bold mt-2">Free</div>
            </div>
          </div>
        </div>

        {/* Usage Limit Banner */}
        <UsageLimitBanner actionType="identification" actionLabel="identification" />

        {/* Main Card */}
        <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-gray-200 p-8 mb-8 overflow-hidden group hover:shadow-indigo-500/20 transition-all duration-500">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10 space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Upload Audio File
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {file ? file.name : 'Choose Audio File'}
                </button>
              </div>
            </div>

            {/* Info Note */}
            {file && !songInfo && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800 font-semibold">
                    <p className="font-bold mb-1">💡 Best Results With:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Popular songs in the database</li>
                      <li>Clear audio without background noise</li>
                      <li>Good quality audio files</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Identify Button */}
            {file && !songInfo && (
              <button
                onClick={handleIdentify}
                disabled={identifying}
                className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-black text-lg rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {identifying ? 'Identifying Song...' : 'Identify Song 🎵'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            )}

            {/* Song Info */}
            {songInfo && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200">
                  <div className="flex items-start gap-6">
                    {songInfo.artwork && (
                      <img
                        src={songInfo.artwork}
                        alt={songInfo.title}
                        className="w-32 h-32 rounded-xl shadow-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-gray-900 mb-2">{songInfo.title}</h3>
                      <p className="text-lg font-bold text-gray-700 mb-1">{songInfo.artist}</p>
                      {songInfo.album && (
                        <p className="text-sm text-gray-600 font-semibold mb-1">Album: {songInfo.album}</p>
                      )}
                      {songInfo.releaseDate && (
                        <p className="text-sm text-gray-600 font-semibold">Released: {songInfo.releaseDate}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Try Another */}
                <button
                  onClick={() => {
                    setFile(null);
                    setSongInfo(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-300"
                >
                  Identify Another Song
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative bg-white/80 backdrop-blur-2xl rounded-2xl p-8 border-2 border-gray-200 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Instant Results ⚡</h3>
                <p className="text-sm text-gray-600 font-semibold">Identify in seconds</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-2xl rounded-2xl p-8 border-2 border-gray-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Accurate 🎯</h3>
                <p className="text-sm text-gray-600 font-semibold">High precision</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-2xl rounded-2xl p-8 border-2 border-gray-200 hover:border-pink-400 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-pink-500 to-indigo-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Auto Export ⚡</h3>
                <p className="text-sm text-gray-600 font-semibold">One-click export</p>
              </div>
            </div>
          </div>
        </div>

        <ToolUsageGuide toolName="Music Identifier" />
      </div>
    </div>
  );
}
