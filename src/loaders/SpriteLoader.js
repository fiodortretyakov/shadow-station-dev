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
            "wall-plain": { x: 0, y: 0, width: 64, height: 64 },
            "wall-tech": { x: 64, y: 0, width: 64, height: 64 },
            "monitor-panel": { x: 128, y: 0, width: 64, height: 64 },
            "wall-vent": { x: 128, y: 128, width: 64, height: 64 },
            "space-void": { x: 192, y: 64, width: 64, height: 64 }
        });
    }

    /**
     * Load floor sprite
     * @param {Object} k - Kaplay instance
     */
    static loadFloor(k) {
        k.loadSpriteAtlas(SPRITE_PATHS.floor, {
            "floor-solid": { x: 64, y: 64, width: 64, height: 64 },
            "floor-pattern": { x: 0, y: 64, width: 64, height: 64 }
        });
    }

    /**
     * Load character sprite with animations
     * @param {Object} k - Kaplay instance
     */
    static loadCharacter(k) {
        k.loadSprite("morgan", SPRITE_PATHS.character, {
            sliceX: 4,
            sliceY: 5,
            anims: {
                "idle-down": 1,
                "walk-down": { from: 0, to: 3, loop: true },
                "walk-left": { from: 4, to: 7, loop: true },
                "walk-right": { from: 8, to: 11, loop: true },
                "walk-up": { from: 12, to: 15, loop: true },
            }
        });
    }

    /**
     * Load prop sprites from atlas
     * @param {Object} k - Kaplay instance
     */
    static loadProps(k) {
        k.loadSpriteAtlas(SPRITE_PATHS.atlas, {
            "door-locked": { x: 0, y: 192, width: 64, height: 64 },
            "door-open": { x: 64, y: 192, width: 64, height: 64 },
            "hazard-strip": { x: 192, y: 128, width: 64, height: 16 },
        });
    }
}
