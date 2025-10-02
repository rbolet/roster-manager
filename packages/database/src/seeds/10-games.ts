import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { games, type League, type Team, type Game } from '../schema/index.js';
import type * as schema from '../schema/index.js';

/**
 * Seed games for the 2025 Fall season
 * 10 games every Saturday at 10:00 AM starting Sept 6, 2025
 */
export async function seedGames(
  db: PostgresJsDatabase<typeof schema>,
  leagues: League[],
  teams: Team[]
): Promise<Game[]> {
  console.log('📆 Seeding games...');

  const fall2025League = leagues.find((l) => l.name === '2025 Fall 10UG');
  const tealPenguins = teams.find((t) => t.name === 'Teal Penguins');
  const opponentTeam = teams.find((t) => t.name === 'Opponent Team');

  if (!fall2025League || !tealPenguins || !opponentTeam) {
    console.log('  ⚠ League or teams not found, skipping games');
    return [];
  }

  // Generate 10 Saturday games starting Sept 6, 2025 at 10:00 AM
  const startDate = new Date('2025-09-06T10:00:00');
  const gamesData = Array.from({ length: 10 }, (_, i) => {
    const gameDate = new Date(startDate);
    gameDate.setDate(startDate.getDate() + i * 7); // Add 7 days for each week

    return {
      leagueId: fall2025League.id,
      homeTeamId: tealPenguins.id,
      awayTeamId: opponentTeam.id,
      startTime: gameDate,
      status: 'UPCOMING' as const,
    };
  });

  const insertedGames = await db.insert(games).values(gamesData).onConflictDoNothing().returning();

  console.log(`  ✓ Seeded ${String(insertedGames.length)} games`);
  return insertedGames;
}
