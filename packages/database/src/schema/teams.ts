import { pgTable, uuid, varchar, timestamp, uniqueIndex, type PgColumn } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { leagues } from './leagues';
import { users } from './users';

/**
 * Teams table schema
 * Defines teams within leagues
 * Supports soft deletion via deletedAt timestamp
 */
export const teams = pgTable(
  'teams',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    leagueId: uuid('league_id')
      .notNull()
      .references((): PgColumn => leagues.id as PgColumn),
    name: varchar('name', { length: 100 }).notNull(),
    color: varchar('color', { length: 50 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    updatedBy: uuid('updated_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // Partial unique index: prevent duplicate team names within same league for active records
    uniqueIndex('teams_league_name_idx')
      .on(table.leagueId, sql`lower(${table.name})`)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
