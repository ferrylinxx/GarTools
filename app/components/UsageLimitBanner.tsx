'use client';

import Link from 'next/link';
import { ActionType } from '@/app/lib/usage-limits';
import { useUsageLimits } from '@/app/hooks/useUsageLimits';

interface UsageLimitBannerProps {
  actionType: ActionType;
  actionLabel?: string;
}

export default function UsageLimitBanner({ actionType, actionLabel }: UsageLimitBannerProps) {
  const { tier, limit, used, remaining, limitReached, unlimited, loading, error } = useUsageLimits(actionType);

  if (loading) {
    return (
      <div className="mb-6 animate-pulse">
        <div className="bg-gray-200 rounded-2xl h-24"></div>
      </div>
    );
  }

  if (error) {
    return null; // Don't show banner if there's an error
  }

  // Get color scheme based on usage percentage
  const getColorScheme = () => {
    if (unlimited) {
      return {
        bg: 'from-purple-500/20 to-pink-500/20',
        border: 'border-purple-500/30',
        text: 'text-purple-600',
        progress: 'from-purple-600 to-pink-600',
        badge: 'from-purple-600 to-pink-600',
      };
    }

    if (limitReached) {
      return {
        bg: 'from-red-500/20 to-rose-500/20',
        border: 'border-red-500/30',
        text: 'text-red-600',
        progress: 'from-red-600 to-rose-600',
        badge: 'from-red-600 to-rose-600',
      };
    }

    const percentage = (used / limit) * 100;
    
    if (percentage >= 80) {
      return {
        bg: 'from-orange-500/20 to-red-500/20',
        border: 'border-orange-500/30',
        text: 'text-orange-600',
        progress: 'from-orange-600 to-red-600',
        badge: 'from-orange-600 to-red-600',
      };
    }

    if (percentage >= 50) {
      return {
        bg: 'from-yellow-500/20 to-orange-500/20',
        border: 'border-yellow-500/30',
        text: 'text-yellow-600',
        progress: 'from-yellow-600 to-orange-600',
        badge: 'from-yellow-600 to-orange-600',
      };
    }

    return {
      bg: 'from-green-500/20 to-emerald-500/20',
      border: 'border-green-500/30',
      text: 'text-green-600',
      progress: 'from-green-600 to-emerald-600',
      badge: 'from-green-600 to-emerald-600',
    };
  };

  const colors = getColorScheme();
  const percentage = unlimited ? 0 : Math.min(100, (used / limit) * 100);
  const label = actionLabel || actionType;

  return (
    <div className="mb-6 animate-fade-in">
      <div className={`relative bg-gradient-to-r ${colors.bg} backdrop-blur-xl rounded-2xl border-2 ${colors.border} p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 bg-gradient-to-r ${colors.badge} text-white rounded-full text-sm font-black uppercase`}>
              {tier} Plan
            </div>
            <h3 className={`text-lg font-black ${colors.text}`}>
              {unlimited ? '∞ Unlimited' : `${remaining} ${label}s remaining today`}
            </h3>
          </div>

          {!unlimited && limitReached && (
            <Link
              href="/pricing"
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-xl hover:shadow-lg hover:scale-105 transition-all text-sm"
            >
              Upgrade Plan
            </Link>
          )}
        </div>

        {/* Progress Bar */}
        {!unlimited && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-700">
                {used} / {limit} used
              </span>
              <span className="text-sm font-bold text-gray-700">
                {percentage.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${colors.progress} rounded-full transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Limit Reached Message */}
        {limitReached && (
          <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-sm font-black text-red-800 text-center">
              ⚠️ Daily limit reached! Upgrade your plan to continue using this feature.
            </p>
          </div>
        )}

        {/* Unlimited Badge */}
        {unlimited && (
          <div className="mt-2">
            <p className="text-sm font-bold text-purple-700 text-center">
              ✨ Enjoy unlimited {label}s with your {tier} plan!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

