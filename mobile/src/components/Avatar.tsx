import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { generateAvatarColor, getAvatarInitials } from '../utils/generateColor';


interface AvatarProps {
 
  username: string;
  
  size?: 'small' | 'medium' | 'large';
}


const SIZE_CONFIG = {
  small: {
    container: 32,
    fontSize: 12,
    borderRadius: 16,
  },
  medium: {
    container: 48,
    fontSize: 18,
    borderRadius: 24,
  },
  large: {
    container: 64,
    fontSize: 24,
    borderRadius: 32,
  },
} as const;


export const Avatar: React.FC<AvatarProps> = ({ username, size = 'medium' }) => {
  const backgroundColor = generateAvatarColor(username);
  const initials = getAvatarInitials(username);
  const config = SIZE_CONFIG[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: config.container,
          height: config.container,
          borderRadius: config.borderRadius,
          backgroundColor,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: config.fontSize,
          },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default Avatar;
