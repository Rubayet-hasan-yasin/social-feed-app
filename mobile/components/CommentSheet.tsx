import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import {
    BottomSheetModal,
    BottomSheetFlatList,
    BottomSheetTextInput,
    BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { postsApi } from "../lib/api";
import { Comment } from "../types";
import Avatar from "./Avatar";

interface CommentSheetProps {
    postId: string;
    visible: boolean;
    onClose: () => void;
    onCommentAdded: () => void;
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

function CommentItem({ comment }: { comment: Comment }) {
    return (
        <View className="flex-row py-2.5 gap-2.5">
            <Avatar username={comment.author.username} size="sm" />
            <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-0.5">
                    <Text className="text-slate-300 text-[13px] font-semibold">
                        @{comment.author.username}
                    </Text>
                    <Text className="text-slate-500 text-[11px]">{timeAgo(comment.createdAt)}</Text>
                </View>
                <Text className="text-slate-200 text-sm leading-5">{comment.content}</Text>
            </View>
        </View>
    );
}

export default function CommentSheet({
    postId,
    visible,
    onClose,
    onCommentAdded,
}: CommentSheetProps) {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["55%", "85%"], []);

    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [text, setText] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchComments = useCallback(
        async (pageNum = 1, append = false) => {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);
            try {
                const res = await postsApi.getComments(postId, { page: pageNum, limit: 20 });
                const { comments: fetched, pagination } = res.data.data;
                setComments((prev) => (append ? [...prev, ...fetched] : fetched));
                setHasMore(pagination.hasNextPage);
                setPage(pageNum);
            } catch {
                
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [postId]
    );

    
    useEffect(() => {
        if (visible) {
            bottomSheetModalRef.current?.present();
            fetchComments(1);
        } else {
            bottomSheetModalRef.current?.dismiss();
        }
    }, [visible, fetchComments]);

    const handleDismiss = useCallback(() => {
        setComments([]);
        setPage(1);
        setHasMore(true);
        setText("");
        onClose();
    }, [onClose]);

    const handleSubmit = useCallback(async () => {
        const trimmed = text.trim();
        if (!trimmed || submitting) return;
        setSubmitting(true);
        try {
            const res = await postsApi.addComment(postId, trimmed);
            const {comment: newComment} = res.data.data;
            setComments((prev) => [newComment, ...prev]);
            setText("");
            onCommentAdded();
        } catch {
        
        } finally {
            setSubmitting(false);
        }
    }, [text, submitting, postId, onCommentAdded]);

    const handleLoadMore = useCallback(() => {
        if (hasMore && !loadingMore && !loading) {
            fetchComments(page + 1, true);
        }
    }, [hasMore, loadingMore, loading, page, fetchComments]);

    const renderBackdrop = useCallback(
        (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.6}
            />
        ),
        []
    );

    const renderEmpty = useCallback(() => {
        if (loading) return null;
        return (
            <View className="items-center py-12 gap-2">
                <Ionicons name="chatbubble-outline" size={40} color="#475569" />
                <Text className="text-slate-300 text-[15px] font-semibold">No comments yet</Text>
                <Text className="text-slate-500 text-[13px]">Be the first to comment!</Text>
            </View>
        );
    }, [loading]);

    const renderFooter = useCallback(() => {
        if (!loadingMore) return null;
        return (
            <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#6366f1" />
            </View>
        );
    }, [loadingMore]);

    return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            onDismiss={handleDismiss}
            backdropComponent={renderBackdrop}
            backgroundStyle={{ backgroundColor: "#1e293b", borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
            handleIndicatorStyle={{ backgroundColor: "#475569", width: 40 }}
            keyboardBehavior="extend"
            keyboardBlurBehavior="restore"
        >
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pt-1 pb-3">
                <Text className="text-slate-100 text-base font-bold">Comments</Text>
                <TouchableOpacity onPress={handleDismiss} hitSlop={8}>
                    <Ionicons name="close" size={22} color="#94a3b8" />
                </TouchableOpacity>
            </View>

            <View className="h-px bg-slate-700" />

            {/* Comments list */}
            {loading ? (
                <View className="flex-1 items-center justify-center py-10">
                    <ActivityIndicator size="large" color="#6366f1" />
                </View>
            ) : (
                <BottomSheetFlatList
                    data={comments}
                    keyExtractor={(item: Comment) => item._id}
                    renderItem={({ item }: { item: Comment }) => <CommentItem comment={item} />}
                    ListEmptyComponent={renderEmpty}
                    ListFooterComponent={renderFooter}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.3}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 }}
                />
            )}

            {/* Input bar */}
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <View className="flex-row items-end px-4 py-3 border-t border-slate-700 gap-2.5 bg-slate-800">
                    <BottomSheetTextInput
                        value={text}
                        onChangeText={setText}
                        placeholder="Add a comment…"
                        placeholderTextColor="#475569"
                        multiline
                        maxLength={500}
                        style={{
                            flex: 1,
                            backgroundColor: "#0f172a",
                            borderRadius: 20,
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            color: "#f1f5f9",
                            fontSize: 14,
                            maxHeight: 100,
                            borderWidth: 1,
                            borderColor: "#334155",
                        }}
                    />
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={!text.trim() || submitting}
                        className={`w-10 h-10 rounded-full bg-indigo-500 items-center justify-center ${
                            !text.trim() || submitting ? "opacity-40" : "opacity-100"
                        }`}
                    >
                        {submitting ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Ionicons name="send" size={18} color="#fff" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </BottomSheetModal>
    );
}


