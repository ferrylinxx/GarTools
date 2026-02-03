-- ============================================
-- ANALYTICS & MONETIZATION DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'free', -- free, basic, pro, enterprise
  subscription_status VARCHAR(50) DEFAULT 'active', -- active, canceled, expired
  stripe_customer_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255),
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ANALYTICS EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id VARCHAR(255),
  event_type VARCHAR(100) NOT NULL, -- process, convert, enhance, compress, etc.
  event_category VARCHAR(100), -- video, audio, playlist
  event_data JSONB, -- flexible data storage
  file_size BIGINT, -- in bytes
  processing_time INTEGER, -- in milliseconds
  format_from VARCHAR(50),
  format_to VARCHAR(50),
  quality VARCHAR(50),
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- USAGE STATS TABLE (Daily aggregates)
-- ============================================
CREATE TABLE IF NOT EXISTS usage_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  processes_count INTEGER DEFAULT 0,
  conversions_count INTEGER DEFAULT 0,
  enhancements_count INTEGER DEFAULT 0,
  compressions_count INTEGER DEFAULT 0,
  total_file_size BIGINT DEFAULT 0, -- in bytes
  total_processing_time INTEGER DEFAULT 0, -- in milliseconds
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ============================================
-- SUBSCRIPTION PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  tier VARCHAR(50) UNIQUE NOT NULL, -- free, basic, pro, enterprise
  price_monthly DECIMAL(10, 2),
  price_yearly DECIMAL(10, 2),
  stripe_price_id_monthly VARCHAR(255),
  stripe_price_id_yearly VARCHAR(255),
  features JSONB, -- list of features
  limits JSONB, -- usage limits
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- PAYMENT HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50), -- succeeded, failed, pending
  payment_method VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);

CREATE INDEX idx_usage_stats_user_id ON usage_stats(user_id);
CREATE INDEX idx_usage_stats_date ON usage_stats(date);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);

CREATE INDEX idx_payment_history_user_id ON payment_history(user_id);

-- ============================================
-- INSERT DEFAULT SUBSCRIPTION PLANS
-- ============================================
INSERT INTO subscription_plans (name, tier, price_monthly, price_yearly, features, limits) VALUES
('Free Plan', 'free', 0, 0, 
  '["Basic processes", "MP3/MP4 conversion", "Standard quality", "5 processes/day"]'::jsonb,
  '{"processes_per_day": 5, "max_file_size_mb": 100, "max_duration_minutes": 10, "concurrent_processes": 1}'::jsonb
),
('Basic Plan', 'basic', 9.99, 99.99,
  '["Unlimited processes", "All formats", "HD quality", "No ads", "Batch processing (5 files)", "Priority support"]'::jsonb,
  '{"processes_per_day": -1, "max_file_size_mb": 500, "max_duration_minutes": 60, "concurrent_processes": 3, "batch_size": 5}'::jsonb
),
('Pro Plan', 'pro', 19.99, 199.99,
  '["Everything in Basic", "4K quality", "AI features", "Batch processing (20 files)", "Cloud storage (50GB)", "API access", "Premium support"]'::jsonb,
  '{"processes_per_day": -1, "max_file_size_mb": 2000, "max_duration_minutes": 180, "concurrent_processes": 10, "batch_size": 20, "cloud_storage_gb": 50}'::jsonb
),
('Enterprise Plan', 'enterprise', 49.99, 499.99,
  '["Everything in Pro", "Unlimited everything", "White-label option", "Custom integrations", "Dedicated support", "SLA guarantee", "Cloud storage (500GB)"]'::jsonb,
  '{"processes_per_day": -1, "max_file_size_mb": -1, "max_duration_minutes": -1, "concurrent_processes": -1, "batch_size": -1, "cloud_storage_gb": 500}'::jsonb
)
ON CONFLICT (tier) DO NOTHING;

-- ============================================
-- FUNCTIONS FOR ANALYTICS
-- ============================================

-- Function to update usage stats
CREATE OR REPLACE FUNCTION update_usage_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO usage_stats (user_id, date, processes_count, conversions_count, total_file_size, total_processing_time)
  VALUES (
    NEW.user_id,
    CURRENT_DATE,
    CASE WHEN NEW.event_type = 'process' THEN 1 ELSE 0 END,
    CASE WHEN NEW.event_type = 'convert' THEN 1 ELSE 0 END,
    COALESCE(NEW.file_size, 0),
    COALESCE(NEW.processing_time, 0)
  )
  ON CONFLICT (user_id, date) DO UPDATE SET
    processes_count = usage_stats.processes_count + CASE WHEN NEW.event_type = 'process' THEN 1 ELSE 0 END,
    conversions_count = usage_stats.conversions_count + CASE WHEN NEW.event_type = 'convert' THEN 1 ELSE 0 END,
    total_file_size = usage_stats.total_file_size + COALESCE(NEW.file_size, 0),
    total_processing_time = usage_stats.total_processing_time + COALESCE(NEW.processing_time, 0),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update usage stats
CREATE TRIGGER trigger_update_usage_stats
AFTER INSERT ON analytics_events
FOR EACH ROW
EXECUTE FUNCTION update_usage_stats();

