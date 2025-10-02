import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { teamFormations, type Team, type Formation } from '../schema/index.js';
import type * as schema from '../schema/index.js';

/**
 * Link teams to their formations
 */
export async function seedTeamFormations(
  db: PostgresJsDatabase<typeof schema>,
  teams: Team[],
  formations: Formation[]
): Promise<void> {
  console.log('🔗 Seeding team-formation relationships...');

  const tealPenguins = teams.find((t) => t.name === 'Teal Penguins');
  const formation231 = formations.find((f) => f.name === '2-3-1');

  if (!tealPenguins || !formation231) {
    console.log('  ⚠ Team or formation not found, skipping');
    return;
  }

  const teamFormationsData = [
    {
      teamId: tealPenguins.id,
      formationId: formation231.id,
    },
  ];

  await db.insert(teamFormations).values(teamFormationsData).onConflictDoNothing();

  console.log(`  ✓ Linked ${String(teamFormationsData.length)} team(s) to formations`);
}
