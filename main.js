import kaplay from "kaplay";

kaplay({
    pixelDensity: 2,
    texFilter: "nearest", // Ensures 16x16 stays crisp when scaled to 64x64
});

// 1. Load your 16x16 sheet
loadSprite("apartment", "assets/your-16x16-sheet.png", {
    // If your sheet is 128x128 pixels, sliceX and sliceY would be 8
    sliceX: 8, 
    sliceY: 8,
});

const map = addLevel([
    "wwwwwwww",
    "w  b   w",
    "wwwwwwww",
], {
    // 2. Tile size remains 64x64 for your level grid
    tileWidth: 64, 
    tileHeight: 64,
    tiles: {
        "w": () => [
            sprite("apartment", { frame: 5 }), 
            scale(4), // 16px * 4 = 64px
            area(), 
            body({ isStatic: true })
        ],
        "b": () => [
            sprite("apartment", { frame: 18 }), 
            scale(4), // 16px * 4 = 64px
            area(), 
            body({ isStatic: true })
        ],
    }
});