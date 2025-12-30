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

// Define your level layout
const level = addLevel([
    " "
], {
    tileWidth: 64,
    tileHeight: 64,
    tiles: {
        "w": () => [sprite("walls", { frame: 0 }), scale(4.01), area(), body({ isStatic: true }), "wall"],
        " ": () => [sprite("floor", { frame: 3 }), scale(4.01), "floor"],
        "g": () => [sprite("walls", { frame: 1 }), scale(4.01), area(), body({ isStatic: true }), "glass"],
    }
});

const player = add([
    sprite("morgan", { anim: "idle-down" }),
    pos(vec2(2 * 64, 2 * 64)),
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