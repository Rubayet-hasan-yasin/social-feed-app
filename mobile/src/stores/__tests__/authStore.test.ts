/**
 * Property-Based Tests for Auth Store
 * 
 * Tests the Zustand authentication store to ensure session restoration
 * and authentication data cleanup work correctly.
 */

import * as SecureStore from 'expo-secure-store';
import * as fc from 'fast-check';
import { useAuthStore } from '../authStore';

// Mock dependencies
jest.mock('expo-secure-store');
jest.mock('../../services/auth', () => ({
  login: jest.fn(),
  register: jest.fn(),
}));

describe('Auth Store', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset the store state
    const store = useAuthStore.getState();
    store.setUser(null);
    store.setToken(null);
  });

  describe('Property-Based Tests', () => {
    // Feature: mobile-app-completion, Property 2: Authentication State Restoration
    // For any stored authentication token, when Auth_Context restores the session,
    // the authenticated state should be set to true.
    describe('Property 2: Authentication State Restoration', () => {
      // Custom arbitrary for JWT-like tokens
      const jwtTokenArbitrary = fc.string({ minLength: 10, maxLength: 500 }).map(
        (str) => `eyJ${str.replace(/[^a-zA-Z0-9]/g, '')}`
      );

      // Custom arbitrary for User objects
      const userArbitrary = fc.record({
        id: fc.uuid(),
        username: fc.string({ minLength: 3, maxLength: 30 }),
        email: fc.emailAddress(),
        createdAt: fc.date({ 
          min: new Date('2020-01-01T00:00:00.000Z'), 
          max: new Date('2025-12-31T23:59:59.999Z') 
        }).map((d) => {
          const time = d.getTime();
          if (isNaN(time)) {
            return new Date('2024-01-01T00:00:00.000Z').toISOString();
          }
          return d.toISOString();
        }),
      });

      it('should set authenticated state to true when restoring any valid token', async () => {
        await fc.assert(
          fc.asyncProperty(
            jwtTokenArbitrary,
            userArbitrary,
            async (token, user) => {
              // Mock SecureStore to return stored token and user
              (SecureStore.getItemAsync as jest.Mock).mockImplementation(
                async (key: string) => {
                  if (key === 'auth_token') return token;
                  if (key === 'auth_user') return JSON.stringify(user);
                  return null;
                }
              );

              // Get the store instance
              const store = useAuthStore.getState();
              
              // Restore session
              await store.restoreSession();
              
              // Get the updated state
              const state = useAuthStore.getState();
              
              // Verify authenticated state is true
              expect(state.isAuthenticated).toBe(true);
              expect(state.token).toBe(token);
              expect(state.user).toEqual(user);
              expect(state.isLoading).toBe(false);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should set authenticated state to false when no token is stored', async () => {
        await fc.assert(
          fc.asyncProperty(fc.constant(null), async () => {
            // Mock SecureStore to return null (no stored data)
            (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

            // Get the store instance
            const store = useAuthStore.getState();
            
            // Restore session
            await store.restoreSession();
            
            // Get the updated state
            const state = useAuthStore.getState();
            
            // Verify authenticated state is false
            expect(state.isAuthenticated).toBe(false);
            expect(state.token).toBeNull();
            expect(state.user).toBeNull();
            expect(state.isLoading).toBe(false);
          }),
          { numRuns: 100 }
        );
      });

      it('should set authenticated state to false when token exists but user does not', async () => {
        await fc.assert(
          fc.asyncProperty(jwtTokenArbitrary, async (token) => {
            // Mock SecureStore to return token but no user
            (SecureStore.getItemAsync as jest.Mock).mockImplementation(
              async (key: string) => {
                if (key === 'auth_token') return token;
                if (key === 'auth_user') return null;
                return null;
              }
            );

            // Get the store instance
            const store = useAuthStore.getState();
            
            // Restore session
            await store.restoreSession();
            
            // Get the updated state
            const state = useAuthStore.getState();
            
            // Verify authenticated state is false (both token and user required)
            expect(state.isAuthenticated).toBe(false);
            expect(state.token).toBeNull();
            expect(state.user).toBeNull();
            expect(state.isLoading).toBe(false);
          }),
          { numRuns: 100 }
        );
      });

      it('should set authenticated state to false when user exists but token does not', async () => {
        await fc.assert(
          fc.asyncProperty(userArbitrary, async (user) => {
            // Mock SecureStore to return user but no token
            (SecureStore.getItemAsync as jest.Mock).mockImplementation(
              async (key: string) => {
                if (key === 'auth_token') return null;
                if (key === 'auth_user') return JSON.stringify(user);
                return null;
              }
            );

            // Get the store instance
            const store = useAuthStore.getState();
            
            // Restore session
            await store.restoreSession();
            
            // Get the updated state
            const state = useAuthStore.getState();
            
            // Verify authenticated state is false (both token and user required)
            expect(state.isAuthenticated).toBe(false);
            expect(state.token).toBeNull();
            expect(state.user).toBeNull();
            expect(state.isLoading).toBe(false);
          }),
          { numRuns: 100 }
        );
      });

      it('should handle restoration errors gracefully and set authenticated to false', async () => {
        await fc.assert(
          fc.asyncProperty(fc.constant(null), async () => {
            // Mock SecureStore to throw an error
            (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(
              new Error('Storage access error')
            );

            // Get the store instance
            const store = useAuthStore.getState();
            
            // Restore session (should not throw)
            await store.restoreSession();
            
            // Get the updated state
            const state = useAuthStore.getState();
            
            // Verify authenticated state is false on error
            expect(state.isAuthenticated).toBe(false);
            expect(state.token).toBeNull();
            expect(state.user).toBeNull();
            expect(state.isLoading).toBe(false);
          }),
          { numRuns: 100 }
        );
      });
    });

    // Feature: mobile-app-completion, Property 3: Authentication Data Cleanup
    // For any stored authentication data, calling logout should result in
    // SecureStore containing no token or user data.
    describe('Property 3: Authentication Data Cleanup', () => {
      // Custom arbitrary for JWT-like tokens
      const jwtTokenArbitrary = fc.string({ minLength: 10, maxLength: 500 }).map(
        (str) => `eyJ${str.replace(/[^a-zA-Z0-9]/g, '')}`
      );

      // Custom arbitrary for User objects
      const userArbitrary = fc.record({
        id: fc.uuid(),
        username: fc.string({ minLength: 3, maxLength: 30 }),
        email: fc.emailAddress(),
        createdAt: fc.date({ 
          min: new Date('2020-01-01T00:00:00.000Z'), 
          max: new Date('2025-12-31T23:59:59.999Z') 
        }).map((d) => {
          const time = d.getTime();
          if (isNaN(time)) {
            return new Date('2024-01-01T00:00:00.000Z').toISOString();
          }
          return d.toISOString();
        }),
      });

      it('should clear all stored authentication data on logout', async () => {
        await fc.assert(
          fc.asyncProperty(
            jwtTokenArbitrary,
            userArbitrary,
            async (token, user) => {
              // Mock SecureStore with in-memory storage
              const storage: Record<string, string> = {
                'auth_token': token,
                'auth_user': JSON.stringify(user),
              };
              
              (SecureStore.deleteItemAsync as jest.Mock).mockImplementation(
                async (key: string) => {
                  delete storage[key];
                }
              );
              
              (SecureStore.getItemAsync as jest.Mock).mockImplementation(
                async (key: string) => storage[key] || null
              );

              // Set initial authenticated state
              const store = useAuthStore.getState();
              store.setUser(user);
              store.setToken(token);
              
              // Verify initial state
              expect(useAuthStore.getState().isAuthenticated).toBe(false); // setUser/setToken don't set isAuthenticated
              
              // Call logout
              await store.logout();
              
              // Verify SecureStore was cleared
              expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
              expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_user');
              
              // Verify storage is empty
              expect(storage['auth_token']).toBeUndefined();
              expect(storage['auth_user']).toBeUndefined();
              
              // Verify store state is cleared
              const state = useAuthStore.getState();
              expect(state.token).toBeNull();
              expect(state.user).toBeNull();
              expect(state.isAuthenticated).toBe(false);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should clear store state even if SecureStore deletion fails', async () => {
        await fc.assert(
          fc.asyncProperty(
            jwtTokenArbitrary,
            userArbitrary,
            async (token, user) => {
              // Mock SecureStore to throw errors on delete
              (SecureStore.deleteItemAsync as jest.Mock).mockRejectedValue(
                new Error('Storage deletion error')
              );

              // Set initial authenticated state
              const store = useAuthStore.getState();
              store.setUser(user);
              store.setToken(token);
              
              // Call logout (should not throw)
              await store.logout();
              
              // Verify store state is still cleared despite error
              const state = useAuthStore.getState();
              expect(state.token).toBeNull();
              expect(state.user).toBeNull();
              expect(state.isAuthenticated).toBe(false);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should result in null values when retrieving after logout', async () => {
        await fc.assert(
          fc.asyncProperty(
            jwtTokenArbitrary,
            userArbitrary,
            async (token, user) => {
              // Mock SecureStore with in-memory storage
              const storage: Record<string, string> = {
                'auth_token': token,
                'auth_user': JSON.stringify(user),
              };
              
              (SecureStore.deleteItemAsync as jest.Mock).mockImplementation(
                async (key: string) => {
                  delete storage[key];
                }
              );
              
              (SecureStore.getItemAsync as jest.Mock).mockImplementation(
                async (key: string) => storage[key] || null
              );

              // Set initial state
              const store = useAuthStore.getState();
              store.setUser(user);
              store.setToken(token);
              
              // Verify data exists in storage
              expect(await SecureStore.getItemAsync('auth_token')).toBe(token);
              expect(await SecureStore.getItemAsync('auth_user')).toBe(JSON.stringify(user));
              
              // Call logout
              await store.logout();
              
              // Verify data is gone from storage
              expect(await SecureStore.getItemAsync('auth_token')).toBeNull();
              expect(await SecureStore.getItemAsync('auth_user')).toBeNull();
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should handle logout when already logged out', async () => {
        await fc.assert(
          fc.asyncProperty(fc.constant(null), async () => {
            // Mock SecureStore with empty storage
            const storage: Record<string, string> = {};
            
            (SecureStore.deleteItemAsync as jest.Mock).mockImplementation(
              async (key: string) => {
                delete storage[key];
              }
            );

            // Ensure store is in logged out state
            const store = useAuthStore.getState();
            store.setUser(null);
            store.setToken(null);
            
            // Call logout (should not throw)
            await store.logout();
            
            // Verify state remains cleared
            const state = useAuthStore.getState();
            expect(state.token).toBeNull();
            expect(state.user).toBeNull();
            expect(state.isAuthenticated).toBe(false);
            
            // Verify delete was still called
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
            expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_user');
          }),
          { numRuns: 100 }
        );
      });

      it('should clear both token and user data independently', async () => {
        await fc.assert(
          fc.asyncProperty(
            jwtTokenArbitrary,
            userArbitrary,
            async (token, user) => {
              // Track which keys were deleted
              const deletedKeys: string[] = [];
              
              (SecureStore.deleteItemAsync as jest.Mock).mockImplementation(
                async (key: string) => {
                  deletedKeys.push(key);
                }
              );

              // Set initial state
              const store = useAuthStore.getState();
              store.setUser(user);
              store.setToken(token);
              
              // Call logout
              await store.logout();
              
              // Verify both keys were deleted
              expect(deletedKeys).toContain('auth_token');
              expect(deletedKeys).toContain('auth_user');
              expect(deletedKeys.length).toBe(2);
            }
          ),
          { numRuns: 100 }
        );
      });
    });
  });
});
