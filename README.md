# Roster Manager

A modern, offline-capable full-stack TypeScript application for roster management. Built as a portfolio project demonstrating modern web development practices and architectural patterns.

## 🎯 Project Goals

1. **Portfolio Demonstration** - Showcase ability to solve complex problems with clean, scalable architecture
2. **Production Ready** - Built to scale if the application gains traction

## 🏗️ Architecture

This project follows a **loosely coupled, layered architecture** with clear separation of concerns:

- **Frontend (React + Vite)** - Deployed on Vercel
- **Backend (Fastify)** - Deployed on Railway
- **Database (PostgreSQL)** - Managed by Railway
- **Contracts (Zod)** - Shared validation schemas

### Key Architectural Decisions

- ✅ **Loose Coupling** - REST API instead of tRPC for framework independence
- ✅ **Type Safety** - End-to-end TypeScript with Zod validation
- ✅ **Offline First** - PWA with service workers and IndexedDB
- ✅ **Monorepo** - Turborepo for efficient builds and code sharing
- ✅ **Testing** - Unit (Vitest), Integration, and E2E (Playwright)

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Vite PWA** - Offline support

### Backend
- **Fastify** - Fast, low-overhead web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Lightweight, type-safe database access
- **PostgreSQL** - Production database
- **@fastify/jwt** - Authentication
- **Zod** - Runtime validation

### DevOps & Tooling
- **Turborepo** - Monorepo build system
- **pnpm** - Fast, efficient package manager
- **ESLint + Prettier** - Code quality
- **Vitest** - Unit & integration testing
- **Playwright** - E2E testing
- **GitHub Actions** - CI/CD
- **Docker Compose** - Local development
- **Railway** - Backend hosting
- **Vercel** - Frontend hosting

## 📦 Project Structure

```
roster-manager/
├── apps/
│   ├── web/              # React frontend (Vite + React)
│   └── api/              # Fastify backend
├── packages/
│   ├── database/         # Drizzle ORM schema & migrations
│   ├── contracts/        # Zod schemas (shared types)
│   └── tsconfig/         # Shared TypeScript configs
├── e2e/                  # Playwright E2E tests
└── .github/workflows/    # CI/CD pipelines
```

## 🛠️ Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0
- **Docker** (for local PostgreSQL)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/roster-manager.git
   cd roster-manager
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

4. **Start local PostgreSQL**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   pnpm db:migrate
   ```

6. **Start development servers**
   ```bash
   pnpm dev
   ```

The API will be available at `http://localhost:3001` and the frontend at `http://localhost:5173`.

## 📝 Development Commands

```bash
# Development
pnpm dev                  # Start all apps in dev mode
pnpm build                # Build all apps
pnpm clean                # Clean all build artifacts

# Code Quality
pnpm lint                 # Lint all packages
pnpm format               # Format code with Prettier
pnpm type-check           # TypeScript type checking

# Testing
pnpm test                 # Run unit tests
pnpm test:e2e             # Run E2E tests

# Database
pnpm db:generate          # Generate migration from schema changes
pnpm db:migrate           # Apply migrations
pnpm db:studio            # Open Drizzle Studio (DB GUI)
```

## 🧪 Testing Strategy

- **Unit Tests** (Vitest) - Test individual functions and components
- **Integration Tests** (Vitest) - Test API endpoints and database interactions
- **E2E Tests** (Playwright) - Test complete user flows across browser

## 🚀 Deployment

### Backend (Railway)

1. Connect your GitHub repository to Railway
2. Set environment variables (DATABASE_URL, JWT_SECRET, etc.)
3. Railway will auto-deploy on push to `main`

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set root directory to `apps/web`
3. Set environment variables (VITE_API_URL)
4. Vercel will auto-deploy on push to `main`

## 🔒 Security

- JWT authentication with HTTP-only cookies
- Rate limiting on API endpoints
- Helmet.js for security headers
- CORS configuration
- Input validation with Zod
- SQL injection prevention via Drizzle ORM

## 📄 License

MIT

## 👤 Author

Your Name - [GitHub](https://github.com/yourusername)

---

**Built with** ❤️ **as a portfolio project demonstrating modern full-stack development**
