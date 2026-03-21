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
    │   ├── app/App.tsx                # Root component with route definitions
    │   ├── pages/                     # Route components
    │   │   ├── Login.tsx              # Email/password login form
    │   │   ├── Signup.tsx             # Registration form (email, username, password)
    │   │   ├── Feed.tsx               # Main feed with posts from followed users
    │   │   ├── Profile.tsx            # User profile view (posts, bio, followers)
    │   │   └── EditProfile.tsx        # Profile editor (bio, avatar)
    │   ├── components/                # Reusable UI components
    │   │   ├── Navbar.tsx             # Navigation header with user menu
    │   │   ├── PostCard.tsx           # Single post display with like/comment UI
    │   │   ├── CreatePost.tsx         # New post form modal
    │   │   ├── UserListModal.tsx      # User discovery/search modal
    │   │   └── Spinner.tsx            # Loading indicator
    │   ├── hooks/                     # Custom React hooks
    │   │   ├── usePosts.ts            # Post management (fetch, create, update, delete)
    │   │   └── useProfile.ts          # Profile management (fetch, update, follow)
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
    │   └── styles.css                 # Global styling
    ├── vite.config.ts                 # Vite build config with React plugin
    ├── index.html                     # HTML entry point
    ├── Dockerfile                     # Multi-stage: build + Nginx serving
    ├── nginx.conf                     # Reverse proxy config for SPA routing
    └── entrypoint.sh                  # Container startup script

libs/shared/                          # Shared code across backend & frontend
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
| `DELETE` | `/:id`                     | Delete post          | ✅ JWT | None                     | `204 No Content`                         |
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
| `/`                  | `Feed.tsx`        | ✅            | Main feed showing posts from followed users       |
| `/profile/:username` | `Profile.tsx`     | ✅            | View user profile with bio, posts, follower count |
| `/edit-profile`      | `EditProfile.tsx` | ✅            | Edit own profile (bio, profile picture)           |
| `*`                  | Redirect          | -             | Redirects to `/login` if not authenticated        |

**Technologies:** React 19.0.0, Vite 7.0.0, React Router 6.29.0, Axios 1.13.2, TailwindCSS 4.2.2, React Hook Form 7.69.0, lucide-react, react-hot-toast

**Key Hooks & Context:**

```typescript
// Global auth state
useAuth() → { user, setUser, loading, logout }

// Post management
usePosts() → { posts, loading, addPost, removePost, updatePost }

// Profile management
useProfile(username) → { profile, loading, error, toggleFollow }
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

- `Navbar.tsx` - Navigation header with user menu and logout
- `PostCard.tsx` - Single post display with like/comment UI
- `CreatePostModal.tsx` - New post form modal
- `Spinner.tsx` - Loading indicator
- `UserListModal.tsx` - Followers/following list modal (inline in Profile.tsx)

**File Structure:**

- [apps/web-app/src/pages/](apps/web-app/src/pages/) - Route components (Login, Signup, Feed, Profile, EditProfile)
- [apps/web-app/src/components/](apps/web-app/src/components/) - Reusable UI components
- [apps/web-app/src/hooks/](apps/web-app/src/hooks/) - Custom React hooks (usePosts, useProfile)
- [apps/web-app/src/context/AuthContext.tsx](apps/web-app/src/context/AuthContext.tsx) - Global auth state
- [apps/web-app/src/types/index.ts](apps/web-app/src/types/index.ts) - TypeScript interfaces (User, Profile, Post, Comment, etc.)
- [apps/web-app/src/config/api.ts](apps/web-app/src/config/api.ts) - API base URLs from environment variables

## 📚 Shared Libraries

All backend services and frontend share code through the `libs/shared` directory:

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
  - Calls `JwtStrategy` for validation

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
    email: string; // Must be valid email
    username: string; // Required, alphanumeric
    password: string; // Required, min 8 characters
  }
  ```

- **`LoginDto`** - User login validation

  ```typescript
  {
    email: string; // Must be valid email
    password: string; // Required
  }
  ```

