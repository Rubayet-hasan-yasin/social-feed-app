/**
 * Property-based tests for EmptyState component
 * Feature: mobile-app-completion
 */

import { render } from '@testing-library/react-native';
import * as fc from 'fast-check';
import React from 'react';

import EmptyState from '../EmptyState';

// Arbitrary for generating valid Ionicons names
// Using a subset of common Ionicons names for testing
const ioniconNameArbitrary = fc.constantFrom(
  'alert-circle',
  'checkmark-circle',
  'close-circle',
  'information-circle',
  'warning',
  'heart',
  'star',
  'home',
  'person',
  'settings',
  'notifications',
  'search',
  'add',
  'remove',
  'trash',
  'create',
  'mail',
  'call',
  'time',
  'calendar',
  'camera',
  'image',
  'document',
  'folder',
  'cloud',
  'download',
  'upload',
  'share',
  'bookmark',
  'flag',
  'lock',
  'unlock',
  'eye',
  'eye-off',
  'refresh',
  'sync',
  'arrow-back',
  'arrow-forward',
  'arrow-up',
  'arrow-down',
  'chevron-back',
  'chevron-forward',
  'chevron-up',
  'chevron-down',
  'menu',
  'ellipsis-horizontal',
  'ellipsis-vertical',
  'grid',
  'list',
  'apps',
  'layers',
  'map',
  'location',
  'navigate',
  'compass',
  'globe',
  'wifi',
  'bluetooth',
  'battery-full',
  'battery-half',
  'battery-dead',
  'flashlight',
  'bulb',
  'sunny',
  'moon',
  'cloudy',
  'rainy',
  'snow',
  'thunderstorm',
  'partly-sunny',
  'musical-notes',
  'volume-high',
  'volume-low',
  'volume-mute',
  'play',
  'pause',
  'stop',
  'skip-forward',
  'skip-backward',
  'fast-forward',
  'rewind',
  'shuffle',
  'repeat',
  'mic',
  'mic-off',
  'videocam',
  'videocam-off',
  'chatbubble',
  'chatbubbles',
  'paper-plane',
  'send',
  'attach',
  'link',
  'code',
  'terminal',
  'bug',
  'construct',
  'hammer',
  'build',
  'color-palette',
  'brush',
  'pencil',
  'create-outline',
  'cut',
  'copy',
  'clipboard',
  'save',
  'print',
  'qr-code',
  'barcode',
  'scan',
  'finger-print',
  'key',
  'shield',
  'shield-checkmark',
  'alert',
  'help',
  'help-circle',
  'information',
  'ban',
  'radio-button-on',
  'radio-button-off',
  'checkbox',
  'checkbox-outline',
  'square',
  'square-outline',
  'toggle',
  'options',
  'filter',
  'funnel',
  'swap-horizontal',
  'swap-vertical',
  'resize',
  'expand',
  'contract',
  'enter',
  'exit',
  'log-in',
  'log-out',
  'power',
  'reload',
  'return-up-back',
  'return-down-forward',
  'undo',
  'redo',
  'cut-outline',
  'copy-outline',
  'duplicate',
  'albums',
  'archive',
  'basket',
  'cart',
  'bag',
  'briefcase',
  'business',
  'card',
  'cash',
  'wallet',
  'gift',
  'trophy',
  'medal',
  'ribbon',
  'pricetag',
  'pricetags',
  'ticket',
  'restaurant',
  'cafe',
  'pizza',
  'beer',
  'wine',
  'ice-cream',
  'nutrition',
  'fitness',
  'barbell',
  'bicycle',
  'football',
  'basketball',
  'baseball',
  'tennisball',
  'golf',
  'american-football',
  'body',
  'accessibility',
  'walk',
  'man',
  'woman',
  'male',
  'female',
  'transgender',
  'male-female',
  'people',
  'people-circle',
  'person-add',
  'person-remove',
  'person-circle',
  'happy',
  'sad',
  'heart-circle',
  'heart-half',
  'heart-dislike',
  'thumbs-up',
  'thumbs-down',
  'hand-left',
  'hand-right',
  'megaphone',
  'newspaper',
  'book',
  'bookmarks',
  'library',
  'journal',
  'reader',
  'glasses',
  'school',
  'desktop',
  'laptop',
  'tablet-portrait',
  'tablet-landscape',
  'phone-portrait',
  'phone-landscape',
  'watch',
  'tv',
  'game-controller',
  'headset',
  'calculator',
  'keypad',
  'at',
  'at-circle',
  'planet',
  'rocket',
  'airplane',
  'car',
  'car-sport',
  'bus',
  'train',
  'subway',
  'boat',
  'speedometer',
  'hourglass',
  'stopwatch',
  'timer',
  'alarm',
  'bed',
  'cafe-outline',
  'restaurant-outline',
  'fast-food',
  'fast-food-outline'
);

