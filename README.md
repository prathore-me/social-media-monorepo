# Social Media Monorepo

A full-stack, production-ready social media application built as an **Nx monorepo** with **microservices architecture**. This project demonstrates a modern approach to building scalable applications with NestJS, React 19, MongoDB, and comprehensive deployment support via Docker and Kubernetes.

## 📋 Project Overview

This is a **full-stack social media platform** featuring:

- **User Authentication** - JWT-based auth with email/password, password hashing with bcrypt
- **User Profiles** - Profile management with bio, profile pictures, follower/following system
- **Posts & Feed** - Create, edit, delete posts with image support and captions
- **Social Interactions** - Like/unlike posts, comment system with nested comments
- **User Discovery** - Search users by username, follow/unfollow functionality
- **Feed System** - Personalized feed aggregation for connected users
- **Real-time Updates** - WebSocket-ready architecture for future real-time features
- **Microservices Architecture** - Decoupled, independently deployable services
- **Production Deployment** - Docker Compose and Kubernetes support with hot-reload for development

**Tech Stack:**

- **Framework:** Nx 21.6.10 - Monorepo workspace management with task orchestration
- **Backend:** NestJS 11.0.0 - Enterprise Node.js framework with TypeScript
- **Frontend:** React 19 - Modern UI library with React Router v6, Hooks-based architecture
- **Database:** MongoDB 8.0 with Mongoose 9.1.0 - Schema validation and ODM
- **Authentication:** JWT + Passport.js - Stateless, scalable authentication
- **Security:** Bcrypt 6.0.0 - Secure password hashing
- **HTTP Client:** Axios 1.13.2 - Request interceptor for JWT injection
- **Styling:** TailwindCSS 4.2.2 + CSS - Utility-first and custom styling
- **Form Validation:** class-validator + class-transformer + react-hook-form
- **Build Tools:** Vite 7.0.0 (frontend), Webpack (backend), SWC 1.5.7 (transpilation)
- **Testing:** Vitest 3.0.0, Jest - Unit and integration testing
- **Notifications:** react-hot-toast 2.6.0 - Toast UI notifications
- **Icons:** lucide-react 0.562.0 - Icon library
- **Package Management:** npm
- **Language:** TypeScript 5.9.2
- **Deployment:** Docker, Docker Compose, Kubernetes
- **CI/CD Ready:** ESLint 9.8.0, Prettier 2.6.2

## 🏗️ Project Architecture

### Monorepo Structure

