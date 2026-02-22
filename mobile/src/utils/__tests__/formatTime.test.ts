import * as fc from 'fast-check';
import { formatRelativeTime } from '../formatTime';

describe('Time Formatting Utilities', () => {
  describe('formatRelativeTime', () => {
    // Unit tests for specific examples
    describe('just now cases', () => {
      it('should return "just now" for current time', () => {
        const now = new Date().toISOString();
        expect(formatRelativeTime(now)).toBe('just now');
      });

      it('should return "just now" for 30 seconds ago', () => {
        const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString();
        expect(formatRelativeTime(thirtySecondsAgo)).toBe('just now');
      });

      it('should return "just now" for 59 seconds ago', () => {
        const fiftyNineSecondsAgo = new Date(Date.now() - 59 * 1000).toISOString();
        expect(formatRelativeTime(fiftyNineSecondsAgo)).toBe('just now');
      });
    });

    describe('minutes ago cases', () => {
      it('should return "1m ago" for 1 minute ago', () => {
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
        expect(formatRelativeTime(oneMinuteAgo)).toBe('1m ago');
      });

      it('should return "5m ago" for 5 minutes ago', () => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        expect(formatRelativeTime(fiveMinutesAgo)).toBe('5m ago');
      });

      it('should return "30m ago" for 30 minutes ago', () => {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
        expect(formatRelativeTime(thirtyMinutesAgo)).toBe('30m ago');
      });

      it('should return "59m ago" for 59 minutes ago', () => {
        const fiftyNineMinutesAgo = new Date(Date.now() - 59 * 60 * 1000).toISOString();
        expect(formatRelativeTime(fiftyNineMinutesAgo)).toBe('59m ago');
      });
    });

    describe('hours ago cases', () => {
      it('should return "1h ago" for 1 hour ago', () => {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        expect(formatRelativeTime(oneHourAgo)).toBe('1h ago');
      });

      it('should return "3h ago" for 3 hours ago', () => {
        const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
        expect(formatRelativeTime(threeHoursAgo)).toBe('3h ago');
      });

      it('should return "12h ago" for 12 hours ago', () => {
        const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
        expect(formatRelativeTime(twelveHoursAgo)).toBe('12h ago');
      });

      it('should return "23h ago" for 23 hours ago', () => {
        const twentyThreeHoursAgo = new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString();
        expect(formatRelativeTime(twentyThreeHoursAgo)).toBe('23h ago');
      });
    });

    describe('days ago cases', () => {
      it('should return "1d ago" for 24 hours ago', () => {
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        expect(formatRelativeTime(oneDayAgo)).toBe('1d ago');
      });

      it('should return "2d ago" for 2 days ago', () => {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
        expect(formatRelativeTime(twoDaysAgo)).toBe('2d ago');
      });

      it('should return "7d ago" for 7 days ago', () => {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        expect(formatRelativeTime(sevenDaysAgo)).toBe('7d ago');
      });

      it('should return "30d ago" for 30 days ago', () => {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        expect(formatRelativeTime(thirtyDaysAgo)).toBe('30d ago');
      });

      it('should return "365d ago" for 365 days ago', () => {
        const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
        expect(formatRelativeTime(oneYearAgo)).toBe('365d ago');
      });
    });

    describe('boundary cases', () => {
      it('should handle exactly 60 seconds (1 minute boundary)', () => {
        const sixtySecondsAgo = new Date(Date.now() - 60 * 1000).toISOString();
        const result = formatRelativeTime(sixtySecondsAgo);
        expect(result).toBe('1m ago');
      });

      it('should handle exactly 60 minutes (1 hour boundary)', () => {
        const sixtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const result = formatRelativeTime(sixtyMinutesAgo);
        expect(result).toBe('1h ago');
      });

      it('should handle exactly 24 hours (1 day boundary)', () => {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const result = formatRelativeTime(twentyFourHoursAgo);
        expect(result).toBe('1d ago');
      });
    });

    // Feature: mobile-app-completion, Property 40: Time Formatting Correctness
    // For any timestamp, the formatted time should display "just now" if less than 
    // 1 minute old, "Xm ago" if less than 60 minutes old, "Xh ago" if less than 
    // 24 hours old, and "Xd ago" if 24 hours or older.
    describe('property-based tests', () => {
      it('should return "just now" for any timestamp less than 1 minute old', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 0, max: 59 }), // seconds
            (seconds) => {
              const timestamp = new Date(Date.now() - seconds * 1000).toISOString();
              const result = formatRelativeTime(timestamp);
              expect(result).toBe('just now');
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should return "Xm ago" for any timestamp between 1 and 59 minutes old', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 1, max: 59 }), // minutes
            (minutes) => {
              const timestamp = new Date(Date.now() - minutes * 60 * 1000).toISOString();
              const result = formatRelativeTime(timestamp);
              expect(result).toBe(`${minutes}m ago`);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should return "Xh ago" for any timestamp between 1 and 23 hours old', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 1, max: 23 }), // hours
            (hours) => {
              const timestamp = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
              const result = formatRelativeTime(timestamp);
              expect(result).toBe(`${hours}h ago`);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should return "Xd ago" for any timestamp 24 hours or older', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 1, max: 365 }), // days
            (days) => {
              const timestamp = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
              const result = formatRelativeTime(timestamp);
              expect(result).toBe(`${days}d ago`);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should always return a string in the expected format', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 0, max: 365 * 24 * 60 * 60 }), // seconds in a year
            (seconds) => {
              const timestamp = new Date(Date.now() - seconds * 1000).toISOString();
              const result = formatRelativeTime(timestamp);
              
              // Result should match one of the expected patterns
              const validPatterns = [
                /^just now$/,
                /^\d+m ago$/,
                /^\d+h ago$/,
                /^\d+d ago$/,
              ];
              
              const isValid = validPatterns.some((pattern) => pattern.test(result));
              expect(isValid).toBe(true);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should handle any valid ISO 8601 timestamp', () => {
        fc.assert(
          fc.property(
            fc.date({ min: new Date('2020-01-01'), max: new Date() }).filter(date => !isNaN(date.getTime())),
            (date) => {
              const timestamp = date.toISOString();
              const result = formatRelativeTime(timestamp);
              
              // Should return a string
              expect(typeof result).toBe('string');
              
              // Should match one of the expected formats
              const validPatterns = [
                /^just now$/,
                /^\d+m ago$/,
                /^\d+h ago$/,
                /^\d+d ago$/,
              ];
              
              const isValid = validPatterns.some((pattern) => pattern.test(result));
              expect(isValid).toBe(true);
            }
          ),
          { numRuns: 100 }
        );
      });

      it('should be deterministic for the same timestamp', () => {
        fc.assert(
          fc.property(
            fc.integer({ min: 0, max: 365 * 24 * 60 * 60 }), // seconds in a year
            (seconds) => {
              const timestamp = new Date(Date.now() - seconds * 1000).toISOString();
              const result1 = formatRelativeTime(timestamp);
              const result2 = formatRelativeTime(timestamp);
              
              // Same input should always produce same output
              expect(result1).toBe(result2);
            }
          ),
          { numRuns: 100 }
        );
      });
    });

    describe('edge cases', () => {
      it('should handle timestamps in the future gracefully', () => {
        const futureTime = new Date(Date.now() + 60 * 1000).toISOString();
        const result = formatRelativeTime(futureTime);
        // Future times will have negative diff, which floors to 0 or negative
        // This should return "just now" based on the implementation
        expect(result).toBe('just now');
      });

      it('should handle very old timestamps', () => {
        const veryOld = new Date('2000-01-01').toISOString();
        const result = formatRelativeTime(veryOld);
        expect(result).toMatch(/^\d+d ago$/);
      });
    });
  });
});
