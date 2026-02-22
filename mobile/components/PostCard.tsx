import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "../types";
import Avatar from "./Avatar";
import CommentSheet from "./CommentSheet";
import { postsApi } from "../lib/api";

interface PostCardProps {
    post: Post;
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export default function PostCard({ post }: PostCardProps) {
    const [liked, setLiked] = useState(post.isLiked);
    const [likesCount, setLikesCount] = useState(post.likesCount);
    const [commentsCount, setCommentsCount] = useState(post.commentsCount);
    const [isLiking, setIsLiking] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const scaleAnim = new Animated.Value(1);

    

    const handleLike = useCallback(async () => {
        if (isLiking) return;
        setIsLiking(true);
        

        
        const newLiked = !liked;
        const newCount = newLiked ? likesCount + 1 : likesCount - 1;
        setLiked(newLiked);
        setLikesCount(newCount);

       
        try {
            const res = await postsApi.toggleLike(post._id);
            
            const { liked: serverLiked, likesCount: serverCount } = res.data.data;
            setLiked(serverLiked);
            setLikesCount(serverCount);
        } catch {
            
            setLiked(!newLiked);
            setLikesCount(likesCount);
        } finally {
            setIsLiking(false);
        }
    }, [isLiking, liked, likesCount, post._id]);

    return (
        <>
            <View className="mx-4 mb-3 bg-slate-800 rounded-3xl overflow-hidden border border-slate-700">
                {/* Author header */}
                <View className="flex-row items-center px-4 pt-4 pb-3">
                    <Avatar username={post.author.username} size="md" />
                    <View className="flex-1 ml-3">
                        <Text className="text-white font-semibold text-sm">
                            @{post.author.username}
                        </Text>
                        <Text className="text-slate-500 text-xs mt-0.5">
                            {timeAgo(post.createdAt)}
                        </Text>
                    </View>
                </View>

                {/* Post text */}
                <View className="px-4 pb-4">
                    <Text className="text-slate-100 text-base leading-6">{post.content}</Text>
                </View>

                {/* Divider */}
                <View className="h-px bg-slate-700 mx-4" />

                {/* Actions */}
                <View className="flex-row px-4 py-3 gap-6">
                    {/* Like */}
                    <TouchableOpacity
                        onPress={handleLike}
                        disabled={isLiking}
                        className="flex-row items-center gap-2"
                    >
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <Ionicons
                                name={liked ? "heart" : "heart-outline"}
                                size={22}
                                color={liked ? "#f43f5e" : "#94a3b8"}
                            />
                        </Animated.View>
                        <Text
                            className={`text-sm font-semibold ${liked ? "text-rose-400" : "text-slate-400"}`}
                        >
                            {likesCount}
                        </Text>
                    </TouchableOpacity>

                    {/* Comment */}
                    <TouchableOpacity
                        onPress={() => setShowComments(true)}
                        className="flex-row items-center gap-2"
                    >
                        <Ionicons name="chatbubble-outline" size={20} color="#94a3b8" />
                        <Text className="text-slate-400 text-sm font-semibold">
                            {commentsCount}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <CommentSheet
                postId={post._id}
                visible={showComments}
                onClose={() => setShowComments(false)}
                onCommentAdded={() => setCommentsCount((c) => c + 1)}
            />
        </>
    );
}
