import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  integer,
  timestamp,
  uniqueIndex,
  type PgColumn,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { divisions } from './divisions';
import { users } from './users';

/**
 * Leagues table schema
 * Defines leagues within divisions with date ranges
 * Supports soft deletion via deletedAt timestamp
 */
export const leagues = pgTable(
  'leagues',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    divisionId: uuid('division_id')
      .notNull()
      .references((): PgColumn => divisions.id as PgColumn),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    gamesCount: integer('games_count').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    updatedBy: uuid('updated_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // Partial unique index: prevent duplicate league names within same division for active records
    uniqueIndex('leagues_division_name_idx')
      .on(table.divisionId, sql`lower(${table.name})`)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type League = typeof leagues.$inferSelect;
export type NewLeague = typeof leagues.$inferInsert;
