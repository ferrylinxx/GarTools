'use client';

import { useState, useRef } from 'react';
import { useToast } from '../components/Toast';
import UsageLimitBanner from '../components/UsageLimitBanner';
import ToolUsageGuide from '../components/ToolUsageGuide';
import { useUsageLimits } from '../hooks/useUsageLimits';
import { Analytics } from '../lib/analytics';

interface AudioFile {
  file: File;
  id: string;
  metadata: {
    title: string;
    artist: string;
    album: string;
    year: string;
    genre: string;
    artwork?: string;
  };
}

export default function MetadataEditorPage() {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<AudioFile | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const artworkInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();
  const { limitReached, incrementUsage } = useUsageLimits('metadata_edit');

  const handleFilesSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length === 0) return;

    const audioFiles: AudioFile[] = [];

    for (const file of selectedFiles) {
      // Validate file type
      if (!file.name.match(/\.(mp3|m4a|aac|flac|wav)$/i)) {
        showToast('error', `Skipped ${file.name}: Invalid file type`);
        continue;
      }

      // Extract existing metadata
      const metadata = await extractMetadata(file);
      
      audioFiles.push({
        file,
        id: Math.random().toString(36).substr(2, 9),
        metadata: metadata || {
          title: file.name.replace(/\.[^/.]+$/, ''),
          artist: '',
          album: '',
          year: '',
          genre: '',
        },
      });
    }

    setFiles([...files, ...audioFiles]);
    if (audioFiles.length > 0) {
      setSelectedFile(audioFiles[0]);
      showToast('success', `${audioFiles.length} file(s) loaded`);
    }
  };

  const extractMetadata = async (file: File): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/extract-metadata', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error extracting metadata:', error);
    }
    return null;
  };

  const handleMetadataChange = (field: string, value: string) => {
    if (!selectedFile) return;

    const updatedFiles = files.map(f => 
      f.id === selectedFile.id 
        ? { ...f, metadata: { ...f.metadata, [field]: value } }
        : f
    );

    setFiles(updatedFiles);
    setSelectedFile({ ...selectedFile, metadata: { ...selectedFile.metadata, [field]: value } });
  };

  const handleArtworkSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const artwork = event.target?.result as string;
      handleMetadataChange('artwork', artwork);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    // Check usage limit
    if (limitReached) {
      showToast('error', 'Daily metadata edit limit reached! Upgrade your plan to continue.');
      return;
    }

    // Increment usage
    const result = await incrementUsage();
    if (!result.success) {
      showToast('error', result.error || 'Failed to track usage');
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile.file);
      formData.append('metadata', JSON.stringify(selectedFile.metadata));

      const response = await fetch('/api/update-metadata', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update metadata');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Track analytics
      Analytics.trackMetadataEdit({
        fileCount: 1,
        fileSize: selectedFile.file.size / (1024 * 1024), // Convert to MB
        success: true,
      });

      showToast('success', 'Metadata updated successfully!');
    } catch (error) {
      console.error('Save error:', error);

      // Track analytics error
      Analytics.trackMetadataEdit({
        fileCount: 1,
        fileSize: selectedFile.file.size / (1024 * 1024),
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to update metadata',
      });

      showToast('error', 'Failed to update metadata');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);

    try {
      for (const audioFile of files) {
        const formData = new FormData();
        formData.append('file', audioFile.file);
        formData.append('metadata', JSON.stringify(audioFile.metadata));

        const response = await fetch('/api/update-metadata', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = audioFile.file.name;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      }

      // Track analytics for batch save
      const totalSize = files.reduce((sum, f) => sum + f.file.size, 0) / (1024 * 1024);
      Analytics.trackMetadataEdit({
        fileCount: files.length,
        fileSize: totalSize,
        success: true,
      });

      showToast('success', `${files.length} file(s) updated successfully!`);
    } catch (error) {
      console.error('Batch save error:', error);

      // Track analytics error
      const totalSize = files.reduce((sum, f) => sum + f.file.size, 0) / (1024 * 1024);
      Analytics.trackMetadataEdit({
        fileCount: files.length,
        fileSize: totalSize,
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to update some files',
      });

      showToast('error', 'Failed to update some files');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8 pt-24 relative overflow-hidden">
      {/* Background Decorations - ULTRA ENHANCED */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Mesh Gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/50 via-blue-500/50 to-teal-500/50 animate-gradient-shift"></div>
        </div>

        {/* Gradient Orbs - MORE & BIGGER */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[450px] h-[450px] bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-cyan-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-40 right-10 w-[300px] h-[300px] bg-blue-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div style={{
            backgroundImage: `
              linear-gradient(to right, rgb(6, 182, 212) 1px, transparent 1px),
              linear-gradient(to bottom, rgb(6, 182, 212) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating Sparkles */}
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
            ✨
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header - ULTRA ENHANCED */}
        <div className="text-center mb-12 animate-fade-in">
          {/* Icon with MEGA Glow */}
          <div className="inline-block mb-8 relative group">
            {/* Multiple Glow Layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 rounded-3xl blur-3xl opacity-60 animate-pulse-glow"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 rounded-3xl blur-2xl opacity-40 animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>

            {/* Icon Container with 3D Effect */}
            <div className="relative bg-gradient-to-br from-cyan-600 via-blue-600 to-teal-600 p-8 rounded-3xl shadow-2xl group-hover:scale-110 transition-all duration-500 card-3d">
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

              {/* Icon with Animation */}
              <svg className="w-24 h-24 text-white relative z-10 group-hover:rotate-12 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>

              {/* Corner Decorations */}
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/50 rounded-tr-lg"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/50 rounded-bl-lg"></div>
            </div>
          </div>

          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-full border-2 border-cyan-500/30 mb-6 animate-glow-pulse">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span className="text-sm font-black text-cyan-600">PROFESSIONAL EDITOR</span>
          </div>

          {/* Title with Enhanced Gradient */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 mb-6 leading-none">
            <span className="inline-block bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto] drop-shadow-2xl">
              Metadata
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto] drop-shadow-2xl" style={{ animationDelay: '0.5s' }}>
              Editor
            </span>
          </h1>

          {/* Subtitle with Shimmer */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-bold mb-6 leading-relaxed">
            Edit <span className="text-shimmer bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent font-black">ID3 tags</span>, artwork, and more with <span className="text-shimmer bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent font-black">batch support</span> ✨
          </p>

          {/* Stats - ENHANCED */}
          <div className="flex items-center justify-center gap-8 mt-8 flex-wrap">
            <div className="group text-center animate-zoom-in stagger-1">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent px-6 py-2">{files.length || '0'}</div>
              </div>
              <div className="text-sm text-gray-600 font-bold mt-2">Files Loaded</div>
            </div>
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-blue-300 to-transparent"></div>
            <div className="group text-center animate-zoom-in stagger-2">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent px-6 py-2">Batch</div>
              </div>
              <div className="text-sm text-gray-600 font-bold mt-2">Edit Support</div>
            </div>
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-teal-300 to-transparent"></div>
            <div className="group text-center animate-zoom-in stagger-3">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative text-4xl md:text-5xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent px-6 py-2">100%</div>
              </div>
              <div className="text-sm text-gray-600 font-bold mt-2">Free</div>
            </div>
          </div>
        </div>

        {/* Usage Limit Banner */}
        <UsageLimitBanner actionType="metadata_edit" actionLabel="metadata edit" />

        {/* File Upload */}
        <div className="mb-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFilesSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {files.length > 0 ? 'Add More Files' : 'Choose Audio Files'}
          </button>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* File List */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-xl border-2 border-gray-200 p-6">
                <h2 className="text-xl font-black text-gray-900 mb-4">Files ({files.length})</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {files.map((audioFile) => (
                    <button
                      key={audioFile.id}
                      onClick={() => setSelectedFile(audioFile)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        selectedFile?.id === audioFile.id
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="truncate">{audioFile.file.name}</div>
                      <div className="text-xs opacity-75 truncate">{audioFile.metadata.artist || 'Unknown Artist'}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor */}
            {selectedFile && (
              <div className="lg:col-span-2">
                <div className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-xl border-2 border-gray-200 p-8">
                  <h2 className="text-2xl font-black text-gray-900 mb-6">Edit Metadata</h2>
                  
                  <div className="space-y-6">
                    {/* Artwork */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">Album Artwork</label>
                      <div className="flex items-center gap-4">
                        {selectedFile.metadata.artwork && (
                          <img
                            src={selectedFile.metadata.artwork}
                            alt="Artwork"
                            className="w-32 h-32 rounded-xl shadow-lg object-cover"
                          />
                        )}
                        <input
                          ref={artworkInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleArtworkSelect}
                          className="hidden"
                        />
                        <button
                          onClick={() => artworkInputRef.current?.click()}
                          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                          {selectedFile.metadata.artwork ? 'Change Artwork' : 'Add Artwork'}
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={selectedFile.metadata.title}
                        onChange={(e) => handleMetadataChange('title', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none font-semibold"
                        placeholder="Song Title"
                      />
                    </div>

                    {/* Artist */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Artist</label>
                      <input
                        type="text"
                        value={selectedFile.metadata.artist}
                        onChange={(e) => handleMetadataChange('artist', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none font-semibold"
                        placeholder="Artist Name"
                      />
                    </div>

                    {/* Album */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Album</label>
                      <input
                        type="text"
                        value={selectedFile.metadata.album}
                        onChange={(e) => handleMetadataChange('album', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none font-semibold"
                        placeholder="Album Name"
                      />
                    </div>

                    {/* Year & Genre */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Year</label>
                        <input
                          type="text"
                          value={selectedFile.metadata.year}
                          onChange={(e) => handleMetadataChange('year', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none font-semibold"
                          placeholder="2024"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Genre</label>
                        <input
                          type="text"
                          value={selectedFile.metadata.genre}
                          onChange={(e) => handleMetadataChange('genre', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-cyan-500 focus:outline-none font-semibold"
                          placeholder="Pop"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 text-white font-black text-lg rounded-2xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Saving...' : 'Save This File'}
                      </button>
                      <button
                        onClick={handleSaveAll}
                        disabled={saving}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white font-black text-lg rounded-2xl hover:shadow-2xl hover:shadow-teal-500/50 transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? 'Saving...' : `Save All (${files.length})`}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <ToolUsageGuide toolName="Metadata Editor" />
      </div>
    </div>
  );
}
