import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  uniqueIndex,
  type PgColumn,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

/**
 * Formations table schema
 * Defines team formations/tactics
 * Supports soft deletion via deletedAt timestamp
 */
export const formations = pgTable(
  'formations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    noGoalkeepers: boolean('no_goalkeepers').notNull().default(false),
    playersCount: integer('players_count').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    updatedBy: uuid('updated_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // Partial unique index: only enforce uniqueness for non-deleted records
    uniqueIndex('formations_name_idx')
      .on(sql`lower(${table.name})`)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type Formation = typeof formations.$inferSelect;
export type NewFormation = typeof formations.$inferInsert;
