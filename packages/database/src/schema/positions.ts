import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  uniqueIndex,
  type PgColumn,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

/**
 * Position type enum
 * ⚠️ VALIDATION REQUIRED AT APPLICATION LEVEL:
 * positionType column must be validated to match one of these values
 */
export enum PositionType {
  ATTACK = 'ATTACK',
  MIDFIELD = 'MIDFIELD',
  DEFENSE = 'DEFENSE',
  GK = 'GK',
}

/**
 * Positions table schema
 * Defines player positions with types
 * Supports soft deletion via deletedAt timestamp
 */
export const positions = pgTable(
  'positions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    positionType: varchar('position_type', { length: 20 }).notNull(), // ATTACK, MIDFIELD, DEFENSE, GK - validate at app level
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    updatedBy: uuid('updated_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // Partial unique index: only enforce uniqueness for non-deleted records
    uniqueIndex('positions_name_idx')
      .on(sql`lower(${table.name})`)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type Position = typeof positions.$inferSelect;
export type NewPosition = typeof positions.$inferInsert;
