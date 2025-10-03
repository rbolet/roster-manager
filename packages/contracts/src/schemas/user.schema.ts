import { z } from 'zod';

/**
 * User schema definitions with OpenAPI documentation
 * Shared between frontend and backend for type safety
 */

// Base user schema
export const userSchema = z.object({
  id: z.string().uuid().describe('Unique user identifier'),
  email: z.string().email().describe('User email address'),
  name: z.string().min(1).max(100).describe('User full name (1-100 characters)'),
  createdAt: z.date().describe('User creation timestamp'),
  updatedAt: z.date().describe('Last update timestamp'),
});

// Schema for creating a user (no id, timestamps)
export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Schema for updating a user (all fields optional except id)
export const updateUserSchema = userSchema.partial().required({ id: true });

// Infer TypeScript types from schemas
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
