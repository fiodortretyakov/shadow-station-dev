import kaplay from "kaplay";

kaplay({
    pixelDensity: 2,
    texFilter: "nearest", // Ensures 16x16 stays crisp when scaled to 64x64
    letterbox: true,      // Keeps the 16:9 aspect ratio clean
});

loadSprite("walls", "assets/Walls.png", {
    sliceX: 3, // 3 columns
    sliceY: 5, // 5 rows
});

loadSprite("floor", "assets/Floor.png", {
    sliceX: 3, // 3 columns
    sliceY: 2, // 2 rows
});

loadSprite("morgan", "assets/character_9-16.png", {
    sliceX: 12,
    sliceY: 8,
    anims: {
        // Character 12 starts at Row 4 (0-indexed)
        "idle-down": 48,
        "walk-down": { from: 48, to: 50, loop: true },
        "walk-left": { from: 60, to: 62, loop: true },
        "walk-right": { from: 72, to: 74, loop: true },
        "walk-up": { from: 84, to: 86, loop: true },
    }
});

// Define your level layout
const map = addLevel([
    "gg", // g = simulation glass
], {
    tileWidth: 64,
    tileHeight: 64,
    tiles: {
        "w": () => [sprite("walls", { frame: 0 }), scale(4), area(), body({ isStatic: true }), "wall"],
        " ": () => [sprite("floor", { frame: 3 }), scale(4), "floor"],
        "g": () => [sprite("walls", { frame: 1 }), scale(4), area(), body({ isStatic: true }), "glass"],
    }
});

const player = add([
    sprite("morgan", { anim: "idle-down" }),
    pos(level.getPos(2, 2)), // Spawns him at tile coordinates (2,2)
    area(),
    body(),
    scale(4),
    anchor("bot"), // Keeps his feet on the floor
    "player",
]);

// At the bottom of main.js
function setupControls(p) {
    onKeyDown("left", () => p.move(-300, 0));
    onKeyDown("right", () => p.move(300, 0));
    onKeyPress("space", () => {
        // Logic for swinging the Wrench
        debug.log("Wrench swing!");
    });
}

// Inside your scene
scene("apartment", () => {
    setupControls(player); // One clean line to include all inputs
});