```
apps/                                    # Independently deployable applications
├── auth-api/                          # Port 3000 - Authentication microservice
│   ├── src/
│   │   ├── app/app.module.ts          # Root module with MongoDB connection
│   │   ├── auth/
│   │   │   ├── auth.controller.ts     # Endpoints: /auth/signup, /auth/login, /auth/me
│   │   │   ├── auth.service.ts        # Password hashing, JWT generation, user creation
│   │   │   └── auth.module.ts         # JWT + Passport + Mongoose configuration
│   │   └── main.ts                    # NestJS bootstrap with global pipes and CORS
│   ├── Dockerfile                     # Multi-stage build: development & production
│   └── webpack.config.js              # Bundle configuration
│
├── posts-api/                         # Port 3001 - Posts & Interactions microservice
│   ├── src/
│   │   ├── app/app.module.ts
│   │   ├── posts/
│   │   │   ├── posts.controller.ts    # CRUD: /posts, /posts/feed, /posts/user/:id
│   │   │   │                          # Social: /posts/:id/like, /posts/:id/comments
│   │   │   ├── posts.service.ts       # Post management, like toggle, comments
│   │   │   ├── posts.module.ts
│   │   │   └── dto/                   # CreatePostDto, UpdatePostDto, CreateCommentDto
│   │   └── main.ts
│   └── Dockerfile
│
├── users-api/                         # Port 3002 - User Profiles microservice
│   ├── src/
│   │   ├── app/app.module.ts
│   │   ├── profiles/
│   │   │   ├── profiles.controller.ts # CRUD: /profiles, /profiles/:username
│   │   │   │                          # Social: /profiles/:id/follow
│   │   │   │                          # Search: /profiles/search?q=term
│   │   │   ├── profiles.service.ts    # Profile management, follow system
│   │   │   ├── profiles.module.ts
│   │   │   └── dto/                   # CreateProfileDto, UpdateProfileDto
│   │   └── main.ts
│   └── Dockerfile
│
└── web-app/                           # Port 5173 (dev) / 80 (prod) - React SPA
    ├── src/
    │   ├── main.tsx                   # React bootstrap with AuthProvider & BrowserRouter
    │   ├── app/app.tsx                # Root component with route definitions
    │   ├── pages/                     # Route components
    │   │   ├── Login.tsx              # Email/password login form
    │   │   ├── Signup.tsx             # Registration form (email, username, password)
    │   │   ├── Feed.tsx               # Main feed with posts
    │   │   ├── Profile.tsx            # User profile view (posts, bio, followers)
    │   │   └── EditProfile.tsx        # Profile editor (bio, avatar)
    │   ├── components/                # Reusable UI components
    │   │   ├── layout/
    │   │   │   ├── Navbar.tsx         # Navigation header with search and user menu
    │   │   │   └── ProtectedRoute.tsx # Auth guard for protected pages
    │   │   ├── post/
    │   │   │   ├── PostCard.tsx       # Single post display with like/comment UI
    │   │   │   ├── PostGrid.tsx       # Profile post grid layout
    │   │   │   └── CreatePostModal.tsx # New post form modal
    │   │   ├── profile/
    │   │   │   └── FollowButton.tsx   # Follow/unfollow toggle button
    │   │   └── ui/
    │   │       ├── Avatar.tsx         # User avatar with fallback initials
    │   │       ├── Modal.tsx          # Reusable modal wrapper
    │   │       └── Spinner.tsx        # Loading indicator
    │   ├── hooks/                     # Custom React hooks
    │   │   ├── usePosts.ts            # Post management (fetch, create, update, delete)
    │   │   └── useProfile.ts          # Profile data fetching
    │   ├── context/
    │   │   └── AuthContext.tsx        # Global auth state with user & token management
    │   ├── api/                       # API client layer
    │   │   ├── axios.ts               # Axios instance with JWT interceptor
    │   │   ├── auth.api.ts            # Auth endpoints (login, signup, getMe)
    │   │   ├── posts.api.ts           # Posts endpoints (CRUD, like, comments)
    │   │   └── users.api.ts           # User endpoints (profile, search, follow)
    │   ├── config/
    │   │   └── api.ts                 # API base URLs configured from environment
    │   ├── types/
    │   │   └── index.ts               # TypeScript interfaces (User, Profile, Post, etc.)
    │   └── styles.css                 # Global styling with TailwindCSS v4
    ├── vite.config.ts                 # Vite build config with React + Tailwind plugins
    ├── index.html                     # HTML entry point
    ├── Dockerfile                     # Multi-stage: build + Nginx serving
    ├── nginx.conf                     # Reverse proxy config for SPA routing
    └── entrypoint.sh                  # Runtime env var injection script

libs/shared/                          # Shared code across backend services
├── auth-utils/                        # Authentication utilities library
│   ├── src/lib/
│   │   ├── jwt.strategy.ts           # Passport JWT strategy for token validation
│   │   ├── jwt-auth.guard.ts         # NestJS guard for protected routes
│   │   └── decorators/
│   │       └── current-user.decorator.ts # Extract user from JWT token
│   └── src/index.ts                  # Public API exports
│
├── dto/                               # Data Transfer Objects (validation contracts)
│   ├── src/lib/
│   │   ├── signup.dto.ts             # Email, username, password validation
│   │   └── login.dto.ts              # Email, password validation
│   └── src/index.ts
│
├── schemas/                           # Mongoose schemas (database models)
│   ├── src/lib/
│   │   ├── user.schema.ts            # User account (email, password, username)
│   │   ├── profile.schema.ts         # User profile (bio, followers, following, pics)
│   │   └── post.schema.ts            # Post with comments nested
│   └── src/index.ts
│
└── constants/                         # Shared constants (future use)
    └── src/

k8s/                                  # Kubernetes manifests for production
├── namespace.yaml                    # Isolated namespace for services
├── configmap.yaml                    # Non-sensitive configuration
├── secret.yaml                       # Sensitive data (credentials, secrets)
├── ingress.yaml                      # External traffic routing
├── auth-api/
│   ├── deployment.yaml               # Auth API pod replicas & scaling
│   └── service.yaml                  # Internal service discovery
├── posts-api/
│   ├── deployment.yaml
│   └── service.yaml
├── users-api/
│   ├── deployment.yaml
│   └── service.yaml
├── web-app/
│   ├── deployment.yaml
│   └── service.yaml
└── mongo-db/
    ├── statefulset.yaml              # MongoDB StatefulSet for data persistence
    └── service.yaml                  # MongoDB service for backend access

docker-compose.dev.yaml               # Local development with hot-reload
docker-compose.yaml                   # Production deployment
tsconfig.base.json                    # Base TypeScript config with path aliases
nx.json                               # Nx workspace configuration
package.json                          # Dependencies and npm scripts
```

