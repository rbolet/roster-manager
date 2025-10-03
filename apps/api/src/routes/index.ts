import type { FastifyInstance } from 'fastify';
import { healthRoutes } from './health.js';
import { authRoutes } from './auth.js';

/**
 * Register all application routes
 */
export async function registerRoutes(app: FastifyInstance): Promise<void> {
  // Health check routes
  await app.register(healthRoutes);

  // API routes
  await app.register(authRoutes, { prefix: '/api/auth' });
  // await app.register(userRoutes, { prefix: '/api/users' });
}
