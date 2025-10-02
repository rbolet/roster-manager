import { db } from '../client.js';
import { seedPositions } from './01-positions.js';
import { seedFormations } from './02-formations.js';
import { seedFormationPositions } from './03-formation-positions.js';
import { seedRoles } from './04-roles.js';
import { seedDivisions } from './05-divisions.js';
import { seedLeagues } from './06-leagues.js';
import { seedTeams } from './07-teams.js';
import { seedTeamFormations } from './08-team-formations.js';
import { seedPlayers } from './09-players.js';
import { seedGames } from './10-games.js';
import { seedGameFormations } from './11-game-formations.js';

/**
 * Main seeder entry point
 * Runs all seeders in dependency order
 */
async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Seed positions and formations first (no dependencies)
    const positions = await seedPositions(db);
    const formations = await seedFormations(db);
    await seedFormationPositions(db, formations, positions);

    // Seed roles (no dependencies)
    const roles = await seedRoles(db);

    // Seed hierarchy: divisions -> leagues -> teams
    const divisions = await seedDivisions(db);
    const leagues = await seedLeagues(db, divisions);
    const teams = await seedTeams(db, leagues);

    // Link teams to formations
    await seedTeamFormations(db, teams, formations);

    // Seed players for teams
    const players = await seedPlayers(db, teams);

    // Seed games and link to formations
    const games = await seedGames(db, leagues, teams);
    await seedGameFormations(db, games, teams, formations);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`  • ${String(positions.length)} positions`);
    console.log(`  • ${String(formations.length)} formations`);
    console.log(`  • ${String(roles.length)} roles`);
    console.log(`  • ${String(divisions.length)} divisions`);
    console.log(`  • ${String(leagues.length)} leagues`);
    console.log(`  • ${String(teams.length)} teams`);
    console.log(`  • ${String(players.length)} players`);
    console.log(`  • ${String(games.length)} games`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

void seed();