### Service Dependencies

```
web-app (React SPA)
  ├→ auth-api (JWT authentication)
  ├→ posts-api (Post CRUD & interactions)
  └→ users-api (User profiles & social graph)

auth-api (Microservice)
  ├→ MongoDB (User storage)
  └→ users-api (Create profile on signup)

posts-api (Microservice)
  └→ MongoDB (Posts & comments)

users-api (Microservice)
  └→ MongoDB (Profiles & social connections)
```

## 🚀 Microservices API Reference

### 1. **Auth API** (`apps/auth-api`) - Port 3000

**Purpose:** User authentication, account creation, JWT token management

**Base URL:** `http://localhost:3000/api/auth` (or `http://auth-api:3000/api` in Docker network)

**Endpoints:**

| Method | Endpoint       | Description                     | Body                            | Response                                              |
| ------ | -------------- | ------------------------------- | ------------------------------- | ----------------------------------------------------- |
| `POST` | `/auth/signup` | Register new user               | `{ email, username, password }` | `{ message: "Account created successfully" }`         |
| `POST` | `/auth/login`  | Authenticate user, get JWT      | `{ email, password }`           | `{ access_token, user: { userId, username, email } }` |
| `GET`  | `/auth/me`     | Get current user (JWT required) | None                            | `{ userId, username, email }`                         |

**Technologies:** NestJS, MongoDB, Passport.js, JWT (@nestjs/jwt), Bcrypt

**Key Implementation Details:**

- Password hashing with bcrypt (10 salt rounds)
- JWT tokens expire in 1 hour (configurable via `signOptions`)
- On successful signup:
  1. Check for duplicate email/username
  2. Hash password with bcrypt
  3. Create user document in MongoDB
  4. Call users-api to create profile
  5. Return success message
- On login: validate credentials, generate JWT token
- `JwtAuthGuard` protects `/me` endpoint

**Service File Structure:**

- [apps/auth-api/src/auth/auth.controller.ts](apps/auth-api/src/auth/auth.controller.ts) - HTTP endpoints
- [apps/auth-api/src/auth/auth.service.ts](apps/auth-api/src/auth/auth.service.ts) - Business logic
- [apps/auth-api/src/auth/auth.module.ts](apps/auth-api/src/auth/auth.module.ts) - Dependencies

---

### 2. **Posts API** (`apps/posts-api`) - Port 3001

**Purpose:** Create, manage, and interact with posts; like/comment system

**Base URL:** `http://localhost:3001/api/posts`

**Endpoints:**

| Method   | Endpoint                   | Description          | Auth   | Body                     | Response                                 |
| -------- | -------------------------- | -------------------- | ------ | ------------------------ | ---------------------------------------- |
| `POST`   | `/`                        | Create new post      | ✅ JWT | `{ imageUrl, caption? }` | `Post object`                            |
| `GET`    | `/feed`                    | Get all posts (feed) | ❌     | None                     | `Post[]`                                 |
| `GET`    | `/user/:userId`            | Get user's posts     | ❌     | None                     | `Post[]`                                 |
| `PATCH`  | `/:id`                     | Update post caption  | ✅ JWT | `{ caption }`            | `Post object`                            |
| `DELETE` | `/:id`                     | Delete post          | ✅ JWT | None                     | `{ message }`                            |
| `POST`   | `/:id/like`                | Toggle like on post  | ✅ JWT | None                     | `{ liked: boolean, likesCount: number }` |
| `POST`   | `/:id/comments`            | Add comment to post  | ✅ JWT | `{ text }`               | `Post object`                            |
| `DELETE` | `/:id/comments/:commentId` | Delete comment       | ✅ JWT | None                     | `Post object`                            |

**Technologies:** NestJS, MongoDB, Mongoose, JWT

**Data Models:**

```typescript
interface Post {
  _id: string;
  userId: string; // Creator's user ID
  username: string; // Creator's username
  imageUrl: string; // Post image URL
  caption?: string; // Post text
  likes: string[]; // Array of user IDs who liked
  comments: Comment[]; // Nested comment array
  createdAt: Date;
  updatedAt: Date;
}

interface Comment {
  _id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: Date;
}
```

**Service File Structure:**

- [apps/posts-api/src/posts/posts.controller.ts](apps/posts-api/src/posts/posts.controller.ts)
- [apps/posts-api/src/posts/posts.service.ts](apps/posts-api/src/posts/posts.service.ts)
- [apps/posts-api/src/posts/posts.module.ts](apps/posts-api/src/posts/posts.module.ts)

