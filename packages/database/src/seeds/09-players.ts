import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { players, type Team, type Player } from '../schema/index.js';
import type * as schema from '../schema/index.js';

/**
 * Seed players for Teal Penguins
 * 10 girls with jersey numbers 2-11
 */
export async function seedPlayers(
  db: PostgresJsDatabase<typeof schema>,
  teams: Team[]
): Promise<Player[]> {
  console.log('⚽ Seeding players...');

  const tealPenguins = teams.find((t) => t.name === 'Teal Penguins');
  if (!tealPenguins) {
    console.log('  ⚠ Teal Penguins team not found, skipping players');
    return [];
  }

  const girlNames = [
    'Sophia',
    'Emma',
    'Olivia',
    'Ava',
    'Isabella',
    'Mia',
    'Charlotte',
    'Amelia',
    'Harper',
    'Evelyn',
  ];

  const playersData = girlNames.map((name, index) => ({
    teamId: tealPenguins.id,
    name,
    jerseyNumber: index + 2, // Start at jersey #2
  }));

  const insertedPlayers = await db
    .insert(players)
    .values(playersData)
    .onConflictDoNothing()
    .returning();

  console.log(`  ✓ Seeded ${String(insertedPlayers.length)} players for Teal Penguins`);
  return insertedPlayers;
}
