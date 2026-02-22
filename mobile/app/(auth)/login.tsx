import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Validation", "Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        try {
            await login(email.trim(), password);
            router.replace("/(tabs)/feed");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Login failed";
            Alert.alert("Login Failed", message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-slate-950"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View className="pt-20 pb-12 px-6 items-center">
                    <View className="w-20 h-20 rounded-3xl bg-violet-600 items-center justify-center mb-6 shadow-lg">
                        <Ionicons name="chatbubbles" size={40} color="white" />
                    </View>
                    <Text className="text-white text-4xl font-bold tracking-tight">
                        Welcome back
                    </Text>
                    <Text className="text-slate-400 text-base mt-2 text-center">
                        Sign in to your account to continue
                    </Text>
                </View>

                {/* Form */}
                <View className="px-6 flex-1">
                    {/* Email */}
                    <View className="mb-4">
                        <Text className="text-slate-300 text-sm font-semibold mb-2 ml-1">
                            Email address
                        </Text>
                        <View className="flex-row items-center bg-slate-800 rounded-2xl px-4 border border-slate-700">
                            <Ionicons name="mail-outline" size={20} color="#94a3b8" />
                            <TextInput
                                className="flex-1 text-white text-base py-4 ml-3"
                                placeholder="you@example.com"
                                placeholderTextColor="#475569"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    {/* Password */}
                    <View className="mb-6">
                        <Text className="text-slate-300 text-sm font-semibold mb-2 ml-1">
                            Password
                        </Text>
                        <View className="flex-row items-center bg-slate-800 rounded-2xl px-4 border border-slate-700">
                            <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
                            <TextInput
                                className="flex-1 text-white text-base py-4 ml-3"
                                placeholder="Enter your password"
                                placeholderTextColor="#475569"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                className="p-1"
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#94a3b8"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Submit */}
                    <TouchableOpacity
                        className="bg-violet-600 rounded-2xl py-4 items-center shadow-lg active:bg-violet-700"
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white text-base font-bold">Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Divider */}
                    <View className="flex-row items-center my-8">
                        <View className="flex-1 h-px bg-slate-700" />
                        <Text className="text-slate-500 mx-4 text-sm">or</Text>
                        <View className="flex-1 h-px bg-slate-700" />
                    </View>

                    {/* Sign Up Link */}
                    <View className="flex-row justify-center pb-8">
                        <Text className="text-slate-400 text-base">
                            Don't have an account?{" "}
                        </Text>
                        <Link href="/(auth)/register" asChild>
                            <TouchableOpacity>
                                <Text className="text-violet-400 font-bold text-base">
                                    Create one
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
