# Social Media Monorepo

A full-stack, production-ready social media application built as an **Nx monorepo** with **microservices architecture**. This project demonstrates a modern approach to building scalable applications with NestJS, React 19, MongoDB, MinIO, and comprehensive deployment support via Docker and Kubernetes.

## 📋 Project Overview

This is a **full-stack social media platform** featuring:

- **User Authentication** - JWT-based auth with email/password, password hashing with bcrypt
- **User Profiles** - Profile management with bio, profile pictures, follower/following system
- **Posts & Feed** - Create, edit, delete posts with real image uploads and captions
- **Media Uploads** - Image upload for posts and profile pictures via MinIO object storage
- **Social Interactions** - Like/unlike posts, comment system with nested comments
- **User Discovery** - Search users by username, follow/unfollow functionality
- **Microservices Architecture** - Decoupled, independently deployable services
- **Production Deployment** - Docker Compose and Kubernetes support with hot-reload for development

**Tech Stack:**

- **Framework:** Nx 21.6.10 - Monorepo workspace management with task orchestration
- **Backend:** NestJS 11.0.0 - Enterprise Node.js framework with TypeScript
- **Frontend:** React 19, Vite 7.0.0, TailwindCSS 4.2.2
- **Database:** MongoDB 8.0 with Mongoose 9.1.0
- **Object Storage:** MinIO (S3-compatible, self-hosted)
- **Authentication:** JWT + Passport.js, Bcrypt 6.0.0
- **HTTP Client:** Axios 1.13.2 with JWT interceptor
- **File Uploads:** Multer 2.1.1
- **Notifications:** react-hot-toast 2.6.0
- **Icons:** lucide-react 0.562.0
- **Testing:** Vitest 3.0.0, Jest
- **Language:** TypeScript 5.9.2
- **Deployment:** Docker, Docker Compose, Kubernetes
- **CI/CD:** GitHub Actions, ESLint 9.8.0, Prettier

---

## 🏗️ Project Architecture

### Monorepo Structure

```
apps/
├── auth-api/                          # Port 3000 - Authentication microservice
│   ├── src/
│   │   ├── app/app.module.ts
│   │   ├── auth/
│   │   │   ├── auth.controller.ts     # /auth/signup, /auth/login, /auth/me
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   └── webpack.config.js
│
├── posts-api/                         # Port 3001 - Posts & Interactions microservice
│   ├── src/
│   │   ├── app/app.module.ts
│   │   ├── posts/
│   │   │   ├── posts.controller.ts    # /posts, /posts/feed, /posts/:id/like, etc.
│   │   │   ├── posts.service.ts
│   │   │   ├── posts.module.ts
│   │   │   └── dto/                   # CreatePostDto, UpdatePostDto, CreateCommentDto
│   │   └── main.ts
│   └── Dockerfile
│
├── users-api/                         # Port 3002 - User Profiles microservice
│   ├── src/
│   │   ├── app/app.module.ts
│   │   ├── profiles/
│   │   │   ├── profiles.controller.ts # /profiles, /profiles/:username, /profiles/:id/follow
│   │   │   ├── profiles.service.ts
│   │   │   ├── profiles.module.ts
│   │   │   └── dto/                   # CreateProfileDto, UpdateProfileDto
│   │   └── main.ts
│   └── Dockerfile
│
├── media-api/                         # Port 3003 - File Upload microservice
│   ├── src/
│   │   ├── app/app.module.ts
│   │   ├── media/
│   │   │   ├── media.controller.ts    # POST /media/upload/:bucket
│   │   │   ├── media.service.ts       # MinIO client, bucket management, file upload
│   │   │   └── media.module.ts
│   │   └── main.ts
│   └── Dockerfile
│
└── web-app/                           # Port 5173 (dev) / 80 (prod) - React SPA
    ├── src/
    │   ├── main.tsx
    │   ├── app/app.tsx
    │   ├── pages/                     # Login, Signup, Feed, Profile, EditProfile
    │   ├── components/
    │   │   ├── layout/                # Navbar, ProtectedRoute
    │   │   ├── post/                  # PostCard, PostGrid, CreatePostModal
    │   │   ├── profile/               # FollowButton
    │   │   └── ui/                    # Avatar, Modal, Spinner
    │   ├── hooks/                     # usePosts, useProfile
    │   ├── context/AuthContext.tsx
    │   ├── api/                       # axios, auth.api, posts.api, users.api, media.api
    │   ├── config/api.ts              # API base URLs from environment
    │   ├── types/index.ts
    │   └── styles.css
    ├── Dockerfile
    ├── nginx.conf
    └── entrypoint.sh                  # Runtime env var injection

libs/shared/
├── auth-utils/                        # JwtStrategy, JwtAuthGuard, @CurrentUser() decorator
├── dto/                               # SignupDto, LoginDto
└── schemas/                           # User, Profile, Post Mongoose schemas

k8s/
├── namespace.yaml
├── configmap.yaml
├── secret.yaml
├── ingress.yaml
├── auth-api/
├── posts-api/
├── users-api/
├── media-api/
├── web-app/
└── mongo-db/
```

