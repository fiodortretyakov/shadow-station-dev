import { TILE_CONFIG } from '../config/constants.js';

/**
 * Manages the game level/map
 */
export class GameMap {
    /**
     * @param {Object} k - Kaplay instance
     * @param {Array<string>} layout - Map layout as array of strings
     */
    constructor(k, layout) {
        this.k = k;
        this.layout = layout;
        this.map = null;
    }

    /**
     * Create the map in the game
     * @returns {Object} The level object
     */
    create() {
        const { k, layout } = this;
        const config = TILE_CONFIG;

        this.map = k.addLevel(layout, {
            tileWidth: config.width,
            tileHeight: config.height,
            tiles: {
                "w": () => [
                    k.sprite("wall0"),
                    k.scale(config.wallScale),
                    k.area(),
                    k.body({ isStatic: true })
                ],
                "g": () => [
                    k.sprite("glass-panel"), 
                    k.scale(config.glassScale),
                    k.area(),
                    k.body({ isStatic: true }),
                    k.opacity(0.5)
                ],
                ".": () => [
                    k.sprite("floor", { frame: 4 }),
                    k.scale(config.floorScale)
                ],
            }
        });

        return this.map;
    }

    /**
     * Get tile at specific position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Object|null} Tile object or null
     */
    getTileAt(x, y) {
        // Implementation depends on Kaplay's level API
        return this.map ? this.map.getTileAt(x, y) : null;
    }
}
