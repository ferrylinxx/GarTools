import Stripe from 'stripe';

// Get Stripe key with fallback for build time
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

// Validation function that only runs at runtime
function validateStripeConfig() {
  if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      console.error('⚠️ STRIPE_SECRET_KEY is not set in environment variables');
    }
  }
}

// Run validation
validateStripeConfig();

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Product IDs (will be created in Stripe)
export const STRIPE_PRODUCTS = {
  BASIC: 'prod_basic',
  PRO: 'prod_pro',
  ENTERPRISE: 'prod_enterprise',
} as const;

// Price IDs from Stripe
export const STRIPE_PRICES = {
  BASIC_MONTHLY: 'price_1SsMk7DKDJaukVa6PK71qism',
  BASIC_YEARLY: 'price_1SsMk7DKDJaukVa6Uu5F6Ism',
  PRO_MONTHLY: 'price_1SsMk8DKDJaukVa6K8ErKbpR',
  PRO_YEARLY: 'price_1SsMk9DKDJaukVa6CEZjm1zU',
  ENTERPRISE_MONTHLY: 'price_1SsMk9DKDJaukVa6hE1QE3WW',
  ENTERPRISE_YEARLY: 'price_1SsMk9DKDJaukVa6sEEvThPe',
} as const;

