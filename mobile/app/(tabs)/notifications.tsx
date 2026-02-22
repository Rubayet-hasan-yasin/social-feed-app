import React, { useEffect, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { registerForPushNotifications } from "../../lib/notifications";
import { SafeAreaView } from "react-native-safe-area-context";

interface NotificationItem {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    iconBg: string;
    title: string;
    body: string;
    time: string;
}

const SAMPLE: NotificationItem[] = [
    {
        id: "1",
        icon: "heart",
        iconColor: "#f43f5e",
        iconBg: "bg-rose-600/20",
        title: "New Like",
        body: "Someone liked your post",
        time: "just now",
    },
    {
        id: "2",
        icon: "chatbubble",
        iconColor: "#8b5cf6",
        iconBg: "bg-violet-600/20",
        title: "New Comment",
        body: "Someone commented on your post",
        time: "2m ago",
    },
    {
        id: "3",
        icon: "heart",
        iconColor: "#f43f5e",
        iconBg: "bg-rose-600/20",
        title: "New Like",
        body: "Someone liked your post",
        time: "5m ago",
    },
];

export default function NotificationsScreen() {
    const notificationListener = useRef<Notifications.EventSubscription | null>(null);
    const responseListener = useRef<Notifications.EventSubscription | null>(null);

    useEffect(() => {
  
        registerForPushNotifications().catch(() => { });

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                console.log("Notification received:", notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log("Notification tapped:", response);
            });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-slate-950">
            {/* Header */}
            <View className="px-5 pt-6 pb-4 flex-row items-center justify-between border-b border-slate-800">
                <View>
                    <Text className="text-white text-2xl font-bold">Notifications</Text>
                    <Text className="text-slate-400 text-sm">Stay up to date</Text>
                </View>
                <View className="w-10 h-10 rounded-2xl bg-violet-600/20 items-center justify-center">
                    <Ionicons name="notifications" size={20} color="#8b5cf6" />
                </View>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            >
                {/* FCM Active Banner */}
                <View className="bg-violet-600/10 border border-violet-600/30 rounded-2xl p-4 mb-5 flex-row items-start gap-3">
                    <Ionicons name="flash-outline" size={20} color="#8b5cf6" />
                    <View className="flex-1">
                        <Text className="text-violet-300 font-semibold text-sm">
                            Push notifications active
                        </Text>
                        <Text className="text-slate-400 text-xs mt-1 leading-4">
                            You'll receive real-time push notifications when someone likes or
                            comments on your post via Firebase Cloud Messaging.
                        </Text>
                    </View>
                </View>

                {/* Notification List */}
                <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 ml-1">
                    Recent
                </Text>
                {SAMPLE.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        className="flex-row items-center bg-slate-800 rounded-2xl p-4 mb-3 border border-slate-700"
                        activeOpacity={0.7}
                    >
                        <View
                            className={`w-12 h-12 rounded-2xl ${item.iconBg} items-center justify-center mr-4`}
                        >
                            <Ionicons name={item.icon} size={24} color={item.iconColor} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-white font-semibold text-sm">
                                {item.title}
                            </Text>
                            <Text className="text-slate-400 text-xs mt-0.5">{item.body}</Text>
                        </View>
                        <Text className="text-slate-500 text-xs">{item.time}</Text>
                    </TouchableOpacity>
                ))}

                {/* Empty hint */}
                <View className="items-center py-6">
                    <Text className="text-slate-600 text-xs text-center">
                        Live notifications will appear here via FCM
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
