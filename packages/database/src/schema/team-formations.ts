import { pgTable, uuid, timestamp, uniqueIndex, type PgColumn } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { teams } from './teams';
import { formations } from './formations';
import { users } from './users';

/**
 * Team-Formations junction table
 * Links teams to their formations (many-to-many)
 * Supports soft deletion via deletedAt timestamp
 */
export const teamFormations = pgTable(
  'team_formations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teamId: uuid('team_id')
      .notNull()
      .references((): PgColumn => teams.id as PgColumn),
    formationId: uuid('formation_id')
      .notNull()
      .references((): PgColumn => formations.id as PgColumn),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // Partial unique index: prevent duplicate team-formation assignments for active records
    uniqueIndex('team_formations_team_formation_idx')
      .on(table.teamId, table.formationId)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type TeamFormation = typeof teamFormations.$inferSelect;
export type NewTeamFormation = typeof teamFormations.$inferInsert;
