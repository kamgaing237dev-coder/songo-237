/**
 * Main Game Engine
 * Core function to apply moves and manage game state
 */

/**
 * Validate a move
 */
function validateMove(state, move) {
  if (state.status !== STATUS.PLAYING) {
    return { ok: false, reason: 'Game is over' };
  }
  
  if (move.player !== state.currentPlayer) {
    return { ok: false, reason: 'Not this player\'s turn' };
  }
  
  if (move.pitIndex < 0 || move.pitIndex > 6) {
    return { ok: false, reason: 'Invalid pit' };
  }
  
  if (state.board[move.player][move.pitIndex] <= 0) {
    return { ok: false, reason: 'Pit is empty' };
  }
  
  // Check if move is legal
  const legalMoves = getLegalMoves(state);
  const isLegal = legalMoves.some(lm => 
    lm.player === move.player && lm.pitIndex === move.pitIndex
  );
  
  if (!isLegal) {
    return { ok: false, reason: 'Forbidden move' };
  }
  
  return { ok: true };
}

/**
 * Apply forced donation (from attack pit with 1-2 numbers)
 */
function applyForcedDonation(state, player, pitIndex) {
  const numbers = state.board[player][pitIndex];
  state.board[player][pitIndex] = 0;
  state.scores[other(player)] += numbers;
  
  return {
    type: MOVE_TYPE.FORCED_DONATION,
    donated: numbers
  };
}

/**
 * Main function: Apply a move to the game state
 */
function applyMove(state, move) {
  // Validate move
  const validation = validateMove(state, move);
  if (!validation.ok) {
    return {
      state,
      ok: false,
      error: validation.reason
    };
  }
  
  // Find the legal move definition
  const legalMove = getLegalMoves(state).find(lm => 
    lm.player === move.player && lm.pitIndex === move.pitIndex
  );
  
  let actionResult;
  
  // Check if it's a forced donation
  if (legalMove && legalMove.forcedDonation) {
    actionResult = applyForcedDonation(state, move.player, move.pitIndex);
  } else {
    // Normal move: sow and capture
    const sowing = sow(state, move.player, move.pitIndex);
    const capture = resolveCaptures(state, move.player, sowing);
    actionResult = {
      type: sowing.type,
      sowing: sowing,
      capture: capture
    };
  }
  
  // Record move in history
  state.moveNumber += 1;
  state.history.push({
    moveNumber: state.moveNumber,
    player: move.player,
    pitIndex: move.pitIndex,
    result: actionResult
  });
  
  // Check end conditions after move
  resolveEndGameAfterMove(state);
  
  // If still playing, switch player and check end conditions
  if (state.status === STATUS.PLAYING) {
    state.currentPlayer = other(state.currentPlayer);
    resolveEndGameBeforeTurn(state);
  }
  
  // Verify invariant
  assertTotalNumbers(state);
  
  return {
    state,
    ok: true,
    action: actionResult
  };
}