---

### 3. **Users API** (`apps/users-api`) - Port 3002

**Purpose:** User profile management, follower/following system, user discovery

**Base URL:** `http://localhost:3002/api/profiles`

**Endpoints:**

| Method  | Endpoint          | Description                         | Auth   | Query          | Response                 |
| ------- | ----------------- | ----------------------------------- | ------ | -------------- | ------------------------ |
| `POST`  | `/`               | Create profile (called by auth-api) | ❌     | None           | `Profile object`         |
| `GET`   | `/search`         | Search users by username            | ❌     | `q=searchTerm` | `Profile[]`              |
| `GET`   | `/id/:userId`     | Get profile by user ID              | ❌     | None           | `Profile object`         |
| `GET`   | `/:username`      | Get profile by username             | ❌     | None           | `Profile object`         |
| `PATCH` | `/`               | Update own profile                  | ✅ JWT | None           | `Profile object`         |
| `POST`  | `/:userId/follow` | Toggle follow/unfollow              | ✅ JWT | None           | `{ following: boolean }` |

**Technologies:** NestJS, MongoDB, Mongoose, JWT

**Data Models:**

```typescript
interface Profile {
  _id: string;
  userId: string; // Reference to User account
  username: string; // Unique username
  bio: string; // Profile biography
  profilePic: string; // Profile picture URL
  followers: string[]; // Array of user IDs following this user
  following: string[]; // Array of user IDs this user follows
  createdAt: Date;
  updatedAt: Date;
}
```

**Service File Structure:**

- [apps/users-api/src/profiles/profiles.controller.ts](apps/users-api/src/profiles/profiles.controller.ts)
- [apps/users-api/src/profiles/profiles.service.ts](apps/users-api/src/profiles/profiles.service.ts)
- [apps/users-api/src/profiles/profiles.module.ts](apps/users-api/src/profiles/profiles.module.ts)

---

### 4. **Web App** (`apps/web-app`) - Port 5173 (dev) / 80 (prod)

**Purpose:** React-based single-page application (SPA) frontend

**Base URL:** `http://localhost:5173` (dev), or served behind Nginx in production

**Routes:**

| Path                 | Component         | Auth Required | Description                                       |
| -------------------- | ----------------- | ------------- | ------------------------------------------------- |
| `/login`             | `Login.tsx`       | ❌            | Email/password login form with error handling     |
| `/signup`            | `Signup.tsx`      | ❌            | Registration form (email, username, password)     |
| `/`                  | `Feed.tsx`        | ✅            | Main feed showing all posts                       |
| `/profile/:username` | `Profile.tsx`     | ✅            | View user profile with bio, posts, follower count |
| `/edit-profile`      | `EditProfile.tsx` | ✅            | Edit own profile (bio, profile picture)           |
| `*`                  | Redirect          | -             | Redirects to `/login` if not authenticated        |

**Technologies:** React 19.0.0, Vite 7.0.0, React Router 6.29.0, Axios 1.13.2, TailwindCSS 4.2.2, lucide-react, react-hot-toast

**Key Hooks & Context:**

```typescript
// Global auth state
useAuth() → { user, setUser, loading, logout }

// Post management
usePosts() → { posts, loading, addPost, removePost, updatePost }

// Profile management
useProfile(username) → { profile, setProfile, posts, loading, error }
```

**API Client Layer:**

- [apps/web-app/src/api/axios.ts](apps/web-app/src/api/axios.ts) - Axios instance with JWT interceptor
- [apps/web-app/src/api/auth.api.ts](apps/web-app/src/api/auth.api.ts) - Auth endpoints (login, signup, getMe)
- [apps/web-app/src/api/posts.api.ts](apps/web-app/src/api/posts.api.ts) - Posts endpoints (feed, CRUD, like, comments)
- [apps/web-app/src/api/users.api.ts](apps/web-app/src/api/users.api.ts) - User/profile endpoints (get, update, search, follow)

**Frontend Authentication Flow:**

1. User enters credentials on `/login` or `/signup`
2. Frontend calls auth-api with credentials
3. Auth API returns `{ access_token, user: { userId, username, email } }`
4. Frontend stores token in `localStorage` and user in React Context
5. Axios interceptor automatically adds `Authorization: Bearer <token>` to all requests
6. Protected routes check for user in Context; redirect to `/login` if missing
7. 401 responses trigger token removal and redirect to `/login`
8. Page refresh: AuthContext checks localStorage for token, calls `/auth/me` to restore session

**Key Components:**

