import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Post } from '../types/models';
import { formatRelativeTime } from '../utils/formatTime';
import { Avatar } from './Avatar';

interface PostCardProps {
  post: Post;
  onLike: (postId: string, isLiked: boolean) => Promise<void>;
  onComment: (post: Post) => void;
}


export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment }) => {
  const handleLikePress = () => {
    onLike(post.id, post.isLiked);
  };

  const handleCommentPress = () => {
    onComment(post);
  };

  return (
    <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header: Avatar and User Info */}
      <View className="flex-row items-center mb-3">
        <Avatar username={post.username} size="medium" />
        <View className="ml-3 flex-1">
          <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {post.username}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {formatRelativeTime(post.createdAt)}
          </Text>
        </View>
      </View>

      {/* Post Content */}
      <Text className="text-base text-gray-800 dark:text-gray-200 mb-4 leading-6">
        {post.text}
      </Text>

      {/* Action Buttons */}
      <View className="flex-row items-center pt-3 border-t border-gray-100 dark:border-gray-700">
        {/* Like Button */}
        <TouchableOpacity
          onPress={handleLikePress}
          className="flex-row items-center mr-6"
          accessibilityRole="button"
          accessibilityLabel={`Like button. ${post.likeCount} likes`}
          accessibilityHint="Double tap to like or unlike this post"
        >
          <Ionicons
            name={post.isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={post.isLiked ? '#EF4444' : '#6B7280'}
          />
          <Text className={`ml-2 text-sm font-medium ${post.isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
            {post.likeCount}
          </Text>
        </TouchableOpacity>

        {/* Comment Button */}
        <TouchableOpacity
          onPress={handleCommentPress}
          className="flex-row items-center"
          accessibilityRole="button"
          accessibilityLabel={`Comment button. ${post.commentCount} comments`}
          accessibilityHint="Double tap to view and add comments"
        >
          <Ionicons
            name="chatbubble-outline"
            size={22}
            color="#6B7280"
          />
          <Text className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
            {post.commentCount}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
