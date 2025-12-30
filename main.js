import kaplay from "kaplay";

kaplay({
    crisp: true,
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
    "##########",
    "#........#",
    "#..c.....#", // Glass on the right
    "#........#",
    "##########",
], {
    tileWidth: 64,
    tileHeight: 64,
    tiles: {
        "#": () => [sprite("walls", { frame: 2 }), scale(4), area(), body({ isStatic: true })],
        ".": () => [sprite("floor", { frame: 3 }), scale(4)],
        "g": () => [sprite("walls", { frame: 10 }), scale(4), opacity(0.3), area(), body({ isStatic: true })],
        "c": () => [sprite("walls", { frame: 12 }), scale(4), area(), body({ isStatic: true })],
    }
});

const player = add([
    sprite("morgan", { anim: "idle-down" }),
    pos(vec2(3 * 64, 3 * 64)),
    area({ shape: new Rect(vec2(0), 12, 12) }),
    z(10), // This ensures he is ABOVE the floor
    body(),
    scale(4),
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