### Service Dependencies

```
web-app (React SPA)
  ├→ auth-api   (JWT authentication)
  ├→ posts-api  (Post CRUD & interactions)
  ├→ users-api  (User profiles & social graph)
  └→ media-api  (File uploads)

auth-api
  ├→ MongoDB    (User storage)
  └→ users-api  (Create profile on signup)

posts-api
  └→ MongoDB    (Posts & comments)

users-api
  └→ MongoDB    (Profiles & social connections)

media-api
  └→ MinIO      (Object storage for images & videos)
```

---

## 🚀 API Reference

### Auth API — `http://localhost:3000/api`

| Method | Endpoint       | Auth | Body                            | Response                                              |
| ------ | -------------- | ---- | ------------------------------- | ----------------------------------------------------- |
| `POST` | `/auth/signup` | ❌   | `{ email, username, password }` | `{ message }`                                         |
| `POST` | `/auth/login`  | ❌   | `{ email, password }`           | `{ access_token, user: { userId, username, email } }` |
| `GET`  | `/auth/me`     | ✅   | —                               | `{ userId, username, email }`                         |

### Posts API — `http://localhost:3001/api`

| Method   | Endpoint                         | Auth | Description                           |
| -------- | -------------------------------- | ---- | ------------------------------------- |
| `GET`    | `/posts/feed`                    | ❌   | Get all posts                         |
| `GET`    | `/posts/user/:userId`            | ❌   | Get posts by user                     |
| `POST`   | `/posts`                         | ✅   | Create post `{ imageUrl, caption? }`  |
| `PATCH`  | `/posts/:id`                     | ✅   | Edit post caption                     |
| `DELETE` | `/posts/:id`                     | ✅   | Delete post                           |
| `POST`   | `/posts/:id/like`                | ✅   | Toggle like → `{ liked, likesCount }` |
| `POST`   | `/posts/:id/comments`            | ✅   | Add comment `{ text }`                |
| `DELETE` | `/posts/:id/comments/:commentId` | ✅   | Delete comment                        |

### Users API — `http://localhost:3002/api`

| Method  | Endpoint                   | Auth | Description                          |
| ------- | -------------------------- | ---- | ------------------------------------ |
| `POST`  | `/profiles`                | ❌   | Create profile (called by auth-api)  |
| `GET`   | `/profiles/search?q=`      | ❌   | Search users by username             |
| `GET`   | `/profiles/id/:userId`     | ❌   | Get profile by userId                |
| `GET`   | `/profiles/:username`      | ❌   | Get profile by username              |
| `PATCH` | `/profiles`                | ✅   | Update own profile (bio, profilePic) |
| `POST`  | `/profiles/:userId/follow` | ✅   | Toggle follow/unfollow               |

### Media API — `http://localhost:3003/api`

