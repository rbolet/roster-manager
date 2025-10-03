import type { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';

/**
 * Swagger/OpenAPI documentation plugin
 */
export async function swaggerPlugin(app: FastifyInstance): Promise<void> {
  // Register Swagger documentation generator
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Roster Manager API',
        description: 'REST API for managing sports team rosters and formations',
        version: '1.0.0',
        contact: {
          name: 'Roster Manager Team',
          email: 'support@rostermanager.com',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
        {
          url: 'https://api.rostermanager.com',
          description: 'Production server',
        },
      ],
      tags: [
        {
          name: 'Health',
          description: 'Health check endpoints',
        },
        {
          name: 'Authentication',
          description: 'User authentication and authorization',
        },
        {
          name: 'Users',
          description: 'User management operations',
        },
        {
          name: 'Teams',
          description: 'Team management operations',
        },
        {
          name: 'Games',
          description: 'Game scheduling and management',
        },
        {
          name: 'Formations',
          description: 'Team formation and lineup management',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT token for API authentication',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    transform: ({ schema, url }) => {
      // Transform function to customize the generated OpenAPI spec
      return {
        schema,
        url,
      };
    },
  });

  // Register Swagger UI
  await app.register(fastifySwaggerUI, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      tryItOutEnabled: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, _request, _reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
}
