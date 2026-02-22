import { CommentsResponse, CreateCommentRequest } from '../types/api';
import { Comment } from '../types/models';
import apiClient from './api';

/**
 * Comments Service
 * 
 * This module provides API calls for comment operations:
 * - getComments: Fetch paginated comments for a post
 * - createComment: Create a new comment on a post
 * 
 * Requirements: 7.2, 7.5
 */

/**
 * Fetch paginated comments for a specific post
 * 
 * @param postId - ID of the post to fetch comments for
 * @param page - Page number (1-indexed)
 * @param limit - Number of comments per page
 * @returns Promise resolving to CommentsResponse with comments array and pagination info
 * @throws Error if request fails
 * 
 * Validates: Requirements 7.2
 */
export const getComments = async (
  postId: string,
  page: number,
  limit: number
): Promise<CommentsResponse> => {
  const params = {
    page,
    limit,
  };

  const response = await apiClient.get<CommentsResponse>(
    `/posts/${postId}/comments`,
    { params }
  );
  return response.data;
};

/**
 * Create a new comment on a post
 * 
 * @param postId - ID of the post to comment on
 * @param text - Comment content text (max 500 characters)
 * @returns Promise resolving to the created Comment
 * @throws Error if creation fails
 * 
 * Validates: Requirements 7.5
 */
export const createComment = async (
  postId: string,
  text: string
): Promise<Comment> => {
  const requestData: CreateCommentRequest = {
    text: text.trim(),
  };

  const response = await apiClient.post<Comment>(
    `/posts/${postId}/comments`,
    requestData
  );
  return response.data;
};
