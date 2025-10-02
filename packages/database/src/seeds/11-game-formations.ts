import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { gameFormations, type Game, type Team, type Formation } from '../schema/index.js';
import type * as schema from '../schema/index.js';

/**
 * Link games to team formations
 */
export async function seedGameFormations(
  db: PostgresJsDatabase<typeof schema>,
  games: Game[],
  teams: Team[],
  formations: Formation[]
): Promise<void> {
  console.log('🔗 Seeding game-formation relationships...');

  const tealPenguins = teams.find((t) => t.name === 'Teal Penguins');
  const formation231 = formations.find((f) => f.name === '2-3-1');

  if (!tealPenguins || !formation231 || games.length === 0) {
    console.log('  ⚠ Team, formation, or games not found, skipping');
    return;
  }

  // Link all games to Teal Penguins' formation
  const gameFormationsData = games.map((game) => ({
    gameId: game.id,
    teamId: tealPenguins.id,
    formationId: formation231.id,
  }));

  await db.insert(gameFormations).values(gameFormationsData).onConflictDoNothing();

  console.log(`  ✓ Linked ${String(gameFormationsData.length)} games to formations`);
}
