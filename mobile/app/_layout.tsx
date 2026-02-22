import "../global.css";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

function AuthGate() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = (segments[0] as string) === "(auth)";
    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/login" as never);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/feed" as never);
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <AuthProvider>
          <AuthGate />
        </AuthProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
