import { Users, TrendingUp, Target } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import ReferralTable from '../components/ReferralTable';
import DealsTable from '../components/DealsTable';
import ContactDealsTable from '../components/ContactDealsTable';
import AsyncBoundary from '../components/AsyncBoundary';
import { useDashboardData } from '../hooks/useDashboardData';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
	const {
		referrals,
		deals,
		stats,
		contactLeads,
		loading,
		error,
		timePeriod,
		onTimePeriodChange
	} = useDashboardData();
	const { user } = useAuthStore();

	const formatChange = (value: number, isPercentage: boolean = false) => {
		if (value === 0) return 'No change vs last month';
		const prefix = value > 0 ? '+' : '';
		return `${prefix}${value}${isPercentage ? '%' : ''} vs last month`;
	};

	if (user?.role === 'contact') {
		return (
			<AsyncBoundary loading={loading} error={error}>
				<div className="space-y-6">
					<div className="sm:flex sm:items-center">
						<div className="sm:flex-auto">
							<h1 className="text-2xl font-semibold text-gray-900">My Deals</h1>
							<p className="mt-2 text-sm text-gray-700">
								View and manage your assigned deals
							</p>
						</div>
					</div>
					<ContactDealsTable leads={contactLeads || []} loading={loading} />
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