import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { roles, type Role } from '../schema/index.js';
import type * as schema from '../schema/index.js';

/**
 * Seed default roles
 */
export async function seedRoles(db: PostgresJsDatabase<typeof schema>): Promise<Role[]> {
  console.log('👥 Seeding roles...');

  const rolesData = [
    {
      name: 'Admin',
      description: 'Administrator with full system access',
    },
  ];

  const insertedRoles = await db.insert(roles).values(rolesData).onConflictDoNothing().returning();

  console.log(`  ✓ Seeded ${String(insertedRoles.length)} roles`);
  return insertedRoles;
}
