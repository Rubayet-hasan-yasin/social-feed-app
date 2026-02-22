/**
 * Property-Based Tests for API Client
 * 
 * Tests the axios API client configuration to ensure JWT tokens are correctly
 * attached to all API requests via the Authorization header.
 */

import * as SecureStore from 'expo-secure-store';
import * as fc from 'fast-check';

// Mock Expo SecureStore before importing apiClient
jest.mock('expo-secure-store');

// Import apiClient after mocking
import apiClient from '../api';

describe('API Client', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Unit Tests', () => {
    it('should have correct base configuration', () => {
      expect(apiClient.defaults.baseURL).toBeDefined();
      expect(apiClient.defaults.timeout).toBe(10000);
      expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
    });

    it('should attach token to Authorization header when token exists', async () => {
      const token = 'test-jwt-token';
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);

      // Create a mock request config
      const config: any = {
        url: '/test',
        method: 'GET',
        headers: {},
      };

      // Get the request interceptor
      const requestInterceptor = (apiClient.interceptors.request as any).handlers[0];
      const modifiedConfig = await requestInterceptor.fulfilled(config);

      expect(modifiedConfig.headers.Authorization).toBe(`Bearer ${token}`);
    });

    it('should not attach Authorization header when token does not exist', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const config: any = {
        url: '/test',
        method: 'GET',
        headers: {},
      };

      const requestInterceptor = (apiClient.interceptors.request as any).handlers[0];
      const modifiedConfig = await requestInterceptor.fulfilled(config);

      expect(modifiedConfig.headers.Authorization).toBeUndefined();
    });

    it('should handle SecureStore errors gracefully', async () => {
      (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Storage error'));

      const config: any = {
        url: '/test',
        method: 'GET',
        headers: {},
      };

      const requestInterceptor = (apiClient.interceptors.request as any).handlers[0];
      const modifiedConfig = await requestInterceptor.fulfilled(config);

      // Request should proceed without Authorization header
      expect(modifiedConfig.headers.Authorization).toBeUndefined();
    });
  });

  describe('Property-Based Tests', () => {
    // Feature: mobile-app-completion, Property 4: API Request Authorization
    // For any API request made with a stored token, the request should include 
    // an Authorization header with the format "Bearer {token}".
    describe('Property 4: API Request Authorization', () => {
      // Custom arbitrary for JWT-like tokens
      const jwtTokenArbitrary = fc.string({ minLength: 10, maxLength: 500 }).map(
        (str) => `eyJ${str.replace(/[^a-zA-Z0-9._-]/g, '')}`
      );

      // Custom arbitrary for API request paths
      const apiPathArbitrary = fc.oneof(
        fc.constant('/posts'),
        fc.constant('/auth/login'),
        fc.constant('/auth/register'),
        fc.constant('/comments'),
        fc.constant('/notifications/register'),
        fc.string({ minLength: 1, maxLength: 50 }).map(s => `/${s.replace(/[^a-zA-Z0-9/_-]/g, '')}`)
      );

      // Custom arbitrary for HTTP methods
      const httpMethodArbitrary = fc.oneof(
        fc.constant('GET'),
        fc.constant('POST'),
        fc.constant('PUT'),
        fc.constant('DELETE'),
        fc.constant('PATCH')
      );

      it('should attach Bearer token to Authorization header for any valid token', async () => {
        await fc.assert(
          fc.asyncProperty(jwtTokenArbitrary, async (token) => {
            // Mock SecureStore to return the token
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);

            // Create a mock request config
            const config: any = {
              url: '/test',
              method: 'GET',
              headers: {},
            };

            // Get the request interceptor
            const requestInterceptor = (apiClient.interceptors.request as any).handlers[0];
            const modifiedConfig = await requestInterceptor.fulfilled(config);

            // Verify Authorization header format
            expect(modifiedConfig.headers.Authorization).toBe(`Bearer ${token}`);
            expect(modifiedConfig.headers.Authorization).toMatch(/^Bearer .+$/);
          }),
          { numRuns: 100 }
        );
      });

      it('should attach Bearer token for any API path', async () => {
        await fc.assert(
          fc.asyncProperty(
            jwtTokenArbitrary,
            apiPathArbitrary,
            async (token, path) => {
              // Mock SecureStore to return the token
              (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);

              // Create a mock request config with the generated path
              const config: any = {
                url: path,
                method: 'GET',
                headers: {},
              };

              // Get the request interceptor
              const requestInterceptor = (apiClient.interceptors.request as any).handlers[0];
              const modifiedConfig = await requestInterceptor.fulfilled(config);

              // Verify Authorization header is attached regardless of path
              expect(modifiedConfig.headers.Authorization).toBe(`Bearer ${token}`);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should attach Bearer token for any HTTP method', async () => {
        await fc.assert(
          fc.asyncProperty(
            jwtTokenArbitrary,
            httpMethodArbitrary,
            async (token, method) => {
              // Mock SecureStore to return the token
              (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);

              // Create a mock request config with the generated method
              const config: any = {
                url: '/test',
                method: method,
                headers: {},
              };

              // Get the request interceptor
              const requestInterceptor = (apiClient.interceptors.request as any).handlers[0];
              const modifiedConfig = await requestInterceptor.fulfilled(config);

              // Verify Authorization header is attached regardless of HTTP method
              expect(modifiedConfig.headers.Authorization).toBe(`Bearer ${token}`);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should attach Bearer token for any combination of token, path, and method', async () => {
        await fc.assert(
          fc.asyncProperty(
            jwtTokenArbitrary,
            apiPathArbitrary,
            httpMethodArbitrary,
            async (token, path, method) => {
              // Mock SecureStore to return the token
              (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);

              // Create a mock request config
              const config: any = {
                url: path,
                method: method,
                headers: {},
              };

              // Get the request interceptor
              const requestInterceptor = (apiClient.interceptors.request as any).handlers[0];
              const modifiedConfig = await requestInterceptor.fulfilled(config);

              // Verify Authorization header format
              expect(modifiedConfig.headers.Authorization).toBe(`Bearer ${token}`);
              
              // Verify the format matches "Bearer {token}"
              const authHeader = modifiedConfig.headers.Authorization;
              expect(authHeader).toMatch(/^Bearer .+$/);
              expect(authHeader.split(' ')[0]).toBe('Bearer');
              expect(authHeader.split(' ')[1]).toBe(token);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should not attach Authorization header when no token is stored', async () => {
        await fc.assert(
          fc.asyncProperty(
            apiPathArbitrary,
            httpMethodArbitrary,
            async (path, method) => {
              // Mock SecureStore to return null (no token)
              (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

              // Create a mock request config
              const config: any = {
                url: path,
                method: method,
                headers: {},
              };

              // Get the request interceptor
              const requestInterceptor = (apiClient.interceptors.request as any).handlers[0];
              const modifiedConfig = await requestInterceptor.fulfilled(config);

              // Verify Authorization header is not present
              expect(modifiedConfig.headers.Authorization).toBeUndefined();
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should preserve existing headers while adding Authorization', async () => {
        await fc.assert(
          fc.asyncProperty(
            jwtTokenArbitrary,
            fc.record({
              'X-Custom-Header': fc.string(),
              'Accept-Language': fc.constantFrom('en', 'es', 'fr', 'de'),
            }),
            async (token, customHeaders) => {
              // Mock SecureStore to return the token
              (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);

              // Create a mock request config with custom headers
              const config: any = {
                url: '/test',
                method: 'GET',
                headers: { ...customHeaders },
              };

              // Get the request interceptor
              const requestInterceptor = (apiClient.interceptors.request as any).handlers[0];
              const modifiedConfig = await requestInterceptor.fulfilled(config);

              // Verify Authorization header is added
              expect(modifiedConfig.headers.Authorization).toBe(`Bearer ${token}`);
              
              // Verify existing headers are preserved
              expect(modifiedConfig.headers['X-Custom-Header']).toBe(customHeaders['X-Custom-Header']);
              expect(modifiedConfig.headers['Accept-Language']).toBe(customHeaders['Accept-Language']);
            }
          ),
          { numRuns: 100 }
        );
      });
    });
  });
});
