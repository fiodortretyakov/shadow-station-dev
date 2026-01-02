import { PLAYER_CONFIG, ANIMATIONS } from '../config/constants.js';

/**
 * Handles all player input (keyboard and potentially gamepad)
 */
export class InputHandler {
    /**
     * @param {Object} k - Kaplay instance
     * @param {Player} player - Player instance
     */
    constructor(k, player) {
        this.k = k;
        this.player = player;
        this.speed = PLAYER_CONFIG.speed;
    }

    /**
     * Setup all input handlers
     */
    setupControls() {
        this.setupKeyboardControls();
    }

    /**
     * Setup keyboard input handlers
     */
    setupKeyboardControls() {
        const { k, player, speed } = this;

        // LEFT
        k.onKeyDown("left", () => {
            player.move(-speed, 0);
            player.setFlip(true);
            player.playAnimation(ANIMATIONS.walkRight);
        });

        // RIGHT
        k.onKeyDown("right", () => {
            player.move(speed, 0);
            player.setFlip(false);
            player.playAnimation(ANIMATIONS.walkRight);
        });

        // UP
        k.onKeyDown("up", () => {
            player.move(0, -speed);
            player.playAnimation(ANIMATIONS.walkUp);
        });

        // DOWN
        k.onKeyDown("down", () => {
            player.move(0, speed);
            player.playAnimation(ANIMATIONS.walkDown);
        });

        // Handle key release for idle animation
        k.onKeyRelease(["left", "right", "up", "down"], () => {
            if (
                !k.isKeyDown("left") && 
                !k.isKeyDown("right") && 
                !k.isKeyDown("up") && 
                !k.isKeyDown("down")
            ) {
                player.playAnimation(ANIMATIONS.idleDown);
            }
        });
    }

    /**
     * Setup gamepad controls (future implementation)
     */
    setupGamepadControls() {
        // TODO: Implement gamepad support
        // This will be needed for the twin-stick feel mentioned in README
    }
}