| Method | Endpoint                         | Auth | Description                                     |
| ------ | -------------------------------- | ---- | ----------------------------------------------- |
| `POST` | `/media/upload/posts-images`     | ✅   | Upload post image (JPEG/PNG/WebP/GIF, max 10MB) |
| `POST` | `/media/upload/profile-pictures` | ✅   | Upload profile picture (JPEG/PNG/WebP, max 5MB) |
| `POST` | `/media/upload/videos`           | ✅   | Upload video (MP4/WebM/MOV, max 100MB)          |

**Request:** `multipart/form-data` with field `file`
**Response:** `{ url: "http://localhost:9000/posts-images/filename.jpg" }`

---

## 🗂️ MinIO Object Storage

MinIO is an S3-compatible self-hosted object storage. Files are stored in public buckets and served directly via URL.

**Buckets:**

| Bucket             | Purpose              | Max Size | Allowed Types        |
| ------------------ | -------------------- | -------- | -------------------- |
| `posts-images`     | Post images          | 10MB     | JPEG, PNG, WebP, GIF |
| `profile-pictures` | Profile avatars      | 5MB      | JPEG, PNG, WebP      |
| `videos`           | Post videos (future) | 100MB    | MP4, WebM, MOV       |

**Access:**

- API: `http://localhost:9000`
- Web Console: `http://localhost:9001` (login: `minioadmin` / `minioadmin123`)
- Files are publicly accessible via URL: `http://localhost:9000/<bucket>/<filename>`

**Production:** Swap MinIO for AWS S3 with zero code changes — the SDK is S3-compatible.

---

## 📚 Shared Libraries

### `auth-utils`

- `JwtStrategy` — Passport JWT strategy
- `JwtAuthGuard` — route protection guard (`@UseGuards(JwtAuthGuard)`)
- `@CurrentUser()` — extracts `{ userId, username, email }` from JWT in controllers

### `dto`

- `SignupDto` — email, username, password (min 8 chars)
- `LoginDto` — email, password

### `schemas`

- `User` — email, username, hashed password
- `Profile` — userId, username, bio, profilePic, followers[], following[]
- `Post` — userId, username, imageUrl, caption, likes[], comments[]

---

## 🗄️ Database

**MongoDB 8.0** — Collections: `users`, `profiles`, `posts`

**Connection:** `mongodb://mongodb:27017/social-media-monorepo-db`

```bash
docker exec -it sm-mongodb-container mongosh
mongosh mongodb://localhost:27017/social-media-monorepo-db  # from host
```

---

## 🔐 Authentication Flow

1. Signup → `auth-api` hashes password, creates user, calls `users-api` to create profile
2. Login → returns JWT (expires 1h) + `{ userId, username, email }`
3. JWT stored in `localStorage`, Axios interceptor adds `Authorization: Bearer <token>`
4. `JwtAuthGuard` + `JwtStrategy` validate token on protected endpoints
5. `@CurrentUser()` extracts user from token payload
6. 401 responses → frontend clears token and redirects to `/login`

---

## 🐳 Local Development

### Prerequisites

- Node.js 22+
- Docker & Docker Compose

### Setup

```bash
git clone https://github.com/prathore-me/social-media-monorepo.git
cd social-media-monorepo
npm install
cp .env.example .env.local
# Edit .env.local — set a strong JWT_SECRET
```

### Environment Variables (`.env.local`)

```bash
# Database
MONGO_INITDB_DATABASE=social-media-monorepo-db
MONGO_URI=mongodb://mongodb:27017/social-media-monorepo-db

# Auth
JWT_SECRET=your-strong-secret-key-here

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_USE_SSL=false

# Inter-service (Docker network)
USERS_API_URL=http://users-api:3000/api

# Frontend (browser)
VITE_AUTH_API_URL=http://localhost:3000/api
VITE_USERS_API_URL=http://localhost:3002/api
VITE_POSTS_API_URL=http://localhost:3001/api
VITE_MEDIA_API_URL=http://localhost:3003/api
```

