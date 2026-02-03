import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d, all

    // Create Supabase client with cookies
    const cookieStore = await cookies();
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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
    }

    // Fetch user's analytics events
    const { data: events, error: eventsError } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
    }

    const userEvents = events || [];

    // Calculate overview stats
    const totalProcesses = userEvents.filter(e => e.event_type === 'process').length;
    const totalConversions = userEvents.filter(e => e.event_type === 'conversion').length;
    const totalEnhancements = userEvents.filter(e => e.event_type === 'enhancement').length;
    const totalCompressions = userEvents.filter(e => e.event_type === 'compression').length;

    // Calculate processes by format
    const formatCounts: Record<string, number> = {};
    userEvents
      .filter(e => e.event_type === 'process' && e.event_data?.format)
      .forEach(e => {
        const format = e.event_data.format;
        formatCounts[format] = (formatCounts[format] || 0) + 1;
      });

    const byFormat = Object.entries(formatCounts).map(([format, count]) => ({
      format,
      count
    }));

    // Calculate processes by quality
    const qualityCounts: Record<string, number> = {};
    userEvents
      .filter(e => e.event_type === 'process' && e.event_data?.quality)
      .forEach(e => {
        const quality = e.event_data.quality;
        qualityCounts[quality] = (qualityCounts[quality] || 0) + 1;
      });

    const byQuality = Object.entries(qualityCounts).map(([quality, count]) => ({
      quality,
      count
    }));

    // Generate timeline data
    const timelineData = generateTimelineData(userEvents, period === '7d' ? 7 : period === '30d' ? 30 : 90);

    // Get top content
    const contentCounts: Record<string, number> = {};
    userEvents
      .filter(e => e.event_data?.title)
      .forEach(e => {
        const title = e.event_data.title;
        contentCounts[title] = (contentCounts[title] || 0) + 1;
      });

    const topContent = Object.entries(contentCounts)
      .map(([title, processes]) => ({ title, processes }))
      .sort((a, b) => b.processes - a.processes)
      .slice(0, 5);

    // Calculate performance metrics
    const processingTimes = userEvents
      .filter(e => e.event_data?.processingTime)
      .map(e => e.event_data.processingTime);

    const avgProcessingTime = processingTimes.length > 0
      ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length
      : 0;

    const fileSizes = userEvents
      .filter(e => e.event_data?.fileSize)
      .map(e => e.event_data.fileSize);

    const avgFileSize = fileSizes.length > 0
      ? fileSizes.reduce((a, b) => a + b, 0) / fileSizes.length
      : 0;

    const successfulEvents = userEvents.filter(e => e.event_data?.success !== false).length;
    const successRate = userEvents.length > 0 ? (successfulEvents / userEvents.length) * 100 : 0;
    const errorRate = 100 - successRate;

    const stats = {
      overview: {
        totalProcesses,
        totalConversions,
        totalEnhancements,
        totalCompressions,
        totalUsers: 1, // Current user
        activeUsers: 1, // Current user
      },
      processes: {
        byFormat: byFormat.length > 0 ? byFormat : [{ format: 'No data yet', count: 0 }],
        byQuality: byQuality.length > 0 ? byQuality : [{ quality: 'No data yet', count: 0 }],
      },
      timeline: {
        daily: timelineData,
      },
      topContent: topContent.length > 0 ? topContent : [{ title: 'No processes yet', processes: 0 }],
      performance: {
        avgProcessingTime: Math.round(avgProcessingTime),
        avgFileSize: Math.round(avgFileSize),
        successRate: Math.round(successRate * 10) / 10,
        errorRate: Math.round(errorRate * 10) / 10,
      },
      usage: {
        totalStorage: fileSizes.reduce((a, b) => a + b, 0),
        totalBandwidth: fileSizes.reduce((a, b) => a + b, 0) * 2, // Estimate
        peakHour: 14, // TODO: Calculate from events
        peakDay: 'N/A', // TODO: Calculate from events
      },
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Stats fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: error.message },
      { status: 500 }
    );
  }
}

function generateTimelineData(events: any[], days: number) {
  const data = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Filter events for this specific day
    const dayEvents = events.filter(e => {
      const eventDate = new Date(e.created_at).toISOString().split('T')[0];
      return eventDate === dateStr;
    });

    data.push({
      date: dateStr,
      processes: dayEvents.filter(e => e.event_type === 'process').length,
      conversions: dayEvents.filter(e => e.event_type === 'conversion').length,
      enhancements: dayEvents.filter(e => e.event_type === 'enhancement').length,
      compressions: dayEvents.filter(e => e.event_type === 'compression').length,
    });
  }

  return data;
}

