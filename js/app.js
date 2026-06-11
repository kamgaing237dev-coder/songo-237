/**
 * Local Game Interface
 * Manages UI and player interaction for single-browser game
 */

let gameState = createGame('south');

/**
 * Initialize the game board display
 */
function initializeBoard() {
  renderBoard();
  updateGameInfo();
  updateMoveLog();
}

/**
 * Render the game board (both players' pits)
 */
function renderBoard() {
  renderPlayerPits('north');
  renderPlayerPits('south');
}

/**
 * Render pits for a specific player
 */
function renderPlayerPits(player) {
  const container = document.getElementById(player + 'Pits');
  container.innerHTML = '';
  
  const board = gameState.board[player];
  const legalMoves = getLegalMoves(gameState);
  
  for (let i = 0; i < board.length; i++) {
    const pit = document.createElement('div');
    pit.className = 'pit';
    
    const numbers = board[i];
    pit.textContent = numbers;
    
    // Check if this pit is a legal move
    const isLegal = gameState.currentPlayer === player && 
                    legalMoves.some(move => move.pitIndex === i);
    
    if (isLegal) {
      pit.classList.add('legal');
      pit.onclick = () => makeMove(player, i);
    } else if (numbers === 0) {
      pit.classList.add('empty');
    } else if (gameState.currentPlayer !== player) {
      pit.classList.add('disabled');
    }
  }
  
  container.appendChild(...container.children);
}

/**
 * Make a move
 */
function makeMove(player, pitIndex) {
  const move = { player, pitIndex };
  const result = applyMove(gameState, move);
  
  if (!result.ok) {
    alert('Invalid move: ' + result.error);
    return;
  }
  
  renderBoard();
  updateGameInfo();
  updateMoveLog();
  
  // Check if game ended
  if (gameState.status === STATUS.ENDED) {
    showGameOver();
  }
}

/**
 * Update game info display
 */
function updateGameInfo() {
  const northScore = document.getElementById('northScore');
  const southScore = document.getElementById('southScore');
  const statusDiv = document.getElementById('gameStatus');
  const playerDiv = document.getElementById('currentPlayer');
  
  northScore.textContent = `Score: ${gameState.scores.north}`;
  southScore.textContent = `Score: ${gameState.scores.south}`;
  
  if (gameState.status === STATUS.PLAYING) {
    statusDiv.textContent = '🎮 Game in Progress';
    playerDiv.textContent = `Current Player: ${gameState.currentPlayer.toUpperCase()}`;
  } else {
    statusDiv.textContent = 'Game Over!';
    playerDiv.textContent = `Winner: ${gameState.winner.toUpperCase()}`;
  }
}

/**
 * Update move history log
 */
function updateMoveLog() {
  const movesList = document.getElementById('moves');
  movesList.innerHTML = '';
  
  for (let i = gameState.history.length - 1; i >= Math.max(0, gameState.history.length - 10); i--) {
    const move = gameState.history[i];
    const li = document.createElement('li');
    
    const playerName = move.player.toUpperCase();
    const pitName = move.player === 'north' ? 'N' : 'S';
    
    let text = `Move ${move.moveNumber}: ${playerName} pit ${pitName}${move.pitIndex}`;
    
    if (move.result.type === MOVE_TYPE.FORCED_DONATION) {
      text += ` (Donated ${move.result.donated} to opponent)`;
    } else if (move.result.capture && move.result.capture.captured > 0) {
      text += ` - Captured ${move.result.capture.captured} (${move.result.capture.type})`;
    }
    
    li.textContent = text;
    movesList.appendChild(li);
  }
}

/**
 * Show game over message
 */
function showGameOver() {
  const reason = gameState.reason;
  const winner = gameState.winner;
  
  let message = '';
  
  if (winner === 'draw') {
    message = '🤝 It\'s a Draw!';
  } else {
    message = `🎉 ${winner.toUpperCase()} WINS!`;
  }
  
  message += `\n\nReason: ${reason}`;
  message += `\n\nNorth: ${gameState.scores.north} vs South: ${gameState.scores.south}`;
  
  setTimeout(() => alert(message), 500);
}

/**
 * Reset game
 */
function resetGame() {
  gameState = createGame('south');
  initializeBoard();
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initializeBoard);
