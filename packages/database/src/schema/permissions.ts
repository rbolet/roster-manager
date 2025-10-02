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
 * Permissions table schema
 * Defines granular permissions using resource + action pattern
 * Example: resource="users", action="create" → can create users
 * Supports soft deletion via deletedAt timestamp
 */
export const permissions = pgTable(
  'permissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    resource: varchar('resource', { length: 100 }).notNull(),
    action: varchar('action', { length: 50 }).notNull(),
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
    // This prevents duplicate resource+action combinations
    uniqueIndex('permissions_resource_action_idx')
      .on(sql`lower(${table.resource}), lower(${table.action})`)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;
