import type { FastifyInstance } from 'fastify';

/**
 * Health check routes
 */
export function healthRoutes(app: FastifyInstance): void {
  app.get('/health', () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  });

  app.get('/health/ready', () => {
    // Add database connectivity check here
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  });
}
