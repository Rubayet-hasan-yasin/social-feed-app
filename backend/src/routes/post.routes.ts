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

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post creation and retrieval
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new text post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", createPostValidation, validate, createPost);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get paginated list of posts (newest first)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *         description: Number of posts per page
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Filter posts by author username (case-insensitive)
 *     responses:
 *       200:
 *         description: List of posts with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedPostsResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", getPostsValidation, validate, getPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a single post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Post data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", getPostById);

/**
 * @swagger
 * tags:
 *   name: Interactions
 *   description: Likes and comments on posts
 */

/**
 * @swagger
 * /api/posts/{id}/like:
 *   post:
 *     summary: Toggle like on a post (like if not liked, unlike if already liked)
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Like toggled — returns liked status and updated likes count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Post liked
 *                 data:
 *                   type: object
 *                   properties:
 *                     liked:
 *                       type: boolean
 *                       example: true
 *                     likesCount:
 *                       type: integer
 *                       example: 12
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/:id/like", toggleLike);

/**
 * @swagger
 * /api/posts/{id}/comment:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddCommentRequest'
 *     responses:
 *       201:
 *         description: Comment added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/:id/comment", addCommentValidation, validate, addComment);

/**
 * @swagger
 * /api/posts/{id}/comments:
 *   get:
 *     summary: Get paginated comments for a post
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post MongoDB ObjectId
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *     responses:
 *       200:
 *         description: Paginated comments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id/comments", getCommentsValidation, validate, getComments);

export default router;
