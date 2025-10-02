import { z } from 'zod';

/**
 * Example user schema - demonstrates the pattern for defining API contracts
 * This schema is shared between frontend and backend
 */

// Base user schema
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
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
