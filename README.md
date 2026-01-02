# Shadow Station

**Target Platform:** Web / PC (Gamepad Supported)  
**Engine:** JavaScript (KAPLAY / Node.js)

## Overview

A 2D "demake" inspired by the mechanics of *Prey (2017)*. The goal is to recreate the tense, atmospheric exploration of a semi-abandoned space station with a focus on:

* **Interactive Environments:** Almost every prop can be picked up, thrown, or searched.
* **Shapeshifting AI:** Shifter-style enemies that camouflage as environmental objects.
* **Player Agency:** Multiple ways to solve puzzles (Gloo, Hacking, or brute force).

## Technical Goals

- Optimized for Chrome browser.
- Full **Gamepad/Controller** integration for a twin-stick feel.
- Lightweight assets to ensure instant loading in-browser.

---

## Project Structure

```
shadow-station-dev/
├── src/
│   ├── config/
│   │   └── constants.js          # Game configuration constants
│   ├── controllers/
│   │   └── InputHandler.js       # Input handling (keyboard/gamepad)
│   ├── entities/
│   │   └── Player.js              # Player entity class
│   ├── loaders/
│   │   └── SpriteLoader.js        # Sprite loading utility
│   ├── utils/
│   │   ├── ErrorHandler.js        # Error handling utilities
│   │   └── GameUtils.js           # Common utility functions
│   ├── world/
│   │   └── GameMap.js             # Map/level management
│   ├── Game.js                    # Main game orchestrator
│   └── main.js                    # Entry point
├── tests/
│   ├── config/
│   ├── controllers/
│   ├── entities/
│   ├── loaders/
│   └── world/
├── assets/                        # Game assets (sprites, audio)
├── index.html                     # HTML entry point
├── package.json
├── vitest.config.js               # Test configuration
├── eslint.config.js               # ESLint configuration
└── .prettierrc                    # Prettier configuration
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

---

## Architecture

### Core Classes

#### `Game`
Main orchestrator that initializes and coordinates all game systems.

#### `Player`
Manages player entity, animations, movement, and camera following.

#### `GameMap`
Handles level creation and tile management.

#### `InputHandler`
Processes keyboard and gamepad input for player control.

#### `SpriteLoader`
Centralized sprite loading for walls, floors, characters, and props.

### Configuration

All game constants are centralized in [`src/config/constants.js`](src/config/constants.js):
- Game rendering settings
- Player configuration (speed, scale, collision)
- Tile dimensions and scales
- Sprite paths
- Animation names

---

## Development Guidelines

### Code Style

- ES6+ modules
- Class-based architecture
- JSDoc comments for all public methods
- Single responsibility principle
- Dependency injection where appropriate

### Error Handling

The project uses custom error classes for better debugging:
- `GameError` - Base game error
- `SpriteLoadError` - Sprite loading failures
- `EntityCreationError` - Entity creation failures
- `MapCreationError` - Map creation failures

### Testing

- Unit tests for all classes and utilities
- Mocked Kaplay instances for isolated testing
- Aim for >80% code coverage

---

## Roadmap

### Completed ✅
- [x] Basic player movement and animation
- [x] Wall collision system
- [x] Sprite loading system
- [x] Camera following
- [x] Class-based architecture
- [x] Comprehensive test suite
- [x] Code quality tooling (ESLint, Prettier)

### In Progress 🚧
- [ ] Gamepad support
- [ ] Interactive props system
- [ ] Inventory management

### Planned 📋
- [ ] Shifter enemy AI
- [ ] Gloo gun mechanics
- [ ] Hacking mini-game
- [ ] Multiple rooms/levels
- [ ] Save/load system
- [ ] Sound effects and music
- [ ] Particle effects
- [ ] UI/HUD system

---

## Technical Debt Addressed

1. ✅ **Code Organization**: Migrated from single monolithic `main.js` to modular class-based architecture
2. ✅ **Configuration Management**: Centralized all magic numbers and strings into `constants.js`
3. ✅ **Testing**: Added comprehensive unit tests with Vitest
4. ✅ **Code Quality**: Implemented ESLint and Prettier for consistent code style
5. ✅ **Error Handling**: Added custom error classes and error handling utilities
6. ✅ **Documentation**: Enhanced JSDoc comments and improved README

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Ensure code is properly formatted (`npm run lint && npm run format`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

---

## Legal Note

This is a private educational and creative tribute. No copyrighted assets from original titles are used. All code and logic are original.

---

## License

Private project - All rights reserved.

