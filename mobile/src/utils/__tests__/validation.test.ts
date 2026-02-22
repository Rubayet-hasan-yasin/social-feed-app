import * as fc from 'fast-check';
import { validateEmail, validatePassword, validateUsername } from '../validation';

describe('Form Validation Utilities', () => {
  describe('validateEmail', () => {
    // Unit tests for specific examples
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toEqual({ isValid: true });
      expect(validateEmail('user.name@domain.co.uk')).toEqual({ isValid: true });
      expect(validateEmail('user+tag@example.com')).toEqual({ isValid: true });
    });

    it('should reject emails without @ symbol', () => {
      const result = validateEmail('invalidemail.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject emails without domain', () => {
      const result = validateEmail('user@');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject emails without local part', () => {
      const result = validateEmail('@example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject emails with spaces', () => {
      const result = validateEmail('user name@example.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    it('should reject empty string', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address');
    });

    // Feature: mobile-app-completion, Property 5: Email Validation
    // For any string that matches valid email format (contains @ and domain), 
    // email validation should pass. For any string that doesn't match valid 
    // email format, validation should fail.
    it('should validate all properly formatted emails (property-based)', () => {
      fc.assert(
        fc.property(fc.emailAddress(), (email) => {
          const result = validateEmail(email);
          expect(result.isValid).toBe(true);
          expect(result.error).toBeUndefined();
        }),
        { numRuns: 100 }
      );
    });

    it('should reject strings without @ symbol (property-based)', () => {
      fc.assert(
        fc.property(
          fc.string().filter((s) => !s.includes('@')),
          (invalidEmail) => {
            const result = validateEmail(invalidEmail);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Please enter a valid email address');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('validatePassword', () => {
    // Unit tests for specific examples
    it('should validate passwords with 6 or more characters', () => {
      expect(validatePassword('123456')).toEqual({ isValid: true });
      expect(validatePassword('password')).toEqual({ isValid: true });
      expect(validatePassword('a'.repeat(100))).toEqual({ isValid: true });
    });

    it('should reject passwords shorter than 6 characters', () => {
      const result = validatePassword('12345');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must be at least 6 characters');
    });

    it('should reject empty password', () => {
      const result = validatePassword('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must be at least 6 characters');
    });

    it('should validate password with exactly 6 characters', () => {
      expect(validatePassword('abcdef')).toEqual({ isValid: true });
    });

    // Feature: mobile-app-completion, Property 6: Password Length Validation
    // For any string with length less than 6 characters, password validation 
    // should fail and display an error message.
    it('should reject all passwords shorter than 6 characters (property-based)', () => {
      fc.assert(
        fc.property(
          fc.string({ maxLength: 5 }),
          (shortPassword) => {
            const result = validatePassword(shortPassword);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Password must be at least 6 characters');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate all passwords with 6 or more characters (property-based)', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 6 }),
          (validPassword) => {
            const result = validatePassword(validPassword);
            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('validateUsername', () => {
    // Unit tests for specific examples
    it('should validate usernames with 3 or more characters', () => {
      expect(validateUsername('abc')).toEqual({ isValid: true });
      expect(validateUsername('user')).toEqual({ isValid: true });
      expect(validateUsername('username123')).toEqual({ isValid: true });
    });

    it('should reject usernames shorter than 3 characters', () => {
      const result = validateUsername('ab');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Username must be at least 3 characters');
    });

    it('should reject empty username', () => {
      const result = validateUsername('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Username must be at least 3 characters');
    });

    it('should validate username with exactly 3 characters', () => {
      expect(validateUsername('abc')).toEqual({ isValid: true });
    });

    it('should reject single character username', () => {
      const result = validateUsername('a');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Username must be at least 3 characters');
    });

    // Feature: mobile-app-completion, Property 7: Username Length Validation
    // For any string with length less than 3 characters, username validation 
    // should fail and display an error message.
    it('should reject all usernames shorter than 3 characters (property-based)', () => {
      fc.assert(
        fc.property(
          fc.string({ maxLength: 2 }),
          (shortUsername) => {
            const result = validateUsername(shortUsername);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Username must be at least 3 characters');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should validate all usernames with 3 or more characters (property-based)', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 3 }),
          (validUsername) => {
            const result = validateUsername(validUsername);
            expect(result.isValid).toBe(true);
            expect(result.error).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('ValidationResult interface', () => {
    it('should return consistent structure for valid inputs', () => {
      const emailResult = validateEmail('test@example.com');
      const passwordResult = validatePassword('password123');
      const usernameResult = validateUsername('user123');

      // All valid results should have isValid: true and no error
      expect(emailResult).toHaveProperty('isValid', true);
      expect(emailResult).not.toHaveProperty('error');
      expect(passwordResult).toHaveProperty('isValid', true);
      expect(passwordResult).not.toHaveProperty('error');
      expect(usernameResult).toHaveProperty('isValid', true);
      expect(usernameResult).not.toHaveProperty('error');
    });

    it('should return consistent structure for invalid inputs', () => {
      const emailResult = validateEmail('invalid');
      const passwordResult = validatePassword('short');
      const usernameResult = validateUsername('ab');

      // All invalid results should have isValid: false and an error message
      expect(emailResult).toHaveProperty('isValid', false);
      expect(emailResult).toHaveProperty('error');
      expect(typeof emailResult.error).toBe('string');
      
      expect(passwordResult).toHaveProperty('isValid', false);
      expect(passwordResult).toHaveProperty('error');
      expect(typeof passwordResult.error).toBe('string');
      
      expect(usernameResult).toHaveProperty('isValid', false);
      expect(usernameResult).toHaveProperty('error');
      expect(typeof usernameResult.error).toBe('string');
    });
  });
});
