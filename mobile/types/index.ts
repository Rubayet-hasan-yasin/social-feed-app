export interface User {
    _id: string;
    username: string;
    email: string;
    createdAt: string;
}

export interface Comment {
    _id: string;
    content: string;
    author: {
        _id: string;
        username: string;
    };
    createdAt: string;
}

export interface Post {
    _id: string;
    content: string;
    author: {
        _id: string;
        username: string;
    };
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface PaginatedPostsResponse {
    success: boolean;
    data: {
        posts: Post[];
        pagination: PaginationMeta;
    };
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
}

export interface AuthData {
    token: string;
    user: User;
}
