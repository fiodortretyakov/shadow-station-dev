import { SPRITE_PATHS } from '../config/constants.js';

export class SpriteLoader {
    static loadAllSprites(k) {
        this.loadTiles(k);
        this.loadProps(k);
        this.loadCharacter(k);
    }

    static loadTiles(k) {
        // tiles.png – 5×5 grid of 64×64
        k.loadSpriteAtlas(SPRITE_PATHS.tiles, {
            'floor-plain':   { x: 0,   y: 0,   width: 64, height: 64 },
            'floor-panel':   { x: 64,  y: 0,   width: 64, height: 64 },
            'floor-edge':    { x: 128, y: 0,   width: 64, height: 64 },
            'wall-plain':    { x: 0,   y: 64,  width: 64, height: 64 },
            'wall-tech':     { x: 64,  y: 64,  width: 64, height: 64 },
            'wall-vent':     { x: 128, y: 64,  width: 64, height: 64 },
            'wall-corner':   { x: 192, y: 64,  width: 64, height: 64 },
            'wall-top':      { x: 256, y: 64,  width: 64, height: 64 },
            'window':        { x: 0,   y: 128, width: 64, height: 64 },
            'door-closed':   { x: 64,  y: 128, width: 64, height: 64 },
            'door-open':     { x: 128, y: 128, width: 64, height: 64 },
            'space-void':    { x: 0,   y: 192, width: 64, height: 64 },
            'ceiling-edge':  { x: 64,  y: 192, width: 64, height: 64 },
        });
    }

    static loadProps(k) {
        // props.png – 4×3 grid of 64×64
        k.loadSpriteAtlas(SPRITE_PATHS.props, {
            'desk':       { x: 0,   y: 0,  width: 64, height: 64 },
            'computer':   { x: 64,  y: 0,  width: 64, height: 64 },
            'bed':        { x: 128, y: 0,  width: 64, height: 64 },
            'bookshelf':  { x: 192, y: 0,  width: 64, height: 64 },
            'chair':      { x: 0,   y: 64, width: 64, height: 64 },
            'mug':        { x: 64,  y: 64, width: 64, height: 64 },
            'lamp':       { x: 128, y: 64, width: 64, height: 64 },
            'locker':     { x: 192, y: 64, width: 64, height: 64 },
        });
    }

    static loadCharacter(k) {
        k.loadSprite('morgan', SPRITE_PATHS.character, {
            sliceX: 4,
            sliceY: 5,
            anims: {
                'idle-down':  { from: 16, to: 16, loop: false },
                'walk-down':  { from: 0,  to: 3,  loop: true, speed: 8 },
                'walk-left':  { from: 4,  to: 7,  loop: true, speed: 8 },
                'walk-right': { from: 8,  to: 11, loop: true, speed: 8 },
                'walk-up':    { from: 12, to: 15, loop: true, speed: 8 },
            },
        });
    }
}
