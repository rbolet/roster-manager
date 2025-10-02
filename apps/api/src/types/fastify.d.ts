import '@fastify/jwt';

/**
 * Extend Fastify types for JWT authentication
 */
declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: string;
      email: string;
    };
    user: {
      userId: string;
      email: string;
    };
  }
}
