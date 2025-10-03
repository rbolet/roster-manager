import type { FastifyInstance } from 'fastify';
import {
  loginSchema,
  registerSchema,
  authResponseSchema,
  errorSchema,
  validationErrorSchema,
} from '@roster-manager/contracts';

/**
 * Authentication routes with OpenAPI documentation
 */
export function authRoutes(app: FastifyInstance): void {
  // Login endpoint
  app.post(
    '/login',
    {
      schema: {
        description: 'Authenticate user with email and password',
        tags: ['Authentication'],
        summary: 'User login',
        body: loginSchema,
        response: {
          200: authResponseSchema,
          400: validationErrorSchema,
          401: errorSchema,
          500: errorSchema,
        },
      },
    },
    () => {
      // TODO: Implement actual authentication logic
      // Mock response for demonstration
      return {
        accessToken: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'user@example.com',
          name: 'Mock User',
        },
      };
    }
  );

  // Register endpoint
  app.post(
    '/register',
    {
      schema: {
        description: 'Register a new user account',
        tags: ['Authentication'],
        summary: 'User registration',
        body: registerSchema,
        response: {
          201: authResponseSchema,
          400: validationErrorSchema,
          409: errorSchema,
          500: errorSchema,
        },
      },
    },
    () => {
      // TODO: Implement actual registration logic
      // Mock response for demonstration
      return {
        accessToken: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'newuser@example.com',
          name: 'New User',
        },
      };
    }
  );

  // Logout endpoint (protected)
  app.post(
    '/logout',
    {
      schema: {
        description: 'Logout user and invalidate tokens',
        tags: ['Authentication'],
        summary: 'User logout',
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
          401: errorSchema,
          500: errorSchema,
        },
      },
      preHandler: (_request, _reply, done) => {
        // TODO: Add JWT verification middleware
        // For now, just continue
        done();
      },
    },
    () => {
      // TODO: Implement token invalidation logic
      return {
        success: true,
        message: 'Successfully logged out',
      };
    }
  );
}
