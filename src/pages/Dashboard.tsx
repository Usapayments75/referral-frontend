import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, Target } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import ReferralTable from '../components/ReferralTable';
import DealsTable from '../components/DealsTable';
import ContactDealsTable from '../components/ContactDealsTable';
import AsyncBoundary from '../components/AsyncBoundary';
import { useDashboardData } from '../hooks/useDashboardData';
import { useAuthStore } from '../store/authStore';
import { getContactLeads } from '../services/api/leads';
import { ContactLead } from '../types';

export default function Dashboard() {
  const { 
    referrals, 
    deals, 
    stats, 
    loading, 
    error,
    timePeriod,
    onTimePeriodChange 
  } = useDashboardData();
  
  const { user } = useAuthStore();
  const [contactLeads, setContactLeads] = useState<ContactLead[]>([]);
  const [contactLeadsLoading, setContactLeadsLoading] = useState(false);
  const [contactLeadsError, setContactLeadsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactLeads = async () => {
      if (user?.role === 'contact' && user.partner_id) {
        setContactLeadsLoading(true);
        try {
          const leads = await getContactLeads(user.partner_id);
          setContactLeads(leads);
          setContactLeadsError(null);
        } catch (err) {
          setContactLeadsError(err instanceof Error ? err.message : 'Failed to fetch contact leads');
        } finally {
          setContactLeadsLoading(false);
        }
      }
    };

    fetchContactLeads();
  }, [user]);

  const formatChange = (value: number, isPercentage: boolean = false) => {
    if (value === 0) return 'No change vs last month';
    const prefix = value > 0 ? '+' : '';
    return `${prefix}${value}${isPercentage ? '%' : ''} vs last month`;
  };

  if (user?.role === 'contact') {
    return (
      <AsyncBoundary loading={contactLeadsLoading} error={contactLeadsError}>
        <div className="space-y-6">
          <ContactDealsTable leads={contactLeads} />
        </div>
      </AsyncBoundary>
    );
  }

  return (
    <AsyncBoundary loading={loading} error={error}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Referrals"
            value={stats.totalReferrals}
            change={formatChange(stats.monthlyGrowth.referrals, true)}
            Icon={Users}
          />
          <StatsCard
            title="Conversion Rate"
            value={`${stats.conversionRate.toFixed(1)}%`}
            change={formatChange(stats.monthlyGrowth.conversion, true)}
            Icon={TrendingUp}
          />
          <StatsCard
            title="Active Leads"
            value={stats.activeLeads}
            change={formatChange(stats.monthlyGrowth.leads)}
            Icon={Target}
          />
        </div>
        <ReferralTable 
          referrals={referrals}
          timePeriod={timePeriod}
          onTimePeriodChange={onTimePeriodChange}
        />
        <DealsTable deals={deals} />
      </div>
    </AsyncBoundary>
  );
}