import { pgTable, uuid, timestamp, uniqueIndex, type PgColumn } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { teams } from './teams';
import { users } from './users';

/**
 * Team-Managers junction table
 * Links teams to their managers (many-to-many)
 * Supports soft deletion via deletedAt timestamp
 */
export const teamManagers = pgTable(
  'team_managers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teamId: uuid('team_id')
      .notNull()
      .references((): PgColumn => teams.id as PgColumn),
    managerId: uuid('manager_id')
      .notNull()
      .references((): PgColumn => users.id as PgColumn),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // Partial unique index: prevent duplicate team-manager assignments for active records
    uniqueIndex('team_managers_team_manager_idx')
      .on(table.teamId, table.managerId)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type TeamManager = typeof teamManagers.$inferSelect;
export type NewTeamManager = typeof teamManagers.$inferInsert;
