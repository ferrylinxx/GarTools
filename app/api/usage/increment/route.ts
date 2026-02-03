import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getLimitForAction, isLimitReached, ActionType } from '@/app/lib/usage-limits';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Create Supabase client with SSR
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const { actionType } = await req.json();

    if (!actionType) {
      return NextResponse.json({ error: 'Action type is required' }, { status: 400 });
    }

    // Get user profile to check subscription tier
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const tier = userProfile.subscription_tier || 'free';

    // Check for custom limits first
    let { data: customLimits } = await supabase
      .from('user_custom_limits')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // If no custom limits record exists, create one automatically with all NULL values
    if (!customLimits) {
      const { data: newRecord, error: insertError } = await supabase
        .from('user_custom_limits')
        .insert([{
          user_id: user.id,
          processes_per_day: null,
          conversions_per_day: null,
          enhancements_per_day: null,
          compressions_per_day: null,
          identifications_per_day: null,
          metadata_edits_per_day: null,
          notes: 'Auto-created on first usage',
        }])
        .select()
        .single();

      if (!insertError) {
        customLimits = newRecord;
      }
    }

    // Determine the limit to use
    let limit: number;
    const actionTypeMap: Record<ActionType, string> = {
      'process': 'processes_per_day',
      'conversion': 'conversions_per_day',
      'enhancement': 'enhancements_per_day',
      'compression': 'compressions_per_day',
      'identification': 'identifications_per_day',
      'metadata_edit': 'metadata_edits_per_day',
    };

    const customLimitField = actionTypeMap[actionType as ActionType];
    const customLimit = customLimits?.[customLimitField];

    // Use custom limit if exists (not null), otherwise use tier limit
    if (customLimit !== null && customLimit !== undefined) {
      limit = customLimit;
    } else {
      limit = getLimitForAction(tier, actionType as ActionType);
    }

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Check current usage
    const { data: usageData } = await supabase
      .from('usage_tracking')
      .select('count')
      .eq('user_id', user.id)
      .eq('action_type', actionType)
      .eq('date', today)
      .single();

    const currentUsage = usageData?.count || 0;

    // Check if limit is reached (unless unlimited)
    if (limit !== -1 && isLimitReached(limit, currentUsage)) {
      return NextResponse.json(
        { 
          error: 'Usage limit reached',
          tier,
          limit,
          used: currentUsage,
          limitReached: true,
        },
        { status: 429 } // Too Many Requests
      );
    }

    // Increment usage (upsert: insert if not exists, update if exists)
    const { error: upsertError } = await supabase
      .from('usage_tracking')
      .upsert(
        {
          user_id: user.id,
          action_type: actionType,
          date: today,
          count: currentUsage + 1,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,action_type,date',
        }
      );

    if (upsertError) {
      throw upsertError;
    }

    const newUsage = currentUsage + 1;
    const remaining = limit === -1 ? -1 : Math.max(0, limit - newUsage);

    return NextResponse.json({
      success: true,
      tier,
      limit,
      used: newUsage,
      remaining,
      limitReached: limit !== -1 && newUsage >= limit,
      unlimited: limit === -1,
      customLimit: customLimit !== null && customLimit !== undefined, // Indicates if using custom limit
    });

  } catch (error: any) {
    console.error('Error incrementing usage:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

