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
import { useRouter } from "expo-router";
import { postsApi } from "../../lib/api";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../../components/Avatar";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_CHARS = 500;

export default function CreateScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [text, setText] = useState("");
    const [isPosting, setIsPosting] = useState(false);

    const charsLeft = MAX_CHARS - text.length;
    const isOverLimit = charsLeft < 0;

    const handlePost = async () => {
        if (!text.trim()) {
            Alert.alert("Oops!", "Post cannot be empty.");
            return;
        }
        if (isOverLimit) {
            Alert.alert("Too long!", "Your post exceeds the character limit.");
            return;
        }

        setIsPosting(true);
        try {
            await postsApi.createPost(text.trim());
            setText("");
            router.replace("/feed" as never);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to create post";
            Alert.alert("Error", message);
        } finally {
            setIsPosting(false);
        }
    };

    const progress = Math.min(text.length / MAX_CHARS, 1);
    const circleColor =
        isOverLimit ? "#ef4444" : charsLeft < 50 ? "#f59e0b" : "#8b5cf6";

    return (
        <SafeAreaView className="flex-1 bg-slate-950">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View className="px-5 pt-6 pb-4 flex-row items-center justify-between border-b border-slate-800">
                        <Text className="text-white text-2xl font-bold">New Post</Text>
                        <TouchableOpacity
                            className={`rounded-2xl px-5 py-2.5 flex-row items-center gap-2 ${!text.trim() || isOverLimit || isPosting
                                ? "bg-slate-700"
                                : "bg-violet-600"
                                }`}
                            onPress={handlePost}
                            disabled={!text.trim() || isOverLimit || isPosting}
                        >
                            {isPosting ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <>
                                    <Ionicons name="send" size={16} color="white" />
                                    <Text className="text-white font-bold text-sm">Publish</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Author Row */}
                    <View className="flex-row items-center px-5 pt-5 pb-2">
                        <Avatar username={user?.username ?? "?"} size="md" />
                        <View className="ml-3">
                            <Text className="text-white font-bold">@{user?.username}</Text>
                            <View className="flex-row items-center gap-1 mt-0.5">
                                <Ionicons name="globe-outline" size={12} color="#8b5cf6" />
                                <Text className="text-violet-400 text-xs">Public</Text>
                            </View>
                        </View>
                    </View>

                    {/* Text input */}
                    <View className="px-5 flex-1">
                        <TextInput
                            className="text-white text-lg leading-7 min-h-[160px]"
                            placeholder="What's on your mind?"
                            placeholderTextColor="#475569"
                            value={text}
                            onChangeText={setText}
                            multiline
                            autoFocus
                            maxLength={MAX_CHARS + 50}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Footer */}
                    <View className="px-5 py-4 border-t border-slate-800 flex-row items-center justify-between">
                        <Text className="text-slate-500 text-xs">Text posts only</Text>
                        <View className="flex-row items-center gap-3">
                            {/* Progress circle */}
                            <View className="items-center justify-center">
                                <Text
                                    className={`text-sm font-bold ${isOverLimit
                                        ? "text-red-400"
                                        : charsLeft < 50
                                            ? "text-amber-400"
                                            : "text-slate-400"
                                        }`}
                                >
                                    {charsLeft}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Tips */}
                    <View className="mx-5 mb-8 p-4 rounded-2xl bg-violet-600/10 border border-violet-600/20">
                        <Text className="text-violet-400 text-xs font-semibold mb-1">
                            💡 Tips
                        </Text>
                        <Text className="text-slate-400 text-xs leading-5">
                            Share your thoughts, ideas, or updates. Up to {MAX_CHARS}{" "}
                            characters. Be kind and respectful!
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
