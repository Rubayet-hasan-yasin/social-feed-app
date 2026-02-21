import swaggerJsdoc from "swagger-jsdoc";
import { ENV } from "./env.js";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mini Social Feed API",
      version: "1.0.0",
      description:
        "REST API for the Mini Social Feed App — handles authentication, posts, likes, comments, and Expo push notifications.",
      contact: {
        name: "Mini Social Feed",
      },
    },
    servers: [
      {
        url: `http://localhost:${ENV.PORT}`,
        description: "Development server",
      },
      {
        url: `http://localhost:8000`,
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token obtained from /api/auth/login",
        },
      },
      schemas: {
        // ─── Auth ───────────────────────────────────────────────────
        RegisterRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string", example: "john_doe", minLength: 3, maxLength: 30 },
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", format: "password", example: "secret123", minLength: 6 },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "john@example.com" },
            password: { type: "string", format: "password", example: "secret123" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Login successful" },
            data: {
              type: "object",
              properties: {
                token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                user: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },
        PushTokenRequest: {
          type: "object",
          required: ["pushToken"],
          properties: {
            pushToken: { type: "string", example: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]", description: "Expo push token obtained from expo-notifications on the mobile app" },
          },
        },

        // ─── User ────────────────────────────────────────────────────
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64a7f3c2e4b0c12345678901" },
            username: { type: "string", example: "john_doe" },
            email: { type: "string", example: "john@example.com" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        // ─── Post ────────────────────────────────────────────────────
        Post: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64a7f3c2e4b0c12345678902" },
            content: { type: "string", example: "Hello world! This is my first post." },
            author: { $ref: "#/components/schemas/User" },
            likes: {
              type: "array",
              items: { type: "string" },
              example: ["64a7f3c2e4b0c12345678901"],
            },
            likesCount: { type: "integer", example: 5 },
            commentsCount: { type: "integer", example: 3 },
            isLiked: { type: "boolean", example: false, description: "Whether the requesting user has liked this post" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreatePostRequest: {
          type: "object",
          required: ["content"],
          properties: {
            content: {
              type: "string",
              example: "Hello world! This is my first post.",
              maxLength: 500,
            },
          },
        },
        PaginatedPostsResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Posts fetched successfully" },
            data: {
              type: "object",
              properties: {
                posts: { type: "array", items: { $ref: "#/components/schemas/Post" } },
                pagination: {
                  type: "object",
                  properties: {
                    total: { type: "integer", example: 42 },
                    page: { type: "integer", example: 1 },
                    limit: { type: "integer", example: 10 },
                    totalPages: { type: "integer", example: 5 },
                    hasNextPage: { type: "boolean", example: true },
                    hasPrevPage: { type: "boolean", example: false },
                  },
                },
              },
            },
          },
        },

        // ─── Comment ─────────────────────────────────────────────────
        Comment: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64a7f3c2e4b0c12345678903" },
            post: { type: "string", example: "64a7f3c2e4b0c12345678902" },
            author: { $ref: "#/components/schemas/User" },
            content: { type: "string", example: "Great post!" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        AddCommentRequest: {
          type: "object",
          required: ["content"],
          properties: {
            content: {
              type: "string",
              example: "Great post!",
              maxLength: 300,
            },
          },
        },

        // ─── Generic ─────────────────────────────────────────────────
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Operation successful" },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Something went wrong" },
            errors: { type: "array", items: { type: "object" } },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
