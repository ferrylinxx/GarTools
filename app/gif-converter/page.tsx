'use client';

import { useState, useRef } from 'react';
import { useToast } from '../components/Toast';
import UsageLimitBanner from '../components/UsageLimitBanner';
import ToolUsageGuide from '../components/ToolUsageGuide';
import { useUsageLimits } from '../hooks/useUsageLimits';
import { Analytics } from '../lib/analytics';

type Quality = 'low' | 'medium' | 'high';

interface GifOptions {
  startTime: number;
  duration: number;
  fps: number;
  width: number;
  quality: Quality;
  loop: boolean;
  reverse: boolean;
}

export default function GifConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { limitReached, incrementUsage } = useUsageLimits('conversion');

  const [options, setOptions] = useState<GifOptions>({
    startTime: 0,
    duration: 3,
    fps: 15,
    width: 480,
    quality: 'medium',
    loop: true,
    reverse: false,
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
      } else {
        showToast('error', 'Please upload a video file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      showToast('error', 'Please select a video file');
      return;
    }

    // Check usage limit
    if (limitReached) {
      showToast('error', 'Daily conversion limit reached! Upgrade your plan to continue.');
      return;
    }

    // Increment usage
    const result = await incrementUsage();
    if (!result.success) {
      showToast('error', result.error || 'Failed to track usage');
      return;
    }

    if (options.duration > 10) {
      showToast('error', 'Duration cannot exceed 10 seconds');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(options));

      const response = await fetch('/api/video-to-gif', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Conversion failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'animated.gif';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Track analytics
      Analytics.trackGifConversion({
        duration: options.duration,
        fps: options.fps,
        quality: options.quality,
        fileSize: file.size / (1024 * 1024), // Convert to MB
        success: true,
      });

      showToast('success', 'GIF created successfully!');
    } catch (error: any) {
      console.error('Conversion error:', error);

      // Track analytics error
      Analytics.trackGifConversion({
        duration: options.duration,
        fps: options.fps,
        quality: options.quality,
        fileSize: file.size / (1024 * 1024),
        success: false,
        errorMessage: error.message || 'Conversion failed',
      });

      showToast('error', error.message || 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8 pt-24 relative overflow-hidden">
      {/* Background Decorations - ULTRA ENHANCED */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Mesh Gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/50 via-amber-500/50 to-yellow-500/50 animate-gradient-shift"></div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[450px] h-[450px] bg-amber-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-[400px] h-[400px] bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-orange-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-40 right-10 w-[300px] h-[300px] bg-amber-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div style={{
            backgroundImage: `
              linear-gradient(to right, rgb(249, 115, 22) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(249, 115, 22) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-500/30 rounded-full animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header - ULTRA ENHANCED */}
        <div className="text-center mb-12 animate-fade-in">
          {/* Icon with MEGA Glow */}
          <div className="inline-block mb-8 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl blur-3xl opacity-60 animate-pulse-glow"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl blur-2xl opacity-40 animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>

            <div className="relative bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 p-8 rounded-3xl shadow-2xl group-hover:scale-110 transition-all duration-500 card-3d">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

              <svg className="w-24 h-24 text-white relative z-10 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>

              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/50 rounded-tr-lg"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/50 rounded-bl-lg"></div>
            </div>
          </div>

          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-xl rounded-full border-2 border-orange-500/30 mb-6 animate-glow-pulse">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
            <span className="text-sm font-black text-orange-600">ANIMATED MAGIC</span>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-6 leading-none">
            <span className="inline-block bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto] drop-shadow-2xl">
              Video to
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto] drop-shadow-2xl" style={{ animationDelay: '0.5s' }}>
              GIF
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-bold mb-6 leading-relaxed">
            Convert your videos to <span className="text-shimmer bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent font-black">animated GIFs</span> with professional quality 🎬
          </p>
        </div>

        {/* Usage Limit Banner */}
        <UsageLimitBanner actionType="conversion" actionLabel="GIF conversion" />

        {/* Upload Card */}
        <div className="relative group animate-slide-up mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-gray-200">
            <div
              className={`relative border-4 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                dragActive
                  ? 'border-orange-500 bg-orange-50'
                  : file
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-300 bg-gray-50 hover:border-orange-400 hover:bg-orange-50/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="text-center">
                {file ? (
                  <>
                    <div className="inline-block p-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xl font-black text-gray-900 mb-2">{file.name}</p>
                    <p className="text-sm text-gray-600 font-semibold">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors duration-300"
                    >
                      Remove File
                    </button>
                  </>
                ) : (
                  <>
                    <div className="inline-block p-6 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl mb-4">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-xl font-black text-gray-900 mb-2">
                      Drop your video file here
                    </p>
                    <p className="text-sm text-gray-600 font-semibold mb-4">
                      or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports: MP4, AVI, MOV, MKV, WebM
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* GIF Settings */}
        <div className="relative group animate-slide-up mb-8" style={{ animationDelay: '0.1s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-black text-gray-900 mb-6">GIF Settings</h3>

            <div className="space-y-6">
              {/* Time Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <span className="text-xl">⏱️</span>
                    Start Time: <span className="text-orange-600">{options.startTime}s</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={options.startTime}
                    onChange={(e) => setOptions(prev => ({ ...prev, startTime: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <span className="text-xl">⏳</span>
                    Duration: <span className="text-orange-600">{options.duration}s</span>
                    <span className="text-xs text-gray-500">(max 10s)</span>
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={options.duration}
                    onChange={(e) => setOptions(prev => ({ ...prev, duration: Math.min(10, parseFloat(e.target.value) || 1) }))}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Quality Presets */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <span className="text-xl">💎</span>
                  Quality
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {(['low', 'medium', 'high'] as Quality[]).map((quality) => (
                    <button
                      key={quality}
                      onClick={() => setOptions(prev => ({ ...prev, quality }))}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        options.quality === quality
                          ? 'bg-gradient-to-br from-orange-500 to-amber-600 border-orange-600 text-white shadow-lg'
                          : 'bg-white border-gray-300 hover:border-orange-400'
                      }`}
                    >
                      <div className={`font-bold capitalize ${options.quality === quality ? 'text-white' : 'text-gray-900'}`}>
                        {quality}
                      </div>
                      <div className={`text-xs mt-1 ${options.quality === quality ? 'text-white/80' : 'text-gray-500'}`}>
                        {quality === 'low' && '128 colors'}
                        {quality === 'medium' && '256 colors'}
                        {quality === 'high' && '256 colors HD'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <span className="text-xl">🎞️</span>
                    FPS: <span className="text-orange-600">{options.fps}</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={options.fps}
                    onChange={(e) => setOptions(prev => ({ ...prev, fps: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5 fps</span>
                    <span>30 fps</span>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <span className="text-xl">📏</span>
                    Width: <span className="text-orange-600">{options.width}px</span>
                  </label>
                  <input
                    type="range"
                    min="240"
                    max="1080"
                    step="120"
                    value={options.width}
                    onChange={(e) => setOptions(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>240px</span>
                    <span>1080px</span>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setOptions(prev => ({ ...prev, loop: !prev.loop }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    options.loop
                      ? 'bg-gradient-to-br from-orange-500 to-amber-600 border-orange-600 text-white shadow-lg'
                      : 'bg-white border-gray-300 hover:border-orange-400'
                  }`}
                >
                  <div className="text-2xl mb-2">🔁</div>
                  <div className={`font-bold text-sm ${options.loop ? 'text-white' : 'text-gray-900'}`}>
                    Loop
                  </div>
                </button>
                <button
                  onClick={() => setOptions(prev => ({ ...prev, reverse: !prev.reverse }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    options.reverse
                      ? 'bg-gradient-to-br from-orange-500 to-amber-600 border-orange-600 text-white shadow-lg'
                      : 'bg-white border-gray-300 hover:border-orange-400'
                  }`}
                >
                  <div className="text-2xl mb-2">⏪</div>
                  <div className={`font-bold text-sm ${options.reverse ? 'text-white' : 'text-gray-900'}`}>
                    Reverse
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Convert Button */}
        <div className="relative group animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border-2 border-gray-200">
            <button
              onClick={handleConvert}
              disabled={!file || loading}
              className="group/btn relative w-full px-8 py-6 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white font-black text-xl rounded-2xl hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-500 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Converting to GIF...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                    Convert to GIF
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        <ToolUsageGuide toolName="GIF Converter" />
      </div>
    </div>
  );
}
