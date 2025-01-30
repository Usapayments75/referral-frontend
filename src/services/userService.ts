import api from './axios';
import { User, PaginatedResponse } from '../types';

interface UserResponse {
	status: string;
	message: string;
	data: {
		users?: User[];
		user?: User;
		pagination?: {
			total: number;
			totalPages: number;
			currentPage: number;
			limit: number;
		};
	};
}

export const userService = {
	async getAllUsers(page: number = 1, limit: number = 10, email: string = ''): Promise<PaginatedResponse<User>> {
		try {
			const queryParams = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString()
			});

			if (email) {
				queryParams.append('email', email);
			}

			const response = await api.get<UserResponse>(`/admin/users?${queryParams.toString()}`);
			if (response.data.status !== 'success' || !response.data.data.users || !response.data.data.pagination) {
				throw new Error(response.data.message || 'Failed to fetch users');
			}
			return {
				data: response.data.data.users,
				pagination: response.data.data.pagination
			};
		} catch (error) {
			throw new Error('Failed to fetch users');
		}
	},

	async updateCompensationLink(uuid: string, compensationLink: string): Promise<User> {
		try {
			const response = await api.put<UserResponse>(`/admin/users/${uuid}/compensation-link`, {
				compensation_link: compensationLink
			});

			if (response.data.status !== 'success') {
				throw new Error(response.data.message || 'Failed to update compensation link');
			}

			return response.data.data.user || {
				uuid,
				full_name: '',
				email: '',
				role: 'user',
				compensation_link: compensationLink,
				created_at: new Date().toISOString()
			};
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error('Failed to update compensation link');
		}
	},

	async updatePassword(email: string, newPassword: string, confirmNewPassword: string): Promise<void> {
		try {
			const response = await api.put('/users/admin/update-password', {
				email,
				new_password: newPassword,
				confirm_new_password: confirmNewPassword
			});

			if (response.data.status !== 'success') {
				throw new Error(response.data.message || 'Failed to update password');
			}
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error('Failed to update password');
		}
	},

	async updatePixelId(email: string, pixelId: string): Promise<void> {
		try {
			const response = await api.put('/users/admin/update-pixel-id', {
				email,
				facebook_pixel_id: pixelId
			});

			if (response.data.status !== 'success') {
				throw new Error(response.data.message || 'Failed to update Facebook Pixel ID');
			}
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error('Failed to update Facebook Pixel ID');
		}
	},

	async triggerPasswordReset(identifier: string): Promise<void> {
		try {
			const response = await api.post('/users/admin/trigger-reset-password', {
				identifier
			});

			if (response.data.status !== 'success') {
				throw new Error(response.data.message || 'Failed to send password reset email');
			}
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error('Failed to send password reset email');
		}
	}
};