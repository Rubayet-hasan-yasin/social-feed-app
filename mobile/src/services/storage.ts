/**
 * Secure Storage Service
 * 
 * Wraps Expo SecureStore to provide secure storage for JWT tokens and user data.
 * Handles serialization/deserialization of user objects.
 * 
 * Requirements: 1.1, 1.2, 1.5
 */

import * as SecureStore from 'expo-secure-store';
import { User } from '../types/models';

// Storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * Save JWT token to secure storage
 * @param token - JWT authentication token
 */
export const saveToken = async (token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token:', error);
    throw new Error('Failed to save authentication token');
  }
};

/**
 * Retrieve JWT token from secure storage
 * @returns JWT token or null if not found
 */
export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
};

/**
 * Delete JWT token from secure storage
 */
export const deleteToken = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to delete token:', error);
    throw new Error('Failed to delete authentication token');
  }
};

/**
 * Save user object to secure storage
 * @param user - User object to store
 */
export const saveUser = async (user: User): Promise<void> => {
  try {
    const userJson = JSON.stringify(user);
    await SecureStore.setItemAsync(USER_KEY, userJson);
  } catch (error) {
    console.error('Failed to save user:', error);
    throw new Error('Failed to save user data');
  }
};

/**
 * Retrieve user object from secure storage
 * @returns User object or null if not found
 */
export const getUser = async (): Promise<User | null> => {
  try {
    const userJson = await SecureStore.getItemAsync(USER_KEY);
    if (!userJson) {
      return null;
    }
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
};

/**
 * Delete user object from secure storage
 */
export const deleteUser = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw new Error('Failed to delete user data');
  }
};
