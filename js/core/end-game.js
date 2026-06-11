/**
 * End Game Logic
 * Determines when the game ends and who wins
 */

/**
 * Collect remaining numbers from board into scores
 */
function collectRemainingNumbers(state) {
  state.scores.north += sum(state.board.north);
  state.scores.south += sum(state.board.south);
  state.board.north = [0, 0, 0, 0, 0, 0, 0];
  state.board.south = [0, 0, 0, 0, 0, 0, 0];
}

/**
 * Compute winner strictly: 40+ wins, else draw
 */
function computeWinnerStrict40OrDraw(state) {
  if (state.scores.north >= 40) return 'north';
  if (state.scores.south >= 40) return 'south';
  return 'draw';
}

/**
 * Check end conditions AFTER a move
 */
function resolveEndGameAfterMove(state) {
  // Condition 1: Score >= 40
  if (state.scores.north >= 40 || state.scores.south >= 40) {
    state.status = STATUS.ENDED;
    state.reason = END_REASON.SCORE_40;
    state.winner = computeWinnerStrict40OrDraw(state);
    return;
  }
  
  // Condition 2: Less than 10 numbers on board
  if (boardNumbers(state) < 10) {
    collectRemainingNumbers(state);
    state.status = STATUS.ENDED;
    state.reason = END_REASON.LOW_BOARD;
    state.winner = computeWinnerStrict40OrDraw(state);
    return;
  }
}

/**
 * Check end conditions BEFORE next player's turn
 */
function resolveEndGameBeforeTurn(state) {
  const legalMoves = getLegalMoves(state);
  
  if (legalMoves.length > 0) {
    return; // Game continues
  }
  
  // No legal moves available
  collectRemainingNumbers(state);
  state.status = STATUS.ENDED;
  state.reason = END_REASON.SOLIDARITY_IMPOSSIBLE;
  state.winner = computeWinnerStrict40OrDraw(state);
}
