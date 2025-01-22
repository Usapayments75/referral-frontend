import { Stats, ReferralStatus } from '../../types';
import { getLeads } from './leads';
import { getDeals } from './deals';
import { ApiError } from './errorHandler';
import { getDateRanges, isInDateRange } from '../../utils/dateUtils';

export async function getStats(signal?: AbortSignal): Promise<Stats> {
  try {
    const [leads, deals] = await Promise.all([
      getLeads(signal),
      getDeals(signal)
    ]);

    const { now, lastMonth, previousMonth } = getDateRanges();

    // Current month leads
    const currentMonthLeads = leads.filter(lead =>
      isInDateRange(lead.Created_Time, lastMonth, now)
    );

    // Last month leads
    const lastMonthLeads = leads.filter(lead =>
      isInDateRange(lead.Created_Time, previousMonth, lastMonth)
    );

    // Calculate conversion rates
    const isConverted = (status: ReferralStatus) => 
      ['Convert', 'Signed Application'].includes(status || '');
    const isActive = (status: ReferralStatus) => 
      !['Convert', 'Lost'].includes(status || '');

    // Current period stats
    const totalReferrals = currentMonthLeads.length;
    const convertedLeads = currentMonthLeads.filter(lead => isConverted(lead.Lead_Status)).length;
    const activeLeads = currentMonthLeads.filter(lead => isActive(lead.Lead_Status)).length;
    const conversionRate = totalReferrals > 0 ? (convertedLeads / totalReferrals) * 100 : 0;

    // Last period stats
    const lastMonthTotal = lastMonthLeads.length;
    const lastMonthConverted = lastMonthLeads.filter(lead => isConverted(lead.Lead_Status)).length;
    const lastMonthActive = lastMonthLeads.filter(lead => isActive(lead.Lead_Status)).length;
    const lastMonthConversion = lastMonthTotal > 0 ? (lastMonthConverted / lastMonthTotal) * 100 : 0;

    // Calculate growth
    const referralGrowth = lastMonthTotal > 0
      ? ((totalReferrals - lastMonthTotal) / lastMonthTotal) * 100
      : totalReferrals > 0 ? 100 : 0;

    const conversionGrowth = lastMonthConversion > 0
      ? conversionRate - lastMonthConversion
      : conversionRate;

    const leadsGrowth = lastMonthActive > 0
      ? activeLeads - lastMonthActive
      : activeLeads;

    return {
      totalReferrals,
      conversionRate: Math.round(conversionRate * 10) / 10,
      activeLeads,
      monthlyGrowth: {
        referrals: Math.round(referralGrowth * 10) / 10,
        conversion: Math.round(conversionGrowth * 10) / 10,
        leads: leadsGrowth
      }
    };
  } catch (error) {
    if (error.response?.status === 500) {
      return {
        totalReferrals: 0,
        conversionRate: 0,
        activeLeads: 0,
        monthlyGrowth: {
          referrals: 0,
          conversion: 0,
          leads: 0
        }
      };
    }
    if (error instanceof ApiError && error.message === 'Request cancelled') {
      throw error;
    }
    // Return default stats object for other errors
    return {
      totalReferrals: 0,
      conversionRate: 0,
      activeLeads: 0,
      monthlyGrowth: {
        referrals: 0,
        conversion: 0,
        leads: 0
      }
    };
  }
}