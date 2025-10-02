import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { formationPositions, type Formation, type Position } from '../schema/index.js';
import type * as schema from '../schema/index.js';

/**
 * Link positions to formations
 * For 2-3-1: GK, LCB, RCB, LM, CM, RM, ST
 */
export async function seedFormationPositions(
  db: PostgresJsDatabase<typeof schema>,
  formations: Formation[],
  positions: Position[]
): Promise<void> {
  console.log('🔗 Seeding formation-position relationships...');

  const formation231 = formations.find((f) => f.name === '2-3-1');
  if (!formation231) {
    console.log('  ⚠ 2-3-1 formation not found, skipping');
    return;
  }

  // Map position abbreviations to position IDs
  const positionMap = new Map(positions.map((p) => [p.abbreviation, p.id]));

  const formation231Positions = ['GK', 'LCB', 'RCB', 'LM', 'CM', 'RM', 'ST']
    .map((abbr) => {
      const positionId = positionMap.get(abbr);
      if (!positionId) {
        console.log(`  ⚠ Position ${abbr} not found`);
        return null;
      }
      return {
        formationId: formation231.id,
        positionId,
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  if (formation231Positions.length > 0) {
    await db.insert(formationPositions).values(formation231Positions).onConflictDoNothing();
    console.log(`  ✓ Linked ${String(formation231Positions.length)} positions to 2-3-1 formation`);
  }
}
