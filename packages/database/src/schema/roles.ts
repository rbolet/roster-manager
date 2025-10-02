import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  uniqueIndex,
  type PgColumn,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

/**
 * Roles table schema
 * Defines user roles (e.g., admin, manager, member)
 * Supports soft deletion via deletedAt timestamp
 */
export const roles = pgTable(
  'roles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    updatedBy: uuid('updated_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // Partial unique index: only enforce uniqueness for non-deleted records
    // This allows the same role name to be reused after soft deletion
    uniqueIndex('roles_name_idx')
      .on(sql`lower(${table.name})`)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