| Variable              | Used By           | Purpose                     |
| --------------------- | ----------------- | --------------------------- |
| `MONGO_URI`           | All backend APIs  | MongoDB connection          |
| `JWT_SECRET`          | All backend APIs  | Sign/verify JWT tokens      |
| `MINIO_ROOT_USER`     | media-api, Docker | MinIO access key            |
| `MINIO_ROOT_PASSWORD` | media-api, Docker | MinIO secret key            |
| `MINIO_ENDPOINT`      | media-api         | MinIO host (Docker network) |
| `USERS_API_URL`       | auth-api          | Call users-api on signup    |
| `VITE_*_API_URL`      | web-app           | Frontend API base URLs      |

### Run with Docker

```bash
npm run dev:docker       # Start all services with hot-reload
npm run dev:docker:down  # Stop and remove volumes
```

**Services:**

| Service       | URL                         |
| ------------- | --------------------------- |
| Web App       | `http://localhost:5173`     |
| Auth API      | `http://localhost:3000/api` |
| Posts API     | `http://localhost:3001/api` |
| Users API     | `http://localhost:3002/api` |
| Media API     | `http://localhost:3003/api` |
| MinIO API     | `http://localhost:9000`     |
| MinIO Console | `http://localhost:9001`     |

---

## 📦 Nx Commands

```bash
npx nx graph                              # Visualize dependencies
npx nx serve auth-api                     # Serve a specific app
npx nx serve web-app
npx nx build auth-api                     # Build a specific app
npx nx run-many --target=build --all      # Build all apps
npx nx lint auth-api --fix                # Lint with auto-fix
npx nx test auth-api --coverage           # Run tests with coverage
npx nx affected --targets=build,lint,test # CI — run only affected
```

---

## 🚢 Production Deployment

### Docker Compose

```bash
npm run prod:docker       # Start (pre-built Docker Hub images)
npm run prod:docker:down  # Stop
```

### Kubernetes

```bash
kubectl apply -f k8s/
kubectl get pods -n social-media-monorepo
```

### CI/CD (GitHub Actions)

On push to `main` (`.github/workflows/main.yaml`):

1. Bumps semantic version, creates GitHub Release
2. Builds and pushes Docker images to Docker Hub in parallel
3. Tags with version number and `latest`

Required secrets: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`

Docker images:

- `prathoreme/social-media-monorepo-auth-api`
- `prathoreme/social-media-monorepo-posts-api`
- `prathoreme/social-media-monorepo-users-api`
- `prathoreme/social-media-monorepo-media-api`
- `prathoreme/social-media-monorepo-web-app`

---

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
// 1. Create page
// apps/web-app/src/pages/NewPage.tsx
export default function NewPage() { ... }

// 2. Add route in app.tsx
<Route path="/new" element={<ProtectedRoute><NewPage /></ProtectedRoute>} />

// 3. Add API call
// apps/web-app/src/api/posts.api.ts
export const newFeature = async (data: any) => {
  const res = await api.post(`${POSTS_API_URL}/posts/new-feature`, data);
  return res.data;
};
```

### Debugging

```bash
docker logs -f sm-auth-api-container
docker logs -f sm-posts-api-container
docker logs -f sm-users-api-container
docker logs -f sm-media-api-container
docker exec -it sm-mongodb-container mongosh
```

Frontend: DevTools (F12) → Console + Network tabs.

---

## 🔄 Service Communication

1. **Browser → Web App** — React UI
2. **Web App → Auth API** — `http://localhost:3000/api/auth` (JWT)
3. **Web App → Posts API** — `http://localhost:3001/api/posts` (JWT)
4. **Web App → Users API** — `http://localhost:3002/api/profiles` (JWT)
5. **Web App → Media API** — `http://localhost:3003/api/media` (JWT, multipart)
6. **Auth API → Users API** — `http://users-api:3000/api/profiles` (Docker network)
7. **Media API → MinIO** — `http://minio:9000` (Docker network, S3 SDK)
8. **All APIs → MongoDB** — `mongodb://mongodb:27017/social-media-monorepo-db`

---

## 🗂️ Key Files Reference

