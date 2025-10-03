import type { FastifyInstance, FastifyError } from 'fastify';
import { ZodError } from 'zod';

/**
 * Global error handler plugin for consistent error responses
 */
export function errorHandlerPlugin(app: FastifyInstance): void {
  app.setErrorHandler(async (error: FastifyError, request, reply) => {
    const timestamp = new Date().toISOString();

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const details = error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
      }));

      return reply.status(400).send({
        error: 'ValidationError',
        message: 'Request validation failed',
        statusCode: 400,
        timestamp,
        details,
      });
    }

    // Handle Fastify validation errors
    if (error.validation) {
      return reply.status(400).send({
        error: 'ValidationError',
        message: 'Request validation failed',
        statusCode: 400,
        timestamp,
        details: error.validation.map((issue) => ({
          field: issue.instancePath || issue.schemaPath || 'unknown',
          message: issue.message ?? 'Validation failed',
          code: issue.keyword || 'validation_error',
        })),
      });
    }

    // Handle different HTTP status codes
    const statusCode = error.statusCode ?? 500;

    switch (statusCode) {
      case 400:
        return reply.status(400).send({
          error: 'BadRequestError',
          message: error.message,
          statusCode: 400,
          timestamp,
        });

      case 401:
        return reply.status(401).send({
          error: 'UnauthorizedError',
          message: error.message,
          statusCode: 401,
          timestamp,
        });

      case 403:
        return reply.status(403).send({
          error: 'ForbiddenError',
          message: error.message,
          statusCode: 403,
          timestamp,
        });

      case 404:
        return reply.status(404).send({
          error: 'NotFoundError',
          message: error.message,
          statusCode: 404,
          timestamp,
        });

      case 409:
        return reply.status(409).send({
          error: 'ConflictError',
          message: error.message,
          statusCode: 409,
          timestamp,
        });

      default:
        // Log server errors for debugging
        app.log.error(error);

        return reply.status(500).send({
          error: 'InternalServerError',
          message:
            process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message,
          statusCode: 500,
          timestamp,
        });
    }
  });

  // Handle 404 for routes that don't exist
  app.setNotFoundHandler(async (request, reply) => {
    return reply.status(404).send({
      error: 'NotFoundError',
      message: `Route ${request.method}:${request.url} not found`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
    });
  });
}
