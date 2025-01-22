import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
    baseURL: 'https://api-partnerportal.usapayments.com/api/v1',
    // baseURL: 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000 // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            const { status } = error.response;

            switch (status) {
                case 401: {
                    // Unauthorized - clear auth state and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');

                    // Only redirect if we're not already on the login or register page
                    const currentPath = window.location.pathname;
                    if (!['/login', '/register'].includes(currentPath)) {
                        window.location.href = '/login';
                    }
                    break;
                }
                case 403: {
                    // Forbidden - user doesn't have necessary permissions
                    console.error('Access forbidden:', error.response.data);
                    break;
                }
                case 404: {
                    // Not Found
                    console.error('Resource not found:', error.response.data);
                    break;
                }
                case 422: {
                    // Validation error
                    console.error('Validation error:', error.response.data);
                    break;
                }
                case 429: {
                    // Too Many Requests
                    console.error('Rate limit exceeded:', error.response.data);
                    break;
                }
                case 500: {
                    // Server error
                    console.error('Server error:', error.response.data);
                    break;
                }
                default: {
                    console.error('API error:', error.response.data);
                    break;
                }
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error('No response received:', error.request);
        } else {
            // Error in request configuration
            console.error('Request configuration error:', error.message);
        }

        // Propagate the error for the calling code to handle
        return Promise.reject(error);
    }
);

export default api;