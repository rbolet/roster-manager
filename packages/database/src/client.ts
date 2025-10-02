import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';

/**
 * Database connection client
 * Uses postgres.js driver with Drizzle ORM
 */

const connectionString = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/roster_manager_dev';

// Create postgres client
const client = postgres(connectionString, {
  max: 10, // Connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create Drizzle instance
export const db = drizzle(client, { schema });

// Export schema for use in queries
export { schema };