- `layout/Navbar.tsx` - Navigation header with search, create post, and user avatar
- `layout/ProtectedRoute.tsx` - Auth guard wrapper for protected pages
- `post/PostCard.tsx` - Single post display with like/comment UI
- `post/PostGrid.tsx` - Profile posts grid layout
- `post/CreatePostModal.tsx` - New post form modal
- `profile/FollowButton.tsx` - Follow/unfollow toggle button
- `ui/Avatar.tsx` - User avatar with gradient fallback initials
- `ui/Modal.tsx` - Reusable modal wrapper with ESC support
- `ui/Spinner.tsx` - Loading indicator

**File Structure:**

- [apps/web-app/src/pages/](apps/web-app/src/pages/) - Route components
- [apps/web-app/src/components/](apps/web-app/src/components/) - Reusable UI components (layout, post, profile, ui)
- [apps/web-app/src/hooks/](apps/web-app/src/hooks/) - Custom React hooks (usePosts, useProfile)
- [apps/web-app/src/context/AuthContext.tsx](apps/web-app/src/context/AuthContext.tsx) - Global auth state
- [apps/web-app/src/types/index.ts](apps/web-app/src/types/index.ts) - TypeScript interfaces (User, Profile, Post, Comment)
- [apps/web-app/src/config/api.ts](apps/web-app/src/config/api.ts) - API base URLs from environment variables

## 📚 Shared Libraries

All backend services share code through the `libs/shared` directory:

### `auth-utils` - Authentication Utilities

**Purpose:** Centralized authentication logic for NestJS services

**Exports:**

- **`JwtStrategy`** - Passport strategy for validating JWT tokens

  - Validates token signature
  - Extracts user info from token payload
  - Used by `JwtAuthGuard`

- **`JwtAuthGuard`** - NestJS route guard for JWT protection

  - Applied with `@UseGuards(JwtAuthGuard)` decorator
  - Returns 401 if token missing or invalid

- **`CurrentUser()` Decorator** - Extract user from request
  - Gets user object from `request.user` (set by JwtStrategy)
  - Usage: `@CurrentUser() user: any` in controller methods
  - Provides typed access to `user.userId`, `user.username`, `user.email`

**Files:**

- [libs/shared/auth-utils/src/lib/jwt.strategy.ts](libs/shared/auth-utils/src/lib/jwt.strategy.ts)
- [libs/shared/auth-utils/src/lib/jwt-auth.guard.ts](libs/shared/auth-utils/src/lib/jwt-auth.guard.ts)
- [libs/shared/auth-utils/src/lib/decorators/current-user.decorator.ts](libs/shared/auth-utils/src/lib/decorators/current-user.decorator.ts)

**Usage Example:**

```typescript
import { JwtAuthGuard, CurrentUser } from '@social-media-monorepo/shared-auth-utils';

@Controller('posts')
export class PostsController {
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreatePostDto, @CurrentUser() user: any) {
    return this.postsService.create(dto, user.userId, user.username);
  }
}
```

### `dto` - Data Transfer Objects

**Purpose:** Request/response validation contracts with class-validator

**Exports:**

- **`SignupDto`** - User registration validation

  ```typescript
  {
    email: string;
    username: string;
    password: string; /* min 8 chars */
  }
  ```

- **`LoginDto`** - User login validation
  ```typescript
  {
    email: string;
    password: string;
  }
  ```

**Features:**

- Automatic validation via global `ValidationPipe`
- Returns 400 with detailed error messages for invalid data
- Powered by `class-validator` and `class-transformer`

**Files:**

- [libs/shared/dto/src/lib/signup.dto.ts](libs/shared/dto/src/lib/signup.dto.ts)
- [libs/shared/dto/src/lib/login.dto.ts](libs/shared/dto/src/lib/login.dto.ts)

### `schemas` - Mongoose Database Models

**Purpose:** Shared MongoDB schemas used by backend services

**Exports:**

- **`User` Schema** - User account data (auth-api)

  ```typescript
  {
    email: string;
    username: string;
    password: string; /* hashed */
  }
  ```

- **`Profile` Schema** - User profile data (users-api)

  ```typescript
  { userId: string; username: string; bio: string; profilePic: string; followers: string[]; following: string[]; }
  ```

- **`Post` Schema** - Post and comments (posts-api)
  ```typescript
  { userId: string; username: string; imageUrl: string; caption: string; likes: string[]; comments: Comment[]; }
  ```

**Files:**

- [libs/shared/schemas/src/lib/user.schema.ts](libs/shared/schemas/src/lib/user.schema.ts)
- [libs/shared/schemas/src/lib/profile.schema.ts](libs/shared/schemas/src/lib/profile.schema.ts)
- [libs/shared/schemas/src/lib/post.schema.ts](libs/shared/schemas/src/lib/post.schema.ts)

