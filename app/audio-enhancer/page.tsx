'use client';

import { useState, useRef } from 'react';
import { useToast } from '../components/Toast';
import UsageLimitBanner from '../components/UsageLimitBanner';
import ToolUsageGuide from '../components/ToolUsageGuide';
import { useUsageLimits } from '../hooks/useUsageLimits';
import { Analytics } from '../lib/analytics';

type Preset = 'podcast' | 'music' | 'voice' | 'custom';

interface EnhanceOptions {
  normalize: boolean;
  noiseReduction: boolean;
  bass: number;
  mid: number;
  treble: number;
  compression: boolean;
  reverb: boolean;
  fadeIn: number;
  fadeOut: number;
  preset: Preset;
}

export default function AudioEnhancerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { limitReached, incrementUsage } = useUsageLimits('enhancement');

  const [options, setOptions] = useState<EnhanceOptions>({
    normalize: true,
    noiseReduction: true,
    bass: 0,
    mid: 0,
    treble: 0,
    compression: true,
    reverb: false,
    fadeIn: 0,
    fadeOut: 0,
    preset: 'custom',
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
      if (droppedFile.type.startsWith('audio/')) {
        setFile(droppedFile);
      } else {
        showToast('error', 'Please upload an audio file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const applyPreset = (preset: Preset) => {
    setOptions(prev => ({ ...prev, preset }));
    
    switch (preset) {
      case 'podcast':
        setOptions({
          ...options,
          preset,
          normalize: true,
          noiseReduction: true,
          compression: true,
          bass: -2,
          mid: 3,
          treble: 2,
          reverb: false,
        });
        break;
      case 'music':
        setOptions({
          ...options,
          preset,
          normalize: true,
          noiseReduction: false,
          compression: false,
          bass: 3,
          mid: 0,
          treble: 2,
          reverb: false,
        });
        break;
      case 'voice':
        setOptions({
          ...options,
          preset,
          normalize: true,
          noiseReduction: true,
          compression: true,
          bass: -3,
          mid: 5,
          treble: 1,
          reverb: false,
        });
        break;
    }
  };

  const handleEnhance = async () => {
    if (!file) {
      showToast('error', 'Please select an audio file');
      return;
    }

    // Check usage limit
    if (limitReached) {
      showToast('error', 'Daily enhancement limit reached! Upgrade your plan to continue.');
      return;
    }

    // Increment usage
    const result = await incrementUsage();
    if (!result.success) {
      showToast('error', result.error || 'Failed to track usage');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('options', JSON.stringify(options));

      const response = await fetch('/api/enhance-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Enhancement failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `enhanced_${file.name}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Track analytics
      Analytics.trackEnhancement({
        type: 'audio',
        preset: options.preset,
        fileSize: file.size / (1024 * 1024), // Convert to MB
        success: true,
      });

      showToast('success', 'Audio enhanced successfully!');
    } catch (error: any) {
      console.error('Enhancement error:', error);

      // Track analytics error
      Analytics.trackEnhancement({
        type: 'audio',
        preset: options.preset,
        fileSize: file.size / (1024 * 1024),
        success: false,
        errorMessage: error.message || 'Enhancement failed',
      });

      showToast('error', error.message || 'Enhancement failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8 pt-24 relative overflow-hidden">
      {/* Background Decorations - ULTRA ENHANCED */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Mesh Gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/50 via-green-500/50 to-teal-500/50 animate-gradient-shift"></div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[450px] h-[450px] bg-green-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-emerald-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-40 right-10 w-[300px] h-[300px] bg-green-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div style={{
            backgroundImage: `
              linear-gradient(to right, rgb(16, 185, 129) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(16, 185, 129) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-500/30 rounded-full animate-particle-float"
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
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-3xl blur-3xl opacity-60 animate-pulse-glow"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-3xl blur-2xl opacity-40 animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>

            <div className="relative bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-8 rounded-3xl shadow-2xl group-hover:scale-110 transition-all duration-500 card-3d">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

              <svg className="w-24 h-24 text-white relative z-10 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>

              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/50 rounded-tr-lg"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/50 rounded-bl-lg"></div>
            </div>
          </div>

          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-xl rounded-full border-2 border-emerald-500/30 mb-6 animate-glow-pulse">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-black text-emerald-600">PROFESSIONAL AUDIO</span>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-6 leading-none">
            <span className="inline-block bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto] drop-shadow-2xl">
              Audio
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto] drop-shadow-2xl" style={{ animationDelay: '0.5s' }}>
              Enhancer
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-bold mb-6 leading-relaxed">
            Improve your audio quality with <span className="text-shimmer bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent font-black">professional tools</span> and AI-powered enhancement 🎧
          </p>
        </div>

        {/* Usage Limit Banner */}
        <UsageLimitBanner actionType="enhancement" actionLabel="enhancement" />

        {/* Upload Card */}
        <div className="relative group animate-slide-up mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-gray-200">
            <div
              className={`relative border-4 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                dragActive
                  ? 'border-emerald-500 bg-emerald-50'
                  : file
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50/50'
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
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="text-center">
                {file ? (
                  <>
                    <div className="inline-block p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
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
                    <div className="inline-block p-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl mb-4">
                      <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-xl font-black text-gray-900 mb-2">
                      Drop your audio file here
                    </p>
                    <p className="text-sm text-gray-600 font-semibold mb-4">
                      or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports: MP3, WAV, FLAC, AAC, OGG
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div className="relative group animate-slide-up mb-8" style={{ animationDelay: '0.1s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Enhancement Presets</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(['podcast', 'music', 'voice', 'custom'] as Preset[]).map((preset) => (
                <button
                  key={preset}
                  onClick={() => applyPreset(preset)}
                  className={`group/preset relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                    options.preset === preset
                      ? 'bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/50'
                      : 'bg-white border-gray-300 hover:border-emerald-400 hover:shadow-md'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-4xl mb-3 ${options.preset === preset ? '' : 'grayscale group-hover/preset:grayscale-0 transition-all duration-300'}`}>
                      {preset === 'podcast' && '🎙️'}
                      {preset === 'music' && '🎵'}
                      {preset === 'voice' && '🗣️'}
                      {preset === 'custom' && '⚙️'}
                    </div>
                    <p className={`font-black text-lg capitalize ${options.preset === preset ? 'text-white' : 'text-gray-900'}`}>
                      {preset}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Controls */}
        {options.preset === 'custom' && (
          <div className="relative group animate-slide-up mb-8" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

            <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Advanced Controls</h3>

              <div className="space-y-6">
                {/* Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: 'normalize', label: 'Normalize', icon: '📊' },
                    { key: 'noiseReduction', label: 'Noise Reduction', icon: '🔇' },
                    { key: 'compression', label: 'Compression', icon: '🗜️' },
                    { key: 'reverb', label: 'Reverb', icon: '🌊' },
                  ].map(({ key, label, icon }) => (
                    <button
                      key={key}
                      onClick={() => setOptions(prev => ({ ...prev, [key]: !prev[key as keyof EnhanceOptions] }))}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        options[key as keyof EnhanceOptions]
                          ? 'bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-600 text-white shadow-lg'
                          : 'bg-white border-gray-300 hover:border-emerald-400'
                      }`}
                    >
                      <div className="text-2xl mb-2">{icon}</div>
                      <div className={`font-bold text-sm ${options[key as keyof EnhanceOptions] ? 'text-white' : 'text-gray-900'}`}>
                        {label}
                      </div>
                    </button>
                  ))}
                </div>

                {/* EQ Sliders */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { key: 'bass', label: 'Bass', icon: '🔊', color: 'emerald' },
                    { key: 'mid', label: 'Mid', icon: '🎚️', color: 'green' },
                    { key: 'treble', label: 'Treble', icon: '🔉', color: 'teal' },
                  ].map(({ key, label, icon, color }) => (
                    <div key={key}>
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <span className="text-xl">{icon}</span>
                        {label}: <span className={`text-${color}-600`}>{options[key as keyof EnhanceOptions]} dB</span>
                      </label>
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        value={options[key as keyof EnhanceOptions] as number}
                        onChange={(e) => setOptions(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                  ))}
                </div>

                {/* Fade Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'fadeIn', label: 'Fade In', icon: '📈' },
                    { key: 'fadeOut', label: 'Fade Out', icon: '📉' },
                  ].map(({ key, label, icon }) => (
                    <div key={key}>
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                        <span className="text-xl">{icon}</span>
                        {label}: <span className="text-emerald-600">{options[key as keyof EnhanceOptions]}s</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={options[key as keyof EnhanceOptions] as number}
                        onChange={(e) => setOptions(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhance Button */}
        <div className="relative group animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border-2 border-gray-200">
            <button
              onClick={handleEnhance}
              disabled={!file || loading}
              className="group/btn relative w-full px-8 py-6 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white font-black text-xl rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-500 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enhancing Audio...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    Enhance Audio
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        <ToolUsageGuide toolName="Audio Enhancer" />
      </div>
    </div>
  );
}
