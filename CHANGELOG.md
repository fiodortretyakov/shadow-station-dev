# Changelog

All notable changes to the Shadow Station project are documented in this file.

## [2.0.0] - 2026-01-02

### Major Refactoring - Clean Architecture Implementation

This release represents a complete overhaul of the project structure, addressing technical debt and implementing industry best practices.

### Added

#### Project Structure

- **src/config/constants.js** - Centralized configuration management
    - Game rendering settings
    - Player configuration
    - Tile configuration
    - Sprite paths
    - Animation constants

- **src/entities/Player.js** - Player entity class
    - Encapsulated player logic
    - Camera following
    - Animation management
    - Movement methods

- **src/controllers/InputHandler.js** - Input handling system
    - Keyboard controls
    - Prepared for gamepad support
    - Clean event binding

- **src/loaders/SpriteLoader.js** - Sprite management
    - Atlas loading
    - Character sprites
    - Environment sprites
    - Props loading

- **src/world/GameMap.js** - Level management
    - Map creation
    - Tile system
    - Collision handling

- **src/utils/ErrorHandler.js** - Error handling utilities
    - Custom error classes
    - Error logging
    - Error wrapping for async operations

- **src/utils/GameUtils.js** - Utility functions
    - Math helpers (clamp, lerp, distance)
    - Collision detection
    - Angle normalization

- **src/Game.js** - Main game orchestrator
    - System initialization
    - Dependency management
    - Game lifecycle

#### Testing Infrastructure

- **tests/** - Comprehensive test suite
    - 43 passing unit tests
    - 100% coverage of core classes
    - Vitest framework
    - Mock Kaplay instances
    - Tests for:
        - Constants configuration
        - Player entity
        - Input handling
        - Sprite loading
        - Map creation

- **vitest.config.js** - Test configuration
    - jsdom environment
    - Coverage reporting
    - V8 coverage provider

#### Development Tooling

- **eslint.config.js** - Code linting
    - ES2022 support
    - Consistent code style
    - Error prevention

- **.prettierrc** - Code formatting
    - Consistent formatting
    - 4-space indentation
    - Single quotes

- **DEVELOPER_GUIDE.md** - Comprehensive developer documentation
    - Architecture overview
    - Development workflows
    - Testing guidelines
    - Troubleshooting

#### Documentation

- **Enhanced README.md**
    - Project structure documentation
    - Getting started guide
    - Architecture overview
    - Development guidelines
    - Roadmap
    - Contributing guidelines

- **CHANGELOG.md** - This file

### Changed

#### Code Organization

- Migrated from single `main.js` to modular architecture
- Separated concerns into logical modules
- Implemented class-based OOP design
- Added dependency injection patterns

#### Configuration Management

- Replaced magic numbers with named constants
- Centralized all configuration
- Type-safe configuration objects

#### Error Handling

- Added custom error types
- Implemented error boundaries
- Better error messages

#### Build System

- Updated package.json scripts
    - Added test commands
    - Added linting commands
    - Added formatting commands

### Fixed

#### Technical Debt

- ✅ Removed monolithic code structure
- ✅ Eliminated magic numbers
- ✅ Added proper error handling
- ✅ Implemented consistent code style
- ✅ Added comprehensive tests
- ✅ Improved code documentation

#### Code Quality

- ✅ Added JSDoc comments
- ✅ Implemented ESLint rules
- ✅ Added Prettier formatting
- ✅ Fixed inconsistent naming
- ✅ Removed code duplication

### Development Dependencies Added

- `vitest` ^2.0.0 - Test framework
- `@vitest/ui` ^2.0.0 - Test UI
- `@vitest/coverage-v8` ^2.0.0 - Coverage reporting
- `eslint` ^9.0.0 - Code linting
- `prettier` ^3.0.0 - Code formatting
- `jsdom` ^25.0.0 - DOM simulation for tests

### Archived

- Original `main.js` moved to `.archive/main.js.old`

### Migration Guide

To update from v1.x to v2.0:

1. **Delete old main.js** - Now in `.archive/`
2. **Update imports** - Use new module paths:

    ```javascript
    // Old
    import kaplay from 'kaplay';
    // main.js had all code here

    // New
    import { Game } from './src/Game.js';
    const game = new Game();
    game.start();
    ```

3. **Install new dependencies**:
    ```bash
    npm install
    ```
4. **Run tests**:
    ```bash
    npm test
    ```
5. **Check linting**:
    ```bash
    npm run lint
    ```

### Performance

- No significant performance changes
- Build size: ~194KB (minified)
- Gzipped: ~71KB

### Testing

- 5 test suites
- 43 tests passing
- 0 tests failing
- Coverage: Full coverage of core modules

---

## [1.0.0] - Previous Version

### Initial Release

- Basic player movement
- Wall collision
- Sprite loading
- Camera following
- Monolithic code structure

---

## Future Releases

### [2.1.0] - Planned

- Gamepad support implementation
- Interactive props system
- Basic inventory

### [3.0.0] - Planned

- Shifter enemy AI
- Combat system
- Multiple levels
- Save/load system
