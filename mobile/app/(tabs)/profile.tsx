import React, { useState, useCallback, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { postsApi } from "../../lib/api";
import { Post } from "../../types";
import PostCard from "../../components/PostCard";
import Avatar from "../../components/Avatar";
import EmptyState from "../../components/EmptyState";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [totalPosts, setTotalPosts] = useState(0);

    const fetchMyPosts = useCallback(
        async (p = 1, reset = false) => {
            if (!user) return;
            if (isLoading && !reset) return;
            if (reset) setIsLoading(true);

            try {
                const res = await postsApi.getPosts({
                    page: p,
                    limit: 10,
                    username: user.username,
                });
                const { posts: newPosts, pagination } = res.data.data;
                setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
                setHasMore(pagination.hasNextPage);
                setTotalPosts(pagination.total);
                setPage(p + 1);
            } catch {
                
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [user, isLoading]
    );

    useEffect(() => {
        fetchMyPosts(1, true);
    }, []);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setPosts([]);
        setPage(1);
        setHasMore(true);
        fetchMyPosts(1, true);
    }, []);

    const handleLogout = () => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Sign Out",
                style: "destructive",
                onPress: async () => {
                    await logout();
                    router.replace("/login" as never);
                },
            },
        ]);
    };

    const ProfileHeader = () => (
        <View>
            {/* Banner */}
            <View className="h-28 bg-gradient-to-br from-violet-900 to-slate-900 relative">
                <View className="absolute inset-0 bg-violet-700/30" />
            </View>

            {/* Avatar + Info */}
            <View className="px-5 pb-5 border-b border-slate-800">
                <View className="flex-row items-end justify-between -mt-9 mb-4">
                    <View className="border-4 border-slate-950 rounded-3xl">
                        <Avatar username={user?.username ?? "?"} size="lg" />
                    </View>
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="flex-row items-center gap-2 bg-slate-800 rounded-2xl px-4 py-2.5 border border-slate-700"
                    >
                        <Ionicons name="log-out-outline" size={16} color="#94a3b8" />
                        <Text className="text-slate-300 text-sm font-semibold">Sign out</Text>
                    </TouchableOpacity>
                </View>

                <Text className="text-white text-xl font-bold">@{user?.username}</Text>
                <Text className="text-slate-400 text-sm mt-0.5">{user?.email}</Text>

                {/* Stats */}
                <View className="flex-row mt-4 gap-6">
                    <View className="items-center bg-slate-800 rounded-2xl px-5 py-3">
                        <Text className="text-white text-xl font-bold">{totalPosts}</Text>
                        <Text className="text-slate-400 text-xs mt-0.5">Posts</Text>
                    </View>
                </View>
            </View>

            <View className="px-5 py-4">
                <Text className="text-white text-base font-bold">My Posts</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-950">
            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <PostCard post={item} />}
                ListHeaderComponent={<ProfileHeader />}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor="#8b5cf6"
                        colors={["#8b5cf6"]}
                    />
                }
                onEndReached={() => hasMore && !isLoading && fetchMyPosts(page)}
                onEndReachedThreshold={0.3}
                contentContainerStyle={{ paddingBottom: 24 }}
                ListEmptyComponent={
                    !isLoading ? (
                        <EmptyState
                            icon="create-outline"
                            title="No posts yet"
                            subtitle="Tap the + button to write your first post!"
                        />
                    ) : null
                }
                ListFooterComponent={
                    isLoading && posts.length > 0 ? (
                        <ActivityIndicator
                            color="#8b5cf6"
                            style={{ paddingVertical: 20 }}
                        />
                    ) : null
                }
            />
            {isLoading && posts.length === 0 && (
                <View className="absolute inset-0 items-center justify-center">
                    <ActivityIndicator size="large" color="#8b5cf6" />
                </View>
            )}
        </SafeAreaView>
    );
}
