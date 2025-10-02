import { eq } from 'drizzle-orm';
import { db, users, withoutDeleted } from '@roster-manager/database';
import type { User, NewUser } from '@roster-manager/database';
import { BaseRepository } from './base.repository.js';

/**
 * User repository with soft delete support
 *
 * Extends BaseRepository to inherit soft delete functionality.
 * All queries automatically exclude soft-deleted users by default.
 *
 * Available methods from BaseRepository:
 * - findAllActive() - Get all non-deleted users
 * - findAllWithDeleted() - Get all users including deleted
 * - findOnlyDeleted() - Get only soft-deleted users
 * - findByIdActive(id) - Get user by ID (excludes deleted)
 * - findByIdWithDeleted(id) - Get user by ID (includes deleted)
 * - softDelete(id) - Soft delete a user
 * - restore(id) - Restore a soft-deleted user
 * - forceDelete(id) - Permanently delete a user
 * - create(data) - Create a new user
 * - update(id, data) - Update an existing user
 */
export class UserRepository extends BaseRepository<typeof users, User, NewUser> {
  constructor() {
    super(users, users.id, users.deletedAt);
  }

  /**
   * Find user by email (excludes soft-deleted users)
   */
  async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(withoutDeleted(users.deletedAt, eq(users.email, email)))
      .limit(1);

    return user;
  }

  /**
   * Find user by email including soft-deleted users
   */
  async findByEmailWithDeleted(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    return user;
  }

  /**
   * Delete a user (performs soft delete by default)
   * Use forceDelete() for permanent deletion
   */
  async delete(id: string): Promise<boolean> {
    return this.softDelete(id);
  }

  /**
   * Alias for findByIdActive for backward compatibility
   */
  async findById(id: string): Promise<User | undefined> {
    return this.findByIdActive(id);
  }
}
