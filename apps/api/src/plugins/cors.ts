import type { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import { env } from '../config/env.js';

/**
 * CORS plugin configuration
 */
export async function corsPlugin(app: FastifyInstance): Promise<void> {
  await app.register(fastifyCors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });
}
