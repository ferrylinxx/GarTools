'use client';

import { useState } from 'react';
import { SUBSCRIPTION_PLANS, SubscriptionTier } from '../lib/subscription';
import { useAuth } from '@/app/contexts/AuthContext';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (tier === 'free') {
      alert('You are already on the free plan!');
      return;
    }

    setLoading(tier);

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          billingPeriod,
          userId: user?.id,
          email: user?.email,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      alert(`Error: ${error.message}`);
      setLoading(null);
    }
  };

  const plans = Object.values(SUBSCRIPTION_PLANS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 pt-24 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/50 via-pink-500/50 to-blue-500/50 animate-gradient-shift"></div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-[450px] h-[450px] bg-pink-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-full border-2 border-purple-500/30 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
            <span className="text-sm font-black text-purple-600">PRICING PLANS</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-6 leading-none">
            <span className="inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
              Choose Your Plan
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-bold mb-8">
            Unlock powerful features and take your content creation to the next level 🚀
          </p>

          {/* Billing Toggle - Modern Switch Design */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className={`text-lg font-black transition-all duration-300 ${
              billingPeriod === 'monthly' ? 'text-purple-600 scale-110' : 'text-gray-500'
            }`}>
              Monthly
            </span>

            {/* Toggle Switch */}
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-10 w-20 items-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span
                className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                  billingPeriod === 'yearly' ? 'translate-x-11' : 'translate-x-1'
                }`}
              />
            </button>

            <div className="relative">
              <span className={`text-lg font-black transition-all duration-300 ${
                billingPeriod === 'yearly' ? 'text-purple-600 scale-110' : 'text-gray-500'
              }`}>
                Yearly
              </span>
              {billingPeriod === 'yearly' && (
                <span className="absolute -top-6 -right-12 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-black rounded-full shadow-lg animate-bounce">
                  💰 Save 17%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan, index) => {
            const price = billingPeriod === 'monthly' ? plan.priceMonthly : plan.priceYearly;
            const pricePerMonth = billingPeriod === 'yearly' ? (plan.priceYearly / 12).toFixed(2) : price;

            return (
              <div
                key={plan.tier}
                className={`relative group animate-slide-up ${plan.popular ? 'lg:scale-110 lg:z-10' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-sm rounded-full shadow-lg animate-bounce">
                      ⭐ MOST POPULAR
                    </div>
                  </div>
                )}

                <div className={`absolute inset-0 bg-gradient-to-r ${
                  plan.tier === 'free' ? 'from-gray-500 to-gray-600' :
                  plan.tier === 'basic' ? 'from-blue-500 to-cyan-600' :
                  plan.tier === 'pro' ? 'from-purple-500 to-pink-600' :
                  'from-yellow-500 to-orange-600'
                } rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>

                <div className={`relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border-2 ${
                  plan.popular ? 'border-purple-500' : 'border-gray-200'
                } hover:shadow-3xl transition-all duration-500`}>
                  {/* Plan Name */}
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h3>
                  
                  {/* Price */}
                  <div className="mb-6">
                    {price === 0 ? (
                      <div className="text-5xl font-black text-gray-900">Free</div>
                    ) : (
                      <>
                        <div className="text-5xl font-black text-gray-900">
                          ${pricePerMonth}
                          <span className="text-lg text-gray-600 font-semibold">/mo</span>
                        </div>
                        {billingPeriod === 'yearly' && (
                          <div className="text-sm text-gray-600 font-semibold mt-1">
                            Billed ${plan.priceYearly}/year
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Subscribe Button */}
                  <button
                    onClick={() => handleSubscribe(plan.tier)}
                    disabled={loading === plan.tier}
                    className={`w-full py-4 rounded-xl font-black text-lg mb-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.tier === 'free'
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    {loading === plan.tier ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      plan.tier === 'free' ? 'Current Plan' : 'Get Started'
                    )}
                  </button>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700 font-semibold">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="relative group animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-gray-200">
            <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                <h3 className="text-lg font-black text-gray-900 mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-700 font-semibold">Yes! You can cancel your subscription at any time. No questions asked.</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl">
                <h3 className="text-lg font-black text-gray-900 mb-2">Do you offer refunds?</h3>
                <p className="text-gray-700 font-semibold">We offer a 30-day money-back guarantee for all paid plans.</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl">
                <h3 className="text-lg font-black text-gray-900 mb-2">Can I upgrade or downgrade?</h3>
                <p className="text-gray-700 font-semibold">Yes! You can change your plan at any time. Changes take effect immediately.</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl">
                <h3 className="text-lg font-black text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-700 font-semibold">We accept all major credit cards, PayPal, and bank transfers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

