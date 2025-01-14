import React from 'react';
import { Users, Video, TrendingUp } from 'lucide-react';
import StatsCard from '../../components/StatsCard';
import { useAdminStats } from '../../hooks/useAdminStats';
import { formatDateTime } from '../../utils/dateUtils';

export default function AdminDashboard() {
  const { stats, loading, error } = useAdminStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of the referral program performance
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
          <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          change={`${stats?.activeUsers || 0} active users`}
          Icon={Users}
        />
        <StatsCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          change={`${Math.round((stats?.activeUsers || 0) / (stats?.totalUsers || 1) * 100)}% of total users`}
          Icon={TrendingUp}
        />
        <StatsCard
          title="Total Tutorials"
          value={stats?.totalTutorials || 0}
          change="Available for users"
          Icon={Video}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Recent Users */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Users</h2>
            <p className="mt-1 text-sm text-gray-500">
              Latest registered users in the system
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {stats?.recentUsers?.map((user) => (
              <div key={user.uuid} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDateTime(user.created_at)}
                  </p>
                </div>
              </div>
            ))}
            {(!stats?.recentUsers || stats.recentUsers.length === 0) && (
              <div className="px-6 py-4 text-sm text-gray-500 text-center">
                No recent users
              </div>
            )}
          </div>
        </div> 
        </div>
    </div>
  );
}