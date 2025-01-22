import api from '../axios';
import { Deal } from '../../types';
import { handleApiError } from './errorHandler';

export async function getDeals(signal?: AbortSignal): Promise<Deal[]> {
  try {
    const response = await api.get('/leads/deals/by-referrer', { signal });
    return (response.data?.deals || []).map((deal: any) => ({
      id: deal.id,
      Deal_Name: deal.Deal_Name || 'Unnamed Deal',
      Amount: parseFloat(deal.Amount) || 0,
      Stage: deal.Stage || 'Unknown',
      Lead_Source: deal.Lead_Source,
      Created_Time: deal.Created_Time
    }));
  } catch (error) {
    if (error.response?.status === 500) {
      return [];
    }
    return handleApiError(error);
  }
}