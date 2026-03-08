/**
 * Morgan Yu sprite sheet – smooth Canvas 2D art, 128×128 per frame.
 * 4 cols × 5 rows → 512×640 total PNG.
 *
 * Row 0  walk-down  (front)
 * Row 1  walk-left
 * Row 2  walk-right
 * Row 3  walk-up    (back)
 * Row 4  idle-down
 */

import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync } from 'node:fs';

const FW = 128, FH = 128, COLS = 4, ROWS = 5;
const canvas = createCanvas(FW * COLS, FH * ROWS);
const g = canvas.getContext('2d');

// ── helpers ───────────────────────────────────────────────────────────────────
function frame(col, row, fn) {
    g.save();
    g.translate(col * FW, row * FH);
    g.clearRect(0, 0, FW, FH);
    fn();
    g.restore();
}

function shadow(blur, color, fn) {
    g.save();
    g.shadowBlur = blur;
    g.shadowColor = color;
    fn();
    g.restore();
}

// ── Palette ───────────────────────────────────────────────────────────────────
const P = {
    skin:    '#DDB387',
    skinD:   '#C4946A',
    skinH:   '#F0C9A0',
    hair:    '#5C3210',
    hairH:   '#7A4820',
    hairL:   '#3A1E08',
    suit:    '#1E6890',
    suitD:   '#144D6E',
    suitH:   '#2D8AB8',
    suitA:   '#41B8D8',   // accent / highlight stripe
    grey:    '#4E5462',
    greyH:   '#6B7280',
    pant:    '#1C3054',
    pantD:   '#111E38',
    boot:    '#232332',
    bootH:   '#3A3A52',
    eye:     '#2D68CC',
    pupil:   '#0A0A10',
    brow:    '#3E1E08',
    lip:     '#C07060',
    pack:    '#363C4A',
    packH:   '#4A5266',
    gold:    '#D4A820',
    white:   '#FFFFFF',
    shadow:  'rgba(0,0,20,0.35)',
};

// Gradient helpers
function vGrad(x, y, h, top, bot) {
    const gr = g.createLinearGradient(x, y, x, y + h);
    gr.addColorStop(0, top); gr.addColorStop(1, bot);
    return gr;
}
function hGrad(x, y, w, left, right) {
    const gr = g.createLinearGradient(x, y, x + w, y);
    gr.addColorStop(0, left); gr.addColorStop(1, right);
    return gr;
}

// ── Body parts ────────────────────────────────────────────────────────────────

