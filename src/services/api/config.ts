import axios from 'axios';
import { RetryConfig, shouldRetry, getRetryDelay } from './retryConfig';

// export const API_BASE_URL = 'https://api-partnerportal.usapayments.com/api/v1';
// export const API_BASE_URL = 'http://localhost:5000/api/v1';
export const API_BASE_URL = 'https://stage-api-partnerportal.usapayments.com/api/v1';
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000, // Increased timeout to 30 seconds
  maxRetries: 3,
  retryDelay: 1000
}); 

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors and retries
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config as RetryConfig;
    
    // Initialize retry count
    config.retryCount = config.retryCount || 0;

    if (shouldRetry(error, config)) {
      config.retryCount += 1;
      
      const delay = getRetryDelay(config.retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return api(config);
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!['/login', '/register'].includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;