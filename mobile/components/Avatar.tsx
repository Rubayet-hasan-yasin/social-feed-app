import React from "react";
import { View, Text } from "react-native";

interface AvatarProps {
    username: string;
    size?: "sm" | "md" | "lg";
}

const COLORS = [
    "bg-violet-600",
    "bg-blue-600",
    "bg-emerald-600",
    "bg-rose-600",
    "bg-amber-600",
    "bg-cyan-600",
    "bg-pink-600",
    "bg-indigo-600",
];

function stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
}

const sizeMap = {
    sm: { outer: "w-8 h-8 rounded-xl", text: "text-xs font-bold" },
    md: { outer: "w-11 h-11 rounded-2xl", text: "text-sm font-bold" },
    lg: { outer: "w-14 h-14 rounded-3xl", text: "text-xl font-bold" },
};

export default function Avatar({ username, size = "md" }: AvatarProps) {
    const initials = username.slice(0, 2).toUpperCase();
    const colorClass = stringToColor(username);
    const { outer, text } = sizeMap[size];
    return (
        <View className={`${outer} ${colorClass} items-center justify-center`}>
            <Text className={`${text} text-white`}>{initials}</Text>
        </View>
    );
}
