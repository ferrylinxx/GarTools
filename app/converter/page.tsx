'use client';

import { useState, useRef } from 'react';
import { useToast } from '../components/Toast';
import UsageLimitBanner from '../components/UsageLimitBanner';
import ToolUsageGuide from '../components/ToolUsageGuide';
import { useUsageLimits } from '../hooks/useUsageLimits';
import { Analytics } from '../lib/analytics';

type ConversionFormat = 'mp4' | 'avi' | 'mkv' | 'webm' | 'mov' | 'mp3' | 'aac' | 'flac' | 'wav' | 'ogg';

interface ConversionProgress {
  percent: number;
  status: string;
}

export default function ConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<ConversionFormat>('mp4');
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState<ConversionProgress>({ percent: 0, status: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { limitReached, incrementUsage } = useUsageLimits('conversion');

  const videoFormats: ConversionFormat[] = ['mp4', 'avi', 'mkv', 'webm', 'mov'];
  const audioFormats: ConversionFormat[] = ['mp3', 'aac', 'flac', 'wav', 'ogg'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        'video/mp4', 'video/avi', 'video/x-msvideo', 'video/x-matroska', 'video/webm', 'video/quicktime',
        'audio/mpeg', 'audio/mp3', 'audio/aac', 'audio/flac', 'audio/wav', 'audio/ogg', 'audio/x-wav'
      ];
      
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(mp4|avi|mkv|webm|mov|mp3|aac|flac|wav|ogg)$/i)) {
        showToast('error', 'Please select a valid video or audio file');
        return;
      }

      setFile(selectedFile);
      showToast('success', `File selected: ${selectedFile.name}`);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      showToast('error', 'Please select a file first');
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

    setConverting(true);
    setProgress({ percent: 0, status: 'Uploading file...' });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('outputFormat', outputFormat);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Conversion failed');
      }

      // Get the converted file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.split('.')[0]}.${outputFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Track analytics
      const fileExtension = file.name.split('.').pop() || 'unknown';
      Analytics.trackConversion({
        formatFrom: fileExtension,
        formatTo: outputFormat,
        fileSize: file.size / (1024 * 1024), // Convert to MB
        success: true,
      });

      showToast('success', 'File converted successfully!');
      setProgress({ percent: 100, status: 'Completed!' });
    } catch (error) {
      console.error('Conversion error:', error);

      // Track analytics error
      const fileExtension = file.name.split('.').pop() || 'unknown';
      Analytics.trackConversion({
        formatFrom: fileExtension,
        formatTo: outputFormat,
        fileSize: file.size / (1024 * 1024),
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to convert file',
      });

      showToast('error', error instanceof Error ? error.message : 'Failed to convert file');
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 pt-24 relative overflow-hidden">
      {/* Background Decorations - ULTRA ENHANCED */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Mesh Gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/50 via-blue-500/50 to-pink-500/50 animate-gradient-shift"></div>
        </div>

        {/* Gradient Orbs - MORE & BIGGER */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[450px] h-[450px] bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-purple-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-40 right-10 w-[300px] h-[300px] bg-blue-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div style={{
            backgroundImage: `
              linear-gradient(to right, rgb(147, 51, 234) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(147, 51, 234) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/30 rounded-full animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header - ULTRA ENHANCED */}
        <div className="text-center mb-12 animate-fade-in">
          {/* Icon with MEGA Glow */}
          <div className="inline-block mb-8 relative group">
            {/* Multiple Glow Layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-3xl blur-3xl opacity-60 animate-pulse-glow"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-3xl blur-2xl opacity-40 animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>

            {/* Icon Container with 3D Effect */}
            <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 p-8 rounded-3xl shadow-2xl group-hover:scale-110 transition-all duration-500 card-3d">
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

              {/* Icon */}
              <svg className="w-24 h-24 text-white relative z-10 group-hover:rotate-180 transition-transform duration-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>

              {/* Corner Decorations */}
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/50 rounded-tr-lg"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/50 rounded-bl-lg"></div>
            </div>
          </div>

          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-full border-2 border-purple-500/30 mb-6 animate-glow-pulse">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
            <span className="text-sm font-black text-purple-600">PROFESSIONAL CONVERTER</span>
          </div>

          {/* Title with Enhanced Gradient */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-6 leading-none">
            <span className="inline-block bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto] drop-shadow-2xl">
              Format
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto] drop-shadow-2xl" style={{ animationDelay: '0.5s' }}>
              Converter
            </span>
          </h1>

          {/* Subtitle with Shimmer */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-bold mb-6 leading-relaxed">
            Convert your videos and audio files to <span className="text-shimmer bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent font-black">any format</span> with <span className="text-shimmer bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent font-black">zero quality loss</span> ⚡
          </p>

          {/* Stats - ENHANCED */}
          <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
            <div className="group text-center animate-zoom-in stagger-1">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent px-6 py-2">10+</div>
              </div>
              <div className="text-sm text-gray-600 font-bold mt-2">Formats</div>
            </div>
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-purple-300 to-transparent"></div>
            <div className="group text-center animate-zoom-in stagger-2">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent px-6 py-2">⚡</div>
              </div>
              <div className="text-sm text-gray-600 font-bold mt-2">Fast Conversion</div>
            </div>
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-pink-300 to-transparent"></div>
            <div className="group text-center animate-zoom-in stagger-3">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent px-6 py-2">100%</div>
              </div>
              <div className="text-sm text-gray-600 font-bold mt-2">Free</div>
            </div>
          </div>
        </div>

        {/* Usage Limit Banner */}
        <UsageLimitBanner actionType="conversion" actionLabel="conversion" />

        {/* Main Card */}
        <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-gray-200 p-8 mb-8 overflow-hidden group hover:shadow-purple-500/20 transition-all duration-500">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10 space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Select File
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold rounded-2xl hover:from-purple-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {file ? file.name : 'Choose File'}
                </button>
              </div>
            </div>

            {/* Format Selection */}
            {file && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Convert to Video Format
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {videoFormats.map((format) => (
                      <button
                        key={format}
                        onClick={() => setOutputFormat(format)}
                        className={`px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                          outputFormat === format
                            ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Convert to Audio Format
                  </label>
                  <div className="grid grid-cols-5 gap-3">
                    {audioFormats.map((format) => (
                      <button
                        key={format}
                        onClick={() => setOutputFormat(format)}
                        className={`px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                          outputFormat === format
                            ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Convert Button */}
                <button
                  onClick={handleConvert}
                  disabled={converting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white font-black text-lg rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {converting ? `Converting... ${progress.percent}%` : `Convert to ${outputFormat.toUpperCase()}`}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>

                {/* Progress */}
                {converting && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-600 transition-all duration-300 rounded-full"
                        style={{ width: `${progress.percent}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 text-center font-semibold">{progress.status}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative bg-white/80 backdrop-blur-2xl rounded-2xl p-8 border-2 border-gray-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Lightning Fast ⚡</h3>
                <p className="text-sm text-gray-600 font-semibold">Quick conversions</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-2xl rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-pink-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">High Quality 🎯</h3>
                <p className="text-sm text-gray-600 font-semibold">No quality loss</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-2xl rounded-2xl p-8 border-2 border-gray-200 hover:border-pink-400 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">100% Secure 🔒</h3>
                <p className="text-sm text-gray-600 font-semibold">Files auto-deleted</p>
              </div>
            </div>
          </div>
        </div>

        <ToolUsageGuide toolName="Format Converter" />
      </div>
    </div>
  );
}
