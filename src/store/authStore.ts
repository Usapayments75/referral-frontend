import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from '../types';
import api from '../services/axios';
import { userProfileService } from '../services/userProfileService';

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	token: string | null;
	isInitialized: boolean;
	login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
	register: (fullName: string, emailAddress: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
	logout: () => void;
	initialize: () => void;
	refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			isAuthenticated: false,
			token: null,
			isInitialized: false,
			initialize: () => {
				const token = localStorage.getItem('token');
				const userData = localStorage.getItem('user');
				if (token && userData) {
					try {
						const user = JSON.parse(userData);
						set({ user, isAuthenticated: true, token, isInitialized: true });
						// Refresh profile on initialization
						get().refreshProfile().catch(console.error);
					} catch {
						localStorage.removeItem('token');
						localStorage.removeItem('user');
						set({ user: null, isAuthenticated: false, token: null, isInitialized: true });
					}
				} else {
					set({ isInitialized: true });
				}
			},
			refreshProfile: async () => {
				const { token } = get();
				if (!token) return;

				try {
					const user = await userProfileService.getProfile();
					localStorage.setItem('user', JSON.stringify(user));
					set({ user });
				} catch (error) {
					console.error('Failed to refresh user profile:', error);
					// If profile refresh fails due to auth error, clear the auth state
					if (error.response?.status === 401) {
						localStorage.removeItem('token');
						localStorage.removeItem('user');
						set({ user: null, isAuthenticated: false, token: null });
					}
				}
			},
			login: async (email: string, password: string) => {
				try {
					const response = await api.post<AuthResponse>('/users/login', {
						email,
						password
					});

					if (response.data.status === 'success') {
						const { user, token } = response.data.data;

						localStorage.setItem('token', token);
						localStorage.setItem('user', JSON.stringify(user));

						set({
							token,
							user,
							isAuthenticated: true
						});
						return { success: true, message: 'Login successful' };
					}

					return { success: false, message: response.data.message };
				} catch (error) {
					return { success: false, message: error instanceof Error ? error.message : 'An error occurred during login' };
				}
			},
			register: async (fullName: string, emailAddress: string, password: string, confirmPassword: string) => {
				try {
					const response = await api.post<AuthResponse>('/users/register', {
						full_name: fullName,
						email: emailAddress,
						password,
						confirm_password: confirmPassword
					});

					if (response.data.status === 'success') {
						const { user, token } = response.data.data;

						localStorage.setItem('token', token);
						localStorage.setItem('user', JSON.stringify(user));

						set({
							token,
							user,
							isAuthenticated: true
						});
						return { success: true, message: 'Registration successful' };
					}

					return { success: false, message: response.data.message };
				} catch (error) {
					return { success: false, message: error instanceof Error ? error.message : 'An error occurred during registration' };
				}
			},
			logout: () => {
				localStorage.removeItem('token');
				localStorage.removeItem('user');
				set({ user: null, isAuthenticated: false, token: null });
			},
		}),
		{
			name: 'auth-storage',
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
				token: state.token
			})
		}
	)
);