# Mini Social Feed — Backend API

Node.js + Express + TypeScript REST API for the Mini Social Feed app.  
Supports JWT authentication, posts, likes, comments, and Firebase Cloud Messaging push notifications.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express 5 |
| Language | TypeScript |
| Database | MongoDB (via Mongoose) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Push Notifications | Expo Server SDK (`expo-server-sdk`) |
| Validation | express-validator |
| API Docs | Swagger UI (swagger-jsdoc + swagger-ui-express) |
| Dev Server | tsx watch |

---

## Prerequisites

- Node.js ≥ 18
- MongoDB (local install or [Atlas](https://www.mongodb.com/atlas) free tier)

---

## Setup & Run

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in all required values:

```dotenv
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/mini-social-feed
JWT_SECRET=your_super_secret_jwt_key_here
```

### 3. Start development server

```bash
npm run dev
```

Server starts at **http://localhost:5000**

### 4. Build for production

```bash
npm run build    # Compiles TypeScript to dist/
npm start        # Runs compiled output
```

---

## Interactive API Docs (Swagger UI)

Once the server is running, open:

```
http://localhost:5000/api/docs
```
---

## API Reference

### Base URL

```
http://localhost:5000/api
```

### Authentication

All endpoints except `POST /auth/register` and `POST /auth/login` require a JWT token:

```
Authorization: Bearer <token>
```

---

### Auth Endpoints

#### `POST /auth/register`
Create a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

---

#### `POST /auth/login`
Login and receive a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

---

#### `GET /auth/me` 🔒
Get the authenticated user's profile.

**Response `200`:** Returns the user object.

---

#### `PUT /auth/push-token` 🔒
Register or update the device FCM token for push notifications.

**Request Body:**
```json
{ "pushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]" }
```

**Response `200`:** `{ "success": true, "message": "FCM token updated" }`

---

### Post Endpoints

#### `POST /posts` 🔒
Create a new text-only post.

**Request Body:**
```json
{ "content": "Hello world! This is my first post." }
```

---

#### `GET /posts` 🔒
Fetch all posts, newest first, with pagination.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 10 | Posts per page (max 50) |
| `username` | string | — | Filter by author username (case-insensitive) |

---

#### `GET /posts/:id` 🔒
Fetch a single post by its MongoDB ObjectId.

---

### Interaction Endpoints

#### `POST /posts/:id/like` 🔒
Toggle like on a post. If already liked → unlike; otherwise → like.  
Sends an FCM push notification to the post author (skipped on self-like).

---

#### `POST /posts/:id/comment` 🔒
Add a comment to a post.  
Sends an push notification to the post author (skipped on self-comment).

**Request Body:**
```json
{ "content": "Great post!" }
```

---

#### `GET /posts/:id/comments` 🔒
Fetch paginated comments for a post, newest first.

**Query Parameters:** `page`, `limit` (same as posts)

**Response `200`:** Returns comments array with pagination metadata.

---

## Standard Response Format

All responses follow a consistent envelope:

```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { ... }          // present on success
  "errors": [ ... ]        // present on validation failure
}
```


---
