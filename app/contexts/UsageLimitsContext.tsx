'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ActionType } from '@/app/lib/usage-limits';

export interface UsageStatus {
  tier: string;
  limit: number;
  used: number;
  remaining: number;
  limitReached: boolean;
  unlimited: boolean;
  loading: boolean;
  error: string | null;
}

interface UsageLimitsContextType {
  getStatus: (actionType: ActionType) => UsageStatus;
  checkUsage: (actionType: ActionType) => Promise<any>;
  incrementUsage: (actionType: ActionType) => Promise<{ success: boolean; error?: string; data?: any }>;
  refresh: (actionType: ActionType) => Promise<any>;
}

const UsageLimitsContext = createContext<UsageLimitsContextType | undefined>(undefined);

const defaultStatus: UsageStatus = {
  tier: 'free',
  limit: 0,
  used: 0,
  remaining: 0,
  limitReached: false,
  unlimited: false,
  loading: true,
  error: null,
};

export function UsageLimitsProvider({ children }: { children: React.ReactNode }) {
  const [statusMap, setStatusMap] = useState<Record<string, UsageStatus>>({});

  const getStatus = useCallback((actionType: ActionType): UsageStatus => {
    return statusMap[actionType] || defaultStatus;
  }, [statusMap]);

  const checkUsage = useCallback(async (actionType: ActionType) => {
    try {
      setStatusMap(prev => ({
        ...prev,
        [actionType]: { ...(prev[actionType] || defaultStatus), loading: true, error: null }
      }));

      const response = await fetch('/api/usage/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actionType }),
      });

      if (!response.ok) {
        throw new Error('Failed to check usage');
      }

      const data = await response.json();

      setStatusMap(prev => ({
        ...prev,
        [actionType]: {
          tier: data.tier,
          limit: data.limit,
          used: data.used,
          remaining: data.remaining,
          limitReached: data.limitReached,
          unlimited: data.unlimited,
          loading: false,
          error: null,
        }
      }));

      return data;
    } catch (error: any) {
      setStatusMap(prev => ({
        ...prev,
        [actionType]: {
          ...(prev[actionType] || defaultStatus),
          loading: false,
          error: error.message,
        }
      }));
      return null;
    }
  }, []);

  const incrementUsage = useCallback(async (actionType: ActionType) => {
    try {
      const response = await fetch('/api/usage/increment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actionType }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setStatusMap(prev => ({
            ...prev,
            [actionType]: {
              ...(prev[actionType] || defaultStatus),
              limitReached: true,
              error: 'Usage limit reached for today',
            }
          }));
          return { success: false, error: 'Usage limit reached' };
        }
        throw new Error(data.error || 'Failed to increment usage');
      }

      setStatusMap(prev => ({
        ...prev,
        [actionType]: {
          tier: data.tier,
          limit: data.limit,
          used: data.used,
          remaining: data.remaining,
          limitReached: data.limitReached,
          unlimited: data.unlimited,
          loading: false,
          error: null,
        }
      }));

      return { success: true, data };
    } catch (error: any) {
      setStatusMap(prev => ({
        ...prev,
        [actionType]: {
          ...(prev[actionType] || defaultStatus),
          error: error.message,
        }
      }));
      return { success: false, error: error.message };
    }
  }, []);

  const refresh = useCallback((actionType: ActionType) => {
    return checkUsage(actionType);
  }, [checkUsage]);

  return (
    <UsageLimitsContext.Provider value={{ getStatus, checkUsage, incrementUsage, refresh }}>
      {children}
    </UsageLimitsContext.Provider>
  );
}

export function useUsageLimitsContext() {
  const context = useContext(UsageLimitsContext);
  if (context === undefined) {
    throw new Error('useUsageLimitsContext must be used within a UsageLimitsProvider');
  }
  return context;
}

