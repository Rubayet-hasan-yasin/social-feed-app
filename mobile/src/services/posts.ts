import { CreatePostRequest, PostsResponse } from '../types/api';
import { Post } from '../types/models';
import apiClient from './api';

/**
 * Posts Service
 * 
 * This module provides API calls for post operations:
 * - getPosts: Fetch paginated posts with optional username filter
 * - createPost: Create a new post
 * - likePost: Like a post
 * - unlikePost: Unlike a post
 * 
 * Requirements: 3.1, 6.5, 8.5
 */

/**
 * Fetch paginated posts from the API
 * 
 * @param page - Page number (1-indexed)
 * @param limit - Number of posts per page
 * @param username - Optional username filter to show posts from specific user
 * @returns Promise resolving to PostsResponse with posts array and pagination info
 * @throws Error if request fails
 * 
 * Validates: Requirements 3.1, 5.2
 */
export const getPosts = async (
  page: number,
  limit: number,
  username?: string
): Promise<PostsResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
  };

  // Add username filter if provided
  if (username && username.trim().length > 0) {
    params.username = username.trim();
  }

  const response = await apiClient.get<PostsResponse>('/posts', { params });
  return response.data;
};

/**
 * Create a new post
 * 
 * @param text - Post content text (max 500 characters)
 * @returns Promise resolving to the created Post
 * @throws Error if creation fails
 * 
 * Validates: Requirements 8.5
 */
export const createPost = async (text: string): Promise<Post> => {
  const requestData: CreatePostRequest = {
    text: text.trim(),
  };

  const response = await apiClient.post<Post>('/posts', requestData);
  return response.data;
};

/**
 * Like a post
 * 
 * @param postId - ID of the post to like
 * @returns Promise resolving to the updated Post
 * @throws Error if request fails
 * 
 * Validates: Requirements 6.5
 */
export const likePost = async (postId: string): Promise<Post> => {
  const response = await apiClient.post<Post>(`/posts/${postId}/like`);
  return response.data;
};

/**
 * Unlike a post
 * 
 * @param postId - ID of the post to unlike
 * @returns Promise resolving to the updated Post
 * @throws Error if request fails
 * 
 * Validates: Requirements 6.5
 */
export const unlikePost = async (postId: string): Promise<Post> => {
  const response = await apiClient.delete<Post>(`/posts/${postId}/like`);
  return response.data;
};