### `constants` - Shared Constants

**Purpose:** Placeholder for future shared constants (API endpoints, feature flags, error messages).

**Files:** [libs/shared/constants/src/](libs/shared/constants/src/)

---

## 🗄️ Database Architecture

**MongoDB 8.0** is used as the primary datastore:

### Database Name

- **Development:** `social-media-monorepo-db` (set via `MONGO_INITDB_DATABASE` in docker-compose)
- **Production:** Configurable via environment variable

### Collections

**1. `users` (auth-api)**

```javascript
{
  _id: ObjectId,
  email: "user@example.com",      // Unique
  username: "john_doe",            // Unique
  password: "$2b$10$...",          // Bcrypt hash
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

**2. `profiles` (users-api)**

```javascript
{
  _id: ObjectId,
  userId: "...objectId...",        // Reference to users._id
  username: "john_doe",
  bio: "Software developer",
  profilePic: "https://...",
  followers: ["...userId1...", "...userId2..."],
  following: ["...userId3..."],
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

**3. `posts` (posts-api)**

```javascript
{
  _id: ObjectId,
  userId: "...objectId...",
  username: "john_doe",
  imageUrl: "https://...",
  caption: "Beautiful sunset!",
  likes: ["...userId1...", "...userId2..."],
  comments: [
    { _id: ObjectId, userId: "...", username: "alice", text: "Amazing!", createdAt: ISODate("...") }
  ],
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

### Connection Configuration

**Default Connection (Docker):** `mongodb://mongodb:27017/social-media-monorepo-db`

```bash
# Access from container
docker exec -it sm-mongodb-container mongosh

# Access from host
mongosh mongodb://localhost:27017/social-media-monorepo-db
```

### Indexing

Mongoose automatically creates indexes for: `users.email` (unique), `users.username` (unique), `profiles.userId` (unique), `profiles.username` (unique).

## 🔐 Authentication & Security

### JWT Token Payload

```typescript
{
  sub: "636f7de566c58b001a2f47f0",  // MongoDB _id (maps to userId)
  username: "john_doe",
  email: "user@example.com",
  iat: 1605332320,                   // Issued at
  exp: 1605335920                    // Expiration (1 hour later)
}
```

### Signup Flow

1. Frontend POSTs `{ email, username, password }` to `/api/auth/signup`
2. Auth API validates with `SignupDto`, checks duplicates, hashes password
3. Creates user in MongoDB, calls users-api to create profile
4. Returns `{ message: "Account created successfully" }`

### Login Flow

1. Frontend POSTs `{ email, password }` to `/api/auth/login`
2. Auth API validates credentials, generates JWT (1 hour expiry)
3. Returns `{ access_token, user: { userId, username, email } }`
4. Frontend stores token in `localStorage`, user in React Context

### Protected Route Access

1. Axios interceptor adds `Authorization: Bearer <token>` to every request
2. NestJS `JwtAuthGuard` validates token signature with `JWT_SECRET`
3. `@CurrentUser()` decorator extracts user from validated payload
4. 401 responses → frontend clears token and redirects to `/login`

### Security Features

- **Password Hashing:** Bcrypt with 10 salt rounds
- **JWT Signing:** HS256 algorithm with `JWT_SECRET`
- **Token Expiration:** 1 hour (configurable in modules)
- **CORS:** Enabled on all backend services
- **HTTP-Only Cookies:** Not used (consider for production)
- **Token Refresh:** Not implemented (planned improvement)

## 🐳 Deployment & Running Services

### Prerequisites

- Node.js 22+
- Docker & Docker Compose

### Local Development with Docker (Hot-Reload)

```bash
npm run dev:docker       # Start all services with hot-reload
npm run dev:docker:down  # Stop and remove volumes
```

**Access services:**

- **Web App:** `http://localhost:5173`
- **Auth API:** `http://localhost:3000/api`
- **Posts API:** `http://localhost:3001/api`
- **Users API:** `http://localhost:3002/api`

**Hot-reload behavior:**

- NestJS apps: Nx daemon (`NX_DAEMON=true`) watches files, auto-rebuilds and restarts
- React app: Vite dev server hot-replaces modules

### Production Deployment with Docker

```bash
npm run prod:docker       # Start (uses pre-built Docker Hub images)
npm run prod:docker:down  # Stop
```

### Environment Variables

**Create `.env.local` in project root:**

```bash
# Database
MONGO_INITDB_DATABASE=social-media-monorepo-db
MONGO_URI=mongodb://mongodb:27017/social-media-monorepo-db

# Auth
JWT_SECRET=your-very-secret-key-here-change-in-production

# Inter-service URLs (Docker network)
USERS_API_URL=http://users-api:3000/api

# Frontend URLs (browser)
VITE_AUTH_API_URL=http://localhost:3000/api
VITE_USERS_API_URL=http://localhost:3002/api
VITE_POSTS_API_URL=http://localhost:3001/api
```

**Variables used by services:**

| Variable                | Service        | Used For                   |
| ----------------------- | -------------- | -------------------------- |
| `MONGO_INITDB_DATABASE` | Docker Compose | Initial DB name            |
| `MONGO_URI`             | All APIs       | MongoDB connection string  |
| `JWT_SECRET`            | All APIs       | Sign/verify JWT tokens     |
| `USERS_API_URL`         | auth-api       | Profile creation on signup |
| `VITE_AUTH_API_URL`     | web-app        | Auth API base URL          |
| `VITE_USERS_API_URL`    | web-app        | Users API base URL         |
| `VITE_POSTS_API_URL`    | web-app        | Posts API base URL         |

### Kubernetes Deployment

```bash
kubectl apply -f k8s/
kubectl get pods -n social-media-monorepo
```

K8s resources: Namespace, ConfigMap, Secret, Deployments, ClusterIP Services, MongoDB StatefulSet, Nginx Ingress.

**Kubernetes files:**

- [k8s/namespace.yaml](k8s/namespace.yaml)
- [k8s/configmap.yaml](k8s/configmap.yaml)
- [k8s/secret.yaml](k8s/secret.yaml)
- [k8s/ingress.yaml](k8s/ingress.yaml)
- [k8s/auth-api/deployment.yaml](k8s/auth-api/deployment.yaml)
- [k8s/posts-api/deployment.yaml](k8s/posts-api/deployment.yaml)
- [k8s/users-api/deployment.yaml](k8s/users-api/deployment.yaml)
- [k8s/web-app/deployment.yaml](k8s/web-app/deployment.yaml)
- [k8s/mongo-db/statefulset.yaml](k8s/mongo-db/statefulset.yaml)

### CI/CD (GitHub Actions)

Workflow on push to `main` (`.github/workflows/main.yaml`):

1. Bumps semantic version and creates GitHub Release
2. Builds and pushes all Docker images to Docker Hub in parallel
3. Tags with version number and `latest`

Required secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`

Docker images:

- `prathoreme/social-media-monorepo-auth-api`
- `prathoreme/social-media-monorepo-posts-api`
- `prathoreme/social-media-monorepo-users-api`
- `prathoreme/social-media-monorepo-web-app`

## 📦 Running Nx Tasks

```bash
npx nx graph                              # Visualize project dependencies
npx nx serve auth-api                     # Serve a specific app
npx nx serve web-app
npx nx build auth-api                     # Build a specific app
npx nx run-many --target=build --all      # Build all apps
npx nx lint auth-api --fix                # Lint with auto-fix
npx nx test auth-api --coverage           # Run tests with coverage
npx nx affected --targets=build,lint,test # Run only affected projects (CI)
```

## 📂 Development Workflow

### Adding a new backend endpoint

```typescript
// 1. Create DTO (if needed)
// apps/posts-api/src/posts/dto/new-feature.dto.ts
export class NewFeatureDto {
  @IsString() field: string;
}

// 2. Add service method
// apps/posts-api/src/posts/posts.service.ts
async newFeature(dto: NewFeatureDto, userId: string) { ... }

// 3. Add controller endpoint
// apps/posts-api/src/posts/posts.controller.ts
@UseGuards(JwtAuthGuard)
@Post('new-feature')
newFeature(@Body() dto: NewFeatureDto, @CurrentUser() user: any) {
  return this.postsService.newFeature(dto, user.userId);
}
```

### Adding a new frontend page

```typescript
// 1. Create page component
// apps/web-app/src/pages/NewPage.tsx
export default function NewPage() { ... }

// 2. Add route in app.tsx
<Route path="/new" element={<ProtectedRoute><NewPage /></ProtectedRoute>} />

// 3. Add API call if needed
// apps/web-app/src/api/posts.api.ts
export const newFeature = async (data: any) => {
  const res = await api.post(`${POSTS_API_URL}/posts/new-feature`, data);
  return res.data;
};
```

### Debugging

```bash
docker logs -f sm-auth-api-container   # Backend logs
docker logs -f sm-posts-api-container
docker logs -f sm-users-api-container
docker exec -it sm-mongodb-container mongosh  # MongoDB shell
```

Frontend: Open DevTools (F12) → Console + Network tabs.

## 🔄 Service Communication

1. **Browser → Web App** — User interacts with React UI
2. **Web App → Auth API** — `http://localhost:3000/api/auth` (JWT in header)
3. **Web App → Posts API** — `http://localhost:3001/api/posts` (JWT in header)
4. **Web App → Users API** — `http://localhost:3002/api/profiles` (JWT in header)
5. **Auth API → Users API** — `http://users-api:3000/api/profiles` (Docker network, no JWT)
6. **All APIs → MongoDB** — `mongodb://mongodb:27017/social-media-monorepo-db`

## 🗂️ Key Files Reference

| File                          | Purpose                                  |
| ----------------------------- | ---------------------------------------- |
| `nx.json`                     | Nx workspace config                      |
| `package.json`                | Dependencies and npm scripts             |
| `tsconfig.base.json`          | Base TypeScript config with path aliases |
| `.env.example`                | Environment variables template           |
| `docker-compose.dev.yaml`     | Local development with hot-reload        |
| `docker-compose.yaml`         | Production deployment                    |
| `k8s/`                        | Kubernetes manifests                     |
| `.github/workflows/main.yaml` | CI/CD pipeline                           |
| `eslint.config.mjs`           | ESLint configuration                     |
| `.prettierrc`                 | Prettier formatting config               |

## 💡 Tips for AI Code Generation

✅ `"In apps/posts-api/src/posts/posts.service.ts, add pagination to getFeed() with skip and limit params"`
❌ `"Add pagination"`

✅ Paste full error stack traces from terminal or browser console
❌ `"There's an error"`

✅ Reference exact file paths: `libs/shared/dto/src/lib/signup.dto.ts`
❌ `"the dto file"`

## 📊 Quick Reference

### File Locations by Feature

| Feature             | Files                                                                            |
| ------------------- | -------------------------------------------------------------------------------- |
| User Auth           | `apps/auth-api/src/auth/*`, `libs/shared/auth-utils/src/*`                       |
| Profiles            | `apps/users-api/src/profiles/*`, `libs/shared/schemas/src/lib/profile.schema.ts` |
| Posts               | `apps/posts-api/src/posts/*`, `libs/shared/schemas/src/lib/post.schema.ts`       |
| Frontend Pages      | `apps/web-app/src/pages/*`                                                       |
| Frontend Components | `apps/web-app/src/components/{layout,post,profile,ui}/*`                         |
| Frontend Hooks      | `apps/web-app/src/hooks/*`                                                       |
| Global Auth State   | `apps/web-app/src/context/AuthContext.tsx`                                       |
| Types               | `apps/web-app/src/types/index.ts`                                                |
| DTOs                | `libs/shared/dto/src/lib/*`                                                      |
| Schemas             | `libs/shared/schemas/src/lib/*`                                                  |

### Common Commands

| Task              | Command                                        |
| ----------------- | ---------------------------------------------- |
| Start dev         | `npm run dev:docker`                           |
| Stop dev          | `npm run dev:docker:down`                      |
| Start prod        | `npm run prod:docker`                          |
| Stop prod         | `npm run prod:docker:down`                     |
| View dependencies | `npx nx graph`                                 |
| Serve app         | `npx nx serve web-app`                         |
| Build app         | `npx nx build auth-api`                        |
| Lint              | `npx nx lint auth-api --fix`                   |
| Test              | `npx nx test auth-api`                         |
| Check DB          | `docker exec -it sm-mongodb-container mongosh` |

## 📝 Important Notes

- **JWT tokens expire in 1 hour** (configurable in `*.module.ts` via `JwtModule.register()`)
- **CORS** is enabled on all backend services
- **Global ValidationPipe** enforces DTO validation on all requests
- **Nx daemon** (`NX_DAEMON=true`) is required inside Docker for hot-reload
- **Service-to-service** communication uses Docker network hostnames (e.g., `http://users-api:3000`)
- **Frontend-to-backend** uses localhost in dev (e.g., `http://localhost:3000`)
- **Production web-app** uses Nginx with `entrypoint.sh` for runtime env var injection
- **MongoDB** runs as `mongo:8.0` with persistent `mongo_data` volume
- **Password hashing** uses bcrypt with 10 salt rounds

## 📞 Support & Resources

- [Nx Documentation](https://nx.dev)
- [NestJS Docs](https://docs.nestjs.com)
- [React Docs](https://react.dev)
- [Mongoose Docs](https://mongoosejs.com)
- [JWT](https://jwt.io)
- [Passport.js](http://www.passportjs.org)
