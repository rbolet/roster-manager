import type { FastifyInstance } from 'fastify';
import { healthRoutes } from './health.js';

/**
 * Register all application routes
 */
export async function registerRoutes(app: FastifyInstance): Promise<void> {
  // Health check routes
  await app.register(healthRoutes);

  // API routes will be added here
  // await app.register(authRoutes, { prefix: '/api/auth' });
  // await app.register(userRoutes, { prefix: '/api/users' });
}
