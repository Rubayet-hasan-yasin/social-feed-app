import { Request, Response } from "express";
import { body, query } from "express-validator";
import mongoose from "mongoose";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import { sendPushNotification } from "../utils/push-notification.utils.js";
import { successResponse, errorResponse } from "../utils/response.utils.js";

// Validation rules

export const addCommentValidation = [
  body("content")
    .trim()
    .notEmpty().withMessage("Comment content is required")
    .isLength({ max: 300 }).withMessage("Comment must not exceed 300 characters"),
];

export const getCommentsValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("limit must be 1–50"),
];


const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

/**
 * POST /api/posts/:id/like
 * Toggles a like on a post
 */
export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!isValidObjectId(id)) {
      errorResponse(res, "Invalid post ID", 400);
      return;
    }

    const userId = req.user!.id;
    const post = await Post.findById(id).populate<{ author: { _id: mongoose.Types.ObjectId; pushToken?: string; username: string } }>("author", "username pushToken");

    if (!post) {
      errorResponse(res, "Post not found", 404);
      return;
    }

    const alreadyLiked = post.likes.some((uid) => uid.toString() === userId);

    if (alreadyLiked) {
      // Unlike
      await Post.findByIdAndUpdate(id, { $pull: { likes: userId } });
      successResponse(res, { liked: false, likesCount: post.likes.length - 1 }, "Post unliked");
    } else {
      // Like
      await Post.findByIdAndUpdate(id, { $addToSet: { likes: userId } });

     
      const author = post.author as { _id: mongoose.Types.ObjectId; pushToken?: string; username: string };
      if (author._id.toString() !== userId && author.pushToken) {
        void sendPushNotification({
          pushToken: author.pushToken,
          type: "like",
          actorUsername: req.user!.username,
          postId: id,
        });
      }

      successResponse(res, { liked: true, likesCount: post.likes.length + 1 }, "Post liked");
    }
  } catch {
    errorResponse(res, "Failed to toggle like", 500);
  }
};

//Comments

/**
 * POST /api/posts/:id/comment
 * Adds a comment to a post
 */
export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!isValidObjectId(id)) {
      errorResponse(res, "Invalid post ID", 400);
      return;
    }

    const post = await Post.findById(id).populate<{ author: { _id: mongoose.Types.ObjectId; pushToken?: string } }>("author", "pushToken");
    if (!post) {
      errorResponse(res, "Post not found", 404);
      return;
    }

    const comment = await Comment.create({
      post: id,
      author: req.user!.id,
      content: req.body.content,
    });

    const populated = await comment.populate("author", "username email");

    const author = post.author as { _id: mongoose.Types.ObjectId; pushToken?: string };
    if (author._id.toString() !== req.user!.id && author.pushToken) {
      void sendPushNotification({
        pushToken: author.pushToken,
        type: "comment",
        actorUsername: req.user!.username,
        postId: id,
      });
    }

    successResponse(res, { comment: populated }, "Comment added", 201);
  } catch {
    errorResponse(res, "Failed to add comment", 500);
  }
};

/**
 * GET /api/posts/:id/comments
 */
export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    if (!isValidObjectId(id)) {
      errorResponse(res, "Invalid post ID", 400);
      return;
    }

    const postExists = await Post.exists({ _id: id });
    if (!postExists) {
      errorResponse(res, "Post not found", 404);
      return;
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 50));
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find({ post: id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username email"),
      Comment.countDocuments({ post: id }),
    ]);

    const totalPages = Math.ceil(total / limit);

    successResponse(res, {
      comments,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }, "Comments fetched");
  } catch {
    errorResponse(res, "Failed to fetch comments", 500);
  }
};
