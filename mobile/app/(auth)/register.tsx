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


const InputField = ({
    icon,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType,
    autoCapitalize,
    rightIcon,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    placeholder: string;
    value: string;
    onChangeText: (t: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: "email-address" | "default";
    autoCapitalize?: "none" | "words";
    rightIcon?: React.ReactNode;
}) => (
    <View className="flex-row items-center bg-slate-800 rounded-2xl px-4 border border-slate-700">
        <Ionicons name={icon} size={20} color="#94a3b8" />
        <TextInput
            className="flex-1 text-white text-base py-4 ml-3"
            placeholder={placeholder}
            placeholderTextColor="#475569"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize ?? "none"}
            autoCorrect={false}
        />
        {rightIcon}
    </View>
);

export default function RegisterScreen() {
    const router = useRouter();
    const { register } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!username.trim() || !email.trim() || !password.trim()) {
            Alert.alert("Validation", "Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Validation", "Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Validation", "Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        try {
            await register(username.trim(), email.trim().toLowerCase(), password);
            router.replace("/(tabs)/feed");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Registration failed";
            Alert.alert("Registration Failed", message);
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
                <View className="pt-16 pb-8 px-6 items-center">
                    <View className="w-20 h-20 rounded-3xl bg-violet-600 items-center justify-center mb-5 shadow-lg">
                        <Ionicons name="person-add" size={38} color="white" />
                    </View>
                    <Text className="text-white text-4xl font-bold tracking-tight">
                        Join SocialFeed
                    </Text>
                    <Text className="text-slate-400 text-base mt-2 text-center">
                        Create an account and start sharing
                    </Text>
                </View>

                {/* Form */}
                <View className="px-6 flex-1 gap-4">
                    {/* Username */}
                    <View>
                        <Text className="text-slate-300 text-sm font-semibold mb-2 ml-1">
                            Username
                        </Text>
                        <InputField
                            icon="at-outline"
                            placeholder="johndoe"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Email */}
                    <View>
                        <Text className="text-slate-300 text-sm font-semibold mb-2 ml-1">
                            Email address
                        </Text>
                        <InputField
                            icon="mail-outline"
                            placeholder="you@example.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Password */}
                    <View>
                        <Text className="text-slate-300 text-sm font-semibold mb-2 ml-1">
                            Password
                        </Text>
                        <InputField
                            icon="lock-closed-outline"
                            placeholder="Min. 6 characters"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            rightIcon={
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
                            }
                        />
                    </View>

                    {/* Confirm Password */}
                    <View>
                        <Text className="text-slate-300 text-sm font-semibold mb-2 ml-1">
                            Confirm password
                        </Text>
                        <InputField
                            icon="shield-checkmark-outline"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                        />
                    </View>

                    {/* Submit */}
                    <TouchableOpacity
                        className="bg-violet-600 rounded-2xl py-4 items-center mt-2 shadow-lg active:bg-violet-700"
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white text-base font-bold">
                                Create Account
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Sign In Link */}
                    <View className="flex-row justify-center pb-8 mt-4">
                        <Text className="text-slate-400 text-base">
                            Already have an account?{" "}
                        </Text>
                        <Link href="/(auth)/login" asChild>
                            <TouchableOpacity>
                                <Text className="text-violet-400 font-bold text-base">
                                    Sign in
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
