/**
 * Tests for Avatar component
 */

import { render } from '@testing-library/react-native';
import React from 'react';
import { generateAvatarColor, getAvatarInitials } from '../../utils/generateColor';
import { Avatar } from '../Avatar';

// Mock the utility functions to test component behavior
jest.mock('../../utils/generateColor');

const mockGenerateAvatarColor = generateAvatarColor as jest.MockedFunction<typeof generateAvatarColor>;
const mockGetAvatarInitials = getAvatarInitials as jest.MockedFunction<typeof getAvatarInitials>;

describe('Avatar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementations
    mockGenerateAvatarColor.mockReturnValue('#3B82F6');
    mockGetAvatarInitials.mockReturnValue('JO');
  });

  describe('Rendering', () => {
    it('should render with username prop', () => {
      const { getByText } = render(<Avatar username="john" />);
      expect(mockGenerateAvatarColor).toHaveBeenCalledWith('john');
      expect(mockGetAvatarInitials).toHaveBeenCalledWith('john');
      expect(getByText('JO')).toBeTruthy();
    });

    it('should use medium size by default', () => {
      const { getByText } = render(<Avatar username="john" />);
      const textElement = getByText('JO');
      expect(textElement.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ fontSize: 18 }),
        ])
      );
    });

    it('should render with small size', () => {
      const { getByText } = render(<Avatar username="john" size="small" />);
      const textElement = getByText('JO');
      expect(textElement.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ fontSize: 12 }),
        ])
      );
    });

    it('should render with medium size', () => {
      const { getByText } = render(<Avatar username="john" size="medium" />);
      const textElement = getByText('JO');
      expect(textElement.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ fontSize: 18 }),
        ])
      );
    });

    it('should render with large size', () => {
      const { getByText } = render(<Avatar username="john" size="large" />);
      const textElement = getByText('JO');
      expect(textElement.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ fontSize: 24 }),
        ])
      );
    });
  });

  describe('Size Dimensions', () => {
    it('should have 32x32 dimensions for small size', () => {
      const { getByText } = render(<Avatar username="john" size="small" />);
      const textElement = getByText('JO');
      const container = textElement.parent?.parent; // View is grandparent of Text
      expect(container?.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            width: 32,
            height: 32,
            borderRadius: 16,
          }),
        ])
      );
    });

    it('should have 48x48 dimensions for medium size', () => {
      const { getByText } = render(<Avatar username="john" size="medium" />);
      const textElement = getByText('JO');
      const container = textElement.parent?.parent; // View is grandparent of Text
      expect(container?.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            width: 48,
            height: 48,
            borderRadius: 24,
          }),
        ])
      );
    });

    it('should have 64x64 dimensions for large size', () => {
      const { getByText } = render(<Avatar username="john" size="large" />);
      const textElement = getByText('JO');
      const container = textElement.parent?.parent; // View is grandparent of Text
      expect(container?.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            width: 64,
            height: 64,
            borderRadius: 32,
          }),
        ])
      );
    });
  });

  describe('Color Generation', () => {
    it('should use color from generateAvatarColor utility', () => {
      mockGenerateAvatarColor.mockReturnValue('#EF4444');
      const { getByText } = render(<Avatar username="alice" />);
      const textElement = getByText('JO');
      const container = textElement.parent?.parent; // View is grandparent of Text
      expect(container?.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: '#EF4444',
          }),
        ])
      );
    });

    it('should call generateAvatarColor with username', () => {
      render(<Avatar username="testuser" />);
      expect(mockGenerateAvatarColor).toHaveBeenCalledWith('testuser');
      expect(mockGenerateAvatarColor).toHaveBeenCalledTimes(1);
    });
  });

  describe('Initials Display', () => {
    it('should display initials from getAvatarInitials utility', () => {
      mockGetAvatarInitials.mockReturnValue('AL');
      const { getByText } = render(<Avatar username="alice" />);
      expect(getByText('AL')).toBeTruthy();
    });

    it('should call getAvatarInitials with username', () => {
      render(<Avatar username="testuser" />);
      expect(mockGetAvatarInitials).toHaveBeenCalledWith('testuser');
      expect(mockGetAvatarInitials).toHaveBeenCalledTimes(1);
    });

    it('should handle single character initials', () => {
      mockGetAvatarInitials.mockReturnValue('A');
      const { getByText } = render(<Avatar username="a" />);
      expect(getByText('A')).toBeTruthy();
    });

    it('should handle empty initials', () => {
      mockGetAvatarInitials.mockReturnValue('');
      const { getByText } = render(<Avatar username="" />);
      expect(getByText('')).toBeTruthy();
    });
  });

  describe('Style Properties', () => {
    it('should have white text color', () => {
      const { getByText } = render(<Avatar username="john" />);
      const textElement = getByText('JO');
      expect(textElement.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ color: '#FFFFFF' }),
        ])
      );
    });

    it('should have centered content', () => {
      const { getByText } = render(<Avatar username="john" />);
      const textElement = getByText('JO');
      const container = textElement.parent?.parent; // View is grandparent of Text
      expect(container?.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            justifyContent: 'center',
            alignItems: 'center',
          }),
        ])
      );
    });

    it('should have circular border radius', () => {
      const { getByText } = render(<Avatar username="john" size="medium" />);
      const textElement = getByText('JO');
      const container = textElement.parent?.parent; // View is grandparent of Text
      // For medium size (48x48), border radius should be 24 (half of width/height)
      expect(container?.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            borderRadius: 24,
          }),
        ])
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long usernames', () => {
      mockGetAvatarInitials.mockReturnValue('VE');
      const { getByText } = render(<Avatar username="verylongusernamethatexceedsnormallength" />);
      expect(getByText('VE')).toBeTruthy();
    });

    it('should handle usernames with special characters', () => {
      mockGetAvatarInitials.mockReturnValue('US');
      const { getByText } = render(<Avatar username="user_123!@#" />);
      expect(getByText('US')).toBeTruthy();
    });

    it('should handle usernames with spaces', () => {
      mockGetAvatarInitials.mockReturnValue('JO');
      const { getByText } = render(<Avatar username="john doe" />);
      expect(getByText('JO')).toBeTruthy();
    });

    it('should handle numeric usernames', () => {
      mockGetAvatarInitials.mockReturnValue('12');
      const { getByText } = render(<Avatar username="12345" />);
      expect(getByText('12')).toBeTruthy();
    });
  });

  describe('Color Consistency', () => {
    it('should call generateAvatarColor with the same username consistently', () => {
      render(<Avatar username="alice" />);
      render(<Avatar username="alice" />);
      render(<Avatar username="alice" />);
      
      expect(mockGenerateAvatarColor).toHaveBeenCalledTimes(3);
      expect(mockGenerateAvatarColor).toHaveBeenCalledWith('alice');
    });

    it('should use the same color for multiple renders of the same username', () => {
      mockGenerateAvatarColor.mockReturnValue('#EF4444');
      
      const { getByText: getByText1 } = render(<Avatar username="alice" />);
      const textElement1 = getByText1('JO');
      const container1 = textElement1.parent?.parent;
      const backgroundColor1 = container1?.props.style.find((s: any) => s.backgroundColor)?.backgroundColor;

      const { getByText: getByText2 } = render(<Avatar username="alice" />);
      const textElement2 = getByText2('JO');
      const container2 = textElement2.parent?.parent;
      const backgroundColor2 = container2?.props.style.find((s: any) => s.backgroundColor)?.backgroundColor;

      expect(backgroundColor1).toBe('#EF4444');
      expect(backgroundColor2).toBe('#EF4444');
      expect(backgroundColor1).toBe(backgroundColor2);
    });

    it('should call generateAvatarColor for each different username', () => {
      render(<Avatar username="alice" />);
      render(<Avatar username="bob" />);
      render(<Avatar username="charlie" />);
      
      expect(mockGenerateAvatarColor).toHaveBeenCalledTimes(3);
      expect(mockGenerateAvatarColor).toHaveBeenCalledWith('alice');
      expect(mockGenerateAvatarColor).toHaveBeenCalledWith('bob');
      expect(mockGenerateAvatarColor).toHaveBeenCalledWith('charlie');
    });
  });
});
