/**
 * Board Coordinates and Movement Paths
 * 
 * Physical layout:
 * North: N0 N1 N2 N3 N4 N5 N6
 * South: S0 S1 S2 S3 S4 S5 S6
 * 
 * Sowing cycle (clockwise):
 * N0 → N1 → N2 → N3 → N4 → N5 → N6 → S6 → S5 → S4 → S3 → S2 → S1 → S0 → N0
 */

const CYCLE = [
  { player: 'north', pitIndex: 0 },
  { player: 'north', pitIndex: 1 },
  { player: 'north', pitIndex: 2 },
  { player: 'north', pitIndex: 3 },
  { player: 'north', pitIndex: 4 },
  { player: 'north', pitIndex: 5 },
  { player: 'north', pitIndex: 6 },
  { player: 'south', pitIndex: 6 },
  { player: 'south', pitIndex: 5 },
  { player: 'south', pitIndex: 4 },
  { player: 'south', pitIndex: 3 },
  { player: 'south', pitIndex: 2 },
  { player: 'south', pitIndex: 1 },
  { player: 'south', pitIndex: 0 }
];

/**
 * Get the other player
 */
function other(player) {
  return player === 'north' ? 'south' : 'north';
}

/**
 * Check if two positions are the same
 */
function samePosition(a, b) {
  return a.player === b.player && a.pitIndex === b.pitIndex;
}

/**
 * Find position index in the cycle
 */
function cycleIndexOf(position) {
  return CYCLE.findIndex(item => samePosition(item, position));
}

/**
 * Get the 13 positions following a source (without returning to source)
 */
function nextPositionsAfter(source) {
  const start = cycleIndexOf(source);
  const positions = [];
  for (let step = 1; step <= 13; step++) {
    const index = (start + step) % CYCLE.length;
    positions.push(CYCLE[index]);
  }
  return positions;
}

/**
 * Get the attack pit (last pit of own camp)
 * North: N6, South: S0
 */
function attackPit(player) {
  return player === 'north'
    ? { player: 'north', pitIndex: 6 }
    : { player: 'south', pitIndex: 0 };
}

/**
 * Get the opponent's first pit (protected from solo capture)
 * For North: S6, For South: N0
 */
function opponentFirstPit(player) {
  return player === 'north'
    ? { player: 'south', pitIndex: 6 }
    : { player: 'north', pitIndex: 0 };
}

/**
 * Get opponent's pits in order (for chain captures)
 * For North attacking South: S6, S5, S4, S3, S2, S1, S0
 * For South attacking North: N0, N1, N2, N3, N4, N5, N6
 */
function opponentPath(player) {
  return player === 'north'
    ? [
        { player: 'south', pitIndex: 6 },
        { player: 'south', pitIndex: 5 },
        { player: 'south', pitIndex: 4 },
        { player: 'south', pitIndex: 3 },
        { player: 'south', pitIndex: 2 },
        { player: 'south', pitIndex: 1 },
        { player: 'south', pitIndex: 0 }
      ]
    : [
        { player: 'north', pitIndex: 0 },
        { player: 'north', pitIndex: 1 },
        { player: 'north', pitIndex: 2 },
        { player: 'north', pitIndex: 3 },
        { player: 'north', pitIndex: 4 },
        { player: 'north', pitIndex: 5 },
        { player: 'north', pitIndex: 6 }
      ];
}

/**
 * Check if a position belongs to the opponent
 */
function isOpponentPit(player, position) {
  return position.player === other(player);
}

/**
 * Check if a position is the attack pit for a player
 */
function isAttackPitMove(player, pitIndex) {
  const attack = attackPit(player);
  return attack.player === player && attack.pitIndex === pitIndex;
}
