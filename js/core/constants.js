/**
 * Game Constants and Rules
 * Based on Club Awale and Ewondo/Bulu variant
 */

const RULES = {
  players: ['north', 'south'],
  pitsPerPlayer: 7,
  initialNumbersPerPit: 5,
  totalNumbers: 70,
  victoryScore: 40,
  lowBoardLimit: 10,
  captureValues: [2, 3, 4],      // Numbers that can be captured
  maxNormalSowNumbers: 13         // Beyond this = granary (storage)
};

// Game status constants
const STATUS = {
  PLAYING: 'playing',
  ENDED: 'ended'
};

// Game end reasons
const END_REASON = {
  SCORE_40: 'score_40',          // Someone reached 40
  LOW_BOARD: 'low_board',        // Less than 10 numbers remain
  SOLIDARITY_IMPOSSIBLE: 'solidarity_impossible',  // Cannot feed opponent
  NO_LEGAL_MOVE: 'no_legal_move' // No valid move exists
};

// Move types for display/logging
const MOVE_TYPE = {
  NORMAL_SOW: 'normal_sow',
  GRANARY_SOW: 'granary_sow',
  FORCED_DONATION: 'forced_donation'
};

// Capture types
const CAPTURE_TYPE = {
  NONE: 'none',
  NORMAL: 'normal',
  CHAIN: 'chain',
  SPECIAL_GRANARY: 'special_granary'
};

// Player identifiers
const PLAYERS = {
  NORTH: 'north',
  SOUTH: 'south'
};
