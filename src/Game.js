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

        // Morgan Yu's apartment – Talos I, Transtar Executive Suites
        // 16 wide × 13 tall, each tile = 64×64 px
        const mapLayout = [
            'wwtWwwWwwwwwWtww',  // north wall: tech panels + windows
            'w..............w',
            'wBB..........SSw',  // bed (NW) + bookshelf (NE)
            'wBB..........SSw',
            'w..............w',
            'w....ppppp.....w',  // decorative floor panel
            'w....DDDDD.C...w',  // desk + chair
            'w....DDDDD.C...w',
            'w....X..M......w',  // computer terminal + mug
            'w..............w',
            'wLL............w',  // lockers (SW)
            'w..............w',
            'wwwwwwdwwwwwwww',  // south wall with door
        ];
        try {
            this.map = new GameMap(this.k, mapLayout);
            this.map.create();

            // Player starts roughly in the centre of the room
            this.player = new Player(this.k, { x: 512, y: 448 });
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

        // Room ceiling lights (world-space positions matching the map layout, tile=64)
        const T = 64;
        // Overhead light – centre of bed area (col 2.5, row 2.5)
        this.lighting.addPointLight(2.5*T, 2.5*T, 260, 1.0, 0.95, 0.82);
        // Overhead light – desk / workstation area (col 6.5, row 6.5)
        this.lighting.addPointLight(6.5*T, 6.5*T, 300, 1.0, 0.92, 0.75);
        // Overhead light – bookshelf corner (col 12.5, row 2.5)
        this.lighting.addPointLight(12.5*T, 2.5*T, 240, 1.0, 0.95, 0.82);
        // Overhead light – centre of room (col 7.5, row 4)
        this.lighting.addPointLight(7.5*T, 4*T, 320, 0.95, 0.92, 1.0);
        // Locker area light (col 2, row 10)
        this.lighting.addPointLight(2*T, 10*T, 200, 1.0, 0.90, 0.70);

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
