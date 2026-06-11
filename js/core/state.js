/**
 * Game State Management
 */

/**
 * Create initial game state
 * @param {string} startingPlayer - 'north' or 'south'
 * @returns {object} Initial game state
 */
function createGame(startingPlayer = 'south') {
  return {
    board: {
      north: [5, 5, 5, 5, 5, 5, 5],
      south: [5, 5, 5, 5, 5, 5, 5]
    },
    scores: {
      north: 0,
      south: 0
    },
    currentPlayer: startingPlayer,
    status: STATUS.PLAYING,
    winner: null,
    reason: null,
    moveNumber: 0,
    history: []
  };
}

/**
 * Deep clone the game state
 */
function cloneState(state) {
  return {
    board: {
      north: [...state.board.north],
      south: [...state.board.south]
    },
    scores: {
      north: state.scores.north,
      south: state.scores.south
    },
    currentPlayer: state.currentPlayer,
    status: state.status,
    winner: state.winner,
    reason: state.reason,
    moveNumber: state.moveNumber,
    history: state.history.map(h => ({ ...h }))
  };
}

/**
 * Sum array values
 */
function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

/**
 * Get total numbers on board
 */
function boardNumbers(state) {
  return sum(state.board.north) + sum(state.board.south);
}

/**
 * Get total numbers in game (board + scores)
 */
function totalNumbers(state) {
  return state.scores.north + state.scores.south + boardNumbers(state);
}

/**
 * Verify invariant: total must always be 70
 */
function assertTotalNumbers(state) {
  const total = totalNumbers(state);
  if (total !== RULES.totalNumbers) {
    throw new Error(`Invariant violation: ${total} numbers instead of ${RULES.totalNumbers}`);
  }
}

/**
 * Check if opponent's camp is empty
 */
function opponentCampIsEmpty(state, player) {
  return sum(state.board[other(player)]) === 0;
}
