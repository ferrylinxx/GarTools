'use client';

import { useState, useRef } from 'react';
import { useToast } from '../components/Toast';
import ToolUsageGuide from '../components/ToolUsageGuide';

interface Transcription {
  text: string;
  segments?: Array<{
    start: number;
    end: number;
    text: string;
  }>;
  language?: string;
}

export default function TranscribePage() {
  const [file, setFile] = useState<File | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<Transcription | null>(null);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [translating, setTranslating] = useState(false);
  const [language, setLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [viewMode, setViewMode] = useState<'full' | 'segments'>('segments');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const languages = [
    { code: 'auto', name: 'Auto Detect' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
  ];

  const translationLanguages = [
    { code: 'es', name: 'Spanish' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'tr', name: 'Turkish' },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['audio/', 'video/'];
      const isValid = validTypes.some(type => selectedFile.type.startsWith(type));
      
      if (!isValid && !selectedFile.name.match(/\.(mp3|mp4|wav|m4a|ogg|webm|avi|mov|mkv)$/i)) {
        showToast('error', 'Please select a valid audio or video file');
        return;
      }

      setFile(selectedFile);
      setTranscription(null);
      showToast('success', `File selected: ${selectedFile.name}`);
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
      showToast('error', 'Please select a file first');
      return;
    }

    setTranscribing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', language);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Transcription failed');
      }

      const data = await response.json();
      setTranscription(data);
      setTranslatedText(''); // Reset translation when new transcription is done
      showToast('success', 'Transcription completed!');
    } catch (error) {
      console.error('Transcription error:', error);
      showToast('error', error instanceof Error ? error.message : 'Failed to transcribe file');
    } finally {
      setTranscribing(false);
    }
  };

  const handleTranslate = async () => {
    if (!transcription?.text) {
      showToast('error', 'No transcription to translate');
      return;
    }

    setTranslating(true);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: transcription.text,
          sourceLang: transcription.language || 'auto',
          targetLang: targetLanguage,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Translation failed');
      }

      const data = await response.json();
      setTranslatedText(data.translatedText);
      showToast('success', 'Translation completed!');
    } catch (error) {
      console.error('Translation error:', error);
      showToast('error', error instanceof Error ? error.message : 'Failed to translate text');
    } finally {
      setTranslating(false);
    }
  };

  const exportAsText = () => {
    if (!transcription) return;

    const blob = new Blob([transcription.text], { type: 'text/plain' });
    exportFile(blob, 'transcription.txt');
  };

  const exportAsSRT = () => {
    if (!transcription || !transcription.segments) return;

    let srt = '';
    transcription.segments.forEach((segment, index) => {
      srt += `${index + 1}\n`;
      srt += `${formatTime(segment.start)} --> ${formatTime(segment.end)}\n`;
      srt += `${segment.text.trim()}\n\n`;
    });

    const blob = new Blob([srt], { type: 'text/plain' });
    exportFile(blob, 'transcription.srt');
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  };

  const formatTimeSimple = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const exportFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(16, 185, 129) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header - Ultra Modern */}
        <div className="text-center mb-16 animate-slide-in-top">
          {/* Floating Icon Badge */}
          <div className="inline-flex items-center justify-center p-5 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-3xl shadow-2xl shadow-emerald-500/40 mb-8 group hover:scale-110 hover:rotate-3 transition-all duration-500 animate-glow-pulse">
            <svg className="w-24 h-24 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>

          {/* Main Title with Shimmer Effect */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="block text-gray-900 mb-2">AI Transcription</span>
            <span className="block text-shimmer text-7xl sm:text-8xl lg:text-9xl">
              Made Simple 🎙️
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 font-bold max-w-3xl mx-auto leading-relaxed mb-10">
            Transform audio & video into text with <span className="text-emerald-600">OpenAI Whisper</span> -
            The world's most advanced AI transcription
          </p>

          {/* Feature Pills - Enhanced */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            {[
              { icon: '🌍', text: '100+ Languages', color: 'from-emerald-500 to-teal-600', delay: '0s' },
              { icon: '⚡', text: 'Lightning Fast', color: 'from-yellow-500 to-orange-600', delay: '0.1s' },
              { icon: '🎯', text: '99% Accurate', color: 'from-blue-500 to-cyan-600', delay: '0.2s' },
              { icon: '🔒', text: 'Secure & Private', color: 'from-purple-500 to-pink-600', delay: '0.3s' },
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative glass-morphism px-6 py-3 rounded-full hover:scale-110 transition-all duration-300 cursor-default animate-slide-in-bottom"
                style={{ animationDelay: feature.delay }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-full transition-opacity`}></div>
                <div className="relative flex items-center gap-2">
                  <span className="text-2xl group-hover:scale-125 transition-transform">{feature.icon}</span>
                  <span className={`text-sm font-black bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.text}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Bar - Redesigned */}
          <div className="inline-flex items-center gap-8 px-10 py-6 glass-morphism rounded-3xl shadow-xl">
            {[
              { value: '100+', label: 'Languages', gradient: 'from-emerald-600 to-teal-600' },
              { value: 'AI', label: 'Powered', gradient: 'from-teal-600 to-cyan-600' },
              { value: 'SRT', label: 'Export', gradient: 'from-cyan-600 to-blue-600' },
            ].map((stat, index) => (
              <div key={index} className="flex items-center gap-8">
                {index > 0 && (
                  <div className="w-px h-14 bg-gradient-to-b from-transparent via-gray-400 to-transparent"></div>
                )}
                <div className="text-center group cursor-default">
                  <div className={`text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-bold uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Card - Ultra Premium Design */}
        <div className="relative card-premium rounded-3xl shadow-2xl p-10 mb-10 overflow-hidden group animate-scale-in">
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
          <div className="absolute inset-[2px] bg-white dark:bg-gray-900 rounded-3xl"></div>

          {/* Glow Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

          {/* Decorative Corner Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-bl-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-tr-full opacity-50"></div>

          <div className="relative z-10 space-y-8">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Upload Audio/Video File</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {file ? file.name : 'Choose File'}
              </button>
            </div>

            {/* Language Selection */}
            {file && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none font-semibold"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Transcribe Button */}
                <button
                  onClick={handleTranscribe}
                  disabled={transcribing}
                  className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-black text-lg rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {transcribing ? 'Transcribing... This may take a few minutes' : 'Transcribe 🎙️'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </>
            )}

            {/* Transcription Result */}
            {transcription && (
              <div className="space-y-6 pt-6 border-t-2 border-gray-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h3 className="text-xl font-black text-gray-900">Transcription Result</h3>
                  <div className="flex items-center gap-3">
                    {transcription.language && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                        {transcription.language.toUpperCase()}
                      </span>
                    )}
                    {transcription.segments && (
                      <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setViewMode('segments')}
                          className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${
                            viewMode === 'segments'
                              ? 'bg-white text-emerald-600 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Segments
                        </button>
                        <button
                          onClick={() => setViewMode('full')}
                          className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${
                            viewMode === 'full'
                              ? 'bg-white text-emerald-600 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Full Text
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Text Display */}
                <div className="bg-gray-50 rounded-2xl p-6 max-h-96 overflow-y-auto">
                  {viewMode === 'segments' && transcription.segments ? (
                    <div className="space-y-4">
                      {transcription.segments.map((segment, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                              {formatTimeSimple(segment.start)}
                            </span>
                            <p className="text-gray-800 font-medium leading-relaxed flex-1">
                              {segment.text.trim()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">
                      {transcription.text}
                    </p>
                  )}
                </div>

                {/* Translation Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 space-y-4">
                  <h4 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    Translate Transcription
                  </h4>

                  <div className="flex gap-3">
                    <select
                      value={targetLanguage}
                      onChange={(e) => setTargetLanguage(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none font-semibold bg-white"
                    >
                      {translationLanguages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleTranslate}
                      disabled={translating}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {translating ? 'Translating...' : 'Translate 🌍'}
                    </button>
                  </div>

                  {translatedText && (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">
                        {translatedText}
                      </p>
                    </div>
                  )}
                </div>

                {/* Export Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={exportAsText}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Export as TXT 📄
                  </button>
                  {transcription.segments && (
                    <button
                      onClick={exportAsSRT}
                      className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      Export as SRT 🎬
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative bg-white/80 backdrop-blur-2xl rounded-2xl p-8 border-2 border-gray-200 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">AI Powered 🤖</h3>
                <p className="text-sm text-gray-600 font-semibold">OpenAI Whisper</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-2xl rounded-2xl p-8 border-2 border-gray-200 hover:border-teal-400 hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Multi-Language 🌍</h3>
                <p className="text-sm text-gray-600 font-semibold">100+ languages</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-2xl rounded-2xl p-8 border-2 border-gray-200 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Timestamps ⏱️</h3>
                <p className="text-sm text-gray-600 font-semibold">SRT export ready</p>
              </div>
            </div>
          </div>
        </div>

        <ToolUsageGuide toolName="Transcription Tool" />
      </div>
    </div>
  );
}