| File                          | Purpose                             |
| ----------------------------- | ----------------------------------- |
| `nx.json`                     | Nx workspace config                 |
| `package.json`                | Dependencies and npm scripts        |
| `tsconfig.base.json`          | TypeScript config with path aliases |
| `.env.example`                | Environment variables template      |
| `docker-compose.dev.yaml`     | Local dev with hot-reload           |
| `docker-compose.yaml`         | Production deployment               |
| `k8s/`                        | Kubernetes manifests                |
| `.github/workflows/main.yaml` | CI/CD pipeline                      |

---

## 💡 Tips for AI Code Generation

✅ `"In apps/posts-api/src/posts/posts.service.ts, add pagination to getFeed() with skip and limit params"`
❌ `"Add pagination"`

✅ Paste full error stack traces
❌ `"There's an error"`

✅ Reference exact file paths: `libs/shared/dto/src/lib/signup.dto.ts`
❌ `"the dto file"`

---

## 📊 Quick Reference

### File Locations by Feature

| Feature             | Files                                                                            |
| ------------------- | -------------------------------------------------------------------------------- |
| User Auth           | `apps/auth-api/src/auth/*`, `libs/shared/auth-utils/src/*`                       |
| Profiles            | `apps/users-api/src/profiles/*`, `libs/shared/schemas/src/lib/profile.schema.ts` |
| Posts               | `apps/posts-api/src/posts/*`, `libs/shared/schemas/src/lib/post.schema.ts`       |
| Media Upload        | `apps/media-api/src/media/*`                                                     |
| Frontend Pages      | `apps/web-app/src/pages/*`                                                       |
| Frontend Components | `apps/web-app/src/components/{layout,post,profile,ui}/*`                         |
| Frontend Hooks      | `apps/web-app/src/hooks/*`                                                       |
| Frontend API        | `apps/web-app/src/api/*`                                                         |
| Global Auth State   | `apps/web-app/src/context/AuthContext.tsx`                                       |
| Types               | `apps/web-app/src/types/index.ts`                                                |
| DTOs                | `libs/shared/dto/src/lib/*`                                                      |
| Schemas             | `libs/shared/schemas/src/lib/*`                                                  |

### Common Commands

| Task              | Command                                            |
| ----------------- | -------------------------------------------------- |
| Start dev         | `npm run dev:docker`                               |
| Stop dev          | `npm run dev:docker:down`                          |
| Start prod        | `npm run prod:docker`                              |
| Stop prod         | `npm run prod:docker:down`                         |
| View dependencies | `npx nx graph`                                     |
| Serve app         | `npx nx serve web-app`                             |
| Build app         | `npx nx build auth-api`                            |
| Lint              | `npx nx lint auth-api --fix`                       |
| Test              | `npx nx test auth-api`                             |
| Check DB          | `docker exec -it sm-mongodb-container mongosh`     |
| MinIO console     | `http://localhost:9001` (minioadmin/minioadmin123) |

---

## 📝 Important Notes

- **JWT tokens expire in 1 hour** (configurable in `*.module.ts` via `JwtModule.register()`)
- **CORS** is enabled on all backend services
- **Global ValidationPipe** enforces DTO validation on all requests
- **Nx daemon** (`NX_DAEMON=true`) is required inside Docker for hot-reload
- **Service-to-service** communication uses Docker network hostnames
- **Frontend-to-backend** uses localhost in dev
- **MinIO** is S3-compatible — swap for AWS S3 in production with zero code changes
- **Media buckets** are public — files are accessible directly via URL
- **Production web-app** uses Nginx + `entrypoint.sh` for runtime env var injection
- **MongoDB** runs as `mongo:8.0` with persistent `mongo_data` volume
- **MinIO** persists data in `minio_data` volume

---

## 📞 Support & Resources

- [Nx Documentation](https://nx.dev)
- [NestJS Docs](https://docs.nestjs.com)
- [React Docs](https://react.dev)
- [Mongoose Docs](https://mongoosejs.com)
- [MinIO Docs](https://min.io/docs)
- [JWT](https://jwt.io)

---

**Last Updated:** March 2026 | **Version:** 1.0.0 | **Status:** Active Development
