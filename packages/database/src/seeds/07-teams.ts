import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { teams, type League, type Team } from '../schema/index.js';
import type * as schema from '../schema/index.js';

/**
 * Seed teams
 */
export async function seedTeams(
  db: PostgresJsDatabase<typeof schema>,
  leagues: League[]
): Promise<Team[]> {
  console.log('🐧 Seeding teams...');

  const fall2025League = leagues.find((l) => l.name === '2025 Fall 10UG');
  if (!fall2025League) {
    console.log('  ⚠ 2025 Fall 10UG league not found, skipping teams');
    return [];
  }

  const teamsData = [
    {
      leagueId: fall2025League.id,
      name: 'Teal Penguins',
      color: 'cyan',
    },
    {
      leagueId: fall2025League.id,
      name: 'Opponent Team',
      color: 'red',
    },
  ];

  const insertedTeams = await db.insert(teams).values(teamsData).onConflictDoNothing().returning();

  console.log(`  ✓ Seeded ${String(insertedTeams.length)} teams`);
  return insertedTeams;
}
