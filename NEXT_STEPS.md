# Next Steps

The project scaffold is complete! Here's what to do next:

## 1. Install Dependencies

```bash
pnpm install
```

This will install all dependencies across the monorepo.

## 2. Setup Local Database

Start PostgreSQL with Docker:

```bash
docker-compose up -d
```

Generate and run initial migration:

```bash
pnpm db:generate
pnpm db:migrate
```

## 3. Configure Environment Variables

Copy the example files and update with your values:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

**Important:** Generate a strong JWT secret for `apps/api/.env`:

```bash
# Generate a secure random string (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 4. Start Development Servers

```bash
pnpm dev
```

This starts:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API health check: http://localhost:3001/health

## 5. Setup Git Hooks

```bash
pnpm prepare
```

This installs Husky git hooks for pre-commit linting.

## 6. Verify Setup

Run tests to ensure everything is working:

```bash
pnpm test
```

## 7. Optional: Install Playwright Browsers

For E2E testing:

```bash
npx playwright install
```

## What's Next?

Now you can start building application features! Here are some suggestions:

### Backend Features to Implement

1. **Authentication endpoints** (`apps/api/src/routes/auth.ts`)
   - POST `/api/auth/register` - User registration
   - POST `/api/auth/login` - User login
   - POST `/api/auth/refresh` - Refresh access token
   - POST `/api/auth/logout` - Logout

2. **User service** (`apps/api/src/services/user.service.ts`)
   - Password hashing (bcrypt/argon2)
   - Token generation/verification
   - User CRUD operations

3. **Roster features** (your core domain)
   - Define schemas in `packages/database/src/schema/`
   - Create repositories in `apps/api/src/repositories/`
   - Build services in `apps/api/src/services/`
   - Expose via routes in `apps/api/src/routes/`

### Frontend Features to Implement

1. **Authentication UI** (`apps/web/src/features/auth/`)
   - Login form
   - Registration form
   - Protected route wrapper

2. **API integration**
   - Update `apps/web/src/lib/api-client.ts` with auth headers
   - Create hooks for API calls (TanStack Query)
   - Handle token refresh

3. **Roster management UI** (your core domain)
   - List view
   - Create/edit forms
   - Offline support with service workers

## Development Tips

- **Database changes**: Edit schema → `pnpm db:generate` → `pnpm db:migrate`
- **Database GUI**: Run `pnpm db:studio` to open Drizzle Studio
- **Hot reload**: Both apps have hot module replacement
- **Type safety**: TypeScript will catch errors across the stack
- **API testing**: Use http://localhost:3001/health to verify API is running

## Deployment

When ready to deploy:

1. Push to GitHub
2. Connect Railway (backend) and Vercel (frontend)
3. Set environment variables in both platforms
4. Deployments will happen automatically on push to `main`

## Resources

- [Fastify Documentation](https://fastify.dev/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [React Query Docs](https://tanstack.com/query/latest)
- [Vite Docs](https://vitejs.dev/)

Happy coding! 🚀
