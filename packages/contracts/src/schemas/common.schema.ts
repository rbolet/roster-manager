import { z } from 'zod';

/**
 * Common error response schemas for API documentation
 */

// Base error schema
export const errorSchema = z.object({
  error: z.string().describe('Error type identifier'),
  message: z.string().describe('Human-readable error message'),
  statusCode: z.number().describe('HTTP status code'),
  timestamp: z.string().datetime().describe('ISO timestamp when the error occurred'),
});

// Validation error with details
export const validationErrorSchema = errorSchema.extend({
  details: z
    .array(
      z.object({
        field: z.string().describe('Field that failed validation'),
        message: z.string().describe('Validation error message'),
        code: z.string().describe('Validation error code'),
      })
    )
    .describe('Detailed validation errors'),
});

// Predefined error responses for common HTTP status codes
export const unauthorizedErrorSchema = errorSchema;
export const forbiddenErrorSchema = errorSchema;
export const notFoundErrorSchema = errorSchema;
export const conflictErrorSchema = errorSchema;
export const internalServerErrorSchema = errorSchema;

// Success response wrapper
export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean().default(true).describe('Operation success indicator'),
    data: dataSchema.describe('Response data'),
    timestamp: z.string().datetime().describe('ISO timestamp of the response'),
  });

// Paginated response wrapper
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    success: z.boolean().default(true).describe('Operation success indicator'),
    data: z.array(itemSchema).describe('Array of items'),
    pagination: z
      .object({
        page: z.number().min(1).describe('Current page number'),
        limit: z.number().min(1).describe('Items per page'),
        total: z.number().min(0).describe('Total number of items'),
        pages: z.number().min(0).describe('Total number of pages'),
      })
      .describe('Pagination metadata'),
    timestamp: z.string().datetime().describe('ISO timestamp of the response'),
  });

// Common query parameters
export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).describe('Page number (1-based)'),
  limit: z.coerce.number().min(1).max(100).default(20).describe('Items per page (max 100)'),
});

// Health check response
export const healthResponseSchema = z.object({
  status: z.enum(['ok', 'error']).describe('System health status'),
  timestamp: z.string().datetime().describe('ISO timestamp of the health check'),
  uptime: z.number().describe('Server uptime in seconds'),
  version: z.string().optional().describe('API version'),
});

// Export types
export type ErrorResponse = z.infer<typeof errorSchema>;
export type ValidationErrorResponse = z.infer<typeof validationErrorSchema>;
export type HealthResponse = z.infer<typeof healthResponseSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
