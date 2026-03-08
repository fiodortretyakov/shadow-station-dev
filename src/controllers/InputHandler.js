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
        this.setupGamepadControls();
    }

    /**
     * Setup keyboard input handlers
     */
    setupKeyboardControls() {
        const { k, player, speed } = this;

        // LEFT
        k.onKeyDown(['left', 'a'], () => {
            player.move(-speed, 0);
            player.setFlip(true);
            player.playAnimation(ANIMATIONS.walkRight);
        });

        // RIGHT
        k.onKeyDown(['right', 'd'], () => {
            player.move(speed, 0);
            player.setFlip(false);
            player.playAnimation(ANIMATIONS.walkRight);
        });

        // UP
        k.onKeyDown(['up', 'w'], () => {
            player.move(0, -speed);
            player.playAnimation(ANIMATIONS.walkUp);
        });

        // DOWN
        k.onKeyDown(['down', 's'], () => {
            player.move(0, speed);
            player.playAnimation(ANIMATIONS.walkDown);
        });

        // Interaction
        k.onKeyPress('e', () => {
            player.interact();
        });

        // Handle key release for idle animation
        k.onKeyRelease(['left', 'right', 'up', 'down', 'a', 's', 'd', 'w'], () => {
            if (
                !k.isKeyDown('left') &&
                !k.isKeyDown('right') &&
                !k.isKeyDown('up') &&
                !k.isKeyDown('down') &&
                !k.isKeyDown('a') &&
                !k.isKeyDown('s') &&
                !k.isKeyDown('d') &&
                !k.isKeyDown('w')
            ) {
                player.playAnimation(ANIMATIONS.idleDown);
            }
        });
    }

    /**
     * Setup gamepad controls
     */
    setupGamepadControls() {
        const { k, player, speed } = this;

        // Use onGamepadStick to handle movement
        k.onGamepadStick('left', (pos) => {
            if (pos.x !== 0 || pos.y !== 0) {
                player.move(pos.x * speed, pos.y * speed);

                // Handle animations based on dominant direction
                if (Math.abs(pos.x) > Math.abs(pos.y)) {
                    player.setFlip(pos.x < 0);
                    player.playAnimation(ANIMATIONS.walkRight);
                } else if (pos.y < 0) {
                    player.playAnimation(ANIMATIONS.walkUp);
                } else if (pos.y > 0) {
                    player.playAnimation(ANIMATIONS.walkDown);
                }
            }
        });

        // Handle stick release for idle animation
        k.onGamepadStick('left', (pos) => {
            if (pos.x === 0 && pos.y === 0) {
                // Only go to idle if no keyboard keys are down either
                if (
                    !k.isKeyDown('left') &&
                    !k.isKeyDown('right') &&
                    !k.isKeyDown('up') &&
                    !k.isKeyDown('down') &&
                    !k.isKeyDown('a') &&
                    !k.isKeyDown('s') &&
                    !k.isKeyDown('d') &&
                    !k.isKeyDown('w')
                ) {
                    player.playAnimation(ANIMATIONS.idleDown);
                }
            }
        });

        // Support D-pad as well
        k.onGamepadButtonDown('dpad-left', () => {
            player.move(-speed, 0);
            player.setFlip(true);
            player.playAnimation(ANIMATIONS.walkRight);
        });

        k.onGamepadButtonDown('dpad-right', () => {
            player.move(speed, 0);
            player.setFlip(false);
            player.playAnimation(ANIMATIONS.walkRight);
        });

        k.onGamepadButtonDown('dpad-up', () => {
            player.move(0, -speed);
            player.playAnimation(ANIMATIONS.walkUp);
        });

        k.onGamepadButtonDown('dpad-down', () => {
            player.move(0, speed);
            player.playAnimation(ANIMATIONS.walkDown);
        });

        k.onGamepadButtonRelease(['dpad-left', 'dpad-right', 'dpad-up', 'dpad-down'], () => {
            // Check if any movement input is still active
            const stick = k.getGamepadStick('left');
            if (
                stick.x === 0 &&
                stick.y === 0 &&
                !k.isKeyDown('left') &&
                !k.isKeyDown('right') &&
                !k.isKeyDown('up') &&
                !k.isKeyDown('down') &&
                !k.isKeyDown('a') &&
                !k.isKeyDown('s') &&
                !k.isKeyDown('d') &&
                !k.isKeyDown('w')
            ) {
                player.playAnimation(ANIMATIONS.idleDown);
            }
        });

        // Interaction button (X/Square)
        k.onGamepadButtonPress('west', () => {
            player.interact();
        });
    }
}
