import { SPRITE_PATHS } from '../config/constants.js';

/**
 * Handles loading and management of all game sprites
 */
export class SpriteLoader {
    /**
     * Load all game sprites
     * @param {Object} k - Kaplay instance
     */
    static loadAllSprites(k) {
        this.loadWalls(k);
        this.loadFloor(k);
        this.loadCharacter(k);
        this.loadProps(k);
    }

    /**
     * Load wall sprites from atlas
     * @param {Object} k - Kaplay instance
     */
    static loadWalls(k) {
        k.loadSpriteAtlas(SPRITE_PATHS.walls, {
            "wall0": {
                x: 16,    
                y: 16,    
                width: 48, 
                height: 32
            },
            "glass-panel": {
                x: 64,    
                y: 16,    
                width: 32, 
                height: 32
            }
        });
    }

    /**
     * Load floor sprite
     * @param {Object} k - Kaplay instance
     */
    static loadFloor(k) {
        k.loadSprite("floor", SPRITE_PATHS.floor, {
            sliceX: 3,
            sliceY: 2,
        });
    }

    /**
     * Load character sprite with animations
     * @param {Object} k - Kaplay instance
     */
    static loadCharacter(k) {
        k.loadSprite("morgan", SPRITE_PATHS.character, {
            sliceX: 12,
            sliceY: 8,
            anims: {
                "idle-down": 48,
                "walk-down": { from: 48, to: 50, loop: true },
                "walk-left": { from: 60, to: 62, loop: true },
                "walk-right": { from: 72, to: 74, loop: true },
                "walk-up": { from: 84, to: 86, loop: true },
            }
        });
    }

    /**
     * Load prop sprites from atlas
     * @param {Object} k - Kaplay instance
     */
    static loadProps(k) {
        k.loadSpriteAtlas(SPRITE_PATHS.atlas, {
            "bed": { x: 160, y: 736, width: 32, height: 48 },
            "desk": { x: 208, y: 288, width: 48, height: 32 },
            "pc": { x: 400, y: 16, width: 16, height: 16 },
            "chair": { x: 208, y: 336, width: 16, height: 16 },
            "bookshelf": { x: 160, y: 528, width: 32, height: 48 }
        });
    }
}
