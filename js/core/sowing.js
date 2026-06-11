/**
 * Number Sowing Logic
 * Distributes numbers from a pit following the game rules
 */

/**
 * Normal sowing (1-13 numbers)
 * @param {object} state - Game state
 * @param {string} player - 'north' or 'south'
 * @param {number} pitIndex - 0-6
 * @returns {object} Sowing result with visited positions
 */
function sowNormal(state, player, pitIndex) {
  const numbers = state.board[player][pitIndex];
  const source = { player, pitIndex };
  const visited = [];
  
  // Empty the source pit
  state.board[player][pitIndex] = 0;
  
  // Get the path for distribution
  const path = nextPositionsAfter(source);
  
  // Distribute numbers one by one
  for (let i = 0; i < numbers; i++) {
    const position = path[i];
    state.board[position.player][position.pitIndex] += 1;
    visited.push(position);
  }
  
  return {
    visited,
    lastPosition: visited[visited.length - 1],
    specialCapture: 0,
    type: MOVE_TYPE.NORMAL_SOW
  };
}

/**
 * Granary sowing (14+ numbers)
 * 
 * Rules:
 * 1. Do a complete turn without returning to source
 * 2. Distribute remaining only in opponent's camp
 * 3. If last number lands on protected first pit, it's captured
 */
function sowGranary(state, player, pitIndex) {
  const numbers = state.board[player][pitIndex];
  const source = { player, pitIndex };
  const visited = [];
  let remaining = numbers;
  let specialCapture = 0;
  
  // Empty the source pit
  state.board[player][pitIndex] = 0;
  
  // Phase 1: Complete turn (13 positions)
  for (const position of nextPositionsAfter(source)) {
    state.board[position.player][position.pitIndex] += 1;
    visited.push(position);
    remaining -= 1;
  }
  
  // Phase 2: Remaining numbers only in opponent's camp
  const path = opponentPath(player);
  for (let i = 0; i < remaining; i++) {
    const position = path[i % path.length];
    const isLastSeed = i === remaining - 1;
    const isProtectedFirstPit = samePosition(position, opponentFirstPit(player));
    
    if (isLastSeed && isProtectedFirstPit) {
      // Capture this special number
      specialCapture += 1;
      visited.push(position);
      continue;
    }
    
    state.board[position.player][position.pitIndex] += 1;
    visited.push(position);
  }
  
  return {
    visited,
    lastPosition: visited[visited.length - 1],
    specialCapture,
    type: MOVE_TYPE.GRANARY_SOW
  };
}

/**
 * General sow function - chooses normal or granary
 */
function sow(state, player, pitIndex) {
  const numbers = state.board[player][pitIndex];
  
  if (numbers <= 0) {
    throw new Error('Cannot sow from empty pit');
  }
  
  if (numbers <= 13) {
    return sowNormal(state, player, pitIndex);
  }
  
  return sowGranary(state, player, pitIndex);
}
