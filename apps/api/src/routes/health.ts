import type { FastifyInstance } from 'fastify';

/**
 * Health check routes
 */
export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  app.get('/health/ready', async () => {
    // Add database connectivity check here
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  });
}
