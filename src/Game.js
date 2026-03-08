import kaplay from 'kaplay';
import { GAME_CONFIG } from './config/constants.js';
import { SpriteLoader } from './loaders/SpriteLoader.js';
import { GameMap } from './world/GameMap.js';
import { Player } from './entities/Player.js';
import { InputHandler } from './controllers/InputHandler.js';
import { SoundLoader } from './loaders/SoundLoader.js';
import { LightingSystem } from './world/LightingSystem.js';

/**
 * Main game class that orchestrates all game systems
 */
export class Game {
    constructor() {
        this.k = null;
        this.player = null;
        this.map = null;
        this.inputHandler = null;
        this.lighting = null;
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

        this.k.loadShader('chroma', null, `
            vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
                vec4 c = texture2D(tex, uv);
                float dist = distance(c.rgb, vec3(1.0));
                if (dist < 0.3) {
                    discard;
                }
                return c * color;
            }
        `);

        this.k.setGravity(0);

        // Load all sprites and sounds
        SpriteLoader.loadAllSprites(this.k);
        SoundLoader.loadAllSounds(this.k);

        // Start background music
        SoundLoader.playMusic(this.k);

        // Create the map
        const mapLayout = [
            'wwwwwwwwww',
            'w........w',
            'w........w',
            'w........w',
            'w........w',
            'w........w',
            'w........w',
            'w........w',
            'w........w',
            'wwwwwwwwww',
        ];
        try {
            this.map = new GameMap(this.k, mapLayout);
            this.map.create();

            // Create the player
            this.player = new Player(this.k, { x: 320, y: 320 });
            this.player.create();
        } catch (error) {
            console.error('Initialization error:', error);
        }

        // Setup input handling
        this.inputHandler = new InputHandler(this.k, this.player);
        this.inputHandler.setupControls();

        // Setup dynamic lighting
        this.lighting = new LightingSystem(this.k);
        this.lighting.init();

        // Feed player position + facing angle to lighting every frame
        this.k.onUpdate(() => {
            if (this.player?.entity) {
                this.lighting.updatePlayerPos(this.player.entity.pos);
                this.lighting.setFacing(this.player.facingAngle);
            }
        });
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
