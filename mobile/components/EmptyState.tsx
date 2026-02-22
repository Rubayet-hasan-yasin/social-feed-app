import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
}

export default function EmptyState({
    icon = "document-outline",
    title,
    subtitle,
}: EmptyStateProps) {
    return (
        <View className="flex-1 items-center justify-center py-20 px-8">
            <View className="w-24 h-24 rounded-full bg-slate-800 items-center justify-center mb-6">
                <Ionicons name={icon} size={44} color="#6C63FF" />
            </View>
            <Text className="text-white text-xl font-bold text-center mb-2">
                {title}
            </Text>
            {subtitle && (
                <Text className="text-slate-400 text-base text-center">{subtitle}</Text>
            )}
        </View>
    );
}
