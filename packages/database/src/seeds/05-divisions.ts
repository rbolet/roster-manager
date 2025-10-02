import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { divisions, type Division } from '../schema/index.js';
import type * as schema from '../schema/index.js';

/**
 * Seed divisions
 */
export async function seedDivisions(db: PostgresJsDatabase<typeof schema>): Promise<Division[]> {
  console.log('🏆 Seeding divisions...');

  const divisionsData = [
    {
      name: 'U10',
      description: 'Under 10 division with 7 players per team',
      playersCount: 7,
      maxPlayersOnRoster: 10,
      noGoalkeepers: false,
      gameDuration: 50,
      gamePeriodsCount: 4,
    },
  ];

  const insertedDivisions = await db
    .insert(divisions)
    .values(divisionsData)
    .onConflictDoNothing()
    .returning();

  console.log(`  ✓ Seeded ${String(insertedDivisions.length)} divisions`);
  return insertedDivisions;
}
