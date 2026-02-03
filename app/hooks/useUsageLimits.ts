import { useEffect, useCallback } from 'react';
import { ActionType } from '@/app/lib/usage-limits';
import { useUsageLimitsContext } from '@/app/contexts/UsageLimitsContext';

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

export function useUsageLimits(actionType: ActionType) {
  const { getStatus, checkUsage: contextCheckUsage, incrementUsage: contextIncrementUsage, refresh: contextRefresh } = useUsageLimitsContext();

  const status = getStatus(actionType);

  // Check current usage
  const checkUsage = useCallback(async () => {
    return contextCheckUsage(actionType);
  }, [actionType, contextCheckUsage]);

  // Increment usage
  const incrementUsage = useCallback(async () => {
    return contextIncrementUsage(actionType);
  }, [actionType, contextIncrementUsage]);

  // Refresh
  const refresh = useCallback(async () => {
    return contextRefresh(actionType);
  }, [actionType, contextRefresh]);

  // Check usage on mount
  useEffect(() => {
    checkUsage();
  }, [checkUsage]);

  return {
    ...status,
    checkUsage,
    incrementUsage,
    refresh,
  };
}

