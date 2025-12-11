# Linktree Clone

A full-stack microservices application for creating and managing personalized link pages (similar to Linktree). Users can create multiple linktrees, add custom links, and share their public linktree pages.

## 🏗️ Architecture

This project follows a **microservices architecture** with the following components:

### Services

1. **Gateway Service** (Port 3000)

   - API Gateway that routes requests to appropriate services
   - Handles authentication middleware
   - Proxies requests to backend services

2. **Authentication Service** (Port 3001)

   - User registration and login
   - JWT token generation
   - Password hashing with bcrypt

3. **Linktrees Management Service** (Port 3002)

   - CRUD operations for linktrees
   - CRUD operations for links
   - Database operations using TypeORM

4. **Linktrees Public Service** (Port 3003)

   - Public-facing API for viewing linktrees
   - Redis caching for performance
   - Fetches data from management service

5. **Frontend Client** (Port 5173)
   - React + TypeScript + Vite
   - Tailwind CSS for styling
   - React Router for navigation
   - Two views: Authenticated (edit) and Public (view-only)

## 🛠️ Tech Stack

### Backend

- **Node.js** with **Express**
- **TypeScript**
- **TypeORM** (PostgreSQL)
- **JWT** for authentication
- **Redis** for caching
- **bcrypt** for password hashing
- **http-proxy-middleware** for API gateway

### Frontend

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Router**
- **Axios** for API calls
- **Heroicons** for icons

## 📋 Prerequisites

Before running the project, make sure you have:

- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **Redis** server
- **npm** or **yarn**

## 🚀 Getting Started (Local)

### 1. Clone the Repository

```bash
git clone https://github.com/nbhran3/linktree.git
cd linktree
```

### 2. Database Setup

Create a PostgreSQL database and update the connection details in each service's environment variables.

### 3. Install Dependencies

Install dependencies for each service:

```bash
# Authentication Service
cd authentication
npm install

# Gateway Service
cd ../linktree-gateway
npm install

# Management Service
cd ../linktrees-management
npm install

# Public Service
cd ../linktrees-public
npm install

# Frontend Client
cd ../linktree-client
npm install
```

### 4. Environment Variables

Create `.env` files in each service directory:

#### `authentication/.env`

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
JWT_SECRET=your-secret-key
```

#### `linktree-gateway/.env`

```env
PORT=3000
AUTH_SERVICE_URL=http://localhost:3001
MANAGEMENT_SERVICE_URL=http://localhost:3002
PUBLIC_SERVICE_URL=http://localhost:3003
JWT_SECRET=your-secret-key
```

#### `linktrees-management/.env`

```env
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
```

#### `linktrees-public/.env`

```env
PORT=3003
LINKTREES_MANAGEMENT_SERVICE_URL=http://localhost:3002
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=  # Optional
REDIS_CACHE_TTL=20  # Cache TTL in seconds (default: 20 seconds)
```

### 5. Start Redis

Make sure Redis is running:

```bash
# On Windows (if installed)
redis-server

# On Mac/Linux
redis-server
```

### 6. Run the Services

Open multiple terminal windows and run each service:

**Terminal 1 - Authentication Service:**

```bash
cd authentication
npm run dev
```

**Terminal 2 - Gateway Service:**

```bash
cd linktree-gateway
npm run dev
```

**Terminal 3 - Management Service:**

```bash
cd linktrees-management
npm run dev
```

**Terminal 4 - Public Service:**

```bash
cd linktrees-public
npm run dev
```

**Terminal 5 - Frontend Client:**

```bash
cd linktree-client
npm run dev
```

### 7. Access the Application

- **Frontend**: http://localhost:5173
- **Gateway**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health

## 📁 Project Structure

```
linktree/
├── authentication/          # Authentication microservice
│   ├── src/
│   │   ├── controllers/    # Authentication controllers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Data access layer
│   │   └── entity/         # Database entities
│   └── package.json
│
├── linktree-gateway/       # API Gateway
│   ├── src/
│   │   ├── index.ts        # Gateway server
│   │   └── middlewares/    # Auth middleware
│   └── package.json
│
├── linktrees-management/    # Linktrees CRUD service
│   ├── src/
│   │   ├── controllers/    # Linktree & Link controllers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Data access layer
│   │   └── entity/         # Database entities
│   └── package.json
│
├── linktrees-public/       # Public API service
│   ├── src/
│   │   ├── controller/     # Public controller
│   │   ├── services/       # Cache & API calls
│   │   └── redis-client.ts # Redis connection
│   └── package.json
│
└── linktree-client/        # React frontend
    ├── src/
    │   ├── pages/          # Page components
    │   ├── components/     # Reusable components
    │   ├── context/        # Auth context
    │   └── styles/         # CSS files
    └── package.json
