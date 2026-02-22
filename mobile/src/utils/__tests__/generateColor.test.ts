/**
 * Tests for avatar generation utilities
 */

import fc from 'fast-check';
import { AVATAR_COLORS } from '../../constants/colors';
import { generateAvatarColor, getAvatarInitials } from '../generateColor';

describe('generateAvatarColor', () => {
  it('should return a color from the AVATAR_COLORS palette', () => {
    const color = generateAvatarColor('testuser');
    expect(AVATAR_COLORS).toContain(color);
  });

  it('should return the same color for the same username (deterministic)', () => {
    const username = 'john';
    const color1 = generateAvatarColor(username);
    const color2 = generateAvatarColor(username);
    expect(color1).toBe(color2);
  });

  it('should return consistent colors for multiple calls', () => {
    const username = 'alice';
    const colors = Array.from({ length: 10 }, () => generateAvatarColor(username));
    const allSame = colors.every(color => color === colors[0]);
    expect(allSame).toBe(true);
  });

  it('should handle empty string', () => {
    const color = generateAvatarColor('');
    expect(AVATAR_COLORS).toContain(color);
  });

  it('should handle single character username', () => {
    const color = generateAvatarColor('a');
    expect(AVATAR_COLORS).toContain(color);
  });

  it('should distribute different usernames across the color palette', () => {
    const usernames = ['alice', 'bob', 'charlie', 'david', 'eve', 'frank', 'grace', 'henry'];
    const colors = usernames.map(generateAvatarColor);
    const uniqueColors = new Set(colors);
    // With 8 usernames and 8 colors, we should get some variety
    expect(uniqueColors.size).toBeGreaterThan(1);
  });
});

describe('getAvatarInitials', () => {
  it('should return first two characters in uppercase', () => {
    expect(getAvatarInitials('john')).toBe('JO');
    expect(getAvatarInitials('alice')).toBe('AL');
  });

  it('should handle single character username', () => {
    expect(getAvatarInitials('a')).toBe('A');
  });

  it('should handle two character username', () => {
    expect(getAvatarInitials('ab')).toBe('AB');
  });

  it('should handle lowercase usernames', () => {
    expect(getAvatarInitials('test')).toBe('TE');
  });

  it('should handle mixed case usernames', () => {
    expect(getAvatarInitials('JohnDoe')).toBe('JO');
  });

  it('should handle usernames with special characters', () => {
    expect(getAvatarInitials('user_123')).toBe('US');
  });

  it('should handle empty string', () => {
    expect(getAvatarInitials('')).toBe('');
  });

  it('should only take first two characters even for long usernames', () => {
    expect(getAvatarInitials('verylongusername')).toBe('VE');
  });
});

// Property-Based Tests

describe('Property-Based Tests for Avatar Generation', () => {
  // Feature: mobile-app-completion, Property 41: Avatar Determinism
  // For any username, generating an avatar multiple times should produce identical visual results (same color and text)
  describe('Property 41: Avatar Determinism', () => {
    it('should generate identical color for the same username across multiple calls', () => {
      fc.assert(
        fc.property(fc.string(), (username) => {
          const color1 = generateAvatarColor(username);
          const color2 = generateAvatarColor(username);
          const color3 = generateAvatarColor(username);
          
          // All colors should be identical
          expect(color1).toBe(color2);
          expect(color2).toBe(color3);
          
          // Color should be from the palette
          expect(AVATAR_COLORS).toContain(color1);
        }),
        { numRuns: 100 }
      );
    });

    it('should generate identical initials for the same username across multiple calls', () => {
      fc.assert(
        fc.property(fc.string(), (username) => {
          const initials1 = getAvatarInitials(username);
          const initials2 = getAvatarInitials(username);
          const initials3 = getAvatarInitials(username);
          
          // All initials should be identical
          expect(initials1).toBe(initials2);
          expect(initials2).toBe(initials3);
        }),
        { numRuns: 100 }
      );
    });
  });

  // Feature: mobile-app-completion, Property 42: Avatar Text Generation
  // For any username, the avatar should display the first two characters in uppercase
  describe('Property 42: Avatar Text Generation', () => {
    it('should display the first two characters in uppercase for any username', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1 }), (username) => {
          const initials = getAvatarInitials(username);
          const expected = username.slice(0, 2).toUpperCase();
          
          expect(initials).toBe(expected);
          
          // Verify it's uppercase
          expect(initials).toBe(initials.toUpperCase());
          
          // Verify length is at most 2
          expect(initials.length).toBeLessThanOrEqual(2);
        }),
        { numRuns: 100 }
      );
    });

    it('should handle usernames of any length correctly', () => {
      fc.assert(
        fc.property(fc.string(), (username) => {
          const initials = getAvatarInitials(username);
          
          if (username.length === 0) {
            expect(initials).toBe('');
          } else if (username.length === 1) {
            expect(initials).toBe(username.toUpperCase());
          } else {
            expect(initials).toBe(username.slice(0, 2).toUpperCase());
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  // Feature: mobile-app-completion, Property 43: Avatar Color Palette
  // For any set of usernames, the avatar color generation should use at least 8 distinct colors from the palette
  describe('Property 43: Avatar Color Palette', () => {
    it('should use at least 8 distinct colors from the palette for diverse usernames', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1 }), { minLength: 100, maxLength: 200 }),
          (usernames) => {
            // Generate colors for all usernames
            const colors = usernames.map(generateAvatarColor);
            
            // Get unique colors
            const uniqueColors = new Set(colors);
            
            // All colors should be from the palette
            colors.forEach(color => {
              expect(AVATAR_COLORS).toContain(color);
            });
            
            // With a large diverse set of usernames, we should see all 8 colors
            // This tests that the hash function distributes well across the palette
            expect(uniqueColors.size).toBeGreaterThanOrEqual(8);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should only return colors from the 8-color palette', () => {
      fc.assert(
        fc.property(fc.string(), (username) => {
          const color = generateAvatarColor(username);
          
          // Color must be one of the 8 avatar colors
          expect(AVATAR_COLORS).toContain(color);
          
          // Verify the palette has exactly 8 colors
          expect(AVATAR_COLORS.length).toBe(8);
        }),
        { numRuns: 100 }
      );
    });

    it('should distribute colors across the full palette with varied inputs', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 50 }),
          (usernames) => {
            const colors = usernames.map(generateAvatarColor);
            const uniqueColors = new Set(colors);
            
            // With 50+ diverse usernames, we should see multiple colors
            // (not all mapping to the same color)
            expect(uniqueColors.size).toBeGreaterThan(1);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
