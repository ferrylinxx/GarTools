'use client';

import { useState, useRef } from 'react';
import { useToast } from '../components/Toast';
import UsageLimitBanner from '../components/UsageLimitBanner';
import ToolUsageGuide from '../components/ToolUsageGuide';
import { useUsageLimits } from '../hooks/useUsageLimits';
import { Analytics } from '../lib/analytics';

type Preset = 'instagram' | 'tiktok' | 'twitter' | 'custom';
type Quality = 'low' | 'medium' | 'high';

interface CompressionOptions {
  preset: Preset;
  quality: Quality;
  bitrate?: string;
  resolution?: string;
  fps?: number;
}

export default function CompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
    ratio: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { limitReached, incrementUsage } = useUsageLimits('compression');

  const [options, setOptions] = useState<CompressionOptions>({
    preset: 'custom',
    quality: 'medium',
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

  const handleCompress = async () => {
    if (!file) {
      showToast('error', 'Please select a video file');
      return;
    }

    // Check usage limit
    if (limitReached) {
      showToast('error', 'Daily compression limit reached! Upgrade your plan to continue.');
      return;
    }

    // Increment usage
    const result = await incrementUsage();
    if (!result.success) {
      showToast('error', result.error || 'Failed to track usage');
      return;
    }

    setLoading(true);
    setCompressionStats(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(options));

      const response = await fetch('/api/compress-video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Compression failed');
      }

      // Get compression stats from headers
      const originalSize = parseInt(response.headers.get('X-Original-Size') || '0');
      const compressedSize = parseInt(response.headers.get('X-Compressed-Size') || '0');
      const ratio = response.headers.get('X-Compression-Ratio') || '0';

      setCompressionStats({
        originalSize,
        compressedSize,
        ratio,
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Track analytics
      Analytics.trackCompression({
        preset: options.preset,
        quality: options.quality,
        originalSize: originalSize / (1024 * 1024), // Convert to MB
        compressedSize: compressedSize / (1024 * 1024),
        success: true,
      });

      showToast('success', `Video compressed by ${ratio}%!`);
    } catch (error: any) {
      console.error('Compression error:', error);

      // Track analytics error
      Analytics.trackCompression({
        preset: options.preset,
        quality: options.quality,
        originalSize: file.size / (1024 * 1024),
        success: false,
        errorMessage: error.message || 'Compression failed',
      });

      showToast('error', error.message || 'Compression failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8 pt-24 relative overflow-hidden">
      {/* Background Decorations - ULTRA ENHANCED */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Mesh Gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/50 via-sky-500/50 to-cyan-500/50 animate-gradient-shift"></div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[450px] h-[450px] bg-sky-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-blue-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-40 right-10 w-[300px] h-[300px] bg-sky-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div style={{
            backgroundImage: `
              linear-gradient(to right, rgb(14, 165, 233) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(14, 165, 233) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500/30 rounded-full animate-particle-float"
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 rounded-3xl blur-3xl opacity-60 animate-pulse-glow"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 rounded-3xl blur-2xl opacity-40 animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>

            <div className="relative bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-600 p-8 rounded-3xl shadow-2xl group-hover:scale-110 transition-all duration-500 card-3d">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

              <svg className="w-24 h-24 text-white relative z-10 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>

              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/50 rounded-tr-lg"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/50 rounded-bl-lg"></div>
            </div>
          </div>

          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500/20 to-sky-500/20 backdrop-blur-xl rounded-full border-2 border-blue-500/30 mb-6 animate-glow-pulse">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-sm font-black text-blue-600">SMART COMPRESSION</span>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-6 leading-none">
            <span className="inline-block bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto] drop-shadow-2xl">
              Video
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-cyan-600 via-blue-600 to-sky-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto] drop-shadow-2xl" style={{ animationDelay: '0.5s' }}>
              Compressor
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-bold mb-6 leading-relaxed">
            Reduce file size while maintaining <span className="text-shimmer bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 bg-clip-text text-transparent font-black">professional quality</span> 📦
          </p>
        </div>

        {/* Usage Limit Banner */}
        <UsageLimitBanner actionType="compression" actionLabel="compression" />

        {/* Upload Card */}
        <div className="relative group animate-slide-up mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-gray-200">
            <div
              className={`relative border-4 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : file
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
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
                    <div className="inline-block p-6 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl mb-4">
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
                        setCompressionStats(null);
                      }}
                      className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors duration-300"
                    >
                      Remove File
                    </button>
                  </>
                ) : (
                  <>
                    <div className="inline-block p-6 bg-gradient-to-br from-blue-500 to-sky-600 rounded-2xl mb-4">
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

            {/* Compression Stats */}
            {compressionStats && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Original</p>
                  <p className="text-lg font-black text-blue-600">
                    {(compressionStats.originalSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Compressed</p>
                  <p className="text-lg font-black text-sky-600">
                    {(compressionStats.compressedSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl">
                  <p className="text-xs text-gray-600 font-semibold mb-1">Saved</p>
                  <p className="text-lg font-black text-cyan-600">
                    {compressionStats.ratio}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Platform Presets */}
        <div className="relative group animate-slide-up mb-8" style={{ animationDelay: '0.1s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Platform Presets</h3>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { preset: 'instagram' as Preset, label: 'Instagram', icon: '📸', desc: '1080x1350' },
                { preset: 'tiktok' as Preset, label: 'TikTok', icon: '🎵', desc: '1080x1920' },
                { preset: 'twitter' as Preset, label: 'Twitter', icon: '🐦', desc: '720p, 2Mbps' },
                { preset: 'custom' as Preset, label: 'Custom', icon: '⚙️', desc: 'Manual' },
              ].map(({ preset, label, icon, desc }) => (
                <button
                  key={preset}
                  onClick={() => setOptions(prev => ({ ...prev, preset }))}
                  className={`group/preset relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                    options.preset === preset
                      ? 'bg-gradient-to-br from-blue-500 to-sky-600 border-blue-600 text-white shadow-lg shadow-blue-500/50'
                      : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-3xl mb-2 ${options.preset === preset ? '' : 'grayscale group-hover/preset:grayscale-0 transition-all duration-300'}`}>
                      {icon}
                    </div>
                    <p className={`font-black text-sm mb-1 ${options.preset === preset ? 'text-white' : 'text-gray-900'}`}>
                      {label}
                    </p>
                    <p className={`text-xs ${options.preset === preset ? 'text-white/80' : 'text-gray-500'}`}>
                      {desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quality Settings */}
        <div className="relative group animate-slide-up mb-8" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Compression Quality</h3>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { quality: 'low' as Quality, label: 'Low', icon: '🚀', desc: 'Fast, smaller file' },
                { quality: 'medium' as Quality, label: 'Medium', icon: '⚖️', desc: 'Balanced' },
                { quality: 'high' as Quality, label: 'High', icon: '💎', desc: 'Best quality' },
              ].map(({ quality, label, icon, desc }) => (
                <button
                  key={quality}
                  onClick={() => setOptions(prev => ({ ...prev, quality }))}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    options.quality === quality
                      ? 'bg-gradient-to-br from-blue-500 to-sky-600 border-blue-600 text-white shadow-lg'
                      : 'bg-white border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{icon}</div>
                    <p className={`font-black text-lg mb-1 ${options.quality === quality ? 'text-white' : 'text-gray-900'}`}>
                      {label}
                    </p>
                    <p className={`text-xs ${options.quality === quality ? 'text-white/80' : 'text-gray-500'}`}>
                      {desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Settings */}
            {options.preset === 'custom' && (
              <div className="space-y-4 pt-6 border-t-2 border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Bitrate (e.g., 2M, 5M)
                    </label>
                    <input
                      type="text"
                      placeholder="2M"
                      value={options.bitrate || ''}
                      onChange={(e) => setOptions(prev => ({ ...prev, bitrate: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Resolution (e.g., 1920x1080)
                    </label>
                    <input
                      type="text"
                      placeholder="1920x1080"
                      value={options.resolution || ''}
                      onChange={(e) => setOptions(prev => ({ ...prev, resolution: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      FPS
                    </label>
                    <input
                      type="number"
                      placeholder="30"
                      min="15"
                      max="60"
                      value={options.fps || ''}
                      onChange={(e) => setOptions(prev => ({ ...prev, fps: parseInt(e.target.value) || undefined }))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Compress Button */}
        <div className="relative group animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border-2 border-gray-200">
            <button
              onClick={handleCompress}
              disabled={!file || loading}
              className="group/btn relative w-full px-8 py-6 bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 text-white font-black text-xl rounded-2xl hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-500 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Compressing Video...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Compress Video
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        <ToolUsageGuide toolName="Video Compressor" />
      </div>
    </div>
  );
}
