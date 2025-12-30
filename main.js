import kaplay from "kaplay";

kaplay({
    crisp: true,
    pixelDensity: 2,
    pixelate: true,
    texFilter: "nearest", // Ensures 16x16 stays crisp when scaled to 64x64
});

loadSpriteAtlas("assets/Walls.png", {
    "wall0": {
        x: 16,    
        y: 16,    
        width: 32, 
        height: 32
    },
    "glass-panel": {
        x: 64,    
        y: 16,    
        width: 32, 
        height: 32
    }
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

loadSpriteAtlas("assets/atlas_16x.png", {
    "bed": { x: 160, y: 736, width: 32, height: 48 },      // Blue bed at the bottom
    "desk": { x: 208, y: 288, width: 48, height: 32 },     // Large wooden desk
    "pc": { x: 400, y: 16, width: 16, height: 16 },        // Computer monitor
    "chair": { x: 208, y: 336, width: 16, height: 16 },    // Desk chair
    "bookshelf": { x: 160, y: 528, width: 32, height: 48 } // Large shelf
});

// Define your level layout
const map = addLevel([
    "wwwwww",
    "w    w",
    "w    w",
    "wwwwww",
], {
    tileWidth: 64,
    tileHeight: 64,
    tiles: {
        "w": () => [
            sprite("wall0"), // Use the name from atlas
            scale(2), // Adjust scale based on your atlas tile size
            area(),
            body({ isStatic: true })
        ],
        "g": () => [
            sprite("glass-panel"), 
            scale(2),
            area(),
            body({ isStatic: true }),
            opacity(0.5)
        ],
        ".": () => [
            sprite("floor", { frame: 4 }), // You can still mix methods!
            scale(2)
        ],
    }
});

const player = add([
    sprite("morgan", { anim: "idle-down" }),
    pos(vec2(3 * 64, 3 * 64)),
    area({ shape: new Rect(vec2(2, 10), 12, 6) }),
    z(10), // This ensures he is ABOVE the floor
    body(),
    scale(3),
    anchor("center"),
    "player",
]);

player.onUpdate(() => {
    setCamPos(player.pos); // Follow Morgan as he moves
});

const SPEED = 300;

// LEFT
onKeyDown("left", () => {
    player.move(-SPEED, 0);
    player.flipX = true; // Mirrored the right-facing sprite
    if (player.curAnim() !== "walk-right") {
        player.play("walk-right"); // Uses the same frames as right
    }
});

// RIGHT
onKeyDown("right", () => {
    player.move(SPEED, 0);
    player.flipX = false;
    if (player.curAnim() !== "walk-right") {
        player.play("walk-right");
    }
});

// UP
onKeyDown("up", () => {
    player.move(0, -SPEED);
    if (player.curAnim() !== "walk-up") {
        player.play("walk-up");
    }
});

// DOWN
onKeyDown("down", () => {
    player.move(0, SPEED);
    if (player.curAnim() !== "walk-down") {
        player.play("walk-down");
    }
});

// This triggers whenever ANY of these keys are released
onKeyRelease(["left", "right", "up", "down"], () => {
    // Check if NO movement keys are currently held down
    if (
        !isKeyDown("left") && 
        !isKeyDown("right") && 
        !isKeyDown("up") && 
        !isKeyDown("down")
    ) {
        player.play("idle-down"); // Resets to the front-facing idle frame
    }
});