/** Draw full character shadow on the floor */
function drawGroundShadow(cx, gy) {
    g.save();
    g.fillStyle = 'rgba(0,0,30,0.22)';
    g.beginPath();
    g.ellipse(cx, gy, 18, 6, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
}

// ─── HEAD (front) ─────────────────────────────────────────────────────────────
function headFront(cx, cy) {
    // Hair back
    g.fillStyle = P.hairL;
    g.beginPath();
    g.ellipse(cx, cy - 6, 17, 19, 0, 0, Math.PI * 2);
    g.fill();

    // Face
    const facGr = vGrad(cx - 14, cy - 16, 32, P.skinH, P.skinD);
    g.fillStyle = facGr;
    g.beginPath();
    g.ellipse(cx, cy, 13, 15, 0, 0, Math.PI * 2);
    g.fill();

    // Hair front overlay (top half)
    const hairGr = vGrad(cx - 17, cy - 24, 22, P.hairH, P.hair);
    g.fillStyle = hairGr;
    g.beginPath();
    g.moveTo(cx - 17, cy - 6);
    g.bezierCurveTo(cx - 17, cy - 28, cx + 17, cy - 28, cx + 17, cy - 6);
    g.bezierCurveTo(cx + 14, cy - 12, cx - 14, cy - 12, cx - 17, cy - 6);
    g.fill();

    // Hair highlight
    g.fillStyle = P.hairH;
    g.beginPath();
    g.ellipse(cx - 3, cy - 20, 5, 3, -0.4, 0, Math.PI * 2);
    g.fill();

    // Side hair strands
    g.fillStyle = P.hair;
    g.beginPath();
    g.moveTo(cx - 14, cy - 8); g.bezierCurveTo(cx - 18, cy - 4, cx - 18, cy + 6, cx - 14, cy + 8);
    g.lineTo(cx - 12, cy + 6); g.bezierCurveTo(cx - 15, cy + 2, cx - 15, cy - 4, cx - 12, cy - 6);
    g.fill();
    g.beginPath();
    g.moveTo(cx + 14, cy - 8); g.bezierCurveTo(cx + 18, cy - 4, cx + 18, cy + 6, cx + 14, cy + 8);
    g.lineTo(cx + 12, cy + 6); g.bezierCurveTo(cx + 15, cy + 2, cx + 15, cy - 4, cx + 12, cy - 6);
    g.fill();

    // Ears
    g.fillStyle = P.skinD;
    g.beginPath(); g.ellipse(cx - 14, cy + 1, 3, 5, 0.2, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(cx + 14, cy + 1, 3, 5, -0.2, 0, Math.PI * 2); g.fill();

    // Eyebrows
    g.strokeStyle = P.brow; g.lineWidth = 3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - 9, cy - 5); g.quadraticCurveTo(cx - 5, cy - 8, cx - 1, cy - 6); g.stroke();
    g.beginPath(); g.moveTo(cx + 9, cy - 5); g.quadraticCurveTo(cx + 5, cy - 8, cx + 1, cy - 6); g.stroke();

    // Eyes white
    g.fillStyle = P.white;
    g.beginPath(); g.ellipse(cx - 5, cy - 1, 5, 4, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(cx + 5, cy - 1, 5, 4, 0, 0, Math.PI * 2); g.fill();

    // Iris
    g.fillStyle = P.eye;
    g.beginPath(); g.ellipse(cx - 5, cy - 1, 3.5, 3.5, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(cx + 5, cy - 1, 3.5, 3.5, 0, 0, Math.PI * 2); g.fill();

    // Pupil
    g.fillStyle = P.pupil;
    g.beginPath(); g.ellipse(cx - 5, cy - 1, 1.8, 1.8, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(cx + 5, cy - 1, 1.8, 1.8, 0, 0, Math.PI * 2); g.fill();

    // Eye shine
    g.fillStyle = 'rgba(255,255,255,0.8)';
    g.beginPath(); g.ellipse(cx - 6.2, cy - 2.5, 1.2, 1, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(cx + 3.8, cy - 2.5, 1.2, 1, 0, 0, Math.PI * 2); g.fill();

    // Eyelid line
    g.strokeStyle = P.skinD; g.lineWidth = 1.2;
    g.beginPath(); g.moveTo(cx - 10, cy - 1); g.quadraticCurveTo(cx - 5, cy - 5, cx, cy - 1); g.stroke();
    g.beginPath(); g.moveTo(cx, cy - 1); g.quadraticCurveTo(cx + 5, cy - 5, cx + 10, cy - 1); g.stroke();

    // Nose
    g.strokeStyle = P.skinD; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(cx - 2, cy + 2); g.lineTo(cx, cy + 6); g.lineTo(cx + 2, cy + 2); g.stroke();

    // Mouth
    g.strokeStyle = P.lip; g.lineWidth = 2.5; g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - 5, cy + 9); g.quadraticCurveTo(cx, cy + 12, cx + 5, cy + 9); g.stroke();
    g.strokeStyle = P.skinD; g.lineWidth = 1;
    g.beginPath(); g.moveTo(cx - 4, cy + 9); g.lineTo(cx + 4, cy + 9); g.stroke();
}

// ─── HEAD (back) ──────────────────────────────────────────────────────────────
function headBack(cx, cy) {
    // Hair fill
    const hGr = vGrad(cx - 17, cy - 24, 38, P.hairH, P.hairL);
    g.fillStyle = hGr;
    g.beginPath();
    g.ellipse(cx, cy, 15, 18, 0, 0, Math.PI * 2);
    g.fill();

    // Hair volume / strand lines
    g.strokeStyle = P.hairL; g.lineWidth = 2;
    for (let i = -2; i <= 2; i++) {
        g.beginPath();
        g.moveTo(cx + i * 4, cy - 18);
        g.bezierCurveTo(cx + i * 5, cy - 6, cx + i * 5, cy + 6, cx + i * 4, cy + 14);
        g.stroke();
    }

    // Hair highlight
    g.fillStyle = P.hairH;
    g.beginPath(); g.ellipse(cx - 4, cy - 14, 6, 3, -0.3, 0, Math.PI * 2); g.fill();

    // Neck skin
    g.fillStyle = P.skinD;
    g.beginPath();
    g.roundRect(cx - 5, cy + 14, 10, 8, 3);
    g.fill();
}

// ─── HEAD (left profile) ──────────────────────────────────────────────────────
function headLeft(cx, cy) {
    // Back of head / hair
    const hGr = hGrad(cx - 4, cy, 22, P.hairH, P.hairL);
    g.fillStyle = hGr;
    g.beginPath();
    g.moveTo(cx - 2, cy - 18);
    g.bezierCurveTo(cx + 20, cy - 18, cx + 22, cy, cx + 18, cy + 16);
    g.lineTo(cx, cy + 16);
    g.bezierCurveTo(cx - 4, cy + 6, cx - 4, cy - 8, cx - 2, cy - 18);
    g.fill();

    // Face (profile facing left)
    const fGr = hGrad(cx - 14, cy, 18, P.skinH, P.skinD);
    g.fillStyle = fGr;
    g.beginPath();
    g.moveTo(cx, cy - 14);
    g.bezierCurveTo(cx - 6, cy - 16, cx - 15, cy - 10, cx - 14, cy);
    g.bezierCurveTo(cx - 14, cy + 8, cx - 8, cy + 16, cx, cy + 16);
    g.bezierCurveTo(cx + 4, cy + 16, cx + 4, cy - 14, cx, cy - 14);
    g.fill();

    // Nose (profile bump)
    g.fillStyle = P.skin;
    g.beginPath();
    g.moveTo(cx - 14, cy - 2);
    g.bezierCurveTo(cx - 18, cy, cx - 18, cy + 5, cx - 14, cy + 6);
    g.lineTo(cx - 13, cy + 4);
    g.bezierCurveTo(cx - 16, cy + 3, cx - 16, cy, cx - 13, cy);
    g.fill();

    // Hair overlap on face
    const hFaceGr = hGrad(cx - 2, cy, 10, P.hair, 'rgba(92,50,16,0)');
    g.fillStyle = hFaceGr;
    g.beginPath();
    g.moveTo(cx, cy - 14);
    g.bezierCurveTo(cx + 4, cy - 16, cx + 4, cy + 14, cx, cy + 16);
    g.lineTo(cx + 2, cy + 16); g.lineTo(cx + 2, cy - 14);
    g.fill();

    // Ear
    g.fillStyle = P.skinD;
    g.beginPath(); g.ellipse(cx + 2, cy + 2, 3, 5, 0.1, 0, Math.PI * 2); g.fill();

    // Eyebrow
    g.strokeStyle = P.brow; g.lineWidth = 2.5; g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - 11, cy - 6); g.quadraticCurveTo(cx - 6, cy - 10, cx - 1, cy - 8); g.stroke();

    // Eye
    g.fillStyle = P.white;
    g.beginPath(); g.ellipse(cx - 7, cy - 2, 5, 3.5, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = P.eye;
    g.beginPath(); g.ellipse(cx - 8, cy - 2, 3, 3, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = P.pupil;
    g.beginPath(); g.ellipse(cx - 8.5, cy - 2, 1.5, 1.5, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.8)';
    g.beginPath(); g.ellipse(cx - 9.5, cy - 3, 1, 0.8, 0, 0, Math.PI * 2); g.fill();

    // Mouth
    g.strokeStyle = P.lip; g.lineWidth = 2; g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - 12, cy + 9); g.quadraticCurveTo(cx - 9, cy + 12, cx - 5, cy + 10); g.stroke();
}

// ─── HEAD (right profile) ─────────────────────────────────────────────────────
function headRight(cx, cy) {
    // Mirror left via transform
    g.save();
    g.translate(cx * 2, 0); g.scale(-1, 1);
    headLeft(cx, cy);
    g.restore();
}

// ─── NECK ─────────────────────────────────────────────────────────────────────
function neck(cx, ny, sideways = false) {
    g.fillStyle = vGrad(cx - 5, ny, 12, P.skin, P.skinD);
    g.beginPath();
    if (sideways) {
        g.roundRect(cx - 3, ny, 8, 10, 3);
    } else {
        g.roundRect(cx - 5, ny, 10, 12, 4);
    }
    g.fill();
}

// ─── TORSO (front) ────────────────────────────────────────────────────────────
function torsoFront(cx, ty, armLY, armRY) {
    const tw = 44, th = 42;
    const tx = cx - tw / 2;

    // Main suit body
    const bodyGr = hGrad(tx, ty, tw, P.suitH, P.suitD);
    g.fillStyle = bodyGr;
    g.beginPath();
    g.moveTo(tx + 4, ty);
    g.lineTo(tx + tw - 4, ty);
    g.bezierCurveTo(tx + tw + 4, ty, tx + tw + 6, ty + th, tx + tw, ty + th);
    g.lineTo(tx, ty + th);
    g.bezierCurveTo(tx - 6, ty + th, tx - 4, ty, tx + 4, ty);
    g.fill();

    // Highlight stripe left side
    g.fillStyle = P.suitH;
    g.beginPath(); g.roundRect(tx + 3, ty + 2, 6, th - 4, 3); g.fill();

    // Centre accent stripe
    g.fillStyle = P.suitA;
    g.beginPath(); g.roundRect(cx - 2, ty + 4, 4, th - 8, 2); g.fill();

    // Chest panel / logo
    g.fillStyle = P.suitD;
    g.beginPath(); g.roundRect(cx - 10, ty + 6, 20, 14, 4); g.fill();
    g.fillStyle = P.gold;
    g.font = 'bold 10px sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('TI', cx, ty + 13);   // TranStar Industries logo

    // Belt
    const beltGr = hGrad(tx, ty + th, tw, P.greyH, P.grey);
    g.fillStyle = beltGr;
    g.beginPath(); g.roundRect(tx, ty + th, tw, 8, 2); g.fill();
    g.fillStyle = P.gold;
    g.beginPath(); g.roundRect(cx - 5, ty + th + 1, 10, 6, 2); g.fill(); // buckle

    // Shoulder pads
    g.fillStyle = P.suitD;
    g.beginPath(); g.roundRect(tx - 6, ty - 2, 14, 10, 4); g.fill();
    g.beginPath(); g.roundRect(tx + tw - 8, ty - 2, 14, 10, 4); g.fill();
    g.fillStyle = P.suitA;
    g.beginPath(); g.roundRect(tx - 5, ty - 1, 4, 4, 2); g.fill();
    g.beginPath(); g.roundRect(tx + tw + 1, ty - 1, 4, 4, 2); g.fill();

    // Collar
    g.fillStyle = P.suitD;
    g.beginPath(); g.roundRect(cx - 9, ty - 5, 18, 8, 4); g.fill();

    // LEFT ARM
    drawArm(tx - 14, ty + armLY, 12, 36, false);

    // RIGHT ARM
    drawArm(tx + tw + 2, ty + armRY, 12, 36, true);
}

function drawArm(ax, ay, aw, ah, right) {
    const gr = hGrad(ax, ay, aw, right ? P.suitH : P.suitD, right ? P.suitD : P.suitH);
    g.fillStyle = gr;
    g.beginPath();
    g.roundRect(ax, ay, aw, ah - 8, 5);
    g.fill();
    // Cuff
    g.fillStyle = P.grey;
    g.beginPath(); g.roundRect(ax, ay + ah - 10, aw, 5, 2); g.fill();
    // Hand
    g.fillStyle = P.skin;
    g.beginPath(); g.ellipse(ax + aw / 2, ay + ah, aw / 2 - 1, 7, 0, 0, Math.PI * 2); g.fill();
}

// ─── TORSO (back) ─────────────────────────────────────────────────────────────
function torsoBack(cx, ty, armLY, armRY) {
    const tw = 44, th = 42;
    const tx = cx - tw / 2;

    const bodyGr = hGrad(tx, ty, tw, P.suitD, P.suitH);
    g.fillStyle = bodyGr;
    g.beginPath();
    g.moveTo(tx + 4, ty);
    g.lineTo(tx + tw - 4, ty);
    g.bezierCurveTo(tx + tw + 4, ty, tx + tw + 6, ty + th, tx + tw, ty + th);
    g.lineTo(tx, ty + th);
    g.bezierCurveTo(tx - 6, ty + th, tx - 4, ty, tx + 4, ty);
    g.fill();

    // Backpack
    const packGr = vGrad(cx - 14, ty + 4, 30, P.packH, P.pack);
    g.fillStyle = packGr;
    g.beginPath(); g.roundRect(cx - 14, ty + 4, 28, 30, 5); g.fill();
    g.fillStyle = P.packH;
    g.beginPath(); g.roundRect(cx - 12, ty + 6, 24, 8, 3); g.fill(); // top pocket
    // Pack clips
    g.fillStyle = P.gold;
    g.beginPath(); g.roundRect(cx - 14, ty + 8, 5, 8, 2); g.fill();
    g.beginPath(); g.roundRect(cx + 9, ty + 8, 5, 8, 2); g.fill();
    // Accent stripe
    g.fillStyle = P.suitA;
    g.beginPath(); g.roundRect(cx - 2, ty + 4, 4, 30, 2); g.fill();

    // Belt
    const beltGr = hGrad(tx, ty + th, tw, P.grey, P.greyH);
    g.fillStyle = beltGr;
    g.beginPath(); g.roundRect(tx, ty + th, tw, 8, 2); g.fill();

    // Shoulder pads
    g.fillStyle = P.suitD;
    g.beginPath(); g.roundRect(tx - 6, ty - 2, 14, 10, 4); g.fill();
    g.beginPath(); g.roundRect(tx + tw - 8, ty - 2, 14, 10, 4); g.fill();

    g.fillStyle = P.suitD;
    g.beginPath(); g.roundRect(cx - 9, ty - 5, 18, 8, 4); g.fill();

    drawArm(tx - 14, ty + armLY, 12, 36, true);
    drawArm(tx + tw + 2, ty + armRY, 12, 36, false);
}

// ─── TORSO (side) ─────────────────────────────────────────────────────────────
function torsoSide(cx, ty, facingRight, frontArmY) {
    const tw = 22, th = 42;
    const tx = facingRight ? cx - 4 : cx - tw + 4;

    const bodyGr = hGrad(tx, ty, tw,
        facingRight ? P.suitH : P.suitD,
        facingRight ? P.suitD : P.suitH);
    g.fillStyle = bodyGr;
    g.beginPath(); g.roundRect(tx, ty, tw, th, 5); g.fill();

    // Accent stripe
    g.fillStyle = P.suitA;
    g.beginPath(); g.roundRect(facingRight ? tx + 9 : tx + 2, ty + 4, 4, th - 8, 2); g.fill();

    // Chest detail
    g.fillStyle = P.suitD;
    g.beginPath(); g.roundRect(facingRight ? tx + 2 : tx + 4, ty + 6, 12, 10, 3); g.fill();
    g.fillStyle = P.gold;
    g.beginPath(); g.roundRect(facingRight ? tx + 4 : tx + 6, ty + 9, 6, 4, 1); g.fill();

    // Belt
    g.fillStyle = P.grey;
    g.beginPath(); g.roundRect(tx, ty + th, tw, 8, 2); g.fill();

    // Backpack (on the non-facing side)
    const bpX = facingRight ? tx - 10 : tx + tw - 2;
    g.fillStyle = P.pack;
    g.beginPath(); g.roundRect(bpX, ty + 4, 12, 28, 4); g.fill();
    g.fillStyle = P.packH;
    g.beginPath(); g.roundRect(bpX + 1, ty + 6, 10, 6, 2); g.fill();
    g.fillStyle = P.gold;
    g.beginPath(); g.roundRect(bpX + 1, ty + 10, 4, 5, 1); g.fill();

    // Shoulder
    const spX = facingRight ? tx + tw - 6 : tx - 8;
    g.fillStyle = P.suitD;
    g.beginPath(); g.roundRect(spX, ty - 2, 14, 10, 4); g.fill();

    // Collar
    g.fillStyle = P.suitD;
    g.beginPath(); g.roundRect(facingRight ? tx + 2 : tx - 6, ty - 5, 16, 8, 4); g.fill();

    // FRONT ARM
    const fax = facingRight ? tx + tw + 1 : tx - 13;
    drawArm(fax, ty + frontArmY, 12, 36, facingRight);

    // BACK ARM (tucked, darker)
    const bax = facingRight ? tx - 8 : tx + tw - 4;
    g.fillStyle = P.suitD;
    g.beginPath(); g.roundRect(bax, ty + 4, 8, 28, 4); g.fill();
    g.fillStyle = P.skin;
    g.beginPath(); g.ellipse(bax + 4, ty + 36, 5, 6, 0, 0, Math.PI * 2); g.fill();
}

// ─── LEGS (front/back view) ───────────────────────────────────────────────────
function legsFront(cx, ly, phase) {
    // phase: 0=neutral 1=L-fwd 2=neutral 3=R-fwd
    const offsets = [
        [0, 0], [-5, 4], [0, 0], [4, -5]
    ];
    const [lo, ro] = offsets[phase];

    function oneLeg(lx, yOff, highlight) {
        const pantGr = hGrad(lx, ly + yOff, 18, highlight ? P.pant : P.pantD, highlight ? P.pantD : P.pant);
        g.fillStyle = pantGr;
        g.beginPath(); g.roundRect(lx, ly + yOff, 18, 30, 4); g.fill();
        // Knee highlight
        g.fillStyle = 'rgba(255,255,255,0.08)';
        g.beginPath(); g.ellipse(lx + 9, ly + yOff + 14, 6, 4, 0, 0, Math.PI * 2); g.fill();
        // Boot
        const bootGr = hGrad(lx - 2, ly + yOff + 30, 22, P.bootH, P.boot);
        g.fillStyle = bootGr;
        g.beginPath(); g.roundRect(lx - 2, ly + yOff + 28, 22, 10, 3); g.fill();
        g.fillStyle = P.bootH;
        g.beginPath(); g.roundRect(lx - 1, ly + yOff + 29, 20, 4, 2); g.fill();
        // Boot toe
        g.fillStyle = P.grey;
        g.beginPath(); g.roundRect(lx - 2, ly + yOff + 35, 6, 3, 2); g.fill();
    }

    oneLeg(cx - 22, lo, true);
    oneLeg(cx + 4,  ro, false);
}

// ─── LEGS (side view) ─────────────────────────────────────────────────────────
function legsSide(cx, ly, phase, facingRight) {
    const offsets = [
        [0, 0], [-5, 4], [0, 0], [4, -5]
    ];
    const [fo, bo] = offsets[phase];
    const lx = cx - 9;

    function oneLeg(yOff, front) {
        const gr = hGrad(lx, ly + yOff, 18,
            front ? P.pant : P.pantD,
            front ? P.pantD : P.pant);
        g.fillStyle = gr;
        g.beginPath(); g.roundRect(lx, ly + yOff, 18, 30, 4); g.fill();
        // Boot
        const bx = facingRight ? lx - 1 : lx - 1;
        const bootGr = hGrad(bx, ly + yOff + 28, 22, front ? P.bootH : P.boot, front ? P.boot : P.bootH);
        g.fillStyle = bootGr;
        g.beginPath(); g.roundRect(bx, ly + yOff + 28, 22, 10, 3); g.fill();
        g.fillStyle = P.bootH;
        g.beginPath(); g.roundRect(bx + 1, ly + yOff + 29, 20, 4, 2); g.fill();
        const toeX = facingRight ? bx + 16 : bx;
        g.fillStyle = P.grey;
        g.beginPath(); g.roundRect(toeX, ly + yOff + 35, 6, 3, 2); g.fill();
    }

    // Back leg first
    oneLeg(bo, false);
    // Front leg on top
    oneLeg(fo, true);
}

// ── ARM SWING per frame ───────────────────────────────────────────────────────
const ARM = [
    { l:  0, r:  0 },
    { l:  8, r: -6 },
    { l:  0, r:  0 },
    { l: -6, r:  8 },
];

// ── Layout ────────────────────────────────────────────────────────────────────
const CX    = 64;
const HEAD_Y = 10;
const NECK_Y = 44;
const TORSO_Y = 54;
const LEG_Y   = 100;
const SHADOW_Y = 126;

// ── Row 0: walk-down ──────────────────────────────────────────────────────────
for (let f = 0; f < 4; f++) {
    frame(f, 0, () => {
        drawGroundShadow(CX, SHADOW_Y);
        legsFront(CX, LEG_Y, f);
        torsoFront(CX, TORSO_Y, ARM[f].l, ARM[f].r);
        neck(CX, NECK_Y);
        headFront(CX, HEAD_Y + 14);
    });
}

// ── Row 1: walk-left ──────────────────────────────────────────────────────────
for (let f = 0; f < 4; f++) {
    frame(f, 1, () => {
        drawGroundShadow(CX, SHADOW_Y);
        legsSide(CX, LEG_Y, f, false);
        torsoSide(CX, TORSO_Y, false, ARM[f].r);
        neck(CX - 4, NECK_Y, true);
        headLeft(CX + 2, HEAD_Y + 14);
    });
}

// ── Row 2: walk-right ─────────────────────────────────────────────────────────
for (let f = 0; f < 4; f++) {
    frame(f, 2, () => {
        drawGroundShadow(CX, SHADOW_Y);
        legsSide(CX, LEG_Y, f, true);
        torsoSide(CX, TORSO_Y, true, ARM[f].l);
        neck(CX, NECK_Y, true);
        headRight(CX - 2, HEAD_Y + 14);
    });
}

// ── Row 3: walk-up ────────────────────────────────────────────────────────────
for (let f = 0; f < 4; f++) {
    frame(f, 3, () => {
        drawGroundShadow(CX, SHADOW_Y);
        legsFront(CX, LEG_Y, f);
        torsoBack(CX, TORSO_Y, ARM[f].l, ARM[f].r);
        neck(CX, NECK_Y);
        headBack(CX, HEAD_Y + 14);
    });
}

// ── Row 4: idle-down (copy frame 0, col 0) ────────────────────────────────────
for (let f = 0; f < 4; f++) {
    frame(f, 4, () => {
        // copy from row 0, col 0
        const src = canvas.getContext('2d');
        g.drawImage(canvas, 0, 0, FW, FH, 0, 0, FW, FH);
    });
}

// ── Save ──────────────────────────────────────────────────────────────────────
const out = canvas.toBuffer('image/png');
writeFileSync('assets/morgan_sprite.png', out);
console.log(`✓ assets/morgan_sprite.png  (${canvas.width}×${canvas.height})`);
