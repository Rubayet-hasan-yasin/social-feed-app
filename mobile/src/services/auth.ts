import { AuthResponse, LoginRequest, RegisterRequest } from '../types/api';
import apiClient from './api';

/**
 * Authentication Service
 * 
 * This module provides API calls for user authentication:
 * - login: Authenticate user with email and password
 * - register: Create new user account
 * 
 * Requirements: 1.1, 1.2
 */

/**
 * Login user with email and password
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise resolving to AuthResponse with token and user data
 * @throws Error if authentication fails
 * 
 * Validates: Requirements 1.1, 1.2
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const requestData: LoginRequest = {
    email,
    password,
  };

  const response = await apiClient.post<AuthResponse>('/auth/login', requestData);
  return response.data;
};

/**
 * Register new user account
 * 
 * @param username - Desired username (min 3 characters)
 * @param email - User's email address
 * @param password - User's password (min 6 characters)
 * @returns Promise resolving to AuthResponse with token and user data
 * @throws Error if registration fails
 * 
 * Validates: Requirements 1.1, 1.2
 */
export const register = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const requestData: RegisterRequest = {
    username,
    email,
    password,
  };

  const response = await apiClient.post<AuthResponse>('/auth/register', requestData);
  return response.data;
};
