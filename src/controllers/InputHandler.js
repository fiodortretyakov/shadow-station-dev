import { PLAYER_CONFIG, ANIMATIONS } from '../config/constants.js';

/**
 * Handles all player input (keyboard and gamepad)
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
        this.setupInteractionControls();
        this.setupMovementUpdate();
    }

    /**
     * Setup interaction-only handlers (keyboard + gamepad)
     */
    setupInteractionControls() {
        const { k, player } = this;

        k.onKeyPress('e', () => {
            player.interact();
        });

        k.onGamepadButtonPress('west', () => {
            player.interact();
        });
    }

    /**
     * Unified movement + animation update running every frame.
     * Fixes:
     *   - Animation stuck when switching direction while holding keys
     *   - Diagonal animation conflict (two handlers racing each frame)
     *   - Diagonal movement being faster than cardinal movement
     */
    setupMovementUpdate() {
        const { k, player, speed } = this;

        k.onUpdate(() => {
            const left  = k.isKeyDown('left')  || k.isKeyDown('a') || k.isGamepadButtonDown('dpad-left');
            const right = k.isKeyDown('right') || k.isKeyDown('d') || k.isGamepadButtonDown('dpad-right');
            const up    = k.isKeyDown('up')    || k.isKeyDown('w') || k.isGamepadButtonDown('dpad-up');
            const down  = k.isKeyDown('down')  || k.isKeyDown('s') || k.isGamepadButtonDown('dpad-down');

            const stick = k.getGamepadStick('left');

            let dx = (right ? 1 : 0) - (left ? 1 : 0) + stick.x;
            let dy = (down  ? 1 : 0) - (up   ? 1 : 0) + stick.y;

            // Normalize diagonal so speed stays consistent in all directions
            if (dx !== 0 && dy !== 0) {
                dx *= Math.SQRT1_2;
                dy *= Math.SQRT1_2;
            }

            if (dx !== 0 || dy !== 0) {
                player.move(dx * speed, dy * speed);

                // Update facing angle for lighting flashlight direction
                player.facingAngle = Math.atan2(dy, dx);

                // Horizontal takes priority; fall back to vertical
                if (Math.abs(dx) >= Math.abs(dy)) {
                    player.setFlip(false);
                    if (dx < 0) {
                        player.playAnimation(ANIMATIONS.walkLeft);
                    } else {
                        player.playAnimation(ANIMATIONS.walkRight);
                    }
                } else if (dy < 0) {
                    player.playAnimation(ANIMATIONS.walkUp);
                } else {
                    player.playAnimation(ANIMATIONS.walkDown);
                }
            } else {
                player.playAnimation(ANIMATIONS.idleDown);
            }
        });
    }
}
