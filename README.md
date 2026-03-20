# Social Media Monorepo

A full-stack social media application built as an Nx monorepo with microservices architecture. This project demonstrates a modern approach to building scalable applications with NestJS, React, MongoDB, and Kubernetes orchestration.

## 📋 Project Overview

This is a **full-stack social media platform** featuring:

- User authentication and authorization
- User profile management
- Social features (posts, interactions, user discovery)
- Real-time interactions
- Responsive React frontend
- Microservices backend architecture
- Production-ready deployment with Docker and Kubernetes

**Tech Stack:**

- **Framework:** Nx monorepo for workspace management
- **Backend:** NestJS (Node.js framework), Express
- **Frontend:** React 19 with React Router
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with Passport.js
- **Build Tools:** Webpack, Vite, SWC
- **Styling:** CSS
- **Testing:** Vitest, Jest
- **Deployment:** Docker, Docker Compose, Kubernetes
- **Package Management:** npm
- **Language:** TypeScript

## 🏗️ Project Architecture

### Monorepo Structure

```
apps/                          # Applications
├── auth-api/                 # Authentication & User Management microservice
├── posts-api/                # Posts & Content microservice
├── users-api/                # User Profiles & Social Graph microservice
└── web-app/                  # React frontend application

libs/shared/                   # Shared code & utilities
├── auth-utils/              # Authentication utilities & strategies
├── constants/               # Shared constants
├── dto/                     # Data Transfer Objects for APIs
└── schemas/                 # Mongoose schemas & models

k8s/                          # Kubernetes manifests
├── namespace.yaml
├── configmap.yaml
├── secret.yaml
├── auth-api/
├── posts-api/
├── users-api/
├── web-app/
└── mongo-db/

docker-compose.dev.yaml       # Local development with hot-reload
docker-compose.yaml          # Production deployment
```

## 🚀 Applications

### 1. **Auth API** (`apps/auth-api`)

**Port:** 3000  
**Purpose:** User authentication, registration, and JWT token management

**Key Endpoints:**

- `POST /api/signup` - Register a new user
- `POST /api/login` - Authenticate user, returns JWT token
- `GET /api/me` - Get current authenticated user (JWT guarded)

**Technologies:** NestJS, MongoDB, Passport.js, JWT, Bcrypt

**Key Features:**

- User registration with password hashing
- Login with email/password
- JWT token generation and validation
- Role-based access control integration
- Communicates with users-api for profile creation

### 2. **Users API** (`apps/users-api`)

**Port:** 3002  
**Purpose:** User profile management and social graph

**Key Endpoints:**

- `POST /api/profiles` - Create a new user profile
- `GET /api/profiles/:username` - Get user profile by username
- `PATCH /api/profiles/:userId` - Update user profile (JWT guarded)

**Technologies:** NestJS, MongoDB, Mongoose, JWT

**Key Features:**

- Create and manage user profiles
- Profile information (bio, avatar, followers, etc.)
- User discovery and search functionality
- Social connections (followers/following)

### 3. **Posts API** (`apps/posts-api`)

**Port:** 3001  
**Purpose:** Create, manage, and interact with posts

**Key Endpoints:**

- `GET /` - Get all posts/feed
- Additional post operations (CRUD, likes, comments)

**Technologies:** NestJS, MongoDB, Express

**Key Features:**

- Create, read, update, delete posts
- Like/unlike functionality
- Comment system
- Feed aggregation
- Media attachments support

### 4. **Web App** (`apps/web-app`)

**Port:** 5173 (dev) / 80 (prod)  
**Purpose:** React-based frontend for the social media platform

**Key Pages:**

- `/login` - User login
- `/signup` - User registration
- `/` - Feed/Home (protected)
- `/profile/:username` - User profile view
- `/edit-profile` - Edit own profile

**Technologies:** React 19, Vite, React Router, Axios, TailwindCSS/CSS

**Key Components:**

- `AuthContext` - Global authentication state management
- `CreatePost` - Post creation component
- `PostCard` - Individual post display
- `Navbar` - Navigation header
- `UserListModal` - User discovery modal

**Features:**

- Protected routes (requires authentication)
- JWT token management in localStorage
- Axios interceptor for API requests
- Real-time form validation (react-hook-form)
- Responsive UI

## 📚 Shared Libraries

All backend services and frontend share code through the `libs/shared` directory:

### `auth-utils`

- JWT strategy for Passport.js
- JwtAuthGuard for route protection
- Authentication decorators and middleware
- User extraction from JWT tokens

### `dto` (Data Transfer Objects)

- `LoginDto` - Login credentials validation
- `SignupDto` - Registration data validation
- API request/response contracts

### `schemas`

- `User` - User account schema
- `Profile` - User profile schema
- `Post` - Post/content schema
- Mongoose models and validation rules

### `constants`

- API endpoints
- Environment variables
- Shared business logic constants

## 🗄️ Database

**MongoDB** is used as the primary datastore:

- User accounts (auth-api)
- User profiles (users-api)
- Posts and interactions (posts-api)

**Connection:** MongoDB runs in a Docker container, configured via `MONGO_URI` environment variable

## 🔐 Authentication Flow

1. User signs up with credentials → **Auth API** creates account with hashed password
2. User logs in → **Auth API** validates credentials and returns JWT token
3. JWT stored in browser localStorage
4. Requests to protected endpoints include `Authorization: Bearer <token>`
5. **JwtAuthGuard** validates token and extracts user information
6. Protected routes verified on both frontend and backend

