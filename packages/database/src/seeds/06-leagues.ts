import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { leagues, type Division, type League } from '../schema/index.js';
import type * as schema from '../schema/index.js';

/**
 * Seed leagues
 */
export async function seedLeagues(
  db: PostgresJsDatabase<typeof schema>,
  divisions: Division[]
): Promise<League[]> {
  console.log('📅 Seeding leagues...');

  const u10Division = divisions.find((d) => d.name === 'U10');
  if (!u10Division) {
    console.log('  ⚠ U10 division not found, skipping leagues');
    return [];
  }

  const leaguesData = [
    {
      divisionId: u10Division.id,
      name: '2025 Fall 10UG',
      description: 'Fall 2025 season for U10 girls',
      startDate: '2025-09-06', // First Saturday of Sept 2025
      endDate: '2025-11-08', // 10 weeks later
      gamesCount: 10,
    },
  ];

  const insertedLeagues = await db
    .insert(leagues)
    .values(leaguesData)
    .onConflictDoNothing()
    .returning();

  console.log(`  ✓ Seeded ${String(insertedLeagues.length)} leagues`);
  return insertedLeagues;
}
