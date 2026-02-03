'use client';

import { useState, useRef } from 'react';
import { useToast } from '../components/Toast';
import ToolUsageGuide from '../components/ToolUsageGuide';

type TranslationType = 'text' | 'subtitle';

export default function TranslatePage() {
  const [translationType, setTranslationType] = useState<TranslationType>('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es');
  const [translating, setTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
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
    { code: 'zh', name: 'Chinese (Simplified)' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' },
    { code: 'tr', name: 'Turkish' },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.match(/\.(srt|txt|vtt)$/i)) {
        showToast('error', 'Please select a valid subtitle file (SRT, TXT, VTT)');
        return;
      }

      setFile(selectedFile);
      showToast('success', `File selected: ${selectedFile.name}`);
    }
  };

  const handleTranslate = async () => {
    if (translationType === 'text' && !text.trim()) {
      showToast('error', 'Please enter text to translate');
      return;
    }

    if (translationType === 'subtitle' && !file) {
      showToast('error', 'Please select a subtitle file');
      return;
    }

    if (targetLang === 'auto') {
      showToast('error', 'Please select a target language');
      return;
    }

    setTranslating(true);
    setTranslatedText('');

    try {
      if (translationType === 'text') {
        await translateText();
      } else {
        await translateSubtitle();
      }
    } catch (error) {
      console.error('Translation error:', error);
      showToast('error', error instanceof Error ? error.message : 'Translation failed');
    } finally {
      setTranslating(false);
    }
  };

  const translateText = async () => {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        sourceLang: sourceLang === 'auto' ? undefined : sourceLang,
        targetLang,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Translation failed');
    }

    const data = await response.json();
    setTranslatedText(data.translatedText);
    showToast('success', 'Translation completed!');
  };

  const translateSubtitle = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('sourceLang', sourceLang);
    formData.append('targetLang', targetLang);

    const response = await fetch('/api/translate-subtitle', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Translation failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translated_${file.name}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    showToast('success', 'Subtitle translated and exported!');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    showToast('success', 'Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(251, 113, 133) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-rose-500 to-orange-600 rounded-3xl shadow-2xl shadow-rose-500/30 mb-6 group hover:scale-110 transition-transform duration-500">
            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
            AI Translator
          </h1>
          <p className="text-xl text-gray-600 font-semibold">
            Translate text and subtitles instantly 🌍
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">100+</div>
              <div className="text-sm text-gray-600 font-semibold">Languages</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
            <div className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">AI</div>
              <div className="text-sm text-gray-600 font-semibold">Powered</div>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
            <div className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent">Instant</div>
              <div className="text-sm text-gray-600 font-semibold">Results</div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-gray-200 p-8 mb-8 overflow-hidden group hover:shadow-rose-500/20 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10 space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Translation Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTranslationType('text')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    translationType === 'text'
                      ? 'bg-gradient-to-r from-rose-500 to-orange-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Text Translation
                </button>
                <button
                  onClick={() => setTranslationType('subtitle')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    translationType === 'subtitle'
                      ? 'bg-gradient-to-r from-rose-500 to-orange-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Subtitle Translation
                </button>
              </div>
            </div>

            {/* Language Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Source Language</label>
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none font-semibold"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Target Language</label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none font-semibold"
                >
                  {languages.filter(l => l.code !== 'auto').map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input */}
            {translationType === 'text' ? (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Text to Translate</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to translate..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-rose-500 focus:outline-none font-medium resize-none"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Upload Subtitle File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".srt,.txt,.vtt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-6 py-4 bg-gradient-to-r from-rose-500 to-orange-600 text-white font-bold rounded-2xl hover:from-rose-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {file ? file.name : 'Choose Subtitle File'}
                </button>
              </div>
            )}

            {/* Translate Button */}
            <button
              onClick={handleTranslate}
              disabled={translating}
              className="w-full px-8 py-4 bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white font-black text-lg rounded-2xl hover:shadow-2xl hover:shadow-rose-500/50 transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
            >
              <span className="relative z-10">
                {translating ? 'Translating...' : 'Translate 🌍'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            {/* Translation Result (Text only) */}
            {translationType === 'text' && translatedText && (
              <div className="space-y-4 pt-6 border-t-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900">Translation</h3>
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">
                    {translatedText}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative bg-white/80 backdrop-blur-2xl rounded-2xl p-8 border-2 border-gray-200 hover:border-rose-400 hover:shadow-2xl hover:shadow-rose-500/20 transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Instant 🚀</h3>
                <p className="text-sm text-gray-600 font-semibold">Real-time translation</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-2xl rounded-2xl p-8 border-2 border-gray-200 hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Accurate 🎯</h3>
                <p className="text-sm text-gray-600 font-semibold">AI-powered precision</p>
              </div>
            </div>
          </div>

          <div className="group relative bg-white/80 backdrop-blur-2xl rounded-2xl p-8 border-2 border-gray-200 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 hover:scale-105 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-amber-500 to-rose-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-500">
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
        </div>

        <ToolUsageGuide toolName="Subtitle and Text Translator" />
      </div>
    </div>
  );
}

