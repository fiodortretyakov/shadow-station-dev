import kaplay from "kaplay";
import { GAME_CONFIG } from './config/constants.js';
import { SpriteLoader } from './loaders/SpriteLoader.js';
import { GameMap } from './world/GameMap.js';
import { Player } from './entities/Player.js';
import { InputHandler } from './controllers/InputHandler.js';
import { SoundLoader } from './loaders/SoundLoader.js';

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
        this.k = kaplay({
            ...GAME_CONFIG,
            background: [10, 10, 20],
        });

        // Load all sprites and sounds
        SpriteLoader.loadAllSprites(this.k);
        SoundLoader.loadAllSounds(this.k);

        // Start background music
        SoundLoader.playMusic(this.k);

        // Create the map
        const mapLayout = [
            "                    ",
            "  wwwwwwwwwwwwwwww  ",
            "  w..............w  ",
            "  w..m.v..m.v....w  ",
            "  w..............w  ",
            "  t...h...h...h..t  ",
            "  w..............w  ",
            "  w..............w  ",
            "  w..m.v..m.v....w  ",
            "  w..............w  ",
            "  t...h...h...h..t  ",
            "  w..............w  ",
            "  w..............w  ",
            "  w.......d......w  ",
            "  wwwwwwwwwwwwwwww  ",
            "                    ",
        ];
        this.map = new GameMap(this.k, mapLayout);
        this.map.create();

        // Create the player
        this.player = new Player(this.k, { x: 400, y: 400 });
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
