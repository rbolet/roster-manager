import { z } from 'zod';

/**
 * Authentication-related schemas with OpenAPI documentation
 */

export const loginSchema = z.object({
  email: z.string().email().describe('User email address'),
  password: z.string().min(8).describe('User password (minimum 8 characters)'),
});

export const registerSchema = z.object({
  email: z.string().email().describe('User email address'),
  password: z.string().min(8).describe('User password (minimum 8 characters)'),
  name: z.string().min(1).max(100).describe('User full name (1-100 characters)'),
});

export const authResponseSchema = z.object({
  accessToken: z.string().describe('JWT access token for API authentication'),
  refreshToken: z.string().describe('JWT refresh token for token renewal'),
  user: z
    .object({
      id: z.string().uuid().describe('Unique user identifier'),
      email: z.string().email().describe('User email address'),
      name: z.string().describe('User full name'),
    })
    .describe('Authenticated user information'),
});

export type LoginRequest = z.infer<typeof loginSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
