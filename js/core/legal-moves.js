/**
 * Legal Moves Generation
 * Determines which moves are allowed for a player
 */

/**
 * Get all non-empty pits for a player
 */
function ownNonEmptyMoves(state, player) {
  const moves = [];
  for (let pitIndex = 0; pitIndex < 7; pitIndex++) {
    if (state.board[player][pitIndex] > 0) {
      moves.push({ player, pitIndex });
    }
  }
  return moves;
}

/**
 * Simulate a move to check if it would cause a capture
 */
function wouldMoveCapture(state, player, pitIndex) {
  const simulated = cloneState(state);
  const sowing = sow(simulated, player, pitIndex);
  
  if (sowing.specialCapture > 0) {
    return true;
  }
  
  const last = sowing.lastPosition;
  return canStartCapture(simulated, player, last);
}

/**
 * Check if a move from attack pit is forbidden
 * Attack pit:
 *   - North: N6
 *   - South: S0
 * 
 * Rules:
 *   - 1 number: always forbidden
 *   - 2 numbers: forbidden unless it causes a capture
 */
function isForbiddenAttackMove(state, player, pitIndex) {
  if (!isAttackPitMove(player, pitIndex)) {
    return false;
  }
  
  const numbers = state.board[player][pitIndex];
  
  if (numbers === 1) {
    return true; // 1 number always forbidden
  }
  
  if (numbers === 2) {
    // Forbidden unless it causes a capture
    return !wouldMoveCapture(state, player, pitIndex);
  }
  
  return false;
}

/**
 * Count how many numbers would be delivered to opponent's camp
 */
function countDeliveredToOpponent(state, player, pitIndex) {
  const simulated = cloneState(state);
  const before = sum(simulated.board[other(player)]);
  
  sow(simulated, player, pitIndex);
  
  const after = sum(simulated.board[other(player)]);
  return after - before;
}

/**
 * Get solidarity moves when opponent's camp is empty
 * Priority:
 *   1. Give at least 7 numbers
 *   2. Give maximum possible
 *   3. Force donation from attack pit if needed
 */
function getSolidarityMoves(state, player) {
  const candidates = ownNonEmptyMoves(state, player);
  
  // Filter out forbidden attack moves
  const ordinary = candidates.filter(move => {
    return !isForbiddenAttackMove(state, player, move.pitIndex);
  });
  
  // Calculate delivery for each move
  const enriched = ordinary.map(move => ({
    ...move,
    delivered: countDeliveredToOpponent(state, player, move.pitIndex)
  }));
  
  // Priority 1: At least 7 numbers
  const atLeastSeven = enriched.filter(move => move.delivered >= 7);
  if (atLeastSeven.length > 0) {
    return atLeastSeven;
  }
  
  // Priority 2: Maximum possible
  const positive = enriched.filter(move => move.delivered > 0);
  if (positive.length > 0) {
    const maxDelivered = Math.max(...positive.map(move => move.delivered));
    return positive.filter(move => move.delivered === maxDelivered);
  }
  
  // Priority 3: Forced donation from attack pit
  const forcedDonation = candidates.filter(move => {
    return isAttackPitMove(player, move.pitIndex) && 
           [1, 2].includes(state.board[player][move.pitIndex]);
  });
  
  return forcedDonation.map(move => ({
    ...move,
    forcedDonation: true
  }));
}

/**
 * Get all legal moves for current player
 */
function getLegalMoves(state) {
  const player = state.currentPlayer;
  
  if (state.status !== STATUS.PLAYING) {
    return [];
  }
  
  // Check solidarity (opponent camp is empty)
  if (opponentCampIsEmpty(state, player)) {
    return getSolidarityMoves(state, player);
  }
  
  // Normal moves (excluding forbidden attack pit moves)
  return ownNonEmptyMoves(state, player).filter(move => {
    return !isForbiddenAttackMove(state, player, move.pitIndex);
  });
}
