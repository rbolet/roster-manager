import { pgTable, uuid, timestamp, uniqueIndex, type PgColumn } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { roles } from './roles';
import { permissions } from './permissions';
import { users } from './users';

/**
 * Role-Permissions junction table
 * Links roles to their associated permissions (many-to-many)
 * Supports soft deletion via deletedAt timestamp
 */
export const rolePermissions = pgTable(
  'role_permissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    roleId: uuid('role_id')
      .notNull()
      .references((): PgColumn => roles.id as PgColumn),
    permissionId: uuid('permission_id')
      .notNull()
      .references((): PgColumn => permissions.id as PgColumn),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // Partial unique index: prevent duplicate role-permission assignments for active records
    uniqueIndex('role_permissions_role_permission_idx')
      .on(table.roleId, table.permissionId)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type RolePermission = typeof rolePermissions.$inferSelect;
export type NewRolePermission = typeof rolePermissions.$inferInsert;
