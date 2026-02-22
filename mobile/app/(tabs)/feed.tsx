import React, { useState, useCallback, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    RefreshControl,
    ActivityIndicator,
} from "react-native";
import { postsApi } from "../../lib/api";
import { Post } from "../../types";
import PostCard from "../../components/PostCard";
import EmptyState from "../../components/EmptyState";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";



export default function FeedScreen() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);


    const fetchPosts = useCallback(
        async (p = 1, reset = false) => {
            if (isLoading && !reset) return;
            if (reset) setIsLoading(true);



            try {
                const params: { page: number; limit: number; username?: string } = {
                    page: p,
                    limit: 10,
                };

                const res = await postsApi.getPosts(params);

                const { posts: newPosts, pagination } = res.data.data;

                setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
                setHasMore(pagination.hasNextPage);
                setPage(p + 1);
            } catch {
                
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [isLoading]
    );

    useEffect(() => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
        fetchPosts(1, true);

    }, []);

    const handleRefresh = useCallback(() => {
        setIsRefreshing(true);
        setPosts([]);
        setPage(1);
        setHasMore(true);
        fetchPosts(1, true);
    }, []);

    const handleLoadMore = useCallback(() => {
        if (hasMore && !isLoading) fetchPosts(page);
    }, [hasMore, isLoading, page]);

    // const applyFilter = () => setUsernameFilter(filterInput.trim());
    // const clearFilter = () => {
    //     setFilterInput("");
    //     setUsernameFilter("");
    // };

    return (
        <SafeAreaView className="flex-1 bg-slate-950">
            {/* Header */}
            <View className="px-5 pt-4 pb-3">
                <View className="flex-row items-center justify-between mb-4">
                    <View>
                        <Text className="text-white text-2xl font-bold">Social Feed</Text>
                        <Text className="text-slate-400 text-sm">Hey, @{user?.username} 👋</Text>
                    </View>
                    <View className="w-10 h-10 rounded-2xl bg-violet-600/20 items-center justify-center">
                        <Ionicons name="flash" size={20} color="#8b5cf6" />
                    </View>
                </View>

                {/* Filter Bar */}
                {/* <View className="flex-row items-center gap-2">
                    <View className="flex-1 flex-row items-center bg-slate-800 rounded-2xl px-3 border border-slate-700">
                        <Ionicons name="search-outline" size={18} color="#64748b" />
                        <TextInput
                            className="flex-1 text-white text-sm py-3 ml-2"
                            placeholder="Filter by username..."
                            placeholderTextColor="#475569"
                            value={filterInput}
                            onChangeText={setFilterInput}
                            onSubmitEditing={applyFilter}
                            returnKeyType="search"
                        />
                        {filterInput ? (
                            <TouchableOpacity onPress={clearFilter}>
                                <Ionicons name="close-circle" size={18} color="#64748b" />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                    <TouchableOpacity
                        onPress={applyFilter}
                        className="bg-violet-600 rounded-2xl px-4 py-3"
                    >
                        <Text className="text-white text-sm font-semibold">Search</Text>
                    </TouchableOpacity>
                </View> */}

                {/* Active filter badge */}
                {/* {usernameFilter ? (
                    <View className="flex-row items-center mt-2 gap-2">
                        <View className="flex-row items-center bg-violet-600/20 border border-violet-600/40 rounded-full px-3 py-1 gap-1">
                            <Text className="text-violet-300 text-xs">@{usernameFilter}</Text>
                            <TouchableOpacity onPress={clearFilter}>
                                <Ionicons name="close" size={14} color="#a78bfa" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null} */}
            </View>

            {/* Feed */}
            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <PostCard post={item} />}
                contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor="#8b5cf6"
                        colors={["#8b5cf6"]}
                    />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.3}
                ListEmptyComponent={
                    !isLoading ? (
                        <EmptyState
                            icon="newspaper-outline"
                            title="No posts yet"
                            subtitle={"Be the first to share something!"}
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

            {/* Initial loader */}
            {isLoading && posts.length === 0 && (
                <View className="absolute inset-0 items-center justify-center">
                    <ActivityIndicator size="large" color="#8b5cf6" />
                </View>
            )}
        </SafeAreaView>
    );
}
