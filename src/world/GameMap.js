import { TILE_CONFIG } from '../config/constants.js';
import { Prop } from '../entities/Prop.js';

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

        console.log('Creating map with layout rows:', layout.length);
        console.log('Map layout first row:', layout[0]);
        console.log('Tile config:', config);

        this.map = k.addLevel(layout, {
            tileWidth: config.width,
            tileHeight: config.height,
            tiles: {
                w: () => [
                    k.sprite('wall-plain'),
                    k.scale(config.wallScale),
                    k.area(),
                    k.body({ isStatic: true }),
                    k.shader('chroma'),
                ],
                t: () => [
                    k.sprite('wall-tech'),
                    k.scale(config.wallScale),
                    k.area(),
                    k.body({ isStatic: true }),
                    k.shader('chroma'),
                ],
                m: () => [
                    k.sprite('monitor-panel'),
                    k.scale(config.wallScale),
                    k.area(),
                    k.body({ isStatic: true }),
                    k.shader('chroma'),
                ],
                v: () => [
                    k.sprite('wall-vent'),
                    k.scale(config.wallScale),
                    k.area(),
                    k.body({ isStatic: true }),
                    k.shader('chroma'),
                ],
                d: () => [
                    k.sprite('door-locked'),
                    k.scale(config.wallScale),
                    k.area(),
                    k.body({ isStatic: true }),
                    k.shader('chroma'),
                ],
                h: () => [k.sprite('hazard-strip'), k.scale(config.wallScale)],
                '.': () => [
                    k.rect(config.width, config.height),
                    k.color(30, 30, 40),
                ],
                p: () => [
                    k.rect(config.width, config.height),
                    k.color(40, 40, 50),
                ],
                ' ': () => [
                    k.rect(config.width, config.height),
                    k.color(0, 0, 0),
                ],
                C: (pos) => {
                    const prop = new Prop(k, 'chair', pos, { pickable: true });
                    prop.create();
                    return [];
                },
                M: (pos) => {
                    const prop = new Prop(k, 'mug', pos, { pickable: true });
                    prop.create();
                    return [];
                },
            },
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
