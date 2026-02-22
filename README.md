# Mini Social Feed

A full-stack social feed app — React Native (Expo) mobile client backed by a Node.js REST API.

**Live API:** https://social-feed-app-chi.vercel.app/api  
**API Docs (Swagger):** https://social-feed-app-chi.vercel.app/api/docs

---

## Features

- JWT authentication (register / login)
- Create and browse posts (paginated feed)
- Like / unlike posts with optimistic UI
- Comments with infinite scroll
- Push notifications via Expo SDK (like & comment events)
- Profile screen with personal post history

---

## Project Structure

```
Mini-Social-Feed/
├── backend/    # Node.js + Express + TypeScript REST API
└── mobile/     # React Native (Expo) app
```

---

### Run locally

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev            # http://localhost:5000
```

### Environment variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | JWT EXPIRES IN for signing JWTs |
| `NODE_ENV` | `development` or `production` |

### API Overview

Base URL: `/api`  
All endpoints (except register/login) require `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/auth/me` | Get current user |
| PUT | `/auth/push-token` | Register Expo push token |
| POST | `/posts` | Create a post |
| GET | `/posts` | Paginated feed (`page`, `limit`, `username`) |
| GET | `/posts/:id` | Single post |
| POST | `/posts/:id/like` | Toggle like |
| POST | `/posts/:id/comment` | Add comment |
| GET | `/posts/:id/comments` | Paginated comments |

---

## Mobile

**Stack:** Expo (React Native), Expo Router, NativeWind (Tailwind), Zustand, Axios

### Run locally

```bash
cd mobile
npm install
npx expo start
```

> Update `API_BASE_URL` in `mobile/lib/api.ts`

---