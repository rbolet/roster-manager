import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { positions, PositionType, type Position } from '../schema/index.js';
import type * as schema from '../schema/index.js';

/**
 * Seed standard soccer positions
 */
export async function seedPositions(db: PostgresJsDatabase<typeof schema>): Promise<Position[]> {
  console.log('📍 Seeding positions...');

  const positionsData = [
    { name: 'Goalkeeper', abbreviation: 'GK', positionType: PositionType.GK },
    { name: 'Left Center Back', abbreviation: 'LCB', positionType: PositionType.DEFENSE },
    { name: 'Right Center Back', abbreviation: 'RCB', positionType: PositionType.DEFENSE },
    { name: 'Left Midfielder', abbreviation: 'LM', positionType: PositionType.MIDFIELD },
    { name: 'Center Midfielder', abbreviation: 'CM', positionType: PositionType.MIDFIELD },
    { name: 'Right Midfielder', abbreviation: 'RM', positionType: PositionType.MIDFIELD },
    { name: 'Striker', abbreviation: 'ST', positionType: PositionType.ATTACK },
  ];

  const insertedPositions = await db
    .insert(positions)
    .values(positionsData)
    .onConflictDoNothing()
    .returning();

  console.log(`  ✓ Seeded ${String(insertedPositions.length)} positions`);
  return insertedPositions;
}
