import { useApi } from './useApi';
import { zohoService } from '../services/zoho';
import { Referral, Stats, Deal, TimePeriod } from '../types';
import { useState } from 'react';

const defaultData = {
  referrals: [] as Referral[],
  deals: [] as Deal[],
  stats: {
    totalReferrals: 0,
    conversionRate: 0,
    activeLeads: 0,
    monthlyGrowth: {
      referrals: 0,
      conversion: 0,
      leads: 0
    }
  } as Stats
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useDashboardData() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');

  const { data: referrals, loading: referralsLoading, error: referralsError, refetch: refetchReferrals } = 
    useApi(signal => zohoService.getLeads({ period: timePeriod }, signal), { 
      defaultValue: [], 
      cacheKey: `dashboard-referrals-${timePeriod}`,
      cacheDuration: CACHE_DURATION,
      retry: false // Disable retries
    });

  const { data: deals, loading: dealsLoading, error: dealsError } = 
    useApi(signal => zohoService.getDeals(signal), { 
      defaultValue: [], 
      cacheKey: 'dashboard-deals',
      cacheDuration: CACHE_DURATION,
      retry: false // Disable retries
    });

  const { data: stats, loading: statsLoading, error: statsError } = 
    useApi(signal => zohoService.getStats(signal), { 
      defaultValue: defaultData.stats,
      cacheKey: 'dashboard-stats',
      cacheDuration: CACHE_DURATION,
      retry: false // Disable retries
    });

  // Only show actual errors, not "no data" responses
  const error = [referralsError, dealsError, statsError]
    .filter(err => err && !err.includes('No deals found') && !err.includes('You didn\'t refer'))
    .join(' ');

  const handleTimePeriodChange = async (newPeriod: TimePeriod) => {
    setTimePeriod(newPeriod);
    await refetchReferrals();
  };

  return {
    referrals,
    deals,
    stats,
    loading: referralsLoading || dealsLoading || statsLoading,
    error: error || null,
    timePeriod,
    onTimePeriodChange: handleTimePeriodChange
  };
}