import swaggerJsdoc from "swagger-jsdoc";
import { ENV } from "./env.js";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mini Social Feed API",
      version: "1.0.0",
      description:
        "REST API for the Mini Social Feed App — authentication, posts, likes, comments, and Expo push notifications.",
      contact: { name: "Mini Social Feed" },
    },
    servers: [
      { url: `http://localhost:${ENV.PORT}`, description: "Local dev" },
      { url: "https://social-feed-app-chi.vercel.app", description: "Production" },
    ],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT obtained from POST /api/auth/login",
        },
      },
      schemas: {
        
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
            pushToken: {
              type: "string",
              example: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
              description: "Expo push token from expo-notifications",
            },
          },
        },
        
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
        
        Post: {
          type: "object",
          properties: {
            _id: { type: "string", example: "64a7f3c2e4b0c12345678902" },
            content: { type: "string", example: "Hello world!" },
            author: { $ref: "#/components/schemas/User" },
            likes: { type: "array", items: { type: "string" }, example: ["64a7f3c2e4b0c12345678901"] },
            likesCount: { type: "integer", example: 5 },
            commentsCount: { type: "integer", example: 3 },
            isLiked: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreatePostRequest: {
          type: "object",
          required: ["content"],
          properties: {
            content: { type: "string", example: "Hello world!", maxLength: 500 },
          },
        },
        
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
            content: { type: "string", example: "Great post!", maxLength: 300 },
          },
        },
       
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
      },
    },
    
    paths: {
      
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new account",
          security: [],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } } },
          },
          responses: {
            201: { description: "Registered successfully", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
            409: { description: "Email or username already in use", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            422: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login and receive a JWT token",
          security: [],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } },
          },
          responses: {
            200: { description: "Login successful", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
            401: { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            422: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          summary: "Get the authenticated user's profile",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "User profile", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/api/auth/push-token": {
        put: {
          tags: ["Auth"],
          summary: "Update device Expo push notification token",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/PushTokenRequest" } } },
          },
          responses: {
            200: { description: "Push token updated", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            422: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
     
      "/api/posts": {
        post: {
          tags: ["Posts"],
          summary: "Create a new text post",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/CreatePostRequest" } } },
          },
          responses: {
            201: { description: "Post created", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            422: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        get: {
          tags: ["Posts"],
          summary: "Get paginated posts (newest first)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: "query", name: "page", schema: { type: "integer", default: 1 }, description: "Page number" },
            { in: "query", name: "limit", schema: { type: "integer", default: 10, maximum: 50 }, description: "Posts per page" },
            { in: "query", name: "username", schema: { type: "string" }, description: "Filter by author username (case-insensitive)" },
          ],
          responses: {
            200: { description: "Paginated list of posts", content: { "application/json": { schema: { $ref: "#/components/schemas/PaginatedPostsResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/api/posts/{id}": {
        get: {
          tags: ["Posts"],
          summary: "Get a single post by ID",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" }, description: "Post MongoDB ObjectId" }],
          responses: {
            200: { description: "Post data", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            404: { description: "Post not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
    
      "/api/posts/{id}/like": {
        post: {
          tags: ["Interactions"],
          summary: "Toggle like on a post (like ↔ unlike)",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" }, description: "Post MongoDB ObjectId" }],
          responses: {
            200: {
              description: "Like toggled",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: { type: "string", example: "Post liked" },
                      data: {
                        type: "object",
                        properties: {
                          liked: { type: "boolean", example: true },
                          likesCount: { type: "integer", example: 12 },
                        },
                      },
                    },
                  },
                },
              },
            },
            404: { description: "Post not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/api/posts/{id}/comment": {
        post: {
          tags: ["Interactions"],
          summary: "Add a comment to a post",
          security: [{ bearerAuth: [] }],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" }, description: "Post MongoDB ObjectId" }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/AddCommentRequest" } } },
          },
          responses: {
            201: { description: "Comment added", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            404: { description: "Post not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            422: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
      "/api/posts/{id}/comments": {
        get: {
          tags: ["Interactions"],
          summary: "Get paginated comments for a post",
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: "path", name: "id", required: true, schema: { type: "string" }, description: "Post MongoDB ObjectId" },
            { in: "query", name: "page", schema: { type: "integer", default: 1 } },
            { in: "query", name: "limit", schema: { type: "integer", default: 10, maximum: 50 } },
          ],
          responses: {
            200: { description: "Paginated comments", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            404: { description: "Post not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
    },
  },
 
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
