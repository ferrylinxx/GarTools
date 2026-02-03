import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_PRICES } from '@/app/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tier, billingPeriod, email, userId } = body;

    if (!tier || !billingPeriod) {
      return NextResponse.json(
        { error: 'Missing tier or billingPeriod' },
        { status: 400 }
      );
    }

    // Get the correct price ID
    let priceId: string;
    if (tier === 'basic') {
      priceId = billingPeriod === 'monthly' ? STRIPE_PRICES.BASIC_MONTHLY : STRIPE_PRICES.BASIC_YEARLY;
    } else if (tier === 'pro') {
      priceId = billingPeriod === 'monthly' ? STRIPE_PRICES.PRO_MONTHLY : STRIPE_PRICES.PRO_YEARLY;
    } else if (tier === 'enterprise') {
      priceId = billingPeriod === 'monthly' ? STRIPE_PRICES.ENTERPRISE_MONTHLY : STRIPE_PRICES.ENTERPRISE_YEARLY;
    } else {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.headers.get('origin')}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/pricing?canceled=true`,
      customer_email: email || undefined,
      metadata: {
        tier,
        billingPeriod,
        userId: userId || '',
      },
      subscription_data: {
        metadata: {
          tier,
          billingPeriod,
          userId: userId || '',
        },
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

