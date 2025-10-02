import { pgTable, uuid, timestamp, uniqueIndex, type PgColumn } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { formations } from './formations';
import { positions } from './positions';
import { users } from './users';

/**
 * Formation-Positions junction table
 * Links formations to their positions (many-to-many)
 * Supports soft deletion via deletedAt timestamp
 */
export const formationPositions = pgTable(
  'formation_positions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    formationId: uuid('formation_id')
      .notNull()
      .references((): PgColumn => formations.id as PgColumn),
    positionId: uuid('position_id')
      .notNull()
      .references((): PgColumn => positions.id as PgColumn),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'), // Soft delete support
    createdBy: uuid('created_by').references((): PgColumn => users.id as PgColumn),
    deletedBy: uuid('deleted_by').references((): PgColumn => users.id as PgColumn),
  },
  (table) => [
    // Partial unique index: prevent duplicate formation-position assignments for active records
    uniqueIndex('formation_positions_formation_position_idx')
      .on(table.formationId, table.positionId)
      .where(sql`${table.deletedAt} IS NULL`),
  ]
);

// Type inference
export type FormationPosition = typeof formationPositions.$inferSelect;
export type NewFormationPosition = typeof formationPositions.$inferInsert;
