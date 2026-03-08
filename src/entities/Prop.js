import { TILE_CONFIG } from '../config/constants.js';

/**
 * Interactive environment object class
 */
export class Prop {
    /**
     * @param {Object} k - Kaplay instance
     * @param {string} type - Prop type (e.g., 'chair', 'mug')
     * @param {Object} position - Initial position {x, y}
     * @param {Object} options - Additional options
     */
    constructor(k, type, position, options = {}) {
        this.k = k;
        this.type = type;
        this.position = position;
        this.options = options;
        this.entity = null;
        this.isHeld = false;
    }

    /**
     * Create the prop entity in the game
     * @returns {Object} The prop game object
     */
    create() {
        const { k, type, position } = this;

        this.entity = k.add([
            k.sprite(type),
            k.pos(k.vec2(position.x, position.y)),
            k.area(),
            k.body({ isStatic: false }),
            k.scale(TILE_CONFIG.wallScale),
            k.anchor('center'),
            'prop',
            {
                type: type,
                isPickable: this.options.pickable !== false,
                isSearchable: this.options.searchable || false,
                propRef: this,
            },
        ]);

        return this.entity;
    }

    /**
     * Interact with the prop
     * @param {Player} player - The player interacting with the prop
     */
    interact(player) {
        if (this.isHeld) {
            this.throw(player);
        } else if (this.options.pickable !== false) {
            this.pickUp(player);
        } else if (this.options.searchable) {
            this.search();
        }
    }

    /**
     * Pick up the prop
     * @param {Player} player - The player picking up the prop
     */
    pickUp(player) {
        if (player.heldObject) return;

        this.isHeld = true;
        player.heldObject = this;
        this.entity.unuse('body'); // Disable physics while held

        // Follow player
        this.entity.onUpdate(() => {
            if (this.isHeld) {
                const pPos = player.getPosition();
                if (pPos) {
                    this.entity.pos = pPos.add(this.k.vec2(0, -20));
                }
            }
        });
    }

    /**
     * Throw the prop
     * @param {Player} player - The player throwing the prop
     */
    throw(player) {
        this.isHeld = false;
        player.heldObject = null;
        this.entity.use(this.k.body({ isStatic: false }));

        // Add some velocity in player's direction
        // (Assuming we can determine direction from player)
        this.entity.jump(200);
    }

    /**
     * Search the prop
     */
    search() {
        console.log(`Searching ${this.type}...`);
        // TODO: Implement inventory/search logic
    }
}
