import type { FastifyInstance } from 'fastify';
import { healthResponseSchema, errorSchema } from '@roster-manager/contracts';

/**
 * Health check routes with OpenAPI documentation
 */
export function healthRoutes(app: FastifyInstance): void {
  app.get(
    '/health',
    {
      schema: {
        description: 'Health check endpoint to verify API status',
        tags: ['Health'],
        summary: 'Get API health status',
        response: {
          200: healthResponseSchema,
          500: errorSchema,
        },
      },
    },
    () => {
      return {
        status: 'ok' as const,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
      };
    }
  );

  app.get(
    '/health/ready',
    {
      schema: {
        description: 'Readiness check endpoint to verify API and dependencies are ready',
        tags: ['Health'],
        summary: 'Get API readiness status',
        response: {
          200: healthResponseSchema,
          503: errorSchema,
        },
      },
    },
    () => {
      // Add database connectivity check here
      // For now, just return ready status
      return {
        status: 'ok' as const,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
      };
    }
  );
}
