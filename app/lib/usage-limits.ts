// Usage limits configuration for each subscription tier

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

export interface UsageLimits {
  processes_per_day: number;
  conversions_per_day: number;
  enhancements_per_day: number;
  compressions_per_day: number;
  identifications_per_day: number;
  metadata_edits_per_day: number;
  max_file_size_mb: number;
  batch_max_files: number;
  gif_max_duration_seconds: number;
}

// -1 means unlimited
export const USAGE_LIMITS: Record<SubscriptionTier, UsageLimits> = {
  free: {
    processes_per_day: 5,
    conversions_per_day: 3,
    enhancements_per_day: 2,
    compressions_per_day: 2,
    identifications_per_day: 3,
    metadata_edits_per_day: 5,
    max_file_size_mb: 50,
    batch_max_files: 3,
    gif_max_duration_seconds: 10,
  },
  basic: {
    processes_per_day: 50,
    conversions_per_day: 30,
    enhancements_per_day: 20,
    compressions_per_day: 20,
    identifications_per_day: 30,
    metadata_edits_per_day: 50,
    max_file_size_mb: 200,
    batch_max_files: 10,
    gif_max_duration_seconds: 30,
  },
  pro: {
    processes_per_day: 200,
    conversions_per_day: 150,
    enhancements_per_day: 100,
    compressions_per_day: 100,
    identifications_per_day: 150,
    metadata_edits_per_day: 200,
    max_file_size_mb: 500,
    batch_max_files: 25,
    gif_max_duration_seconds: 60,
  },
  enterprise: {
    processes_per_day: -1, // unlimited
    conversions_per_day: -1,
    enhancements_per_day: -1,
    compressions_per_day: -1,
    identifications_per_day: -1,
    metadata_edits_per_day: -1,
    max_file_size_mb: -1,
    batch_max_files: -1,
    gif_max_duration_seconds: -1,
  },
};

// Get limits for a specific tier
export function getLimitsForTier(tier: SubscriptionTier): UsageLimits {
  return USAGE_LIMITS[tier];
}

// Check if a value is unlimited
export function isUnlimited(value: number): boolean {
  return value === -1;
}

// Get remaining usage
export function getRemainingUsage(limit: number, used: number): number {
  if (isUnlimited(limit)) {
    return -1; // unlimited
  }
  return Math.max(0, limit - used);
}

// Check if limit is reached
export function isLimitReached(limit: number, used: number): boolean {
  if (isUnlimited(limit)) {
    return false;
  }
  return used >= limit;
}

// Get percentage used
export function getUsagePercentage(limit: number, used: number): number {
  if (isUnlimited(limit)) {
    return 0;
  }
  return Math.min(100, (used / limit) * 100);
}

// Action types for tracking
export type ActionType = 
  | 'process'
  | 'conversion'
  | 'enhancement'
  | 'compression'
  | 'identification'
  | 'metadata_edit';

// Map action types to limit keys
export const ACTION_TO_LIMIT_KEY: Record<ActionType, keyof UsageLimits> = {
  process: 'processes_per_day',
  conversion: 'conversions_per_day',
  enhancement: 'enhancements_per_day',
  compression: 'compressions_per_day',
  identification: 'identifications_per_day',
  metadata_edit: 'metadata_edits_per_day',
};

// Get limit for specific action
export function getLimitForAction(tier: SubscriptionTier, action: ActionType): number {
  const limits = getLimitsForTier(tier);
  const limitKey = ACTION_TO_LIMIT_KEY[action];
  return limits[limitKey];
}
