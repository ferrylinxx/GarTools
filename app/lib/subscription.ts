// Subscription plans and limits

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  limits: {
    processesPerDay: number; // -1 = unlimited
    maxFileSizeMB: number; // -1 = unlimited
    maxDurationMinutes: number; // -1 = unlimited
    concurrentProcesses: number;
    batchSize: number;
    cloudStorageGB?: number;
  };
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, SubscriptionPlan> = {
  free: {
    tier: 'free',
    name: 'Free Plan',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      'Basic processing',
      'MP3/MP4 conversion',
      'Standard quality',
      '5 processes per day',
      'Community support',
    ],
    limits: {
      processesPerDay: 5,
      maxFileSizeMB: 100,
      maxDurationMinutes: 10,
      concurrentProcesses: 1,
      batchSize: 1,
    },
  },
  basic: {
    tier: 'basic',
    name: 'Basic Plan',
    priceMonthly: 9.99,
    priceYearly: 99.99,
    features: [
      'Unlimited processing',
      'All formats supported',
      'HD quality (1080p)',
      'No advertisements',
      'Batch processing (5 files)',
      'Priority support',
      'Processing history',
    ],
    limits: {
      processesPerDay: -1,
      maxFileSizeMB: 500,
      maxDurationMinutes: 60,
      concurrentProcesses: 3,
      batchSize: 5,
    },
    popular: true,
  },
  pro: {
    tier: 'pro',
    name: 'Pro Plan',
    priceMonthly: 19.99,
    priceYearly: 199.99,
    features: [
      'Everything in Basic',
      '4K quality (2160p)',
      'AI-powered features',
      'Batch processing (20 files)',
      'Cloud storage (50GB)',
      'API access',
      'Advanced analytics',
      'Premium support',
      'Custom presets',
    ],
    limits: {
      processesPerDay: -1,
      maxFileSizeMB: 2000,
      maxDurationMinutes: 180,
      concurrentProcesses: 10,
      batchSize: 20,
      cloudStorageGB: 50,
    },
  },
  enterprise: {
    tier: 'enterprise',
    name: 'Enterprise Plan',
    priceMonthly: 49.99,
    priceYearly: 499.99,
    features: [
      'Everything in Pro',
      'Unlimited everything',
      'White-label option',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee (99.9%)',
      'Cloud storage (500GB)',
      'Team collaboration',
      'Advanced security',
      'Custom branding',
    ],
    limits: {
      processesPerDay: -1,
      maxFileSizeMB: -1,
      maxDurationMinutes: -1,
      concurrentProcesses: -1,
      batchSize: -1,
      cloudStorageGB: 500,
    },
  },
};

// Get user's current plan (mock - replace with real auth)
export function getCurrentPlan(): SubscriptionTier {
  if (typeof window === 'undefined') return 'free';
  
  // TODO: Get from auth/session
  const savedTier = localStorage.getItem('subscription_tier') as SubscriptionTier;
  return savedTier || 'free';
}

// Check if user can perform action
export function canPerformAction(
  action: 'process' | 'convert' | 'enhance' | 'compress',
  fileSize?: number,
  duration?: number
): { allowed: boolean; reason?: string; upgradeRequired?: boolean } {
  const tier = getCurrentPlan();
  const plan = SUBSCRIPTION_PLANS[tier];

  // Check file size limit
  if (fileSize && plan.limits.maxFileSizeMB !== -1) {
    const fileSizeMB = fileSize / (1024 * 1024);
    if (fileSizeMB > plan.limits.maxFileSizeMB) {
      return {
        allowed: false,
        reason: `File size exceeds ${plan.limits.maxFileSizeMB}MB limit for ${plan.name}`,
        upgradeRequired: true,
      };
    }
  }

  // Check duration limit
  if (duration && plan.limits.maxDurationMinutes !== -1) {
    const durationMinutes = duration / 60;
    if (durationMinutes > plan.limits.maxDurationMinutes) {
      return {
        allowed: false,
        reason: `Duration exceeds ${plan.limits.maxDurationMinutes} minutes limit for ${plan.name}`,
        upgradeRequired: true,
      };
    }
  }

  // Check daily processing limit
  if (action === 'process' && plan.limits.processesPerDay !== -1) {
    const today = new Date().toISOString().split('T')[0];
    const processesToday = parseInt(localStorage.getItem(`processes_${today}`) || '0');
    
    if (processesToday >= plan.limits.processesPerDay) {
      return {
        allowed: false,
        reason: `Daily processing limit (${plan.limits.processesPerDay}) reached for ${plan.name}`,
        upgradeRequired: true,
      };
    }
  }

  return { allowed: true };
}

// Increment usage counter
export function incrementUsage(action: 'process' | 'convert' | 'enhance' | 'compress'): void {
  if (typeof window === 'undefined') return;
  
  if (action === 'process') {
    const today = new Date().toISOString().split('T')[0];
    const current = parseInt(localStorage.getItem(`processes_${today}`) || '0');
    localStorage.setItem(`processes_${today}`, (current + 1).toString());
  }
}

// Get usage stats
export function getUsageStats(): {
  processesToday: number;
  processesRemaining: number;
  plan: SubscriptionPlan;
} {
  const tier = getCurrentPlan();
  const plan = SUBSCRIPTION_PLANS[tier];
  const today = new Date().toISOString().split('T')[0];
  const processesToday = parseInt(localStorage.getItem(`processes_${today}`) || '0');
  
  const processesRemaining = plan.limits.processesPerDay === -1 
    ? -1 
    : Math.max(0, plan.limits.processesPerDay - processesToday);

  return {
    processesToday,
    processesRemaining,
    plan,
  };
}

