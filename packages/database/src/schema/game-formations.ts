import { pgTable, uuid, timestamp, uniqueIndex, type PgColumn } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { games } from './games';
import { teams } from './teams';
import { formations } from './formations';
import { users } from './users';

/**
 * Game-Formations table
 * Links a game to the formation(s) being used by each team
 * Supports soft deletion via deletedAt timestamp
 */
export const gameFormations = pgTable(
  'game_formations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    gameId: uuid('game_id')
      .notNull()
      .references((): PgColumn => games.id as PgColumn),
    teamId: uuid('team_id')
      .notNull()
      .references((): PgColumn => teams.id as PgColumn),
    formationId: uuid('formation_id')
      .notNull()
      .references((): PgColumn => formations.id as PgColumn),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    updatedBy: uuid('updated_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // Partial unique index: one formation per team per game for active records
    uniqueIndex('game_formations_game_team_idx')
      .on(table.gameId, table.teamId)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type GameFormation = typeof gameFormations.$inferSelect;
export type NewGameFormation = typeof gameFormations.$inferInsert;
