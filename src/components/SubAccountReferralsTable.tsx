import React from 'react';
import { Users } from 'lucide-react';
import { ContactLead } from '../types';
import EmptyState from './EmptyState';

interface SubAccountReferralsTableProps {
  leads: ContactLead[];
  loading?: boolean;
}

export default function SubAccountReferralsTable({ leads, loading }: SubAccountReferralsTableProps) {
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Sub Account Referrals</h3>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Sub Account Referrals</h3>
        </div>
        <EmptyState
          icon={Users}
          title="No sub account referrals"
          description="Your sub accounts haven't submitted any referrals yet."
        />
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Sub Account Referrals</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lead Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th> 
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted by
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={`${lead.contact_id}-${lead.lead_id}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {lead.lead_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.company || 'N/A'}
                </td> 
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.contact_details?.email || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.contact_details?.full_name || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}