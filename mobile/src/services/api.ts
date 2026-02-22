import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

/**
 * API Client Configuration
 * 
 * This module configures the axios HTTP client with:
 * - Base URL from environment variables
 * - Request interceptor for JWT token attachment
 * - Response interceptor for 401 handling and error transformation
 * 
 * Requirements: 1.6, 14.2
 */

// Get base URL from environment variable or use default
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Create axios instance with base configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * 
 * Attaches JWT token from SecureStore to Authorization header
 * Format: Bearer {token}
 * 
 * Validates: Property 4 - API Request Authorization
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Retrieve token from SecureStore
      const token = await SecureStore.getItemAsync('auth_token');
      
      if (token) {
        // Attach token to Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Log error in development, but don't block the request
      if (__DEV__) {
        console.error('Failed to retrieve auth token:', error);
      }
    }
    
    return config;
  },
  (error: AxiosError) => {
    // Handle request setup errors
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * 
 * Handles:
 * - 401 Unauthorized errors (triggers logout)
 * - Error transformation to consistent format
 * - Development logging
 * 
 * Validates: Property 34 - API Error Display
 */
apiClient.interceptors.response.use(
  // Success response - pass through
  (response) => response,
  
  // Error response - transform and handle
  async (error: AxiosError) => {
    // Handle 401 Unauthorized - user session expired or invalid token
    if (error.response?.status === 401) {
      // Clear stored authentication data
      try {
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('auth_user');
      } catch (clearError) {
        if (__DEV__) {
          console.error('Failed to clear auth data on 401:', clearError);
        }
      }
      
      // Note: Navigation to login screen should be handled by the auth store
      // The auth store will detect the cleared token and update state accordingly
    }
    
    // Transform error to consistent format
    const errorMessage = 
      error.response?.data?.message || // API error message
      error.message || // Network error message
      'Something went wrong'; // Fallback message
    
    // Log errors in development mode
    if (__DEV__) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: errorMessage,
        data: error.response?.data,
      });
    }
    
    // Create user-friendly error object
    const transformedError = new Error(errorMessage);
    (transformedError as any).statusCode = error.response?.status;
    (transformedError as any).originalError = error;
    
    return Promise.reject(transformedError);
  }
);

export default apiClient;
