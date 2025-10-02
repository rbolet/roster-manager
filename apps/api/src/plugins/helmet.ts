import type { FastifyInstance } from 'fastify';
import fastifyHelmet from '@fastify/helmet';

/**
 * Helmet plugin for security headers
 */
export async function helmetPlugin(app: FastifyInstance): Promise<void> {
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: false, // Disable for API
  });
}
