import { Router } from "express";
import {
  createPost,
  getPosts,
  getPostById,
  createPostValidation,
  getPostsValidation,
} from "../controllers/post.controller.js";
import {
  toggleLike,
  addComment,
  getComments,
  addCommentValidation,
  getCommentsValidation,
} from "../controllers/interaction.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

// All post routes require authentication
router.use(authenticate);


router.post("/", createPostValidation, validate, createPost);

router.get("/", getPostsValidation, validate, getPosts);

router.get("/:id", getPostById);

router.post("/:id/like", toggleLike);

router.post("/:id/comment", addCommentValidation, validate, addComment);

router.get("/:id/comments", getCommentsValidation, validate, getComments);

export default router;
