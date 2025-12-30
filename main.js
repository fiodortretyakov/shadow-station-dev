import kaplay from "kaplay";

kaplay({
    pixelDensity: 2,
    texFilter: "nearest", // Ensures 16x16 stays crisp when scaled to 64x64
});

loadSprite("walls", "assets/Walls.png", {
    sliceX: 3, // 3 columns
    sliceY: 5, // 5 rows
});

loadSprite("floor", "assets/Floor.png", {
    sliceX: 3, // 3 columns
    sliceY: 2, // 2 rows
});

const map = addLevel([
    "wwwwwwww",
    " fffff ",
    "        ",
], {
    // 2. Tile size remains 64x64 for your level grid
    tileWidth: 64, 
    tileHeight: 64,
    tiles: {
    "w": () => [
            sprite("walls", { frame: 0 }), // Wall 1!
            scale(4),
            area(),
            body({ isStatic: true })
        ],
    "f": () => [
            sprite("floor", { frame: 3 }), // Floor 4!
            scale(4),
            // No area() or body() so player can walk on it
        ],
    }
});