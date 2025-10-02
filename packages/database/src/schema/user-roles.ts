import { pgTable, uuid, timestamp, uniqueIndex, type PgColumn } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';
import { roles } from './roles';

/**
 * User-Roles junction table
 * Links users to their assigned roles (many-to-many)
 * Supports soft deletion via deletedAt timestamp
 */
export const userRoles = pgTable(
  'user_roles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references((): PgColumn => users.id as PgColumn),
    roleId: uuid('role_id')
      .notNull()
      .references((): PgColumn => roles.id as PgColumn),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // Partial unique index: prevent duplicate user-role assignments for active records
    uniqueIndex('user_roles_user_role_idx')
      .on(table.userId, table.roleId)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type UserRole = typeof userRoles.$inferSelect;
export type NewUserRole = typeof userRoles.$inferInsert;
