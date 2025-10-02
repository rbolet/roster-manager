import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  uniqueIndex,
  type PgColumn,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { teams } from './teams';
import { users } from './users';

/**
 * Players table schema
 * Defines players on teams
 * Supports soft deletion via deletedAt timestamp
 */
export const players = pgTable(
  'players',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    teamId: uuid('team_id')
      .notNull()
      .references((): PgColumn => teams.id as PgColumn),
    name: varchar('name', { length: 100 }).notNull(),
    jerseyNumber: integer('jersey_number').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    updatedBy: uuid('updated_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // Partial unique index: prevent duplicate jersey numbers within same team for active records
    uniqueIndex('players_team_jersey_idx')
      .on(table.teamId, table.jerseyNumber)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
