'use client';

import Link from 'next/link';
import { blogPosts } from './blogData';

export default function BlogPage() {
  const posts = blogPosts.filter(Boolean).sort((a, b) => b.date.localeCompare(a.date));
  const [featured, ...rest] = posts;
  const totalWords = posts.reduce((sum, post) => sum + (post.content ? post.content.split(/\s+/).length : 0), 0);

  const readTime = (content: string) => Math.max(5, Math.ceil((content || '').split(/\s+/).length / 220));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-24 pb-20">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, #10b981 1px, transparent 1px),
                linear-gradient(to bottom, #10b981 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
            }}
          ></div>
        </div>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-gradient-to-r from-emerald-200/40 via-teal-200/40 to-cyan-200/40 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-24 right-10 w-64 h-64 bg-gradient-to-br from-amber-200/40 to-rose-200/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-20 left-10 opacity-15 animate-float-enhanced">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-xl opacity-50"></div>
            <svg className="relative w-14 h-14 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        </div>
        <div className="absolute top-44 right-24 opacity-15 animate-float-enhanced animation-delay-2000">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur-xl opacity-50"></div>
            <svg className="relative w-12 h-12 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-24 right-10 opacity-10 animate-float-enhanced animation-delay-4000">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-400 rounded-2xl blur-xl opacity-50"></div>
            <svg className="relative w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M8 16h8m-4-4v8" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-100 text-emerald-700 font-black text-sm uppercase tracking-wider shadow-sm">
            Media Toolkit Journal
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mt-6 mb-6">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              GarTools Blog
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Deep guides on every tool, clear workflows, and practical export tips for modern media teams.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-gray-500">
            <span>{posts.length} posts</span>
            <span className="text-emerald-500">•</span>
            <span>{totalWords.toLocaleString()} words</span>
            <span className="text-emerald-500">•</span>
            <span>Updated weekly</span>
          </div>
        </div>

        {featured && (
          <Link
            href={`/blog/${featured.id}`}
            className="group relative block overflow-hidden rounded-[32px] border-2 border-emerald-200/70 bg-white p-10 shadow-2xl transition-all hover:-translate-y-2 hover:border-transparent"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-b from-emerald-400/20 to-cyan-400/10"></div>
            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="flex items-center gap-3 text-sm font-semibold text-emerald-700">
                <span className="px-3 py-1 rounded-full bg-emerald-100">Featured</span>
                <span>{featured.date}</span>
                <span className="text-emerald-500">•</span>
                <span>{readTime(featured.content)} min read</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors">
                {featured.title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="flex flex-wrap gap-3">
                {featured.tags.map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="inline-flex items-center gap-2 text-emerald-600 font-black">
                Read the full guide
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </Link>
        )}

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group relative bg-white rounded-3xl p-8 border-2 border-gray-200 hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-200/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
                  <span>{post.date}</span>
                  <span className="text-emerald-500">•</span>
                  <span>{readTime(post.content)} min read</span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="inline-flex items-center gap-2 text-emerald-600 font-bold">
                  Read more
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
