export interface User {
  uuid: string;
  full_name: string;
  email: string;
  role: 'admin' | 'user' | 'contact';
  partner_id?: string;
  compensation_link: string | null;
  created_at?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  video_link: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTutorialInput {
  title: string;
  description: string;
  video_link: string;
  is_public: boolean;
}

export interface AdminUser extends User {
  active: boolean;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalTutorials: number;
  latestUsers: AdminUser[];
}

export interface Setting {
  key: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateTutorialInput {
  title?: string;
  description?: string;
  video_link?: string;
  is_public?: boolean;
}

export interface PaginationMetadata {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

export interface Referral {
  id: string;
  Full_Name: string;
  Company: string;
  Lead_Status: ReferralStatus;
  Created_Time: string;
  Email: string | null;
  Phone: string | null;
  Contact_Number?: string | null;
}

export type ReferralStatus = 
  | 'New'
  | 'Sent Pre-Vet'
  | 'Contact Attempt 1'
  | 'Contact Attempt 2'
  | 'Sent Pre-App'
  | 'Pre-App Received'
  | 'Sent Application for Signature'
  | 'Signed Application'
  | 'Convert'
  | 'Lost'
  | null;

export interface Stats {
  totalReferrals: number;
  conversionRate: number;
  activeLeads: number;
  monthlyGrowth: {
    referrals: number;
    conversion: number;
    leads: number;
  };
}

export interface Deal {
  id: string;
  Deal_Name: string;
  Amount: number;
  Stage: string;
  Lead_Source: string;
  Created_Time: string;
}
 
export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
  };
}


export interface ContactLead {
  contact_id: string;
  lead_id: string;
  lead_name: string;
  company: string;
  contact_details: {
    uuid: string;
    full_name: string;
    email: string;
    partner_id: string;
  };
}

export interface ReferralSubmission {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  businessType: string;
  phoneNumber: string;
  title: string;
  description: string;
}