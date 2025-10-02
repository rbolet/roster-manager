import { eq, sql } from 'drizzle-orm';
import type { PgTable, PgColumn } from 'drizzle-orm/pg-core';
import {
  db,
  excludeDeleted,
  onlyDeleted,
  withoutDeleted,
  withOnlyDeleted,
} from '@roster-manager/database';

/**
 * Base Repository with Soft Delete Support
 *
 * Provides common CRUD operations with soft delete functionality
 * similar to Sequelize's paranoid mode or Laravel's SoftDeletes trait.
 *
 * Default behavior: All queries exclude soft-deleted records automatically
 *
 * Usage:
 * ```ts
 * export class UserRepository extends BaseRepository {
 *   constructor() {
 *     super(users, users.id, users.deletedAt);
 *   }
 * }
 * ```
 */
export abstract class BaseRepository<
  TTable extends PgTable,
  TSelect = TTable['$inferSelect'],
  TInsert = TTable['$inferInsert'],
> {
  constructor(
    protected readonly table: TTable,
    protected readonly idColumn: PgColumn,
    protected readonly deletedAtColumn?: PgColumn
  ) {}

  /**
   * Check if table supports soft deletion
   */
  protected get supportsSoftDelete(): boolean {
    return this.deletedAtColumn !== undefined;
  }

  /**
   * Find all active (non-deleted) records
   * This is the default behavior - mimics Sequelize paranoid mode
   */
  async findAllActive(): Promise<TSelect[]> {
    if (!this.supportsSoftDelete || !this.deletedAtColumn) {
      return db.select().from(this.table) as Promise<TSelect[]>;
    }

    return db.select().from(this.table).where(excludeDeleted(this.deletedAtColumn)) as Promise<
      TSelect[]
    >;
  }

  /**
   * Find all records including soft-deleted ones
   * Use when you explicitly need to see deleted records
   */
  async findAllWithDeleted(): Promise<TSelect[]> {
    return db.select().from(this.table) as Promise<TSelect[]>;
  }

  /**
   * Find only soft-deleted records
   */
  async findOnlyDeleted(): Promise<TSelect[]> {
    if (!this.supportsSoftDelete || !this.deletedAtColumn) {
      return [];
    }

    return db.select().from(this.table).where(onlyDeleted(this.deletedAtColumn)) as Promise<
      TSelect[]
    >;
  }

  /**
   * Find a single active record by ID
   */
  async findByIdActive(id: string): Promise<TSelect | undefined> {
    const results = (await db
      .select()
      .from(this.table)
      .where(
        this.supportsSoftDelete && this.deletedAtColumn
          ? withoutDeleted(this.deletedAtColumn, eq(this.idColumn, id))
          : eq(this.idColumn, id)
      )
      .limit(1)) as TSelect[];

    return results[0];
  }

  /**
   * Find a record by ID including soft-deleted records
   */
  async findByIdWithDeleted(id: string): Promise<TSelect | undefined> {
    const results = (await db
      .select()
      .from(this.table)
      .where(eq(this.idColumn, id))
      .limit(1)) as TSelect[];

    return results[0];
  }

  /**
   * Soft delete a record by ID
   * Sets deletedAt to current timestamp
   *
   * @returns true if record was soft deleted, false if not found
   */
  async softDelete(id: string): Promise<boolean> {
    if (!this.supportsSoftDelete || !this.deletedAtColumn) {
      throw new Error('Table does not support soft delete');
    }

    const result = await db
      .update(this.table)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument -- Drizzle's generic types don't infer update object shape
      .set({ deletedAt: sql`now()` } as any)
      .where(withoutDeleted(this.deletedAtColumn, eq(this.idColumn, id)))
      .returning({ id: this.idColumn });

    return result.length > 0;
  }

  /**
   * Restore a soft-deleted record
   * Sets deletedAt back to null
   *
   * @returns true if record was restored, false if not found
   */
  async restore(id: string): Promise<boolean> {
    if (!this.supportsSoftDelete || !this.deletedAtColumn) {
      throw new Error('Table does not support soft delete');
    }

    const result = await db
      .update(this.table)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument -- Drizzle's generic types don't infer update object shape
      .set({ deletedAt: null } as any)
      .where(withOnlyDeleted(this.deletedAtColumn, eq(this.idColumn, id)))
      .returning({ id: this.idColumn });

    return result.length > 0;
  }

  /**
   * Permanently delete a record (hard delete)
   * Can only be called on already soft-deleted records for safety
   *
   * @returns true if record was permanently deleted, false if not found
   */
  async forceDelete(id: string): Promise<boolean> {
    if (!this.supportsSoftDelete || !this.deletedAtColumn) {
      // If table doesn't support soft delete, just perform regular delete
      const result = await db
        .delete(this.table)
        .where(eq(this.idColumn, id))
        .returning({ id: this.idColumn });

      return result.length > 0;
    }

    // Only allow force delete on already soft-deleted records
    const result = await db
      .delete(this.table)
      .where(withOnlyDeleted(this.deletedAtColumn, eq(this.idColumn, id)))
      .returning({ id: this.idColumn });

    return result.length > 0;
  }

  /**
   * Create a new record
   */
  async create(data: TInsert): Promise<TSelect> {
    const [record] = (await db
      .insert(this.table)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument -- Drizzle's generic types don't infer insert data shape
      .values(data as any)
      .returning()) as TSelect[];

    if (!record) {
      throw new Error('Failed to create record');
    }

    return record;
  }

  /**
   * Update an active record
   */
  async update(id: string, data: Partial<TInsert>): Promise<TSelect | undefined> {
    const [record] = await db
      .update(this.table)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument -- Drizzle's generic types don't infer update object shape
      .set({ ...data, updatedAt: sql`now()` } as any)
      .where(
        this.supportsSoftDelete && this.deletedAtColumn
          ? withoutDeleted(this.deletedAtColumn, eq(this.idColumn, id))
          : eq(this.idColumn, id)
      )
      .returning();

    return record as TSelect | undefined;
  }
}
