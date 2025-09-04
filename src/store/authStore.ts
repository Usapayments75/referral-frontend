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

  // Impersonation state
  isImpersonating: boolean;
  impersonatedUser: User | null;
  originalAdminUser: User | null;
  impersonationStartTime: Date | null;
  impersonationSessionId: string | null;

  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (fullName: string, emailAddress: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  initialize: () => void;
  refreshProfile: () => Promise<void>;
  
  // Impersonation methods
  startImpersonation: (targetUserUuid: string) => Promise<{ success: boolean; message: string }>;
  stopImpersonation: () => Promise<{ success: boolean; message: string }>;
  getImpersonationStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      isInitialized: false,

      // Impersonation state
      isImpersonating: false,
      impersonatedUser: null,
      originalAdminUser: null,
      impersonationStartTime: null,
      impersonationSessionId: null,
      initialize: () => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const impersonationData = localStorage.getItem('impersonation');
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            let impersonationState = {
              isImpersonating: false,
              impersonatedUser: null,
              originalAdminUser: null,
              impersonationStartTime: null,
              impersonationSessionId: null
            };

            // Check for impersonation state
            if (impersonationData) {
              try {
                const parsedImpersonation = JSON.parse(impersonationData);
                impersonationState = {
                  isImpersonating: parsedImpersonation.isImpersonating,
                  impersonatedUser: user, // Current user is the impersonated user
                  originalAdminUser: parsedImpersonation.originalAdminUser,
                  impersonationStartTime: new Date(parsedImpersonation.impersonationStartTime),
                  impersonationSessionId: parsedImpersonation.impersonationSessionId
                };
              } catch {
                localStorage.removeItem('impersonation');
              }
            }

            set({ 
              user, 
              isAuthenticated: true, 
              token, 
              isInitialized: true,
              ...impersonationState
            });
          } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('impersonation');
            set({ 
              user: null, 
              isAuthenticated: false, 
              token: null, 
              isInitialized: true,
              isImpersonating: false,
              impersonatedUser: null,
              originalAdminUser: null,
              impersonationStartTime: null,
              impersonationSessionId: null
            });
          }
        } else {
          set({ 
            isInitialized: true,
            isImpersonating: false,
            impersonatedUser: null,
            originalAdminUser: null,
            impersonationStartTime: null,
            impersonationSessionId: null
          });
        }
      },
      refreshProfile: async () => {
        try {
          const user = await userProfileService.getProfile();
          localStorage.setItem('user', JSON.stringify(user));
          set({ user });
        } catch (error) {
          console.error('Failed to refresh user profile:', error);
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
        localStorage.removeItem('impersonation');
        set({ 
          user: null, 
          isAuthenticated: false, 
          token: null,
          isImpersonating: false,
          impersonatedUser: null,
          originalAdminUser: null,
          impersonationStartTime: null,
          impersonationSessionId: null
        });
      },

      // Impersonation methods
      startImpersonation: async (targetUserUuid: string) => {
        try {
          const response = await api.post(`/admin/impersonate/${targetUserUuid}`);
          
          if (response.data.status === 'success') {
            const { 
              impersonationToken, 
              targetUser, 
              adminUser, 
              sessionId,
              expiresAt 
            } = response.data.data;

            // Store original admin data
            const currentState = get();
            
            // Update localStorage with impersonation token
            localStorage.setItem('token', impersonationToken);
            localStorage.setItem('user', JSON.stringify(targetUser));
            localStorage.setItem('impersonation', JSON.stringify({
              isImpersonating: true,
              originalAdminUser: currentState.user,
              impersonationSessionId: sessionId,
              impersonationStartTime: new Date().toISOString(),
              expiresAt
            }));

            set({
              token: impersonationToken,
              user: targetUser,
              isImpersonating: true,
              impersonatedUser: targetUser,
              originalAdminUser: currentState.user,
              impersonationStartTime: new Date(),
              impersonationSessionId: sessionId
            });

            return { success: true, message: `Now impersonating ${targetUser.full_name}` };
          }
          
          return { success: false, message: response.data.message || 'Failed to start impersonation' };
        } catch (error: any) {
          console.error('Impersonation error:', error);
          return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to start impersonation' 
          };
        }
      },

      stopImpersonation: async () => {
        try {
          const response = await api.post('/admin/stop-impersonation');
          
          if (response.data.status === 'success') {
            const { originalToken } = response.data.data;
            const currentState = get();

            // Restore original admin token and user
            localStorage.setItem('token', originalToken);
            localStorage.setItem('user', JSON.stringify(currentState.originalAdminUser));
            localStorage.removeItem('impersonation');

            set({
              token: originalToken,
              user: currentState.originalAdminUser,
              isImpersonating: false,
              impersonatedUser: null,
              originalAdminUser: null,
              impersonationStartTime: null,
              impersonationSessionId: null
            });

            return { success: true, message: 'Impersonation ended successfully' };
          }
          
          return { success: false, message: response.data.message || 'Failed to stop impersonation' };
        } catch (error: any) {
          console.error('Stop impersonation error:', error);
          return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to stop impersonation' 
          };
        }
      },

      getImpersonationStatus: async () => {
        try {
          const response = await api.get('/admin/impersonation-status');
          
          if (response.data.status === 'success' && response.data.data.isImpersonating) {
            const { adminUser, targetUser, sessionId, startTime } = response.data.data;
            
            set({
              isImpersonating: true,
              impersonatedUser: targetUser,
              originalAdminUser: adminUser,
              impersonationStartTime: new Date(startTime),
              impersonationSessionId: sessionId
            });
          } else {
            // Check localStorage for impersonation state
            const impersonationData = localStorage.getItem('impersonation');
            if (impersonationData) {
              try {
                const parsedData = JSON.parse(impersonationData);
                set({
                  isImpersonating: parsedData.isImpersonating,
                  originalAdminUser: parsedData.originalAdminUser,
                  impersonationStartTime: new Date(parsedData.impersonationStartTime),
                  impersonationSessionId: parsedData.impersonationSessionId
                });
              } catch {
                localStorage.removeItem('impersonation');
              }
            }
          }
        } catch (error) {
          console.error('Error getting impersonation status:', error);
          // Clear impersonation state on error
          set({
            isImpersonating: false,
            impersonatedUser: null,
            originalAdminUser: null,
            impersonationStartTime: null,
            impersonationSessionId: null
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        isImpersonating: state.isImpersonating,
        impersonatedUser: state.impersonatedUser,
        originalAdminUser: state.originalAdminUser,
        impersonationStartTime: state.impersonationStartTime,
        impersonationSessionId: state.impersonationSessionId
      })
    }
  )
);