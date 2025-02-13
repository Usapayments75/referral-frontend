import api from '../axios';
import { Referral, ContactLead, ReferralStatus, ReferralSubmission } from '../../types';
import { handleApiError } from './errorHandler';
import { formatDateForAPI } from '../../utils/dateUtils';
import { LeadsParams, ZohoLeadResponse } from './types';

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
  } catch (error:any) {
    if (error.response?.status === 500) {
      return [];
    }
    return handleApiError(error);
  }
}

export async function getContactLeads(contactId: string, signal?: AbortSignal): Promise<ContactLead[]> {
  try {
    if (!contactId) {
      console.error('Contact ID is required for fetching contact leads');
      return [];
    }

    const response = await api.get('/leads/by-contact', {
      params: { contact_id: contactId },
      signal,
    });

    if (!response.data?.leads) {
      return [];
    }

    return response.data.leads.map((lead: any) => ({
      contact_id: lead.contact_id || '',
      lead_id: lead.lead_id || '',
      lead_name: lead.lead_name || 'Unnamed Lead',
      company: lead.company || '',
      contact_details: {
        uuid: lead.contact_details?.uuid || '',
        full_name: lead.contact_details?.full_name || '',
        email: lead.contact_details?.email || '',
        partner_id: lead.contact_details?.partner_id || ''
      }
    }));
  } catch (error) {
    console.error('Error fetching contact leads:', error);
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
  } catch (error:any) {
    if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    }
    handleApiError(error);
  }
}