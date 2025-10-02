import {
  pgTable,
  uuid,
  integer,
  varchar,
  timestamp,
  index,
  type PgColumn,
} from 'drizzle-orm/pg-core';
import { leagues } from './leagues';
import { teams } from './teams';
import { users } from './users';

/**
 * Games table schema
 * Defines games between two teams within a league
 * Supports soft deletion via deletedAt timestamp
 */
export const games = pgTable(
  'games',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    leagueId: uuid('league_id')
      .notNull()
      .references((): PgColumn => leagues.id as PgColumn),
    homeTeamId: uuid('home_team_id')
      .notNull()
      .references((): PgColumn => teams.id as PgColumn),
    awayTeamId: uuid('away_team_id')
      .notNull()
      .references((): PgColumn => teams.id as PgColumn),
    homeScore: integer('home_score'),
    awayScore: integer('away_score'),
    startTime: timestamp('start_time'),
    status: varchar('status', { length: 20 }).notNull(), // TENTATIVE, UPCOMING, COMPLETE
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    updatedBy: uuid('updated_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // Index on leagueId for fast filtering by league
    index('games_league_idx').on(table.leagueId),
    // Index on status for fast filtering by game status
    index('games_status_idx').on(table.status),
  ]
);

// Type inference
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
