import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blogPosts } from '../blogData';
import '../markdown.css';

interface BlogPageProps {
  params: { id: string };
}


export function generateMetadata({ params }: BlogPageProps): Metadata {
  const post = blogPosts.find((p) => p.id === params.id);
  if (!post) {
    return {
      title: 'Post not found - GarTools Blog',
      description: 'This blog post could not be found.',
      alternates: { canonical: 'https://fgarola.es/blog' },
    };
  }
  return {
    title: `${post.title} - GarTools Blog`,
    description: post.excerpt,
    alternates: { canonical: `https://fgarola.es/blog/${post.id}` },
  };
}
export default function BlogPostPage({ params }: BlogPageProps) {
  const post = blogPosts.find((p) => p.id === params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-emerald-600 font-bold mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to blog
        </Link>

        <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl p-8 sm:p-12">
          <div className="text-sm font-semibold text-gray-500 mb-4">
            {post.date} • {post.tags.join(', ')}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
            {post.title}
          </h1>
          <div className="prose prose-lg max-w-none text-gray-700 prose-headings:font-black prose-headings:text-gray-900 prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-strong:font-semibold prose-ul:my-6 prose-ol:my-6 prose-li:my-1 react-markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
