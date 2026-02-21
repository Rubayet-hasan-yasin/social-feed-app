import { Request, Response } from "express";
import { body, query } from "express-validator";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { successResponse, errorResponse } from "../utils/response.utils.js";
import { User } from "../models/user.model.js";

//Validation rules

export const createPostValidation = [
  body("content")
    .trim()
    .notEmpty().withMessage("Post content is required")
    .isLength({ max: 500 }).withMessage("Post content must not exceed 500 characters"),
];

export const getPostsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 10, max: 50 }).withMessage("limit must be between 10 and 50"),
  query("username")
    .optional()
    .isString().trim(),
];

// Controller handlers

/**
 * POST /api/posts
 * Creates a new
 */
export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const post = await Post.create({ content, author: req.user!.id });

    // Populate author info before responding
    const populated = await post.populate("author", "username email");
    successResponse(res, { post }, "Post created", 201);
  } catch {
    errorResponse(res, "Failed to create post", 500);
  }
};

/**
 * GET /api/posts
 *optional ?username= filter and ?page= / ?limit= parameters.
 */
export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;
    const usernameFilter = (req.query.username as string | undefined)?.trim();
    const currentUserId = req.user!.id;


    let authorFilter: Record<string, unknown> = {};
    if (usernameFilter) {
      const targetUser = await User.findOne({
        username: { $regex: new RegExp(`^${usernameFilter}$`, "i") },
      });
      if (!targetUser) {
        successResponse(res, {
          posts: [],
          pagination: { total: 0, page, limit, totalPages: 0, hasNextPage: false, hasPrevPage: false },
        }, "Posts fetched successfully");
        return;
      }
      authorFilter = { author: targetUser._id };
    }

    const [posts, total] = await Promise.all([
      Post.find(authorFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username email"),
      Post.countDocuments(authorFilter),
    ]);

    
    const commentCounts = await Promise.all(
      posts.map((p) => Comment.countDocuments({ post: p._id }))
    );

    const enrichedPosts = posts.map((post, i) => {
      const obj = post.toJSON() as unknown as Record<string, unknown>;
      obj.likesCount = (post.likes as unknown[]).length;
      obj.commentsCount = commentCounts[i];
      obj.isLiked = post.likes.some((id) => id.toString() === currentUserId);
      return obj;
    });

    const totalPages = Math.ceil(total / limit);

    successResponse(res, {
      posts: enrichedPosts,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }, "Posts fetched successfully");
  } catch (err) {
    console.error(err);
    errorResponse(res, "Failed to fetch posts", 500);
  }
};

/**
 * GET /api/posts/:id
 */
export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username email");
    if (!post) {
      errorResponse(res, "Post not found", 404);
      return;
    }

    const commentsCount = await Comment.countDocuments({ post: post._id });
    const obj = post.toJSON() as unknown as Record<string, unknown>;
    obj.likesCount = (post.likes as unknown[]).length;
    obj.commentsCount = commentsCount;
    obj.isLiked = post.likes.some((id) => id.toString() === req.user!.id);

    successResponse(res, { post: obj }, "Post fetched");
  } catch {
    errorResponse(res, "Failed to fetch post", 500);
  }
};
