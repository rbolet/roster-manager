import { pgTable, uuid, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/**
 * Users table schema
 * Supports soft deletion via deletedAt timestamp
 */
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
  },
  (table) => [
    // Partial unique index: only enforce uniqueness for non-deleted records
    // This allows the same email to be reused after soft deletion
    uniqueIndex('users_email_idx')
      .on(sql`lower(${table.email})`)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