- **`CreateProfileDto`** - Profile creation (internal use)
- **`UpdateProfileDto`** - Profile updates (bio, avatar)
- **`CreatePostDto`** - Post creation
  ```typescript
  {
    imageUrl: string;        // Required
    caption?: string;        // Optional
  }
  ```
- **`UpdatePostDto`** - Post updates
- **`CreateCommentDto`** - Comment creation
  ```typescript
  {
    text: string; // Comment text
  }
  ```

**Features:**

- Automatic validation via `@UseFilters(ValidationPipe)` globally
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
    email: string; // Unique, required
    username: string; // Unique, required
    password: string; // Hashed password, required
    createdAt: Date; // Auto-set by @Schema
    updatedAt: Date; // Auto-updated by Mongoose
  }
  ```

- **`Profile` Schema** - User profile data (users-api)

  ```typescript
  {
    userId: string;          // Reference to User, unique
    username: string;        // Duplicate of User.username
    bio: string;             // Default: ''
    profilePic: string;      // Avatar URL, default: ''
    followers: string[];     // Array of user IDs, default: []
    following: string[];     // Array of user IDs, default: []
    createdAt: Date;
    updatedAt: Date;
  }
  ```

- **`Post` Schema** - Post and comments (posts-api)

  ```typescript
  {
    userId: string;          // Post creator ID
    username: string;        // Creator's username
    imageUrl: string;        // Post image URL
    caption: string;         // Post text, default: ''
    likes: string[];         // User IDs who liked, default: []
    comments: Comment[];     // Nested array of comments
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

**Files:**

- [libs/shared/schemas/src/lib/user.schema.ts](libs/shared/schemas/src/lib/user.schema.ts)
- [libs/shared/schemas/src/lib/profile.schema.ts](libs/shared/schemas/src/lib/profile.schema.ts)
- [libs/shared/schemas/src/lib/post.schema.ts](libs/shared/schemas/src/lib/post.schema.ts)

### `constants` - Shared Constants

**Purpose:** Centralized configuration and constants

**Potential Use Cases:**

- API endpoint URLs
- Feature flags
- Business logic constants
- Error messages

**Files:**

- [libs/shared/constants/src/](libs/shared/constants/src/)

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
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

**2. `profiles` (users-api)**

```javascript
{
  _id: ObjectId,
  userId: "...objectId...",        // Reference to users._id
  username: "john_doe",            // Denormalized from users
  bio: "Software developer",
  profilePic: "https://...",
  followers: ["...userId1...", "...userId2..."],
  following: ["...userId3..."],
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  updatedAt: ISODate("2024-01-15T10:30:00Z")
}
```

**3. `posts` (posts-api)**

```javascript
{
  _id: ObjectId,
  userId: "...objectId...",        // Post creator
  username: "john_doe",            // Creator's username
  imageUrl: "https://...",         // Post image
  caption: "Beautiful sunset!",
  likes: ["...userId1...", "...userId2..."],
  comments: [
    {
      _id: ObjectId,
      userId: "...objectId...",
      username: "alice",
      text: "Amazing shot!",
      createdAt: ISODate("2024-01-15T11:00:00Z")
    }
  ],
  createdAt: ISODate("2024-01-15T10:45:00Z"),
  updatedAt: ISODate("2024-01-15T10:45:00Z")
}
```

### Connection Configuration

**URL Format:** `mongodb://[host]:[port]/[database]`

**Environment Variables:**

- `MONGO_URI` - Full connection string (e.g., `mongodb://mongodb:27017/social-media-monorepo-db`)
- `MONGO_INITDB_DATABASE` - Initial database name for Docker setup

**Default Connection (Docker):**

```
mongodb://mongodb:27017/social-media-monorepo-db
```

### Local MongoDB Access

**From host machine (when exposed):**

```bash
# mongosh CLI
mongosh mongodb://localhost:27017

# Or connect with GUI client to: mongodb://localhost:27017
```

**From Docker container:**

```bash
docker exec -it sm-mongodb-container mongosh
```

### Indexing

Mongoose automatically creates indexes for:

- `users.email` (unique)
- `users.username` (unique)
- `profiles.userId` (unique)
- `profiles.username` (unique)

## 🔐 Authentication & Security

### JWT Token Flow

**Token Structure:**

```
Header.Payload.Signature

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzYzN2RlNTY2YzU4YjAwMWEyZjQ3ZjAiLCJ1c2VybmFtZSI6ImpvaG5fZG9lIiwiaWF0IjoxNjA1MzMyMzIwLCJleHAiOjE2MDUzMzU5MjB9.S8j6F-0Qx
```

**Token Payload:**

```typescript
{
  userId: "636f7de566c58b001a2f47f0",    // MongoDB _id
  username: "john_doe",
  iat: 1605332320,                       // Issued at
  exp: 1605335920                        // Expiration (1 hour later)
}
```

### Signup Flow

1. **Validation** (Frontend)

   - Check password length (min 8 characters)
   - Verify email format
   - Confirm password matches

2. **Request** (Frontend → Auth API)

   ```bash
   POST /api/auth/signup
   {
     "email": "user@example.com",
     "username": "john_doe",
     "password": "password123"
   }
   ```

3. **Processing** (Auth API)

   - Validate input with `SignupDto`
   - Check for duplicate email/username
   - Hash password with bcrypt (10 rounds)
   - Create user in MongoDB
   - Call users-api to create profile
   - Return success message

4. **Error Handling**
   - 409 Conflict - Email or username already in use
   - 400 Bad Request - Invalid input

### Login Flow

1. **Request** (Frontend → Auth API)

   ```bash
   POST /api/auth/login
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. **Processing** (Auth API)

   - Validate input with `LoginDto`
   - Find user by email
   - Compare password with bcrypt
   - Generate JWT token (expires in 1 hour)
   - Return token and user object

3. **Response** (Auth API → Frontend)

   ```json
   {
     "access_token": "eyJhbGc...",
     "user": {
       "userId": "636f7de566c58b001a2f47f0",
       "username": "john_doe",
       "email": "user@example.com"
     }
   }
   ```

4. **Storage** (Frontend)
   - Store token in localStorage
   - Store user in React Context
   - Redirect to "/" (Feed)

### Protected Route Access

**Request with JWT:**

```bash
GET /api/posts/feed
Authorization: Bearer eyJhbGc...
```

**Verification Process:**

1. NestJS receives request with `JwtAuthGuard`
2. Guard calls `JwtStrategy.validate(payload)`
3. Strategy verifies token signature with `JWT_SECRET`
4. If valid, extracts user from payload
5. Attaches user to `request.user`
6. Controller method receives user via `@CurrentUser()` decorator
7. If invalid, returns 401 Unauthorized

### Security Features

- **Password Hashing:** Bcrypt with 10 salt rounds (resistant to brute force)
- **JWT Signing:** HS256 algorithm with `JWT_SECRET`
- **Token Expiration:** 1 hour (configurable in modules)
- **CORS:** Enabled on all backend services
- **HTTP-Only Cookies:** Not used (consider for production)
- **HTTPS:** Required for production deployment
- **Token Refresh:** Not implemented (can be added)

## 🐳 Deployment & Running Services

### Prerequisites

- Node.js 18+ (for local development)
- Docker & Docker Compose
- npm or yarn
- MongoDB 8.0 (in Docker, or external instance)

### Local Development with Docker (Hot-Reload)

**Start all services:**

```bash
npm run dev:docker
```

**What happens:**

1. Docker Compose reads `docker-compose.dev.yaml`
2. Builds all service images with development target
3. Starts containers with volume mounts (for hot-reload)
4. Watches file changes and auto-restarts services

**Access services:**

- **MongoDB:** `mongodb://localhost:27017` (exposed for debugging)
- **Auth API:** `http://localhost:3000/api`
- **Posts API:** `http://localhost:3001/api`
- **Users API:** `http://localhost:3002/api`
- **Web App:** `http://localhost:5173`

**Services in docker-compose.dev.yaml:**

```yaml
mongodb: # image: mongo:8.0
  └─ Port: Not exposed (but accessible via network)
  └─ Data: mongo_data volume

auth-api: # Build from apps/auth-api/Dockerfile (development target)
  └─ Port: 3000
  └─ Volumes: Code mounted for hot-reload
  └─ Dependencies: mongodb

posts-api: # Build from apps/posts-api/Dockerfile (development target)
  └─ Port: 3001
  └─ Volumes: Code mounted for hot-reload
  └─ Dependencies: mongodb

users-api: # Build from apps/users-api/Dockerfile (development target)
  └─ Port: 3002
  └─ Volumes: Code mounted for hot-reload
  └─ Dependencies: mongodb

web-app: # Build from apps/web-app/Dockerfile (development target)
  └─ Port: 5173
  └─ Volumes: Code mounted for hot-reload
  └─ Dependencies: auth-api, posts-api, users-api
```

**Hot-reload behavior:**

- NestJS apps: Nx daemon watches files, auto-rebuilds and restarts
- React app: Vite dev server hot-replaces modules
- Changes take effect automatically without manual restart

**Stop services and remove volumes:**

```bash
npm run dev:docker:down
```

### Production Deployment with Docker

**Build and run:**

```bash
npm run prod:docker
```

**What happens:**

1. Docker Compose reads `docker-compose.yaml`
2. Uses pre-built images (specify version in compose file)
3. Starts containers with restart policies
4. No volume mounts - immutable containers
5. Services restart automatically on failure

**Services in docker-compose.yaml:**

```yaml
mongodb: # image: mongo:8.0
  └─ Restart: always
  └─ Data: mongo_data volume (persistent)

auth-api: # image: prathoreme/social-media-monorepo-auth-api:latest
  └─ Port: 3000 exposed
  └─ Restart: always
  └─ Pull policy: always

posts-api: # image: prathoreme/social-media-monorepo-posts-api:latest
  └─ Port: 3001 exposed
  └─ Restart: always

users-api: # image: prathoreme/social-media-monorepo-users-api:latest
  └─ Port: 3002 exposed
  └─ Restart: always

web-app: # Nginx serving React build + reverse proxy
  └─ Port: 80 exposed
  └─ Restart: always
```

**Stop services and remove volumes:**

```bash
npm run prod:docker:down
```

**Production Considerations:**

- Build Docker images beforehand: `docker build -t prathoreme/social-media-monorepo-auth-api:latest -f apps/auth-api/Dockerfile --target production .`
- Push to Docker Hub or private registry
- Use environment files (`.env.production`) for secrets
- Configure reverse proxy (Nginx) for single entry point
- Set up HTTPS with Let's Encrypt
- Monitor logs and health checks

### Environment Variables

**Create `.env.local` file in project root:**

```bash
# Database Configuration
MONGO_INITDB_DATABASE=social-media-monorepo-db
MONGO_URI=mongodb://mongodb:27017/social-media-monorepo-db

# JWT Secret (use strong random string in production)
JWT_SECRET=your-very-secret-key-here-change-in-production-123456

# Inter-service URLs (within Docker network)
USERS_API_URL=http://users-api:3000



# Frontend URLs
VITE_AUTH_API_URL=http://localhost:3000
VITE_USERS_API_URL=http://localhost:3002
VITE_POSTS_API_URL=http://localhost:3001
```

**Variables used by services:**

| Variable                | Service          | Used For                   | Example                       |
| ----------------------- | ---------------- | -------------------------- | ----------------------------- |
| `MONGO_INITDB_DATABASE` | Docker Compose   | Initial DB name            | `social-media-monorepo-db`    |
| `MONGO_URI`             | All backend APIs | MongoDB connection         | `mongodb://mongodb:27017/...` |
| `JWT_SECRET`            | All backend APIs | Sign/verify JWT tokens     | `your-secret-key`             |
| `USERS_API_URL`         | auth-api         | Profile creation on signup | `http://users-api:3000`       |
| `POSTS_API_URL`         | web-app          | Posts API base URL         | `http://localhost:3001`       |
| `VITE_*_API_URL`        | web-app build    | Frontend API URLs          | `http://localhost:3000`       |

### Kubernetes Deployment

**Deploy entire stack to Kubernetes:**

```bash
kubectl apply -f k8s/
```

**Kubernetes structure:**

- Namespace: `social-media-monorepo` (isolated environment)
- ConfigMap: Non-sensitive configuration
- Secret: Sensitive data (JWT_SECRET, etc.)
- Deployments: One for each microservice
- Services: Expose pods internally
- StatefulSet: MongoDB with persistent storage
- Ingress: External traffic routing

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

## � Running Nx Tasks

### View Project Graph

```bash
npx nx graph
```

Displays interactive visualization of project dependencies and relationships.

### Build Commands

```bash
# Build a specific app
npx nx build auth-api
npx nx build posts-api
npx nx build users-api
npx nx build web-app

# Build all apps
npx nx run-many --target=build --all

# Build with specific configuration
npx nx build web-app --configuration=production
```

### Development/Serve Commands

```bash
# Run app in development mode (hot-reload)
npx nx serve auth-api
npx nx serve web-app

# Run with specific port
npx nx serve web-app --port 3000
```

### Lint Commands

```bash
# Lint a project
npx nx lint auth-api
npx nx lint web-app

# Lint all projects
npx nx run-many --target=lint --all

# Fix linting issues
npx nx lint auth-api --fix
```

### Test Commands

```bash
# Run tests for a project
npx nx test auth-api
npx nx test web-app

# Run all tests
npx nx run-many --target=test --all

# Run with coverage
npx nx test auth-api --coverage
```

### Advanced Nx Commands

```bash
# Show affected projects (based on changes)
npx nx affected --targets=build,lint,test

# Run task for specific project and dependents
npx nx build auth-api --with-deps

# View what would run without executing
npx nx run-many --target=build --all --dry-run
```

## 📂 Development Workflow

### 1. **Initial Setup**

```bash
# Clone repository
git clone <repo-url>
cd social-media-monorepo

# Install dependencies
npm install
```

### 2. **Start Development Environment**

```bash
# Run all services with Docker hot-reload
npm run dev:docker

# Or manually start individual services
npx nx serve auth-api        # In separate terminal
npx nx serve posts-api       # In separate terminal
npx nx serve users-api       # In separate terminal
npx nx serve web-app         # In separate terminal
```

### 3. **Development Workflow**

1. **Make changes** to files in `apps/` or `libs/shared/`
2. **Automatic updates:**
   - Nx daemon detects changes
   - Services rebuild automatically
   - Backend services restart
   - Frontend hot-reloads in browser
3. **No manual restart needed**

### 4. **Working with Backend (NestJS)**

**Add new endpoint:**

```typescript
// apps/auth-api/src/auth/auth.controller.ts
@Post('refresh')  // New endpoint
async refreshToken(@CurrentUser() user: any) {
  return this.authService.refreshToken(user.userId);
}
```

**Add new service method:**

```typescript
// apps/auth-api/src/auth/auth.service.ts
async refreshToken(userId: string) {
  const user = await this.userModel.findById(userId);
  return this.jwtService.sign({ userId, username: user.username });
}
```

**Create new DTO:**

```typescript
// Save in libs/shared/dto/src/lib/refresh.dto.ts
import { IsString } from 'class-validator';

export class RefreshDto {
  @IsString()
  refreshToken: string;
}
```

### 5. **Working with Frontend (React)**

**Add new page:**

```typescript
// apps/web-app/src/pages/Notifications.tsx
import { useAuth } from '../context/AuthContext';

export default function Notifications() {
  const { user } = useAuth();
  return <div>Notifications for {user?.username}</div>;
}
```

**Add new route:**

```typescript
// apps/web-app/src/app/App.tsx
<Route path="/notifications" element={<Notifications />} />
```

**Create custom hook:**

```typescript
// apps/web-app/src/hooks/useNotifications.ts
import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get(`/notifications`).then((res) => setNotifications(res.data));
  }, []);

  return { notifications };
};
```

### 6. **Accessing MongoDB**

**From host machine:**

```bash
# If MongoDB is exposed on port 27017
mongosh mongodb://localhost:27017/social-media-monorepo-db

# Or with Docker exec
docker exec -it sm-mongodb-container mongosh
```

**Query examples:**

```javascript
// Find all users
db.users.find();

// Find posts by userId
db.posts.find({ userId: '...' });

// Get feed for a user
db.posts.find({ userId: { $in: [...followerIds] } });

// Count posts
db.posts.countDocuments();
```

### 7. **Testing Changes Locally**

**Frontend:**

- Open `http://localhost:5173` in browser
- Login with test account
- Navigate through pages
- Check console for errors (F12)
- Test form validation
- Test API error handling

**Backend:**

```bash
# Manual testing with curl
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}'

# Or use Postman/REST Client VSCode extension
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "password123"
}
```

### 8. **Debugging**

**NestJS (Backend):**

```bash
# Enable debug mode
DEBUG=* npx nx serve auth-api

# Check logs in Docker
docker logs -f sm-auth-api-container
```

**React (Frontend):**

- Open DevTools (F12)
- Check Console tab for errors
- Use React DevTools extension
- Check Network tab for API calls
- Use browser debugger for breakpoints

### 9. **Stopping Services**

```bash
# Stop dev environment
npm run dev:docker:down

# This removes volumes too (database will be reset)
```

5. **Testing:** Run tests locally or in containers
   ```sh
   npx nx test <project>
   ```

## 🔄 Service Communication

**Request Flow in System:**

1. **Browser → Web App (React)**

   - User interacts with UI
   - React component calls API client method

2. **Web App → Auth API** (via axios)

   - Path: `http://localhost:3000/api/auth` (dev)
   - Includes JWT in `Authorization` header
   - Example: `POST /api/auth/login`

3. **Web App → Posts API** (via axios)

   - Path: `http://localhost:3001/api/posts` (dev)
   - Includes JWT in `Authorization` header
   - Example: `GET /api/posts/feed`

4. **Web App → Users API** (via axios)

   - Path: `http://localhost:3002/api/profiles` (dev)
   - Includes JWT in `Authorization` header
   - Example: `GET /api/profiles/search?q=john`

5. **Auth API → Users API** (internal, via axios)

   - Used on signup to create profile
   - Path: `http://users-api:3000/api/profiles` (Docker network)
   - No JWT needed (internal service-to-service)

6. **All APIs → MongoDB**
   - Direct MongoDB driver connection
   - Connection: `mongodb://mongodb:27017/social-media-monorepo-db`
   - Each service has own module for Mongoose setup

## 🗂️ Key Files Reference

**Configuration & Setup:**

- [nx.json](nx.json) - Nx workspace config with plugins and generators
- [package.json](package.json) - Dependencies and npm scripts
- [tsconfig.base.json](tsconfig.base.json) - Base TypeScript config with path aliases
- [.env.example](.env.example) - Environment variables template

**Deployment & Infrastructure:**

- [docker-compose.dev.yaml](docker-compose.dev.yaml) - Local development with hot-reload
- [docker-compose.yaml](docker-compose.yaml) - Production deployment
- [k8s/](k8s/) - Kubernetes manifests directory

**Build & CI/CD:**

- [eslint.config.mjs](eslint.config.mjs) - ESLint configuration
- [.prettierrc](.prettierrc) - Prettier formatting config
- [.prettierignore](.prettierignore) - Files to exclude from formatting
- [.editorconfig](.editorconfig) - Editor configuration

**Application Roots:**

- [apps/auth-api/](apps/auth-api/) - Authentication microservice
- [apps/posts-api/](apps/posts-api/) - Posts microservice
- [apps/users-api/](apps/users-api/) - User profiles microservice
- [apps/web-app/](apps/web-app/) - React frontend SPA

**Shared Libraries:**

- [libs/shared/auth-utils/](libs/shared/auth-utils/) - JWT & authentication utilities
- [libs/shared/dto/](libs/shared/dto/) - Data Transfer Objects
- [libs/shared/schemas/](libs/shared/schemas/) - Mongoose schemas
- [libs/shared/constants/](libs/shared/constants/) - Shared constants

## 💡 Tips for AI Code Generation

When asking me to generate or modify code for this project:

### **Be Specific About Service**

✅ "In `apps/posts-api/src/posts/posts.controller.ts`, add a..."
❌ "Add an endpoint to..."

### **Provide Context & Goal**

✅ "I need to add pagination to the feed endpoint. It should accept `page` and `limit` query parameters."
❌ "Add pagination"

### **Share Error Messages**

✅ Paste the full error stack trace from terminal or browser console
❌ "There's an error"

### **Reference File Paths**

✅ `apps/auth-api/src/auth/auth.service.ts`
✅ `libs/shared/dto/src/lib/signup.dto.ts`
❌ "auth service" (ambiguous)

### **Specify Technology**

✅ "Using class-validator, create a DTO that validates..."
✅ "Add a React hook using useState and useEffect..."
❌ "Create validation"

### **Example Good Prompt:**

```
In apps/posts-api/src/posts/posts.service.ts,
I need to add pagination support to the getFeed() method.
It should accept skip and limit parameters,
query MongoDB with pagination,
and return both data and total count.
Use Mongoose lean() for performance.
```

## 📊 Quick Reference

### File Locations by Feature

| Feature            | Files                                                                            |
| ------------------ | -------------------------------------------------------------------------------- |
| **User Auth**      | `apps/auth-api/src/auth/*`, `libs/shared/auth-utils/src/*`                       |
| **Profiles**       | `apps/users-api/src/profiles/*`, `libs/shared/schemas/src/lib/profile.schema.ts` |
| **Posts**          | `apps/posts-api/src/posts/*`, `libs/shared/schemas/src/lib/post.schema.ts`       |
| **Frontend Pages** | `apps/web-app/src/pages/*`                                                       |
| **Frontend Hooks** | `apps/web-app/src/hooks/*`                                                       |
| **Frontend API**   | `apps/web-app/src/api/*`                                                         |
| **Global State**   | `apps/web-app/src/context/*`                                                     |
| **DTOs**           | `libs/shared/dto/src/lib/*`                                                      |
| **Schemas**        | `libs/shared/schemas/src/lib/*`                                                  |

### Common Tasks

| Task                     | Commands                                       |
| ------------------------ | ---------------------------------------------- |
| **Start development**    | `npm run dev:docker`                           |
| **View dependencies**    | `npx nx graph`                                 |
| **Run specific service** | `npx nx serve web-app`                         |
| **Build service**        | `npx nx build posts-api`                       |
| **Lint code**            | `npx nx lint auth-api --fix`                   |
| **Test service**         | `npx nx test users-api`                        |
| **Stop everything**      | `npm run dev:docker:down`                      |
| **Check DB**             | `docker exec -it sm-mongodb-container mongosh` |

## 📝 Important Notes

- **All backend services use NestJS 11.0.0** with Express under the hood
- **Mongoose 9.1.0** handles MongoDB schema validation and relationships
- **JWT tokens expire in 1 hour** (configurable in `*module.ts` files via `JwtModule.register()`)
- **Frontend is a client-side rendered SPA** with React Router v6
- **CORS is enabled** on all backend services for cross-origin requests
- **Global ValidationPipe** enforces DTO validation on all requests automatically
- **Password hashing uses bcrypt** with 10 salt rounds for security
- **MongoDB in Docker runs as mongo:8.0** with persistent `mongo_data` volume
- **Nx daemon** watches file changes and auto-rebuilds services during development
- **Docker volumes** mount code for hot-reload - no image rebuild needed
- **Service-to-service communication** uses Docker network names (e.g., `http://auth-api:3000`)
- **Frontend-to-backend communication** uses localhost URLs in dev (e.g., `http://localhost:3000`)

## 📞 Support & Resources

**Project Documentation:**

- [Nx Documentation](https://nx.dev)
- [NestJS Docs](https://docs.nestjs.com)
- [React Docs](https://react.dev)
- [Mongoose Docs](https://mongoosejs.com)

**Tools Used:**

- MongoDB: [docs.mongodb.com](https://docs.mongodb.com)
- Passport.js: [passportjs.org](http://www.passportjs.org)
- JWT: [jwt.io](https://jwt.io)

---

**Last Updated:** March 2026  
**Version:** 1.0.0  
**Status:** Active Development
