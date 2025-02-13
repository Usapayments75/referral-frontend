import { useApi } from './useApi';
import { zohoService } from '../services/zoho';
import { Referral, Stats, Deal, TimePeriod, ContactLead } from '../types';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { getContactLeads } from '../services/api/leads';
import api from '../services/axios';

const defaultStats: Stats = {
	totalReferrals: 0,
	conversionRate: 0,
	activeLeads: 0,
	monthlyGrowth: {
		referrals: 0,
		conversion: 0,
		leads: 0
	}
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useDashboardData() {
	const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');
	const { user } = useAuthStore();

	// Only fetch regular dashboard data for non-contact users
	const shouldFetchRegularData = user?.role !== 'contact';

	const { data: referrals, loading: referralsLoading, error: referralsError, refetch: refetchReferrals } =
		useApi(
			signal => shouldFetchRegularData ? zohoService.getLeads({ period: timePeriod }, signal) : Promise.resolve([]),
			{
				defaultValue: [],
				cacheKey: `dashboard-referrals-${timePeriod}`,
				cacheDuration: CACHE_DURATION,
				retry: false
			}
		);

	const { data: deals, loading: dealsLoading, error: dealsError } =
		useApi(
			signal => shouldFetchRegularData ? zohoService.getDeals(signal) : Promise.resolve([]),
			{
				defaultValue: [],
				cacheKey: 'dashboard-deals',
				cacheDuration: CACHE_DURATION,
				retry: false
			}
		);

	const { data: stats, loading: statsLoading, error: statsError } =
		useApi(
			signal => shouldFetchRegularData ? zohoService.getStats(signal) : Promise.resolve(defaultStats),
			{
				defaultValue: defaultStats,
				cacheKey: 'dashboard-stats',
				cacheDuration: CACHE_DURATION,
				retry: false
			}
		);

	// Contact user specific data
	const { data: contactLeads, loading: contactLeadsLoading, error: contactLeadsError } =
		useApi(
			signal => user?.role === 'contact' && user.partner_id
				? getContactLeads(user.partner_id, signal)
				: Promise.resolve([]),
			{
				defaultValue: [],
				cacheKey: user?.partner_id ? `contact-leads-${user.partner_id}` : null,
				cacheDuration: CACHE_DURATION,
				retry: false
			}
		);

	// Sub account leads data
	const { data: subAccountLeads, loading: subAccountLeadsLoading, error: subAccountLeadsError } =
		useApi(
			async signal => {
				if (!user?.uuid || user.role !== 'user') return [];

				// First get the user's contacts
				const contactsResponse = await api.get(`/users/user/${user.uuid}/contacts`, { signal });
				const contacts = contactsResponse.data.data.contacts || [];

				// Then get leads for each contact
				if (contacts.length === 0) return [];

				const contactIds = contacts.map(contact => contact.partner_id).join(',');
				const leadsResponse = await api.get(`/leads/leads/by-contacts?contact_ids=${contactIds}`, { signal });
				return leadsResponse.data.leads || [];
			},
			{
				defaultValue: [],
				cacheKey: user?.uuid ? `sub-account-leads-${user.uuid}` : null,
				cacheDuration: CACHE_DURATION,
				retry: false
			}
		);

	// Only show actual errors, not "no data" responses
	const error = [referralsError, dealsError, statsError, contactLeadsError, subAccountLeadsError]
		.filter(err => err && !err.includes('No deals found') && !err.includes('You didn\'t refer'))
		.join(' ');

	const handleTimePeriodChange = async (newPeriod: TimePeriod) => {
		setTimePeriod(newPeriod);
		await refetchReferrals();
	};

	const loading = user?.role === 'contact'
		? contactLeadsLoading
		: (referralsLoading || dealsLoading || statsLoading || subAccountLeadsLoading);

	return {
		referrals,
		deals,
		stats,
		contactLeads,
		subAccountLeads,
		loading,
		error: error || null,
		timePeriod,
		onTimePeriodChange: handleTimePeriodChange
	};
}