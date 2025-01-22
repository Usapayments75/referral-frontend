import api from '../axios';
import { Referral, ReferralStatus } from '../../types';
import { ZohoLeadResponse, ReferralSubmission, ZohoResponse } from './types';
import { handleApiError } from './errorHandler';

export async function getLeads(params?: LeadsParams, signal?: AbortSignal): Promise<Referral[]> {
  try {
    // Format dates for API
    const queryParams: Record<string, string> = {};
    
    if (params?.period) {
      queryParams.period = params.period;
    } else if (params?.startDate && params?.endDate) {
      queryParams.start_date = formatDateForAPI(params.startDate);
      queryParams.end_date = formatDateForAPI(params.endDate);
    }

    const response = await api.get<ZohoLeadResponse>('/leads/by-lead-source', {
      params: queryParams,
      signal,
    });

    return (response.data?.leads || []).map((lead) => ({
      id: lead.id,
      Full_Name: lead.Full_Name || 'Unknown',
      Company: lead.Company || 'N/A',
      Lead_Status: lead.Lead_Status as ReferralStatus,
      Created_Time: lead.Created_Time,
      Email: lead.Email,
      Phone: lead.Phone,
      Contact_Number: lead.Contact_Number
    }));
  } catch (error) {
    if (error.response?.status === 500) {
      return [];
    }
    return handleApiError(error);
  }
}

export async function submitReferral(referral: ReferralSubmission): Promise<void> {
  try {
    const response = await api.post('/leads/referral', {
      Last_Name: referral.lastName,
      First_Name: referral.firstName,
      Email: referral.email,
      Company: referral.company,
      Business_Type: referral.businessType,
      Title: referral.title,
      Description: referral.description,
    });

    const leadData = response.data?.leadData?.data?.[0];
    const noteData = response.data?.noteData?.data?.[0];

    if (leadData?.code === 'DUPLICATE_DATA') {
      throw new Error(
        `A referral with this email already exists (Lead ID: ${leadData.details.id})`
      );
    }

    if (leadData?.code !== 'SUCCESS') {
      throw new Error(
        leadData?.message || 'Failed to create lead. Please try again later.'
      );
    }

    if (noteData?.code !== 'SUCCESS') {
      throw new Error(
        noteData?.message || 'Failed to create note. Please try again later.'
      );
    }

    console.log('Referral submitted successfully:', {
      leadId: leadData.details.id,
      noteId: noteData.details.id,
    });
  } catch (error) {
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }
    handleApiError(error);
  }
}