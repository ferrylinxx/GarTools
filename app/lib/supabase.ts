import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Get environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

// Validation function that only runs at runtime
function validateSupabaseConfig() {
  if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      console.error('⚠️ NEXT_PUBLIC_SUPABASE_URL is not set in environment variables');
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'placeholder-key') {
      console.error('⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment variables');
    }
  }
}

// Run validation
validateSupabaseConfig();

// Client for browser (uses SSR-compatible client)
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);

// Admin client for server-side operations (uses service role key)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey
);

// Database types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'basic' | 'pro' | 'enterprise';
  subscription_status: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEvent {
  id: string;
  user_id?: string;
  session_id: string;
  event_type: string;
  event_category?: string;
  event_data?: any;
  file_size?: number;
  processing_time?: number;
  format_from?: string;
  format_to?: string;
  quality?: string;
  success: boolean;
  error_message?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface UsageStats {
  id: string;
  user_id: string;
  date: string;
  processes_count: number;
  conversions_count: number;
  enhancements_count: number;
  compressions_count: number;
  total_file_size: number;
  total_processing_time: number;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'free' | 'basic' | 'pro' | 'enterprise';
  price_monthly: number;
  price_yearly: number;
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
  features: string[];
  limits: {
    processes_per_day: number;
    max_file_size_mb: number;
    max_duration_minutes: number;
    concurrent_processes: number;
    batch_size?: number;
    cloud_storage_gb?: number;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentHistory {
  id: string;
  user_id: string;
  stripe_payment_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  description?: string;
  created_at: string;
}

