import type { FastifyInstance } from 'fastify';
import fastifyRateLimit from '@fastify/rate-limit';

/**
 * Rate limiting plugin
 */
export async function rateLimitPlugin(app: FastifyInstance): Promise<void> {
  await app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '15 minutes',
  });
}