## 🐳 Deployment

### Local Development with Docker (Hot-Reload)

```sh
npm run dev:docker
```

This command runs all services with volume mounting for hot-reload:

- MongoDB on localhost (no exposed port)
- Auth API on `http://localhost:3000`
- Posts API on `http://localhost:3001`
- Users API on `http://localhost:3002`
- Web App on `http://localhost:5173` (or configured port)

Services watch for file changes and automatically restart.

### Production Deployment with Docker

```sh
npm run prod:docker
```

Production uses pre-built images:

- MongoDB 8.0
- Pre-built Auth API image
- Pre-built Posts API image
- Pre-built Users API image
- Pre-built Web App image (Nginx reverse proxy)

Services restart automatically on failure.

### Stop Services

```sh
npm run dev:docker:down     # Stop dev containers and volumes
npm run prod:docker:down    # Stop prod containers and volumes
```

### Kubernetes Deployment

Kubernetes manifests in `k8s/` define:

- Namespace for service isolation
- ConfigMaps for non-sensitive configuration
- Secrets for sensitive data (credentials)
- Deployments for each microservice
- Services for inter-service communication
- StatefulSet for MongoDB
- Ingress for external traffic routing

Deploy to Kubernetes:

```sh
kubectl apply -f k8s/
```

## 📦 Running Tasks with Nx

View the project graph and understand dependencies:

```sh
npx nx graph
```

Build a specific app:

```sh
npx nx build auth-api
npx nx build web-app
```

Run a specific app in development:

```sh
npx nx serve auth-api
npx nx serve web-app
```

Run linting:

```sh
npx nx lint auth-api
npx nx lint web-app
```

Run tests:

```sh
npx nx test auth-api
npx nx test web-app
```

Build all apps:

```sh
npx nx run-many --target=build --all
```

## 🛠️ Environment Variables

Create `.env.local` file in project root for Docker/local development:

```
# Database
MONGO_INITDB_DATABASE=social_media
MONGO_URI=mongodb://mongodb:27017/social_media

# Auth
JWT_SECRET=your-secret-key-here

# Inter-service URLs
USERS_API_URL=http://users-api:3000
POSTS_API_URL=http://posts-api:3000
AUTH_API_URL=http://auth-api:3000

# Frontend
VITE_API_BASE_URL=http://localhost:3000
```

## 📂 Development Workflow

1. **Setup:** Install dependencies

   ```sh
   npm install
   ```

2. **Development:** Run services with Docker hot-reload

   ```sh
   npm run dev:docker
   ```

3. **Code Changes:** Edit files in `apps/` or `libs/shared/`

   - Changes automatically trigger rebuilds in containers
   - Frontend hot-reloads in browser
   - Backend services restart automatically

4. **Database:** MongoDB persists in `mongo_data` volume

5. **Testing:** Run tests locally or in containers
   ```sh
   npx nx test <project>
   ```

## 🔄 Service Communication

- **Frontend → Backend:** HTTP/REST via Axios
- **Auth API ↔ Users API:** HTTP calls, environment-based URLs

## 🗂️ Key Files Reference

- [nx.json](nx.json) - Nx workspace configuration, plugins, and generators
- [package.json](package.json) - Dependencies, versions, and npm scripts
- [tsconfig.base.json](tsconfig.base.json) - TypeScript configuration with path aliases
- [docker-compose.dev.yaml](docker-compose.dev.yaml) - Development environment setup
- [docker-compose.yaml](docker-compose.yaml) - Production environment setup

## 🤝 How to Help AI Understand Your Code

When asking AI for help with this project:

1. **Mention the service:** Which API or app (auth-api, posts-api, users-api, web-app)?
2. **Specify the file:** Path relative to workspace root (e.g., `apps/auth-api/src/app/app.module.ts`)
3. **Describe the task:** Are you adding a feature, fixing a bug, or refactoring?
4. **Include error messages:** Paste full error stack traces
5. **Reference endpoints:** Which API endpoint needs changes?

Example: "In `apps/posts-api`, I need to add a `/posts` GET endpoint that returns paginated posts from MongoDB. The endpoint should be protected by JWT."

## 📖 Useful Commands

| Command                 | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| `npm run dev:docker`    | Start all services locally with hot-reload |
| `npx nx graph`          | Visualize project dependencies             |
| `npx nx serve web-app`  | Run web-app in dev mode                    |
| `npx nx build auth-api` | Build auth-api for production              |
| `npx nx lint <project>` | Run ESLint on project                      |
| `npx nx test <project>` | Run tests for project                      |
| `npm install`           | Install all dependencies                   |

## 📝 Notes

- All backend services use **NestJS** with **Express** under the hood
- **Mongoose** handles MongoDB schema validation and relationships
- **JWT tokens** expire in 1 hour (configurable in app modules)
- **Frontend** is a SPA with client-side routing
- **CORS** is enabled on all backend services
- **Global ValidationPipe** enforces DTO validation on all requests

```sh
npm run dev:docker:down
```

Notes:

- The dev compose now includes a `mongodb` service (image: `mongo:6`) and a `mongo_data` volume. `auth-api` reads the DB connection from `MONGO_URI` (set to `mongodb://mongodb:27017/social-media-monorepo-db` by the compose file).
  - MongoDB is exposed on the host at `localhost:27017` (for local debugging). The default DB name is `social-media-monorepo-db`.
  - To inspect data from the host you can run: `docker exec -it sm-mongodb-dev mongosh` or connect with a GUI client to `mongodb://localhost:27017`.
