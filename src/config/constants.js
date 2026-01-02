/**
 * Game configuration constants
 */

export const GAME_CONFIG = {
    crisp: true,
    pixelDensity: 2,
    pixelate: true,
    texFilter: "nearest",
};

export const PLAYER_CONFIG = {
    speed: 256,
    scale: 3,
    zIndex: 10,
    collisionBox: {
        offsetX: 2,
        offsetY: 10,
        width: 12,
        height: 6,
    },
};

export const TILE_CONFIG = {
    width: 128,
    height: 96,
    wallScale: 3,
    glassScale: 2,
    floorScale: 2,
};

export const SPRITE_PATHS = {
    walls: "assets/Walls.png",
    floor: "assets/Floor.png",
    character: "assets/character_9-16.png",
    atlas: "assets/atlas_16x.png",
};

export const ANIMATIONS = {
    idleDown: "idle-down",
    walkDown: "walk-down",
    walkLeft: "walk-left",
    walkRight: "walk-right",
    walkUp: "walk-up",
};
