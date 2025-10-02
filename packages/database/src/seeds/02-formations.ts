import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { formations, type Formation } from '../schema/index.js';
import type * as schema from '../schema/index.js';

/**
 * Seed standard soccer formations
 */
export async function seedFormations(db: PostgresJsDatabase<typeof schema>): Promise<Formation[]> {
  console.log('⚽ Seeding formations...');

  const formationsData = [
    {
      name: '2-3-1',
      description: '2 defenders, 3 midfielders, 1 striker (7 players total with GK)',
      noGoalkeepers: false,
      playersCount: 7,
    },
  ];

  const insertedFormations = await db
    .insert(formations)
    .values(formationsData)
    .onConflictDoNothing()
    .returning();

  console.log(`  ✓ Seeded ${String(insertedFormations.length)} formations`);
  return insertedFormations;
}
