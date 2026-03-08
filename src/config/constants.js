/**
 * Game configuration constants
 */

export const GAME_CONFIG = {
    crisp: true,
    pixelDensity: 2,
    pixelate: true,
    texFilter: 'nearest',
    debug: false,
};

export const PLAYER_CONFIG = {
    speed: 256,
    scale: 0.8,
    zIndex: 10,
    collisionBox: {
        offsetX: 2,
        offsetY: 10,
        width: 12,
        height: 6,
    },
};

export const TILE_CONFIG = {
    width: 64,
    height: 64,
    wallScale: 1,
    glassScale: 1,
    floorScale: 1,
};

export const SPRITE_PATHS = {
    walls: 'assets/Gemini_Generated_Image_3f987a3f987a3f98.png',
    floor: 'assets/Gemini_Generated_Image_c5hlgmc5hlgmc5hl.png',
    character: 'assets/Gemini_Generated_Image_oe0aakoe0aakoe0a.png',
    atlas: 'assets/Gemini_Generated_Image_3f987a3f987a3f98.png',
};

export const SOUND_PATHS = {
    music: 'assets/60.8s Recording (Dec 28 @ 7_05 PM) (Cover).mp3',
    musicAlt: 'assets/60.8s Recording (Dec 28 @ 7_05 PM) (Cover) 1.mp3',
};

export const ANIMATIONS = {
    idleDown: 'idle-down',
    walkDown: 'walk-down',
    walkLeft: 'walk-left',
    walkRight: 'walk-right',
    walkUp: 'walk-up',
};
