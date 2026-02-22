
import { Comment, Post, User } from './models';


export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}


export interface PostsResponse {
  posts: Post[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface CreatePostRequest {
  text: string;
}

export interface CommentsResponse {
  comments: Comment[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface CreateCommentRequest {
  text: string;
}


export interface ApiError {
  message: string;
  statusCode?: number;
}
