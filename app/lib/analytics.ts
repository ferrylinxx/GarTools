// Analytics tracking utility
import { v4 as uuidv4 } from 'uuid';

export interface AnalyticsEvent {
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
}

export class Analytics {
  private static sessionId: string | null = null;

  // Get or create session ID
  static getSessionId(): string {
    if (typeof window === 'undefined') return '';
    
    if (!this.sessionId) {
      this.sessionId = sessionStorage.getItem('analytics_session_id');
      if (!this.sessionId) {
        this.sessionId = uuidv4();
        sessionStorage.setItem('analytics_session_id', this.sessionId);
      }
    }
    return this.sessionId;
  }

  // Track an event
  static async track(event: AnalyticsEvent): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
      const sessionId = this.getSessionId();

      const payload = {
        sessionId,
        ...event,
        timestamp: new Date().toISOString(),
      };

      console.log('📊 Tracking analytics event:', {
        type: event.eventType,
        category: event.eventCategory,
        success: event.success,
      });

      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorData: any = null;
        try {
          errorData = await response.json();
        } catch {
          // Ignore JSON parsing errors for non-JSON responses
        }
        console.warn('⚠️ Analytics API unavailable; event skipped.', errorData);
        return;
      }

      const result = await response.json();
      console.log('✅ Analytics event saved:', result);
    } catch (error) {
      console.warn('⚠️ Analytics tracking skipped:', error);
      // Don't throw - analytics should never break the app
    }
  }

  // Track process
  static trackProcess(data: {
    format: string;
    quality?: string;
    fileSize?: number;
    processingTime?: number;
    success?: boolean;
    errorMessage?: string;
  }): Promise<void> {
    return this.track({
      eventType: 'process',
      eventCategory: 'video',
      formatTo: data.format,
      quality: data.quality,
      fileSize: data.fileSize,
      processingTime: data.processingTime,
      success: data.success,
      errorMessage: data.errorMessage,
    });
  }

  // Track conversion
  static trackConversion(data: {
    formatFrom: string;
    formatTo: string;
    fileSize?: number;
    processingTime?: number;
    success?: boolean;
    errorMessage?: string;
  }): Promise<void> {
    return this.track({
      eventType: 'convert',
      eventCategory: 'audio',
      formatFrom: data.formatFrom,
      formatTo: data.formatTo,
      fileSize: data.fileSize,
      processingTime: data.processingTime,
      success: data.success,
      errorMessage: data.errorMessage,
    });
  }

  // Track enhancement
  static trackEnhancement(data: {
    type: 'audio' | 'video';
    preset?: string;
    fileSize?: number;
    processingTime?: number;
    success?: boolean;
    errorMessage?: string;
  }): Promise<void> {
    return this.track({
      eventType: 'enhance',
      eventCategory: data.type,
      eventData: { preset: data.preset },
      fileSize: data.fileSize,
      processingTime: data.processingTime,
      success: data.success,
      errorMessage: data.errorMessage,
    });
  }

  // Track compression
  static trackCompression(data: {
    preset?: string;
    quality?: string;
    originalSize?: number;
    compressedSize?: number;
    processingTime?: number;
    success?: boolean;
    errorMessage?: string;
  }): Promise<void> {
    return this.track({
      eventType: 'compress',
      eventCategory: 'video',
      eventData: { 
        preset: data.preset,
        originalSize: data.originalSize,
        compressedSize: data.compressedSize,
      },
      quality: data.quality,
      fileSize: data.compressedSize,
      processingTime: data.processingTime,
      success: data.success,
      errorMessage: data.errorMessage,
    });
  }

  // Track GIF conversion
  static trackGifConversion(data: {
    duration?: number;
    fps?: number;
    quality?: string;
    fileSize?: number;
    processingTime?: number;
    success?: boolean;
    errorMessage?: string;
  }): Promise<void> {
    return this.track({
      eventType: 'gif_convert',
      eventCategory: 'video',
      eventData: {
        duration: data.duration,
        fps: data.fps,
      },
      quality: data.quality,
      fileSize: data.fileSize,
      processingTime: data.processingTime,
      success: data.success,
      errorMessage: data.errorMessage,
    });
  }

  // Track page view
  static trackPageView(page: string): Promise<void> {
    return this.track({
      eventType: 'page_view',
      eventData: { page },
    });
  }

  // Track music identification
  static trackIdentification(data: {
    fileSize?: number;
    processingTime?: number;
    success?: boolean;
    errorMessage?: string;
    songTitle?: string;
    artist?: string;
  }): Promise<void> {
    return this.track({
      eventType: 'identify',
      eventCategory: 'audio',
      eventData: {
        songTitle: data.songTitle,
        artist: data.artist,
      },
      fileSize: data.fileSize,
      processingTime: data.processingTime,
      success: data.success,
      errorMessage: data.errorMessage,
    });
  }

  // Track metadata edit
  static trackMetadataEdit(data: {
    fileCount?: number;
    fileSize?: number;
    processingTime?: number;
    success?: boolean;
    errorMessage?: string;
  }): Promise<void> {
    return this.track({
      eventType: 'metadata_edit',
      eventCategory: 'audio',
      eventData: { fileCount: data.fileCount },
      fileSize: data.fileSize,
      processingTime: data.processingTime,
      success: data.success,
      errorMessage: data.errorMessage,
    });
  }

}
