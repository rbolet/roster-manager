import {
  pgTable,
  uuid,
  integer,
  varchar,
  timestamp,
  uniqueIndex,
  index,
  type PgColumn,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { games } from './games';
import { players } from './players';
import { positions } from './positions';
import { users } from './users';

/**
 * Assignment Type enum
 * Distinguishes between planned lineups and actual game records
 * ⚠️ VALIDATION REQUIRED AT APPLICATION LEVEL:
 * assignmentType column must be validated to match one of these values
 */
export enum AssignmentType {
  PLANNED = 'PLANNED',
  ACTUAL = 'ACTUAL',
}

/**
 * Game Period Assignments table
 * THE CORE TABLE for tracking player position assignments per period
 *
 * Tracks both planned lineups (pre-game/in-game planning) and actual lineups (what happened)
 *
 * Key patterns:
 * - positionId = NULL means player is on BENCH
 * - periodNumber is 1-indexed (1, 2, 3, 4 for MVP)
 * - assignmentType separates PLANNED vs ACTUAL
 * - startMinute/endMinute are NULL for period-based (MVP), populated for future minutes-based tracking
 *
 * Supports soft deletion via deletedAt timestamp
 */
export const gamePeriodAssignments = pgTable(
  'game_period_assignments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    gameId: uuid('game_id')
      .notNull()
      .references((): PgColumn => games.id as PgColumn),
    playerId: uuid('player_id')
      .notNull()
      .references((): PgColumn => players.id as PgColumn),
    positionId: uuid('position_id').references((): PgColumn => positions.id as PgColumn), // NULL = BENCH
    periodNumber: integer('period_number').notNull(), // 1-indexed: 1, 2, 3, 4
    assignmentType: varchar('assignment_type', { length: 20 }).notNull(), // PLANNED | ACTUAL - validate at app level
    startMinute: integer('start_minute'), // Future: for minutes-based tracking
    endMinute: integer('end_minute'), // Future: for minutes-based tracking
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    updatedBy: uuid('updated_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // PRIMARY QUERY INDEX: Fast lookup for "get all assignments for game X, period Y, type Z"
    index('game_period_assignments_game_period_type_idx').on(
      table.gameId,
      table.periodNumber,
      table.assignmentType,
      table.deletedAt
    ),
    // Player statistics queries: "get all assignments for player X in game Y"
    index('game_period_assignments_player_game_idx').on(table.playerId, table.gameId),
    // Prevent duplicate assignments: one position per player per period per type
    uniqueIndex('game_period_assignments_unique_idx')
      .on(table.gameId, table.playerId, table.periodNumber, table.assignmentType)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type GamePeriodAssignment = typeof gamePeriodAssignments.$inferSelect;
export type NewGamePeriodAssignment = typeof gamePeriodAssignments.$inferInsert;
