import { pgTable, uuid, integer, timestamp, uniqueIndex, type PgColumn } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { players } from './players';
import { users } from './users';

/**
 * Player Preferences table schema
 * Stores player position preferences with 0-4 ratings
 * One-to-one relationship with players
 * Supports soft deletion via deletedAt timestamp
 *
 * ⚠️ VALIDATION REQUIRED AT APPLICATION LEVEL:
 * All preference ratings must be validated to be 0-4 or null
 */
export const playerPreferences = pgTable(
  'player_preferences',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    playerId: uuid('player_id')
      .notNull()
      .references((): PgColumn => players.id as PgColumn),
    attack: integer('attack'), // 0-4 rating, validate at app level
    midfield: integer('midfield'), // 0-4 rating, validate at app level
    defense: integer('defense'), // 0-4 rating, validate at app level
    goalkeeper: integer('goalkeeper'), // 0-4 rating, validate at app level
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    updatedBy: uuid('updated_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // Partial unique index: one preference record per player for active records
    uniqueIndex('player_preferences_player_idx')
      .on(table.playerId)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type PlayerPreference = typeof playerPreferences.$inferSelect;
export type NewPlayerPreference = typeof playerPreferences.$inferInsert;

// Constants for validation at application level
export const PREFERENCE_RATING_MIN = 0;
export const PREFERENCE_RATING_MAX = 4;
