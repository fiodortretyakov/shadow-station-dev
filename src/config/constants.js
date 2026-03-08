/**
 * Game configuration constants
 */

export const GAME_CONFIG = {
    debug: false,
};

export const PLAYER_CONFIG = {
    speed: 256,
    scale: 0.48,
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
    tiles: 'assets/tiles.png',
    props: 'assets/props.png',
    character: 'assets/morgan_sprite.png',
};

export const SOUND_PATHS = {
    music: 'assets/60.8s Recording (Dec 28 @ 7_05 PM) (Cover).mp3',
};

export const ANIMATIONS = {
    idleDown: 'idle-down',
    walkDown: 'walk-down',
    walkLeft: 'walk-left',
    walkRight: 'walk-right',
    walkUp: 'walk-up',
};
