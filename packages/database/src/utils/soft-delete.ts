import { and, isNull, isNotNull, type SQL, type SQLWrapper } from 'drizzle-orm';
import type { PgColumn } from 'drizzle-orm/pg-core';

/**
 * Soft Delete Utilities for Drizzle ORM
 *
 * Provides reusable helpers for implementing soft delete functionality
 */

/**
 * Interface for tables that support soft deletion
 */
export interface SoftDeletable {
  deletedAt: PgColumn | null;
}

/**
 * Filter to exclude soft-deleted records (default behavior)
 * Use this in queries to only return active (non-deleted) records
 *
 * @example
 * ```ts
 * const activeUsers = await db
 *   .select()
 *   .from(users)
 *   .where(excludeDeleted(users.deletedAt));
 * ```
 */
export function excludeDeleted(deletedAtColumn: PgColumn): SQL {
  return isNull(deletedAtColumn);
}

/**
 * Filter to only include soft-deleted records
 * Use this to query only soft-deleted records
 *
 * @example
 * ```ts
 * const deletedUsers = await db
 *   .select()
 *   .from(users)
 *   .where(onlyDeleted(users.deletedAt));
 * ```
 */
export function onlyDeleted(deletedAtColumn: PgColumn): SQL {
  return isNotNull(deletedAtColumn);
}

/**
 * Combine with other conditions to exclude deleted records
 * Use when you have additional WHERE conditions
 *
 * @example
 * ```ts
 * const user = await db
 *   .select()
 *   .from(users)
 *   .where(and(
 *     withoutDeleted(users.deletedAt),
 *     eq(users.id, userId)
 *   ));
 * ```
 */
export function withoutDeleted(
  deletedAtColumn: PgColumn,
  ...conditions: (SQL | SQLWrapper | undefined)[]
): SQL | undefined {
  return and(isNull(deletedAtColumn), ...conditions);
}

/**
 * Combine with other conditions to include only deleted records
 * Use when you have additional WHERE conditions
 *
 * @example
 * ```ts
 * const deletedUser = await db
 *   .select()
 *   .from(users)
 *   .where(withOnlyDeleted(users.deletedAt, eq(users.id, userId)));
 * ```
 */
export function withOnlyDeleted(
  deletedAtColumn: PgColumn,
  ...conditions: (SQL | SQLWrapper | undefined)[]
): SQL | undefined {
  return and(isNotNull(deletedAtColumn), ...conditions);
}

/**
 * Type guard to check if a record has been soft deleted
 *
 * @example
 * ```ts
 * if (isSoftDeleted(user)) {
 *   console.log('User was deleted at:', user.deletedAt);
 * }
 * ```
 */
export function isSoftDeleted<T extends { deletedAt: Date | null }>(
  record: T
): record is T & { deletedAt: Date } {
  return record.deletedAt !== null;
}
