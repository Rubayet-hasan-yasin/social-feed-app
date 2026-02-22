import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-20 px-8">
      <View className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-6">
        <Ionicons name={icon} size={48} color="#3B82F6" />
      </View>
      <Text className="text-gray-900 dark:text-white text-xl font-semibold text-center mb-2">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-gray-500 dark:text-gray-400 text-base text-center">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
