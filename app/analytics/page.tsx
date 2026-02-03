'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

interface Stats {
  overview: {
    totalProcesses: number;
    totalConversions: number;
    totalEnhancements: number;
    totalCompressions: number;
    totalUsers: number;
    activeUsers: number;
  };
  processes: {
    byFormat: Array<{ format: string; count: number }>;
    byQuality: Array<{ quality: string; count: number }>;
  };
  timeline: {
    daily: Array<{ date: string; processes: number; conversions: number; enhancements: number; compressions: number }>;
  };
  topContent: Array<{ title: string; processes: number }>;
  performance: {
    avgProcessingTime: number;
    avgFileSize: number;
    successRate: number;
    errorRate: number;
  };
  usage: {
    totalStorage: number;
    totalBandwidth: number;
    peakHour: number;
    peakDay: string;
  };
}

export default function AnalyticsPage() {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics/stats?period=${period}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="inline-block p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl">
            <svg className="animate-spin h-16 w-16 text-purple-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl font-black text-gray-900">Loading Your Analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has no data
  const hasNoData = stats.overview.totalProcesses === 0 &&
                    stats.overview.totalConversions === 0 &&
                    stats.overview.totalEnhancements === 0 &&
                    stats.overview.totalCompressions === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 pt-24 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/50 via-purple-500/50 to-pink-500/50 animate-gradient-shift"></div>
        </div>

        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[450px] h-[450px] bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12 animate-fade-in">
          <div>
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-xl rounded-full border-2 border-indigo-500/30 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              <span className="text-sm font-black text-indigo-600">YOUR PERSONAL ANALYTICS</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-none mb-3">
              <span className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                {userProfile?.name ? `${userProfile.name}'s Dashboard` : 'My Dashboard'}
              </span>
            </h1>

            <p className="text-xl text-gray-600 font-semibold">
              {user?.email} • <span className="capitalize text-purple-600">{userProfile?.subscription_tier || 'free'} Plan</span>
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2 bg-white/90 backdrop-blur-xl rounded-2xl p-2 shadow-lg border-2 border-gray-200">
            {['7d', '30d', '90d', 'all'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-6 py-2 rounded-xl font-black transition-all duration-300 ${
                  period === p
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {p === 'all' ? 'All Time' : p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Welcome Message for New Users */}
        {hasNoData && (
          <div className="mb-8 animate-fade-in">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20"></div>

              <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl p-12 border-2 border-gray-200 text-center">
                <div className="text-6xl mb-6">👋</div>
                <h2 className="text-4xl font-black text-gray-900 mb-4">
                  Welcome to Your Analytics Dashboard!
                </h2>
                <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                  Start using our tools to process, convert, enhance, or compress your media files.
                  Your activity will appear here automatically.
                </p>
                <div className="flex gap-4 justify-center">
                  <a
                    href="/tools"
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                  >
                    ⚡ Start Processing
                  </a>
                  <a
                    href="/converter"
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                  >
                    🔄 Try Converter
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'My Processes', value: stats.overview.totalProcesses, icon: '📥', color: 'from-blue-500 to-cyan-600' },
            { label: 'My Conversions', value: stats.overview.totalConversions, icon: '🔄', color: 'from-purple-500 to-pink-600' },
            { label: 'My Enhancements', value: stats.overview.totalEnhancements, icon: '✨', color: 'from-green-500 to-emerald-600' },
            { label: 'My Compressions', value: stats.overview.totalCompressions, icon: '📦', color: 'from-orange-500 to-red-600' },
          ].map((stat, index) => (
            <div key={index} className="relative group animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
              
              <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl p-6 border-2 border-gray-200 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">{stat.icon}</span>
                  <div className={`px-3 py-1 bg-gradient-to-r ${stat.color} text-white text-xs font-black rounded-full`}>
                    LIVE
                  </div>
                </div>
                <div className="text-4xl font-black text-gray-900 mb-1">{stat.value.toLocaleString()}</div>
                <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Processes by Format */}
          <div className="relative group animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

            <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Processes by Format</h3>

              <div className="space-y-4">
                {stats.processes.byFormat.map((item, index) => {
                  const total = stats.processes.byFormat.reduce((sum, i) => sum + i.count, 0);
                  const percentage = ((item.count / total) * 100).toFixed(1);

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-black text-gray-700 uppercase">{item.format}</span>
                        <span className="text-sm font-black text-gray-900">{item.count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Processes by Quality */}
          <div className="relative group animate-slide-up" style={{ animationDelay: '0.35s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

            <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-black text-gray-900 mb-6">Processes by Quality</h3>

              <div className="space-y-4">
                {stats.processes.byQuality.map((item, index) => {
                  const total = stats.processes.byQuality.reduce((sum, i) => sum + i.count, 0);
                  const percentage = ((item.count / total) * 100).toFixed(1);

                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-black text-gray-700 uppercase">{item.quality}</span>
                        <span className="text-sm font-black text-gray-900">{item.count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-1000"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="relative group animate-slide-up mb-8" style={{ animationDelay: '0.4s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border-2 border-gray-200">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Activity Timeline (Last 7 Days)</h3>

            <div className="h-64 flex items-end justify-between gap-2">
              {stats.timeline.daily.map((day, index) => {
                const maxValue = Math.max(...stats.timeline.daily.map(d => d.processes + d.conversions + d.enhancements + d.compressions));
                const totalHeight = ((day.processes + day.conversions + day.enhancements + day.compressions) / maxValue) * 100;

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col justify-end h-48 gap-1">
                      {/* Processes */}
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-cyan-600 rounded-t-lg transition-all duration-1000 hover:opacity-80 cursor-pointer group/bar"
                        style={{ height: `${(day.processes / maxValue) * 100}%` }}
                        title={`Processes: ${day.processes}`}
                      >
                        <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity text-xs font-black text-white text-center pt-1">
                          {day.processes}
                        </div>
                      </div>
                      {/* Conversions */}
                      <div
                        className="w-full bg-gradient-to-t from-purple-500 to-pink-600 transition-all duration-1000 hover:opacity-80 cursor-pointer group/bar"
                        style={{ height: `${(day.conversions / maxValue) * 100}%` }}
                        title={`Conversions: ${day.conversions}`}
                      >
                        <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity text-xs font-black text-white text-center pt-1">
                          {day.conversions}
                        </div>
                      </div>
                      {/* Enhancements */}
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-emerald-600 transition-all duration-1000 hover:opacity-80 cursor-pointer group/bar"
                        style={{ height: `${(day.enhancements / maxValue) * 100}%` }}
                        title={`Enhancements: ${day.enhancements}`}
                      >
                        <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity text-xs font-black text-white text-center pt-1">
                          {day.enhancements}
                        </div>
                      </div>
                      {/* Compressions */}
                      <div
                        className="w-full bg-gradient-to-t from-orange-500 to-red-600 rounded-b-lg transition-all duration-1000 hover:opacity-80 cursor-pointer group/bar"
                        style={{ height: `${(day.compressions / maxValue) * 100}%` }}
                        title={`Compressions: ${day.compressions}`}
                      >
                        <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity text-xs font-black text-white text-center pt-1">
                          {day.compressions}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-black text-gray-600">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t-2 border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded"></div>
                <span className="text-sm font-black text-gray-700">Processes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded"></div>
                <span className="text-sm font-black text-gray-700">Conversions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded"></div>
                <span className="text-sm font-black text-gray-700">Enhancements</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-600 rounded"></div>
                <span className="text-sm font-black text-gray-700">Compressions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Content */}
          <div className="relative group animate-slide-up" style={{ animationDelay: '0.45s' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

            <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-black text-gray-900 mb-6">🔥 Top Content</h3>

              <div className="space-y-4">
                {stats.topContent.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl hover:shadow-md transition-all duration-300">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-black rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-gray-900 truncate">{item.title}</div>
                    </div>
                    <div className="flex-shrink-0 text-sm font-black text-gray-600">
                      {item.processes} processes
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance & Usage */}
          <div className="space-y-8">
            {/* Performance Metrics */}
            <div className="relative group animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

              <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border-2 border-gray-200">
                <h3 className="text-2xl font-black text-gray-900 mb-6">⚡ Performance</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <div className="text-xs font-semibold text-gray-600 mb-1">Avg Processing Time</div>
                    <div className="text-2xl font-black text-gray-900">{formatTime(stats.performance.avgProcessingTime)}</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
                    <div className="text-xs font-semibold text-gray-600 mb-1">Avg File Size</div>
                    <div className="text-2xl font-black text-gray-900">{formatBytes(stats.performance.avgFileSize)}</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <div className="text-xs font-semibold text-gray-600 mb-1">Success Rate</div>
                    <div className="text-2xl font-black text-green-600">{stats.performance.successRate}%</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
                    <div className="text-xs font-semibold text-gray-600 mb-1">Error Rate</div>
                    <div className="text-2xl font-black text-red-600">{stats.performance.errorRate}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="relative group animate-slide-up" style={{ animationDelay: '0.55s' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

              <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-xl p-8 border-2 border-gray-200">
                <h3 className="text-2xl font-black text-gray-900 mb-6">💾 Usage</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
                    <span className="text-sm font-black text-gray-700">Total Storage</span>
                    <span className="text-lg font-black text-gray-900">{formatBytes(stats.usage.totalStorage)}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                    <span className="text-sm font-black text-gray-700">Total Bandwidth</span>
                    <span className="text-lg font-black text-gray-900">{formatBytes(stats.usage.totalBandwidth)}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
                    <span className="text-sm font-black text-gray-700">Peak Hour</span>
                    <span className="text-lg font-black text-gray-900">{stats.usage.peakHour}:00</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                    <span className="text-sm font-black text-gray-700">Peak Day</span>
                    <span className="text-lg font-black text-gray-900">{stats.usage.peakDay}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
