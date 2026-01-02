import kaplay from "kaplay";
import { GAME_CONFIG } from './config/constants.js';
import { SpriteLoader } from './loaders/SpriteLoader.js';
import { GameMap } from './world/GameMap.js';
import { Player } from './entities/Player.js';
import { InputHandler } from './controllers/InputHandler.js';

/**
 * Main game class that orchestrates all game systems
 */
export class Game {
    constructor() {
        this.k = null;
        this.player = null;
        this.map = null;
        this.inputHandler = null;
    }

    /**
     * Initialize the game
     */
    init() {
        // Initialize Kaplay
        this.k = kaplay(GAME_CONFIG);

        // Load all sprites
        SpriteLoader.loadAllSprites(this.k);

        // Create the map
        const mapLayout = [
            "wwwwww",
            "w    ",
            "w    w",
            "wwwwww",
        ];
        this.map = new GameMap(this.k, mapLayout);
        this.map.create();

        // Create the player
        this.player = new Player(this.k, { x: 192, y: 192 });
        this.player.create();

        // Setup input handling
        this.inputHandler = new InputHandler(this.k, this.player);
        this.inputHandler.setupControls();
    }

    /**
     * Start the game
     */
    start() {
        this.init();
        // Game loop is handled by Kaplay
    }

    /**
     * Get Kaplay instance (useful for testing)
     * @returns {Object} Kaplay instance
     */
    getKaplayInstance() {
        return this.k;
    }
}
