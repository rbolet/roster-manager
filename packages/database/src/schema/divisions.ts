import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
  type PgColumn,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

/**
 * Divisions table schema
 * Defines sport divisions with their rules and constraints
 * Supports soft deletion via deletedAt timestamp
 */
export const divisions = pgTable(
  'divisions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    playersCount: integer('players_count').notNull(),
    maxPlayersOnRoster: integer('max_players_on_roster').notNull(),
    noGoalkeepers: boolean('no_goalkeepers').notNull().default(false),
    gameDuration: integer('game_duration').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    updatedBy: uuid('updated_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // Partial unique index: only enforce uniqueness for non-deleted records
    uniqueIndex('divisions_name_idx')
      .on(sql`lower(${table.name})`)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type Division = typeof divisions.$inferSelect;
export type NewDivision = typeof divisions.$inferInsert;