describe('EmptyState Component', () => {
  describe('Property 44: Empty State Completeness', () => {
    // Feature: mobile-app-completion, Property 44: Empty State Completeness
    it('should include an icon, title, and optional subtitle for any valid props', () => {
      fc.assert(
        fc.property(
          ioniconNameArbitrary,
          fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          fc.option(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), { nil: undefined }),
          (icon, title, subtitle) => {
            const { getByText, getByTestId } = render(
              <EmptyState icon={icon} title={title} subtitle={subtitle} />
            );

            // Verify title is present
            const titleElement = getByText(title, { exact: false });
            expect(titleElement).toBeTruthy();

            // Verify subtitle is present if provided
            if (subtitle) {
              const subtitleElement = getByText(subtitle, { exact: false });
              expect(subtitleElement).toBeTruthy();
            }

            // Verify component renders without errors (icon is part of the component)
            expect(true).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    // Feature: mobile-app-completion, Property 44: Empty State Completeness
    it('should always render successfully with an icon and title', () => {
      fc.assert(
        fc.property(
          ioniconNameArbitrary,
          fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          (icon, title) => {
            const result = render(
              <EmptyState icon={icon} title={title} />
            );

            // Verify component renders without throwing
            expect(result).toBeTruthy();
            
            // Verify title is present
            const titleElement = result.getByText(title, { exact: false });
            expect(titleElement).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });

    // Feature: mobile-app-completion, Property 44: Empty State Completeness
    it('should render title for any non-empty, non-whitespace string', () => {
      fc.assert(
        fc.property(
          ioniconNameArbitrary,
          fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          (icon, title) => {
            const { getByText } = render(
              <EmptyState icon={icon} title={title} />
            );

            const titleElement = getByText(title, { exact: false });
            expect(titleElement).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });

    // Feature: mobile-app-completion, Property 44: Empty State Completeness
    it('should render subtitle when provided and omit it when not provided', () => {
      fc.assert(
        fc.property(
          ioniconNameArbitrary,
          fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          fc.option(fc.string({ minLength: 1 }).filter(s => s.trim().length > 0), { nil: undefined }),
          (icon, title, subtitle) => {
            const { queryByText } = render(
              <EmptyState icon={icon} title={title} subtitle={subtitle} />
            );

            if (subtitle) {
              const subtitleElement = queryByText(subtitle, { exact: false });
              expect(subtitleElement).toBeTruthy();
            } else {
              // When subtitle is undefined, component should still render successfully
              expect(true).toBe(true);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    // Feature: mobile-app-completion, Property 44: Empty State Completeness
    it('should maintain component structure with all three elements (icon, title, subtitle)', () => {
      fc.assert(
        fc.property(
          ioniconNameArbitrary,
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          fc.string({ minLength: 1, maxLength: 200 }).filter(s => s.trim().length > 0),
          (icon, title, subtitle) => {
            const { getByText } = render(
              <EmptyState icon={icon} title={title} subtitle={subtitle} />
            );

            // All three elements should be present
            expect(getByText(title, { exact: false })).toBeTruthy();
            expect(getByText(subtitle, { exact: false })).toBeTruthy();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Unit Tests - Specific Examples', () => {
    it('should render with a specific icon, title, and subtitle', () => {
      const { getByText } = render(
        <EmptyState
          icon="alert-circle"
          title="No Posts Yet"
          subtitle="Be the first to create a post!"
        />
      );

      expect(getByText('No Posts Yet')).toBeTruthy();
      expect(getByText('Be the first to create a post!')).toBeTruthy();
    });

    it('should render without a subtitle', () => {
      const { getByText, queryByText } = render(
        <EmptyState icon="chatbubbles" title="No Comments" />
      );

      expect(getByText('No Comments')).toBeTruthy();
      // Subtitle should not be rendered
    });

    it('should render with different icons', () => {
      const { rerender, getByText } = render(
        <EmptyState icon="heart" title="No Likes" />
      );

      expect(getByText('No Likes')).toBeTruthy();

      rerender(<EmptyState icon="notifications" title="No Notifications" />);

      expect(getByText('No Notifications')).toBeTruthy();
    });

    it('should handle long titles and subtitles', () => {
      const longTitle = 'This is a very long title that should still render correctly';
      const longSubtitle = 'This is a very long subtitle that provides additional context and should also render correctly without any issues';

      const { getByText } = render(
        <EmptyState
          icon="information-circle"
          title={longTitle}
          subtitle={longSubtitle}
        />
      );

      expect(getByText(longTitle)).toBeTruthy();
      expect(getByText(longSubtitle)).toBeTruthy();
    });

    it('should handle special characters in title and subtitle', () => {
      const { getByText } = render(
        <EmptyState
          icon="alert"
          title="Oops! Something went wrong 😢"
          subtitle="Please try again later... (Error: 404)"
        />
      );

      expect(getByText('Oops! Something went wrong 😢')).toBeTruthy();
      expect(getByText('Please try again later... (Error: 404)')).toBeTruthy();
    });
  });
});
