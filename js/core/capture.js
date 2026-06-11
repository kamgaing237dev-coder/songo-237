/**
 * Capture Logic
 * Handles capturing numbers from opponent's pits
 */

/**
 * Check if a number count is capturable (2, 3, or 4)
 */
function isCaptureValue(seedCount) {
  return RULES.captureValues.includes(seedCount);
}

/**
 * Check if a normal capture can start
 * Conditions:
 * 1. Last number landed in opponent's pit
 * 2. Not in the protected first pit
 * 3. Pit has 2, 3, or 4 numbers
 */
function canStartCapture(state, player, lastPosition) {
  if (!isOpponentPit(player, lastPosition)) {
    return false;
  }
  
  if (samePosition(lastPosition, opponentFirstPit(player))) {
    return false;
  }
  
  const count = state.board[lastPosition.player][lastPosition.pitIndex];
  return isCaptureValue(count);
}

/**
 * Get positions to capture in a chain from the last position backwards
 */
function captureChainPositions(state, player, lastPosition) {
  const path = opponentPath(player);
  const lastIndex = path.findIndex(position => samePosition(position, lastPosition));
  
  if (lastIndex < 0) {
    return [];
  }
  
  const captured = [];
  
  // Go backwards from last position
  for (let index = lastIndex; index >= 0; index--) {
    const position = path[index];
    const count = state.board[position.player][position.pitIndex];
    
    if (!isCaptureValue(count)) {
      break; // Stop at first pit that doesn't have 2-4
    }
    
    captured.push({
      player: position.player,
      pitIndex: position.pitIndex,
      numbers: count
    });
  }
  
  return captured;
}

/**
 * Check if a capture would empty the opponent's entire camp
 */
function wouldEmptyOpponent(state, player, captureList) {
  const opponent = other(player);
  const remaining = [...state.board[opponent]];
  
  for (const capture of captureList) {
    remaining[capture.pitIndex] -= capture.numbers;
  }
  
  return sum(remaining) === 0;
}

/**
 * Apply captures if allowed (don't starve opponent)
 */
function applyCaptureIfAllowed(state, player, captureList) {
  if (captureList.length === 0) {
    return 0;
  }
  
  if (wouldEmptyOpponent(state, player, captureList)) {
    return 0; // Capture blocked
  }
  
  let total = 0;
  for (const capture of captureList) {
    state.board[capture.player][capture.pitIndex] -= capture.numbers;
    total += capture.numbers;
  }
  
  state.scores[player] += total;
  return total;
}

/**
 * Resolve all captures after sowing
 */
function resolveCaptures(state, player, sowingResult) {
  // Special capture from granary
  if (sowingResult.specialCapture > 0) {
    state.scores[player] += sowingResult.specialCapture;
    return {
      captured: sowingResult.specialCapture,
      type: CAPTURE_TYPE.SPECIAL_GRANARY
    };
  }
  
  const last = sowingResult.lastPosition;
  
  // Check if normal capture can start
  if (!canStartCapture(state, player, last)) {
    return {
      captured: 0,
      type: CAPTURE_TYPE.NONE
    };
  }
  
  // Get chain positions and apply if allowed
  const captureList = captureChainPositions(state, player, last);
  const captured = applyCaptureIfAllowed(state, player, captureList);
  
  return {
    captured,
    type: captured > 0 && captureList.length > 1 ? CAPTURE_TYPE.CHAIN : CAPTURE_TYPE.NORMAL,
    cancelledByStarvation: captured === 0 && captureList.length > 0
  };
}
