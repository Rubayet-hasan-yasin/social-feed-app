import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform, View } from "react-native";
import { useEffect, useRef } from "react";
import { registerForPushNotifications } from "@/lib/notifications";
import * as Notifications from "expo-notifications";


export default function TabsLayout() {
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
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#0f172a",
                    borderTopColor: "#1e293b",
                    borderTopWidth: 1,
                    height: Platform.OS === "ios" ? 88 : 68,
                    paddingBottom: Platform.OS === "ios" ? 24 : 12,
                    paddingTop: 10,
                    marginBottom: 2,
                },
                tabBarActiveTintColor: "#8b5cf6",
                tabBarInactiveTintColor: "#475569",
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "600",
                },
            }}
        >
            <Tabs.Screen
                name="feed"
                options={{
                    title: "Feed",
                    tabBarIcon: ({ color, focused }) => (
                        <View className={focused ? "bg-violet-600/20 rounded-2xl py-1" : " py-1"}>
                            <Ionicons
                                name={focused ? "home" : "home-outline"}
                                size={20}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: "Post",
                    tabBarIcon: ({ focused }) => (
                        <View className="bg-violet-600 rounded-2xl shadow-lg">
                            <Ionicons name="add" size={24} color="white" />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: "Alerts",
                    tabBarIcon: ({ color, focused }) => (
                        <View className={focused ? "bg-violet-600/20 rounded-2xl px-0 py-1" : "px-0 py-1"}>
                            <Ionicons
                                name={focused ? "notifications" : "notifications-outline"}
                                size={20}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, focused }) => (
                        <View className={focused ? "bg-violet-600/20 rounded-2xl px-0 py-1" : "px-0 py-1"}>
                            <Ionicons
                                name={focused ? "person" : "person-outline"}
                                size={20}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}
