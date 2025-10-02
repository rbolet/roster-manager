import { pgTable, uuid, timestamp, uniqueIndex, type PgColumn } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { leagues } from './leagues';
import { users } from './users';

/**
 * League-Coordinators junction table
 * Links leagues to their coordinators (many-to-many)
 * Supports soft deletion via deletedAt timestamp
 */
export const leagueCoordinators = pgTable(
  'league_coordinators',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    leagueId: uuid('league_id')
      .notNull()
      .references((): PgColumn => leagues.id as PgColumn),
    coordinatorId: uuid('coordinator_id')
      .notNull()
      .references((): PgColumn => users.id as PgColumn),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // Partial unique index: prevent duplicate league-coordinator assignments for active records
    uniqueIndex('league_coordinators_league_coordinator_idx')
      .on(table.leagueId, table.coordinatorId)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type LeagueCoordinator = typeof leagueCoordinators.$inferSelect;
export type NewLeagueCoordinator = typeof leagueCoordinators.$inferInsert;
