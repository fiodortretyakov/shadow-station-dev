# Developer Guide

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   This will start Vite dev server with hot reload enabled.

3. **Run tests**
   ```bash
   npm test
   ```

---

## Code Architecture

### Game Initialization Flow

```
index.html
    └─> src/main.js (entry point)
        └─> Game class
            ├─> SpriteLoader (loads all sprites)
            ├─> GameMap (creates level)
            ├─> Player (creates player entity)
            └─> InputHandler (sets up controls)
```

### Adding a New Entity

1. Create a new class in `src/entities/`:
   ```javascript
   export class Enemy {
       constructor(k, position) {
           this.k = k;
           this.position = position;
           this.entity = null;
       }
       
       create() {
           this.entity = this.k.add([
               // Components...
           ]);
           return this.entity;
       }
   }
   ```

2. Add tests in `tests/entities/`:
   ```javascript
   import { describe, it, expect } from 'vitest';
   import { Enemy } from '../src/entities/Enemy.js';
   
   describe('Enemy', () => {
       it('should create enemy entity', () => {
           // Test implementation
       });
   });
   ```

3. Initialize in Game class:
   ```javascript
   this.enemy = new Enemy(this.k, { x: 100, y: 100 });
   this.enemy.create();
   ```

### Adding New Sprites

1. Add sprite path to `src/config/constants.js`:
   ```javascript
   export const SPRITE_PATHS = {
       // ... existing paths
       newSprite: "assets/new-sprite.png",
   };
   ```

2. Add loader method in `src/loaders/SpriteLoader.js`:
   ```javascript
   static loadNewSprite(k) {
       k.loadSprite("newSprite", SPRITE_PATHS.newSprite);
   }
   ```

3. Call in `loadAllSprites()`:
   ```javascript
   static loadAllSprites(k) {
       // ... existing loaders
       this.loadNewSprite(k);
   }
   ```

### Configuration Management

All configuration is centralized in `src/config/constants.js`:
- **GAME_CONFIG**: Rendering and engine settings
- **PLAYER_CONFIG**: Player behavior and appearance
- **TILE_CONFIG**: Map tile dimensions and scales
- **SPRITE_PATHS**: Asset file paths
- **ANIMATIONS**: Animation name constants

**Best Practice**: Never use magic numbers in your code. Always add them to constants.

---

## Testing

### Running Tests

```bash
# Watch mode (re-runs on file changes)
npm test

# Interactive UI
npm run test:ui

# Coverage report
npm run test:coverage
```

### Writing Tests

Use Vitest with mocking:

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';

const createMockKaplay = () => ({
    add: vi.fn(),
    sprite: vi.fn(),
    // ... other Kaplay methods
});

describe('MyClass', () => {
    let mockK;
    
    beforeEach(() => {
        mockK = createMockKaplay();
    });
    
    it('should do something', () => {
        // Test implementation
    });
});
```

### Test Coverage Goals

- Aim for >80% coverage
- 100% coverage for critical systems (Player, InputHandler)
- All public methods should have tests
- Edge cases and error conditions should be tested

---

## Code Quality

### ESLint

Configuration in `eslint.config.js`:
- ES2022 features enabled
- Enforces semicolons, single quotes
- 4-space indentation
- Trailing commas in multiline

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Prettier

Configuration in `.prettierrc`:
- Single quotes
- 4-space indentation
- 100 character line width
- LF line endings

```bash
# Format all code
npm run format
```

### Pre-commit Checklist

Before committing:
1. ✅ Run tests: `npm test`
2. ✅ Check linting: `npm run lint`
3. ✅ Format code: `npm run format`
4. ✅ Build succeeds: `npm run build`
5. ✅ Update documentation if needed

---

## Error Handling

### Using Custom Errors

```javascript
import { EntityCreationError, ErrorHandler } from './utils/ErrorHandler.js';

try {
    // Risky operation
} catch (error) {
    const gameError = new EntityCreationError('Player', error);
    ErrorHandler.handle(gameError, true); // Show to user
}
```

### Error Types

- **GameError**: Base class for all game errors
- **SpriteLoadError**: Sprite loading failures
- **EntityCreationError**: Entity creation failures
- **MapCreationError**: Map creation failures

---

## Common Tasks

### Adding a New Control

1. Add key mapping in `InputHandler.setupKeyboardControls()`:
   ```javascript
   k.onKeyDown("e", () => {
       // Interact action
   });
   ```

2. Add gamepad support in `InputHandler.setupGamepadControls()` (TODO)

### Creating a New Map

1. Define layout as string array:
   ```javascript
   const layout = [
       "wwwwww",
       "w    w",
       "w  . w",
       "wwwwww",
   ];
   ```

2. Add tile types to GameMap if needed:
   ```javascript
   tiles: {
       "w": () => [/* wall components */],
       ".": () => [/* floor components */],
       "d": () => [/* door components */],
   }
   ```

### Debugging

1. **Enable Eruda console**: Already included in `index.html` for mobile debugging
2. **Kaplay debug mode**: Add `debug: true` to `GAME_CONFIG`
3. **Browser DevTools**: Use F12 for console, network, and performance monitoring
4. **Vitest UI**: Run `npm run test:ui` for interactive test debugging

---

## Performance Optimization

### Best Practices

1. **Sprite Atlases**: Use atlases instead of individual images
2. **Object Pooling**: Reuse objects instead of creating/destroying
3. **Lazy Loading**: Load assets only when needed
4. **Minimize Draw Calls**: Batch similar objects together
5. **Profile Regularly**: Use browser DevTools performance tab

### Vite Production Build

```bash
npm run build
```

Optimizations included:
- Code minification
- Tree shaking
- Asset optimization
- Source maps for debugging

---

## Deployment

### Building for Production

```bash
# Create optimized build
npm run build

# Preview production build locally
npm run preview
```

Output will be in `dist/` directory.

### Hosting Options

- **GitHub Pages**: Static hosting
- **Netlify**: Automatic deployments
- **Vercel**: Optimized for web apps
- **itch.io**: Game distribution platform

---

## Troubleshooting

### Common Issues

**Problem**: Sprites not loading
- Check file paths in `constants.js`
- Verify assets exist in `assets/` directory
- Check browser console for 404 errors

**Problem**: Tests failing
- Ensure all dependencies installed: `npm install`
- Clear Vitest cache: `rm -rf node_modules/.vitest`
- Check for syntax errors: `npm run lint`

**Problem**: Build fails
- Check for TypeScript errors in console
- Verify all imports are correct
- Ensure no circular dependencies

**Problem**: Game not starting
- Check browser console for errors
- Verify Kaplay is loaded
- Check index.html points to correct entry file

---

## Resources

- [Kaplay Documentation](https://kaplayjs.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [ESLint Documentation](https://eslint.org/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## Getting Help

1. Check this guide and README
2. Review existing tests for examples
3. Search codebase for similar implementations
4. Check browser console for errors
5. Enable debug mode in game config
