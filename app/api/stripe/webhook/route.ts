import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/app/lib/stripe';
import { supabaseAdmin } from '@/app/lib/supabase';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  console.log('Received Stripe webhook event:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { customer, subscription, customer_email, metadata } = session;

  if (!customer || !subscription) {
    console.error('Missing required data in checkout session');
    return;
  }

  const tier = metadata?.tier || 'basic';
  const userId = metadata?.userId;

  // If we have userId from metadata, update by ID
  if (userId) {
    await supabaseAdmin
      .from('users')
      .update({
        subscription_tier: tier,
        subscription_status: 'active',
        stripe_customer_id: customer as string,
        stripe_subscription_id: subscription as string,
        subscription_start_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    console.log(`User ${userId} subscribed to ${tier} plan`);
  } else if (customer_email) {
    // Fallback to email lookup for backwards compatibility
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', customer_email)
      .single();

    if (existingUser) {
      // Update existing user
      await supabaseAdmin
        .from('users')
        .update({
          subscription_tier: tier,
          subscription_status: 'active',
          stripe_customer_id: customer as string,
          stripe_subscription_id: subscription as string,
          subscription_start_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('email', customer_email);
    } else {
      // Create new user
      await supabaseAdmin.from('users').insert({
        email: customer_email,
        subscription_tier: tier,
        subscription_status: 'active',
        stripe_customer_id: customer as string,
        stripe_subscription_id: subscription as string,
        subscription_start_date: new Date().toISOString(),
      });
    }

    console.log(`User ${customer_email} subscribed to ${tier} plan`);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const { customer, status, metadata } = subscription;
  const tier = metadata?.tier || 'basic';

  await supabaseAdmin
    .from('users')
    .update({
      subscription_tier: tier,
      subscription_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customer as string);

  console.log(`Subscription updated for customer ${customer}: ${status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { customer } = subscription;

  await supabaseAdmin
    .from('users')
    .update({
      subscription_tier: 'free',
      subscription_status: 'canceled',
      subscription_end_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customer as string);

  console.log(`Subscription canceled for customer ${customer}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const { customer, amount_paid, currency, subscription } = invoice;

  // Record payment in history
  await supabaseAdmin.from('payment_history').insert({
    user_id: null, // Will be linked via stripe_customer_id
    stripe_payment_id: invoice.id,
    amount: amount_paid / 100, // Convert from cents
    currency: currency.toUpperCase(),
    status: 'succeeded',
    payment_method: 'card',
    description: `Payment for subscription ${subscription}`,
  });

  console.log(`Payment succeeded for customer ${customer}: ${amount_paid / 100} ${currency}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const { customer, amount_due, currency } = invoice;

  // Record failed payment
  await supabaseAdmin.from('payment_history').insert({
    user_id: null,
    stripe_payment_id: invoice.id,
    amount: amount_due / 100,
    currency: currency.toUpperCase(),
    status: 'failed',
    payment_method: 'card',
    description: 'Payment failed',
  });

  console.log(`Payment failed for customer ${customer}: ${amount_due / 100} ${currency}`);
}

