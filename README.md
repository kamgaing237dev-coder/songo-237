# Songo-237 Game Project

## Overview
This is a basic implementation of the Songho/Songo game for a school project (Dr. MESSI).

**Game Rules:**
- 2 players: North and South
- 7 pits per player
- Initial: 5 numbers per pit
- Victory: First player to capture 40 numbers wins
- Numbers are displayed instead of seeds for simplicity

## Project Structure

### Core Game Engine (js/core/)
- `constants.js` - Game rules and configuration
- `coordinates.js` - Board layout and movement paths
- `state.js` - Game state management
- `sowing.js` - Number distribution logic
- `capture.js` - Number capturing rules
- `legal-moves.js` - Valid moves generation
- `end-game.js` - Game ending conditions
- `engine.js` - Main game logic

### Version 1: Local Game (Same Browser)
- `index.html` - Simple interface
- `css/style.css` - Basic styling
- `js/app.js` - Local game interface

## How to Play

1. Each player has 7 pits with numbers
2. On your turn, pick a non-empty pit
3. Take all numbers from that pit
4. Distribute them one by one in the following pits
5. If the last number lands in opponent's pit with 2, 3, or 4 numbers total, you capture them
6. First to 40 numbers wins!

## Development Status
- [x] Basic game structure
- [ ] Core game engine
- [ ] Local player interface
- [ ] Remote player interface (Ajax)

## Deadline
Friday 11:30 AM - Presentation from 1:00 PM
