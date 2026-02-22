/**
 * Property-Based Tests for Storage Operations
 * 
 * Tests the secure storage wrapper functions to ensure authentication data
 * persistence works correctly across all valid inputs.
 */

import * as SecureStore from 'expo-secure-store';
import * as fc from 'fast-check';
import { User } from '../../types/models';
import { deleteToken, deleteUser, getToken, getUser, saveToken, saveUser } from '../storage';

// Mock Expo SecureStore
jest.mock('expo-secure-store');

describe('Storage Service', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Unit Tests', () => {
    describe('Token operations', () => {
      it('should save token successfully', async () => {
        const token = 'test-jwt-token';
        await saveToken(token);
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', token);
      });

      it('should retrieve token successfully', async () => {
        const token = 'test-jwt-token';
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(token);
        
        const result = await getToken();
        expect(result).toBe(token);
        expect(SecureStore.getItemAsync).toHaveBeenCalledWith('auth_token');
      });

      it('should return null when token does not exist', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
        
        const result = await getToken();
        expect(result).toBeNull();
      });

      it('should delete token successfully', async () => {
        await deleteToken();
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
      });

      it('should handle token save errors', async () => {
        (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(new Error('Storage error'));
        
        await expect(saveToken('token')).rejects.toThrow('Failed to save authentication token');
      });

      it('should handle token retrieval errors gracefully', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Storage error'));
        
        const result = await getToken();
        expect(result).toBeNull();
      });
    });

    describe('User operations', () => {
      const mockUser: User = {
        id: '123',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      it('should save user successfully', async () => {
        (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);
        
        await saveUser(mockUser);
        expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
          'auth_user',
          JSON.stringify(mockUser)
        );
      });

      it('should retrieve user successfully', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));
        
        const result = await getUser();
        expect(result).toEqual(mockUser);
        expect(SecureStore.getItemAsync).toHaveBeenCalledWith('auth_user');
      });

      it('should return null when user does not exist', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
        
        const result = await getUser();
        expect(result).toBeNull();
      });

      it('should delete user successfully', async () => {
        await deleteUser();
        expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_user');
      });

      it('should handle user save errors', async () => {
        (SecureStore.setItemAsync as jest.Mock).mockRejectedValue(new Error('Storage error'));
        
        await expect(saveUser(mockUser)).rejects.toThrow('Failed to save user data');
      });

      it('should handle user retrieval errors gracefully', async () => {
        (SecureStore.getItemAsync as jest.Mock).mockRejectedValue(new Error('Storage error'));
        
        const result = await getUser();
        expect(result).toBeNull();
      });
    });
  });

  describe('Property-Based Tests', () => {
    // Feature: mobile-app-completion, Property 1: Authentication Data Persistence
    // For any valid JWT token and user object, storing them via Token_Manager and 
    // then retrieving from SecureStore should return the same token and user data.
    describe('Property 1: Authentication Data Persistence', () => {
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
          // Ensure valid date before converting to ISO string
          const time = d.getTime();
          if (isNaN(time)) {
            return new Date('2024-01-01T00:00:00.000Z').toISOString();
          }
          return d.toISOString();
        }),
      });

      it('should persist and retrieve any valid JWT token correctly', async () => {
        await fc.assert(
          fc.asyncProperty(jwtTokenArbitrary, async (token) => {
            // Mock SecureStore to simulate actual storage behavior
            let storedValue: string | null = null;
            
            (SecureStore.setItemAsync as jest.Mock).mockImplementation(
              async (_key: string, value: string) => {
                storedValue = value;
              }
            );
            
            (SecureStore.getItemAsync as jest.Mock).mockImplementation(
              async (_key: string) => storedValue
            );

            // Save the token
            await saveToken(token);
            
            // Retrieve the token
            const retrievedToken = await getToken();
            
            // The retrieved token should match the original
            expect(retrievedToken).toBe(token);
          }),
          { numRuns: 100 }
        );
      });

      it('should persist and retrieve any valid User object correctly', async () => {
        await fc.assert(
          fc.asyncProperty(userArbitrary, async (user) => {
            // Mock SecureStore to simulate actual storage behavior
            let storedValue: string | null = null;
            
            (SecureStore.setItemAsync as jest.Mock).mockImplementation(
              async (_key: string, value: string) => {
                storedValue = value;
              }
            );
            
            (SecureStore.getItemAsync as jest.Mock).mockImplementation(
              async (_key: string) => storedValue
            );

            // Save the user
            await saveUser(user);
            
            // Retrieve the user
            const retrievedUser = await getUser();
            
            // The retrieved user should match the original
            expect(retrievedUser).toEqual(user);
          }),
          { numRuns: 100 }
        );
      });

      it('should persist and retrieve both token and user data correctly', async () => {
        await fc.assert(
          fc.asyncProperty(
            jwtTokenArbitrary,
            userArbitrary,
            async (token, user) => {
              // Mock SecureStore to simulate actual storage behavior with separate keys
              const storage: Record<string, string> = {};
              
              (SecureStore.setItemAsync as jest.Mock).mockImplementation(
                async (key: string, value: string) => {
                  storage[key] = value;
                }
              );
              
              (SecureStore.getItemAsync as jest.Mock).mockImplementation(
                async (key: string) => storage[key] || null
              );

              // Save both token and user
              await saveToken(token);
              await saveUser(user);
              
              // Retrieve both
              const retrievedToken = await getToken();
              const retrievedUser = await getUser();
              
              // Both should match the originals
              expect(retrievedToken).toBe(token);
              expect(retrievedUser).toEqual(user);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should handle round-trip persistence for user objects with special characters', async () => {
        // Test with usernames and emails that might have special characters
        const specialUserArbitrary = fc.record({
          id: fc.uuid(),
          username: fc.string({ minLength: 3, maxLength: 30 }),
          email: fc.emailAddress(),
          createdAt: fc.date({ 
            min: new Date('2020-01-01T00:00:00.000Z'), 
            max: new Date('2025-12-31T23:59:59.999Z') 
          }).map((d) => {
            // Ensure valid date before converting to ISO string
            const time = d.getTime();
            if (isNaN(time)) {
              return new Date('2024-01-01T00:00:00.000Z').toISOString();
            }
            return d.toISOString();
          }),
        });

        await fc.assert(
          fc.asyncProperty(specialUserArbitrary, async (user) => {
            let storedValue: string | null = null;
            
            (SecureStore.setItemAsync as jest.Mock).mockImplementation(
              async (_key: string, value: string) => {
                storedValue = value;
              }
            );
            
            (SecureStore.getItemAsync as jest.Mock).mockImplementation(
              async (_key: string) => storedValue
            );

            // Save and retrieve
            await saveUser(user);
            const retrievedUser = await getUser();
            
            // Verify all fields match exactly
            expect(retrievedUser).toEqual(user);
            expect(retrievedUser?.id).toBe(user.id);
            expect(retrievedUser?.username).toBe(user.username);
            expect(retrievedUser?.email).toBe(user.email);
            expect(retrievedUser?.createdAt).toBe(user.createdAt);
          }),
          { numRuns: 100 }
        );
      });

      it('should return null after deleting stored data', async () => {
        await fc.assert(
          fc.asyncProperty(
            jwtTokenArbitrary,
            userArbitrary,
            async (token, user) => {
              // Mock SecureStore with delete functionality
              const storage: Record<string, string> = {};
              
              (SecureStore.setItemAsync as jest.Mock).mockImplementation(
                async (key: string, value: string) => {
                  storage[key] = value;
                }
              );
              
              (SecureStore.getItemAsync as jest.Mock).mockImplementation(
                async (key: string) => storage[key] || null
              );
              
              (SecureStore.deleteItemAsync as jest.Mock).mockImplementation(
                async (key: string) => {
                  delete storage[key];
                }
              );

              // Save data
              await saveToken(token);
              await saveUser(user);
              
              // Verify data is stored
              expect(await getToken()).toBe(token);
              expect(await getUser()).toEqual(user);
              
              // Delete data
              await deleteToken();
              await deleteUser();
              
              // Verify data is gone
              expect(await getToken()).toBeNull();
              expect(await getUser()).toBeNull();
            }
          ),
          { numRuns: 100 }
        );
      });
    });
  });
});
