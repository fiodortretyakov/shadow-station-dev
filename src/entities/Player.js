import { PLAYER_CONFIG, ANIMATIONS } from '../config/constants.js';

/**
 * Player entity class
 */
export class Player {
    /**
     * @param {Object} k - Kaplay instance
     * @param {Object} position - Initial position {x, y}
     */
    constructor(k, position = { x: 192, y: 192 }) {
        this.k = k;
        this.position = position;
        this.entity = null;
        this.heldObject = null;
    }

    /**
     * Create the player entity in the game
     * @returns {Object} The player game object
     */
    create() {
        const { k, position } = this;
        const config = PLAYER_CONFIG;

        this.entity = k.add([
            k.sprite('morgan', { anim: ANIMATIONS.idleDown }),
            k.pos(k.vec2(position.x, position.y)),
            k.shader('chroma'),
            k.area({
                shape: new k.Rect(k.vec2(-6, 20), 12, 6),
            }),
            k.z(config.zIndex),
            k.body(),
            k.scale(config.scale),
            k.anchor('center'),
            'player',
        ]);

        this.setupCamera();
        return this.entity;
    }

    /**
     * Setup camera to follow player
     */
    setupCamera() {
        this.k.camPos(this.entity.pos);
        this.entity.onUpdate(() => {
            this.k.camPos(this.entity.pos);
        });
    }

    /**
     * Move player in a direction
     * @param {number} dx - X direction
     * @param {number} dy - Y direction
     */
    move(dx, dy) {
        if (!this.entity) return;
        this.entity.move(dx, dy);
    }

    /**
     * Play animation
     * @param {string} animName - Animation name
     */
    playAnimation(animName) {
        if (!this.entity) return;
        if (this.entity.curAnim() !== animName) {
            this.entity.play(animName);
        }
    }

    /**
     * Set flip state
     * @param {boolean} flip - Whether to flip horizontally
     */
    setFlip(flip) {
        if (!this.entity) return;
        this.entity.flipX = flip;
    }

    /**
     * Get current animation name
     * @returns {string} Current animation
     */
    getCurrentAnimation() {
        return this.entity ? this.entity.curAnim() : null;
    }

    /**
     * Get player position
     * @returns {Object} Position vector
     */
    getPosition() {
        return this.entity ? this.entity.pos : null;
    }

    /**
     * Interact with nearby objects or held object
     */
    interact() {
        if (this.heldObject) {
            this.heldObject.interact(this);
            return;
        }

        const { k, entity } = this;
        // Find all props in range
        const props = k.get('prop');
        let closestProp = null;
        let minDistance = 50; // Interaction range

        props.forEach((prop) => {
            const dist = entity.pos.dist(prop.pos);
            if (dist < minDistance) {
                minDistance = dist;
                closestProp = prop;
            }
        });

        if (closestProp && closestProp.propRef) {
            closestProp.propRef.interact(this);
        }
    }
}
