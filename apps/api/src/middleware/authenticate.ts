import type { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify();
  } catch (_err) {
    reply.status(401).send({
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token',
    });
  }
}
