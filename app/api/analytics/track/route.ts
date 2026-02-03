import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface AnalyticsEvent {
  sessionId: string;
  eventType: string;
  eventCategory?: string;
  eventData?: Record<string, any>;
  fileSize?: number;
  processingTime?: number;
  formatFrom?: string;
  formatTo?: string;
  quality?: string;
  success?: boolean;
  errorMessage?: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const event: AnalyticsEvent = await request.json();

    // Get authenticated user
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Get IP and User Agent
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Save to Supabase
    const { data, error } = await supabaseAdmin
      .from('analytics_events')
      .insert([{
        user_id: user?.id || null,
        session_id: event.sessionId,
        event_type: event.eventType,
        event_category: event.eventCategory,
        event_data: event.eventData,
        file_size: event.fileSize,
        processing_time: event.processingTime,
        format_from: event.formatFrom,
        format_to: event.formatTo,
        quality: event.quality,
        success: event.success !== false,
        error_message: event.errorMessage,
        ip_address: ip,
        user_agent: userAgent,
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    // Log to console for debugging
    console.log('📊 Analytics Event Saved:', {
      type: event.eventType,
      category: event.eventCategory,
      success: event.success !== false,
      processingTime: event.processingTime ? `${event.processingTime}ms` : 'N/A',
    });

    return NextResponse.json({ success: true, event: data });
  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track event', details: error.message },
      { status: 500 }
    );
  }
}

// Get analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get('eventType');
    const limit = parseInt(searchParams.get('limit') || '100');

    let query = supabaseAdmin
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (eventType) {
      query = query.eq('event_type', eventType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    return NextResponse.json({
      events: data || [],
      total: data?.length || 0,
    });
  } catch (error: any) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error.message },
      { status: 500 }
    );
  }
}