```

## 🔑 API Endpoints

### Authentication (via Gateway: `/auth`)

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Linktrees (via Gateway: `/linktrees`)

- `GET /linktrees` - Get user's linktrees (requires auth)
- `POST /linktrees` - Create a new linktree (requires auth)
- `GET /linktrees/:id` - Get linktree by ID (requires auth)
- `DELETE /linktrees/:id` - Delete linktree (requires auth)
- `POST /linktrees/:id/links` - Add a link (requires auth)
- `PATCH /linktrees/:id/links/:linkId` - Update a link (requires auth)
- `DELETE /linktrees/:id/links/:linkId` - Delete a link (requires auth)

### Public (via Gateway: `/public`)

- `GET /public/linktrees/:suffix` - Get public linktree by suffix (no auth required)

## 🎨 Features

### User Features

- ✅ User registration and login
- ✅ Create multiple linktrees
- ✅ Add, edit, and delete links
- ✅ Public linktree pages (read-only view)
- ✅ Responsive design and animated backgrounds on Home, Login, Register
- ✅ Real-time cache updates

### Technical Features

- ✅ Microservices architecture
- ✅ JWT authentication
- ✅ Redis caching with TTL
- ✅ API Gateway pattern
- ✅ TypeScript throughout
- ✅ Modern React with hooks
- ✅ Tailwind CSS styling

## 🔒 Authentication Flow

1. User registers/logs in → Authentication Service
2. Service returns JWT token
3. Frontend stores token in context
4. Gateway validates token on protected routes
5. Gateway forwards requests with `x-user-id` header

## 💾 Caching Strategy

- **Redis** caches public linktree data
- Cache TTL configurable via `REDIS_CACHE_TTL` (default: 20 seconds)
- Cache automatically refreshes after TTL expires
- Public linktrees are cached to reduce database load

## ✨ Recent UI/UX Updates

- Linktree logo on Home, Login, and Register pages links back to the homepage
- Login/Register logo placed at the top-left for quick navigation
- Header on HomePage stretches edge-to-edge with links near the screen edges
- Animated gradient backgrounds on Home, Login, and Register for a unified look

## 🧪 Development

### Running in Development Mode

All services support hot-reload in development:

- Use `npm run dev` for all services
- Frontend uses Vite HMR (Hot Module Replacement)

### Building for Production

```bash
# Build each service
cd authentication && npm run build
cd ../linktrees-management && npm run build
cd ../linktrees-public && npm run build
cd ../linktree-client && npm run build
```

## 🚀 Quickstart (Docker)

1. Start Postgres and Redis (example):

```bash
docker run -d --name pg --network linktree-net \
  -e POSTGRES_USER=linktree_user \
  -e POSTGRES_PASSWORD=linktree_password \
  -e POSTGRES_DB=linktree_db \
  -p 5432:5432 postgres:15-alpine

docker run -d --name redis --network linktree-net -p 6379:6379 redis:7-alpine
```

2. Run migrations (so required tables exist):

- Authentication:

```bash
cd authentication
npm run migration:run
```

- Management:

```bash
cd ../linktrees-management
npm run migration:run
```

3. Start the services (example commands; adjust envs as needed):

- Gateway: `docker run -d --name gateway --network linktree-net -p 3000:3000 linktree-gateway`
- Auth: `docker run -d --name auth --network linktree-net -p 3001:3001 linktree-authentication`
- Management: `docker run -d --name management --network linktree-net -p 3002:3002 linktrees-management`
- Public: `docker run -d --name public --network linktree-net -p 3003:3003 linktrees-public`
- Client: `docker run -d --name client --network linktree-net -p 5173:5173 linktree-client`

4. Access:

- Frontend: http://localhost:5173
- Gateway: http://localhost:3000
- Public linktree (API): http://localhost:3000/public/linktrees/{suffix}
- Public linktree (frontend): http://localhost:5173/linktree/{suffix}

## 📝 Notes

- Make sure all services are running before testing
- Run migrations so the database has the required tables (auth: `users`; management: `linktrees`, `links`)
- Redis must be running for the public service to work
- The gateway service must be running for frontend API calls

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

ISC
