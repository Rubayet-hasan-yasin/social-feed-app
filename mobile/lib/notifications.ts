import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { authApi } from "./api";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotifications(): Promise<
    string | undefined
> {

    if (!Device.isDevice) {
        console.log("Push notifications only work on physical devices.");
        return undefined;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        console.log("Push notification permission denied.");
        return undefined;
    }

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#6C63FF",
        });
    }

    const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
        console.log('Project ID not found');
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    console.log("Attempt to register push token:", token);

    
    try {
        await authApi.updatePushToken(token);
    } catch (err) {
        console.warn("Failed to save push token:", err);
    }

    return token;
}
