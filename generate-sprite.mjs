/**
 * Morgan Yu – high-quality sprite sheet, 128×128 per frame, 4×5 = 512×640
 * Row 0  walk-down   Row 1  walk-left   Row 2  walk-right
 * Row 3  walk-up     Row 4  idle-down
 */
import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync } from 'node:fs';

const FW = 128, FH = 128, COLS = 4, ROWS = 5;
const canvas = createCanvas(FW * COLS, FH * ROWS);
const g = canvas.getContext('2d');
g.imageSmoothingEnabled = true;

// ── Frame helper ──────────────────────────────────────────────────────────────
function frame(col, row, fn) {
    g.save();
    g.translate(col * FW, row * FH);
    g.clearRect(0, 0, FW, FH);
    fn();
    g.restore();
}

// ── Gradient factories ────────────────────────────────────────────────────────
const vg = (x,y,h,...s) => { const gr=g.createLinearGradient(x,y,x,y+h); s.forEach(([t,c])=>gr.addColorStop(t,c)); return gr; };
const hg = (x,y,w,...s) => { const gr=g.createLinearGradient(x,y,x+w,y); s.forEach(([t,c])=>gr.addColorStop(t,c)); return gr; };
const rg = (x,y,r,...s) => { const gr=g.createRadialGradient(x,y,0,x,y,r); s.forEach(([t,c])=>gr.addColorStop(t,c)); return gr; };

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
    skinLight: '#F2C89A', skin: '#E8B882', skinMid: '#D4A06A', skinDark: '#B8845A', skinShadow: '#9A6840',
    hairBase: '#2C1A08', hairMid: '#3D2510', hairLight: '#5A3818', hairSheen: '#7A5030',
    suit1: '#1A5F8A', suit2: '#145070', suit3: '#0D3D58', suitLight: '#2A80B0', suitSheen: '#3DA0D0',
    suitAccent: '#48C8E8', suitAccent2: '#38A8C8',
    grey1: '#3A3E50', grey2: '#2E3244', grey3: '#242838',
    pantDark: '#142240', pant: '#1A2E58', pantLight: '#243870',
    bootBase: '#181820', bootMid: '#242432', bootLight: '#343448',
    eyeIris: '#2A6ADB', eyeDark: '#1A4A9A', eyeLight: '#5A9AFF', pupil: '#0A0A14', eyeWhite: '#F4F4F8',
    brow: '#1E0E04', lip: '#C06858', lipLight: '#D88070', lipDark: '#A05040',
    gold: '#C8981A', goldLight: '#F0C040', goldDark: '#A07810',
    packBase: '#2A2E3C', packMid: '#343848', packLight: '#444858',
    white: '#FFFFFF', black: '#000000',
    shadowDrop: 'rgba(0,0,20,0.30)',
    // Helmet
    helmShell: '#C8D4E8', helmLight: '#E8F0FF', helmShadow: '#7888A0', helmDark: '#505870',
    neckRing: '#2E3648',
};

// ── Ground shadow ─────────────────────────────────────────────────────────────
function groundShadow(cx, y) {
    g.fillStyle = rg(cx,y,22, [0,'rgba(0,0,20,0.28)'],[1,'rgba(0,0,0,0)']);
    g.beginPath(); g.ellipse(cx, y, 22, 7, 0, 0, Math.PI*2); g.fill();
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEAD – FRONT
// ═══════════════════════════════════════════════════════════════════════════════
function headFront(cx, cy) {
    // ── Hair back layer ───────────────────────────────────────────────────────
    g.fillStyle = C.hairBase;
    g.beginPath();
    g.moveTo(cx-17, cy-2);
    g.bezierCurveTo(cx-18, cy-22, cx-10, cy-28, cx, cy-28);
    g.bezierCurveTo(cx+10, cy-28, cx+18, cy-22, cx+17, cy-2);
    g.bezierCurveTo(cx+14, cy+4, cx-14, cy+4, cx-17, cy-2);
    g.fill();

    // ── Face oval ─────────────────────────────────────────────────────────────
    const faceGr = vg(cx-13, cy-18, 36, [0,C.skinLight],[0.4,C.skin],[1,C.skinMid]);
    g.fillStyle = faceGr;
    g.beginPath();
    g.moveTo(cx-12, cy-18);
    g.bezierCurveTo(cx-16, cy-16, cx-16, cy+12, cx-10, cy+16);
    g.bezierCurveTo(cx-4, cy+20, cx+4, cy+20, cx+10, cy+16);
    g.bezierCurveTo(cx+16, cy+12, cx+16, cy-16, cx+12, cy-18);
    g.bezierCurveTo(cx+6, cy-22, cx-6, cy-22, cx-12, cy-18);
    g.fill();

    // ── Hair front ────────────────────────────────────────────────────────────
    const hairGr = vg(cx-18, cy-28, 26, [0,C.hairLight],[0.5,C.hairBase],[1,C.hairBase]);
    g.fillStyle = hairGr;
    g.beginPath();
    g.moveTo(cx-17, cy-2);
    g.bezierCurveTo(cx-18, cy-20, cx-12, cy-28, cx, cy-28);
    g.bezierCurveTo(cx+12, cy-28, cx+18, cy-20, cx+17, cy-2);
    g.bezierCurveTo(cx+16, cy-10, cx+14, cy-14, cx+10, cy-18);
    g.bezierCurveTo(cx+4, cy-22, cx, cy-22, cx, cy-22);
    g.bezierCurveTo(cx, cy-22, cx-4, cy-22, cx-10, cy-18);
    g.bezierCurveTo(cx-14, cy-14, cx-16, cy-10, cx-17, cy-2);
    g.fill();

    // ── Eyes ──────────────────────────────────────────────────────────────────
    g.fillStyle = C.eyeWhite;
    g.beginPath(); g.ellipse(cx-6, cy-4, 5.5, 4, 0, 0, Math.PI*2); g.fill();
    g.beginPath(); g.ellipse(cx+6, cy-4, 5.5, 4, 0, 0, Math.PI*2); g.fill();
    const eyeGrL = rg(cx-6, cy-4, 4, [0,C.eyeLight],[0.5,C.eyeIris],[1,C.eyeDark]);
    const eyeGrR = rg(cx+6, cy-4, 4, [0,C.eyeLight],[0.5,C.eyeIris],[1,C.eyeDark]);
    g.fillStyle = eyeGrL; g.beginPath(); g.ellipse(cx-6, cy-4, 4, 4, 0, 0, Math.PI*2); g.fill();
    g.fillStyle = eyeGrR; g.beginPath(); g.ellipse(cx+6, cy-4, 4, 4, 0, 0, Math.PI*2); g.fill();
    g.fillStyle = C.pupil;
    g.beginPath(); g.ellipse(cx-6, cy-4, 2, 2, 0, 0, Math.PI*2); g.fill();
    g.beginPath(); g.ellipse(cx+6, cy-4, 2, 2, 0, 0, Math.PI*2); g.fill();
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEAD – BACK
// ═══════════════════════════════════════════════════════════════════════════════
function headBack(cx, cy) {
    // Hair
    const hGr = vg(cx-17, cy-28, 50, [0,C.hairLight],[0.3,C.hairMid],[1,C.hairBase]);
    g.fillStyle = hGr;
    g.beginPath();
    g.moveTo(cx-17, cy-2);
    g.bezierCurveTo(cx-18, cy-22, cx-10, cy-28, cx, cy-28);
    g.bezierCurveTo(cx+10, cy-28, cx+18, cy-22, cx+17, cy-2);
    g.bezierCurveTo(cx+14, cy+10, cx-14, cy+10, cx-17, cy-2);
    g.fill();
    // Neck
    g.fillStyle = vg(cx-5, cy+10, 12, [0,C.skinMid],[1,C.skinDark]);
    g.beginPath(); g.roundRect(cx-5, cy+10, 10, 12, 3); g.fill();
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEAD – LEFT PROFILE
// ═══════════════════════════════════════════════════════════════════════════════
function headLeft(cx, cy) {
    // Back of head
    const hGr = hg(cx-2, cy, 22, [0,C.hairLight],[1,C.hairBase]);
    g.fillStyle = hGr;
    g.beginPath();
    g.moveTo(cx-2, cy-24);
    g.bezierCurveTo(cx+20, cy-24, cx+24, cy-6, cx+20, cy+14);
    g.lineTo(cx+2, cy+14);
    g.bezierCurveTo(cx-4, cy+4, cx-4, cy-14, cx-2, cy-24);
    g.fill();

    // Face shape (left profile)
    const fGr = hg(cx-14, cy, 18, [0,C.skinLight],[1,C.skinMid]);
    g.fillStyle = fGr;
    g.beginPath();
    g.moveTo(cx, cy-22);
    g.bezierCurveTo(cx-8, cy-22, cx-16, cy-14, cx-16, cy);
    g.bezierCurveTo(cx-16, cy+10, cx-10, cy+18, cx, cy+18);
    g.bezierCurveTo(cx+5, cy+18, cx+5, cy-22, cx, cy-22);
    g.fill();

    // Eye
    g.fillStyle = C.eyeWhite;
    g.beginPath(); g.ellipse(cx-8, cy-4, 5, 4, 0, 0, Math.PI*2); g.fill();
    g.fillStyle = C.eyeIris;
    g.beginPath(); g.ellipse(cx-9, cy-4, 3.5, 3.5, 0, 0, Math.PI*2); g.fill();
    g.fillStyle = C.pupil;
    g.beginPath(); g.ellipse(cx-9.5, cy-4, 1.8, 1.8, 0, 0, Math.PI*2); g.fill();
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEAD – RIGHT PROFILE
// ═══════════════════════════════════════════════════════════════════════════════
function headRight(cx, cy) {
    g.save(); g.translate(cx*2, 0); g.scale(-1, 1); headLeft(cx, cy); g.restore();
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELMET – FRONT
// ═══════════════════════════════════════════════════════════════════════════════
function helmetFront(cx, cy) {
    // Dome shell (covers hair and sides of head)
    const shellGr = vg(cx, cy-32, 56, [0,C.helmLight],[0.4,C.helmShell],[1,C.helmShadow]);
    g.fillStyle = shellGr;
    g.beginPath();
    g.moveTo(cx-20, cy+6);
    g.bezierCurveTo(cx-24, cy-2, cx-22, cy-28, cx, cy-32);
    g.bezierCurveTo(cx+22, cy-28, cx+24, cy-2, cx+20, cy+6);
    g.bezierCurveTo(cx+18, cy+18, cx-18, cy+18, cx-20, cy+6);
    g.fill();

    // Visor – dark tinted glass window
    const visorGr = rg(cx, cy-5, 18, [0,'rgba(20,60,120,0.25)'],[0.5,'rgba(8,20,50,0.88)'],[1,'rgba(0,2,12,0.97)']);
    g.fillStyle = visorGr;
    g.beginPath();
    g.roundRect(cx-14, cy-19, 28, 24, 11);
    g.fill();

    // Visor blue reflection (top-left)
    g.fillStyle = 'rgba(80,160,255,0.30)';
    g.beginPath(); g.ellipse(cx-5, cy-14, 9, 4.5, -0.3, 0, Math.PI*2); g.fill();
    // Visor white reflection (bottom-right)
    g.fillStyle = 'rgba(255,255,255,0.13)';
    g.beginPath(); g.ellipse(cx+4, cy-7, 6, 3.5, 0.2, 0, Math.PI*2); g.fill();

    // Visor rim glow
    g.strokeStyle = C.suitAccent; g.lineWidth = 1.8;
    g.beginPath(); g.roundRect(cx-14, cy-19, 28, 24, 11); g.stroke();

    // Dome highlight (top)
    g.fillStyle = 'rgba(255,255,255,0.34)';
    g.beginPath(); g.ellipse(cx-3, cy-26, 11, 5, -0.15, 0, Math.PI*2); g.fill();

    // Side tech modules
    g.fillStyle = C.helmDark;
    g.beginPath(); g.roundRect(cx-24, cy-5, 7, 13, 2); g.fill();
    g.beginPath(); g.roundRect(cx+17, cy-5, 7, 13, 2); g.fill();
    g.fillStyle = C.suitAccent;
    g.beginPath(); g.roundRect(cx-23, cy-2, 4, 3, 1); g.fill();
    g.beginPath(); g.roundRect(cx+19, cy-2, 4, 3, 1); g.fill();
    // Small LED dots
    g.fillStyle = '#80FF80';
    g.beginPath(); g.ellipse(cx-22, cy+4, 1.5, 1.5, 0, 0, Math.PI*2); g.fill();
    g.beginPath(); g.ellipse(cx+22, cy+4, 1.5, 1.5, 0, 0, Math.PI*2); g.fill();

    // Neck seal ring
    g.fillStyle = C.neckRing;
    g.beginPath(); g.roundRect(cx-13, cy+16, 26, 9, 3); g.fill();
    g.strokeStyle = C.suitAccent2; g.lineWidth = 1;
    g.beginPath(); g.roundRect(cx-13, cy+16, 26, 9, 3); g.stroke();
    g.strokeStyle = C.suitAccent; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(cx-13, cy+20); g.lineTo(cx+13, cy+20); g.stroke();
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELMET – BACK
// ═══════════════════════════════════════════════════════════════════════════════
function helmetBack(cx, cy) {
    // Dome shell (back – slightly darker)
    const shellGr = vg(cx, cy-32, 56, [0,C.helmShell],[0.45,C.helmShadow],[1,C.helmDark]);
    g.fillStyle = shellGr;
    g.beginPath();
    g.moveTo(cx-20, cy+6);
    g.bezierCurveTo(cx-24, cy-2, cx-22, cy-28, cx, cy-32);
    g.bezierCurveTo(cx+22, cy-28, cx+24, cy-2, cx+20, cy+6);
    g.bezierCurveTo(cx+18, cy+18, cx-18, cy+18, cx-20, cy+6);
    g.fill();

    // Back life-support panel
    g.fillStyle = C.helmDark;
    g.beginPath(); g.roundRect(cx-10, cy-24, 20, 24, 4); g.fill();
    g.strokeStyle = C.suitAccent2; g.lineWidth = 1;
    g.beginPath(); g.roundRect(cx-10, cy-24, 20, 24, 4); g.stroke();
    // Vent grills
    g.strokeStyle = C.suitAccent; g.lineWidth = 1.2;
    for (let i = 0; i < 4; i++) {
        g.beginPath(); g.moveTo(cx-8, cy-21+i*5); g.lineTo(cx+8, cy-21+i*5); g.stroke();
    }
    // LED indicator
    g.fillStyle = '#80FF80';
    g.beginPath(); g.ellipse(cx, cy-5, 2, 2, 0, 0, Math.PI*2); g.fill();

    // Dome highlight
    g.fillStyle = 'rgba(255,255,255,0.22)';
    g.beginPath(); g.ellipse(cx-3, cy-26, 10, 4.5, -0.15, 0, Math.PI*2); g.fill();

    // Neck seal ring
    g.fillStyle = C.neckRing;
    g.beginPath(); g.roundRect(cx-13, cy+16, 26, 9, 3); g.fill();
    g.strokeStyle = C.suitAccent2; g.lineWidth = 1;
    g.beginPath(); g.roundRect(cx-13, cy+16, 26, 9, 3); g.stroke();
    g.strokeStyle = C.suitAccent; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(cx-13, cy+20); g.lineTo(cx+13, cy+20); g.stroke();
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELMET – LEFT PROFILE
// ═══════════════════════════════════════════════════════════════════════════════
function helmetLeft(cx, cy) {
    // Profile dome shell (left-facing: face points left, back of head right)
    const shellGr = hg(cx-22, cy, 44, [0,C.helmLight],[0.65,C.helmShell],[1,C.helmShadow]);
    g.fillStyle = shellGr;
    g.beginPath();
    g.ellipse(cx+2, cy-6, 23, 27, 0, 0, Math.PI*2);
    g.fill();

    // Visor (left side – visor faces left)
    const visorGr = rg(cx-10, cy-6, 18, [0,'rgba(20,60,120,0.3)'],[0.7,'rgba(5,12,35,0.93)']);
    g.fillStyle = visorGr;
    g.beginPath();
    g.roundRect(cx-20, cy-17, 17, 24, 9);
    g.fill();

    // Visor reflections
    g.fillStyle = 'rgba(80,160,255,0.27)';
    g.beginPath(); g.ellipse(cx-14, cy-12, 6, 4, -0.2, 0, Math.PI*2); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.12)';
    g.beginPath(); g.ellipse(cx-12, cy-5, 4, 3, 0.1, 0, Math.PI*2); g.fill();

    // Visor rim
    g.strokeStyle = C.suitAccent; g.lineWidth = 1.6;
    g.beginPath(); g.roundRect(cx-20, cy-17, 17, 24, 9); g.stroke();

    // Back panel / life support (right side of profile)
    g.fillStyle = C.helmDark;
    g.beginPath(); g.roundRect(cx+14, cy-18, 11, 22, 3); g.fill();
    g.fillStyle = C.suitAccent;
    g.beginPath(); g.roundRect(cx+15, cy-14, 3, 5, 1); g.fill();
    g.fillStyle = '#80FF80';
    g.beginPath(); g.ellipse(cx+19, cy-5, 1.5, 1.5, 0, 0, Math.PI*2); g.fill();

    // Top highlight
    g.fillStyle = 'rgba(255,255,255,0.32)';
    g.beginPath(); g.ellipse(cx, cy-26, 10, 4.5, -0.1, 0, Math.PI*2); g.fill();

    // Neck seal ring
    g.fillStyle = C.neckRing;
    g.beginPath(); g.roundRect(cx-12, cy+16, 22, 9, 3); g.fill();
    g.strokeStyle = C.suitAccent; g.lineWidth = 1;
    g.beginPath(); g.moveTo(cx-12, cy+20); g.lineTo(cx+10, cy+20); g.stroke();
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELMET – RIGHT PROFILE (mirror of left)
// ═══════════════════════════════════════════════════════════════════════════════
function helmetRight(cx, cy) {
    g.save(); g.translate(cx*2, 0); g.scale(-1, 1); helmetLeft(cx, cy); g.restore();
}

// ═══════════════════════════════════════════════════════════════════════════════
// NECK
// ═══════════════════════════════════════════════════════════════════════════════
function neck(cx, ny, side=false) {
    const w = side ? 8 : 10;
    g.fillStyle = vg(cx-w/2, ny, 14, [0,C.skin],[1,C.skinDark]);
    g.beginPath(); g.roundRect(cx-w/2, ny, w, 14, 4); g.fill();
    if (!side) {
        g.fillStyle = 'rgba(0,0,0,0.12)';
        g.beginPath(); g.moveTo(cx-5, ny+14); g.lineTo(cx+5, ny+14); g.lineTo(cx+6, ny+8); g.lineTo(cx-6, ny+8); g.fill();
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TORSO – FRONT
// ═══════════════════════════════════════════════════════════════════════════════
function torsoFront(cx, ty, aLY, aRY) {
    const tw=38, th=38, tx=cx-tw/2;

    g.fillStyle = 'rgba(0,0,20,0.15)';
    g.beginPath(); g.ellipse(cx, ty+th+2, tw/2+2, 5, 0, 0, Math.PI*2); g.fill();

    const bodyGr = hg(tx, ty, tw, [0,C.suitLight],[0.5,C.suit1],[1,C.suit3]);
    g.fillStyle = bodyGr;
    g.beginPath();
    g.moveTo(tx+6, ty); g.lineTo(tx+tw-6, ty);
    g.bezierCurveTo(tx+tw+2, ty, tx+tw+4, ty+th, tx+tw, ty+th);
    g.lineTo(tx, ty+th);
    g.bezierCurveTo(tx-4, ty+th, tx-2, ty, tx+6, ty);
    g.fill();

    g.fillStyle = hg(tx, ty, 8, [0,'rgba(0,0,20,0.25)'],[1,'rgba(0,0,0,0)']);
    g.fillRect(tx, ty, 8, th);
    g.fillStyle = hg(tx+tw-8, ty, 8, [0,'rgba(0,0,0,0)'],[1,'rgba(0,0,20,0.25)']);
    g.fillRect(tx+tw-8, ty, 8, th);

    g.fillStyle = hg(tx+2, ty, 8, [0,C.suitSheen],[1,'rgba(0,0,0,0)']);
    g.beginPath(); g.roundRect(tx+2, ty+2, 6, th-4, 2); g.fill();

    g.fillStyle = C.suit3;
    g.beginPath(); g.roundRect(cx-12, ty+4, 24, 18, 3); g.fill();
    g.strokeStyle = C.suitAccent2; g.lineWidth = 1;
    g.beginPath(); g.roundRect(cx-12, ty+4, 24, 18, 3); g.stroke();

    g.fillStyle = vg(cx-2, ty, th, [0,C.suitAccent],[1,C.suitAccent2]);
    g.beginPath(); g.roundRect(cx-2, ty+6, 4, th-10, 2); g.fill();

    g.fillStyle = C.gold;
    g.font = 'bold 9px sans-serif'; g.textAlign='center'; g.textBaseline='middle';
    g.fillText('TI', cx, ty+13);

    const bGr = hg(tx, ty+th, tw+4, [0,C.grey1],[0.5,C.grey2],[1,C.grey1]);
    g.fillStyle = bGr; g.beginPath(); g.roundRect(tx-2, ty+th, tw+4, 7, 2); g.fill();
    g.fillStyle = C.goldLight; g.beginPath(); g.roundRect(cx-5, ty+th+1, 10, 5, 2); g.fill();
    g.fillStyle = C.goldDark; g.beginPath(); g.roundRect(cx-3, ty+th+2, 6, 3, 1); g.fill();

    g.fillStyle = C.suit3; g.beginPath(); g.roundRect(cx-9, ty-5, 18, 8, 4); g.fill();
    g.strokeStyle = C.suitAccent2; g.lineWidth = 1;
    g.beginPath(); g.roundRect(cx-9, ty-5, 18, 8, 4); g.stroke();

    drawArmFront(tx-14, ty+aLY, false);
    drawArmFront(tx+tw+2, ty+aRY, true);
}

function drawArmFront(ax, ay, right) {
    const aw=12, ah=32;
    const gr = hg(ax, ay, aw, right?[0,C.suitLight]:[0,C.suit3], right?[1,C.suit3]:[1,C.suitLight]);
    g.fillStyle = vg(ax, ay, ah, [0,C.suit1],[0.6,C.suit2],[1,C.suit3]);
    g.beginPath(); g.roundRect(ax, ay, aw, ah, 5); g.fill();
    g.fillStyle = gr; g.fillRect(ax, ay, aw, ah);
    g.fillStyle = C.grey2; g.beginPath(); g.roundRect(ax-1, ay+ah-10, aw+2, 6, 2); g.fill();
    g.strokeStyle = C.suitAccent2; g.lineWidth = 1;
    g.beginPath(); g.moveTo(ax, ay+ah-6); g.lineTo(ax+aw, ay+ah-6); g.stroke();
    const hGr2 = vg(ax-1, ay+ah-4, 16, [0,C.skin],[1,C.skinDark]);
    g.fillStyle = hGr2; g.beginPath(); g.ellipse(ax+aw/2, ay+ah+6, 7, 9, 0, 0, Math.PI*2); g.fill();
    g.strokeStyle = C.skinDark; g.lineWidth = 1;
    [-2,0,2].forEach(dx => {
        g.beginPath(); g.moveTo(ax+aw/2+dx, ay+ah+2); g.lineTo(ax+aw/2+dx, ay+ah+14); g.stroke();
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TORSO – BACK
// ═══════════════════════════════════════════════════════════════════════════════
function torsoBack(cx, ty, aLY, aRY) {
    const tw=38, th=38, tx=cx-tw/2;
    const bodyGr = hg(tx, ty, tw, [0,C.suit2],[0.5,C.suit1],[1,C.suit2]);
    g.fillStyle = bodyGr;
    g.beginPath();
    g.moveTo(tx+6, ty); g.lineTo(tx+tw-6, ty);
    g.bezierCurveTo(tx+tw+2, ty, tx+tw+4, ty+th, tx+tw, ty+th);
    g.lineTo(tx, ty+th);
    g.bezierCurveTo(tx-4, ty+th, tx-2, ty, tx+6, ty);
    g.fill();

    const pkGr = vg(cx-13, ty+2, 28, [0,C.packLight],[0.4,C.packMid],[1,C.packBase]);
    g.fillStyle = pkGr; g.beginPath(); g.roundRect(cx-13, ty+2, 26, 28, 4); g.fill();
    g.strokeStyle = C.suitAccent2; g.lineWidth = 1;
    g.beginPath(); g.roundRect(cx-13, ty+2, 26, 28, 4); g.stroke();
    g.fillStyle = C.packBase; g.beginPath(); g.roundRect(cx-11, ty+4, 22, 10, 2); g.fill();
    g.fillStyle = C.packMid; g.beginPath(); g.roundRect(cx-10, ty+5, 20, 8, 2); g.fill();
    g.fillStyle = C.goldLight; g.beginPath(); g.roundRect(cx-13, ty+8, 4, 8, 2); g.fill();
    g.beginPath(); g.roundRect(cx+9, ty+8, 4, 8, 2); g.fill();
    g.fillStyle = vg(cx-2, ty, th, [0,C.suitAccent],[1,C.suitAccent2]);
    g.beginPath(); g.roundRect(cx-2, ty+2, 4, 28, 2); g.fill();
    g.fillStyle = C.grey2; g.beginPath(); g.roundRect(tx-2, ty+th, tw+4, 7, 2); g.fill();
    g.fillStyle = C.gold; g.beginPath(); g.roundRect(cx-5, ty+th+1, 10, 5, 2); g.fill();
    g.fillStyle = C.suit3; g.beginPath(); g.roundRect(cx-9, ty-5, 18, 8, 4); g.fill();

    drawArmFront(tx-14, ty+aLY, true);
    drawArmFront(tx+tw+2, ty+aRY, false);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TORSO – SIDE
// ═══════════════════════════════════════════════════════════════════════════════
function torsoSide(cx, ty, facingRight, frontArmY) {
    const tw=20, th=38, tx = facingRight ? cx-4 : cx-tw+4;
    const bodyGr = hg(tx, ty, tw, facingRight?[0,C.suitLight]:[0,C.suit3],
                                   facingRight?[1,C.suit3]:[1,C.suitLight]);
    g.fillStyle = bodyGr; g.beginPath(); g.roundRect(tx, ty, tw, th, 4); g.fill();

    g.fillStyle = vg(facingRight?tx+8:tx+2, ty, th, [0,C.suitAccent],[1,C.suitAccent2]);
    g.beginPath(); g.roundRect(facingRight?tx+8:tx+2, ty+4, 4, th-8, 2); g.fill();

    const bpX = facingRight ? tx-10 : tx+tw-2;
    g.fillStyle = C.packMid; g.beginPath(); g.roundRect(bpX, ty+4, 12, 24, 3); g.fill();
    g.fillStyle = C.packBase; g.beginPath(); g.roundRect(bpX+1, ty+5, 10, 8, 2); g.fill();
    g.fillStyle = C.goldLight; g.beginPath(); g.roundRect(bpX+1, ty+9, 3, 6, 1); g.fill();

    g.fillStyle = C.suit3;
    g.beginPath(); g.roundRect(facingRight?tx+2:tx+4, ty+5, 10, 14, 2); g.fill();

    g.fillStyle = C.grey2; g.beginPath(); g.roundRect(tx-1, ty+th, tw+2, 7, 2); g.fill();
    g.fillStyle = C.suit3;
    g.beginPath(); g.roundRect(facingRight?tx+1:tx-5, ty-5, 16, 8, 4); g.fill();

    const fax = facingRight ? tx+tw+1 : tx-13;
    drawArmFront(fax, ty+frontArmY, facingRight);
    const bax = facingRight ? tx-9 : tx+tw-3;
    g.fillStyle = C.suit2; g.beginPath(); g.roundRect(bax, ty+4, 9, 26, 4); g.fill();
    g.fillStyle = C.skin; g.beginPath(); g.ellipse(bax+4.5, ty+34, 6, 8, 0, 0, Math.PI*2); g.fill();
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEGS – FRONT / BACK
// ═══════════════════════════════════════════════════════════════════════════════
function legsFront(cx, ly, phase) {
    const off = [[0,0],[-6,4],[0,0],[4,-6]];
    const [lo, ro] = off[phase];
    _leg(cx-19, ly+lo, true);
    _leg(cx+1,  ly+ro, false);
}

function _leg(lx, ly, left) {
    const gr = hg(lx, ly, 18, left?[0,C.pantLight]:[0,C.pant], left?[1,C.pant]:[1,C.pantLight]);
    g.fillStyle = vg(lx, ly, 30, [0,C.pant],[0.5,C.pantDark],[1,C.pant]);
    g.beginPath(); g.roundRect(lx, ly, 18, 30, 4); g.fill();
    g.fillStyle = gr; g.fillRect(lx+1, ly+1, 16, 28);
    g.fillStyle = 'rgba(255,255,255,0.07)';
    g.beginPath(); g.ellipse(lx+9, ly+16, 7, 5, 0, 0, Math.PI*2); g.fill();
    const bGr = hg(lx-2, ly+30, 22, left?[0,C.bootLight]:[0,C.bootBase],
                                     left?[1,C.bootBase]:[1,C.bootLight]);
    g.fillStyle = bGr; g.beginPath(); g.roundRect(lx-2, ly+28, 22, 10, 3); g.fill();
    g.fillStyle = C.bootLight; g.beginPath(); g.roundRect(lx, ly+29, 18, 5, 2); g.fill();
    const toeSide = left ? lx-2 : lx+14;
    g.fillStyle = C.grey1; g.beginPath(); g.roundRect(toeSide, ly+34, 8, 4, 2); g.fill();
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEGS – SIDE
// ═══════════════════════════════════════════════════════════════════════════════
function legsSide(cx, ly, phase, facingRight) {
    const off = [[0,0],[-6,4],[0,0],[4,-6]];
    const [fo, bo] = off[phase];
    _legSide(cx-9, ly+bo, false, facingRight);
    _legSide(cx-9, ly+fo, true, facingRight);
}

function _legSide(lx, ly, front, facingRight) {
    g.fillStyle = vg(lx, ly, 30, front?[0,C.pantLight]:[0,C.pantDark],
                                  front?[1,C.pantDark]:[1,C.pant]);
    g.beginPath(); g.roundRect(lx, ly, 18, 30, 4); g.fill();
    if(front){ g.fillStyle='rgba(255,255,255,0.07)'; g.beginPath(); g.ellipse(lx+9,ly+16,6,4,0,0,Math.PI*2); g.fill(); }
    const bGr = front ? C.bootMid : C.bootBase;
    g.fillStyle = bGr; g.beginPath(); g.roundRect(lx-2, ly+28, 22, 10, 3); g.fill();
    g.fillStyle = front ? C.bootLight : C.bootMid;
    g.beginPath(); g.roundRect(lx, ly+29, 18, 5, 2); g.fill();
    const toeX = facingRight ? lx+14 : lx-2;
    g.fillStyle = C.grey1; g.beginPath(); g.roundRect(toeX, ly+34, 8, 4, 2); g.fill();
}

// ═══════════════════════════════════════════════════════════════════════════════
// ARM SWING TABLE
// ═══════════════════════════════════════════════════════════════════════════════
const ARM = [ {l:0,r:0}, {l:8,r:-6}, {l:0,r:0}, {l:-6,r:8} ];

// ═══════════════════════════════════════════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════
const CX=64, HEAD_Y=20, NECK_Y=52, TORSO_Y=60, LEG_Y=102, SHADOW_Y=124;

// ── Row 0: walk-down ──────────────────────────────────────────────────────────
for(let f=0;f<4;f++) frame(f,0,()=>{
    groundShadow(CX, SHADOW_Y);
    legsFront(CX, LEG_Y, f);
    torsoFront(CX, TORSO_Y, ARM[f].l, ARM[f].r);
    neck(CX, NECK_Y);
    headFront(CX, HEAD_Y+12);
    helmetFront(CX, HEAD_Y+12);
});

// ── Row 1: walk-left ──────────────────────────────────────────────────────────
for(let f=0;f<4;f++) frame(f,1,()=>{
    groundShadow(CX, SHADOW_Y);
    legsSide(CX, LEG_Y, f, false);
    torsoSide(CX, TORSO_Y, false, ARM[f].r);
    neck(CX-4, NECK_Y, true);
    headLeft(CX+2, HEAD_Y+12);
    helmetLeft(CX+2, HEAD_Y+12);
});

// ── Row 2: walk-right ─────────────────────────────────────────────────────────
for(let f=0;f<4;f++) frame(f,2,()=>{
    groundShadow(CX, SHADOW_Y);
    legsSide(CX, LEG_Y, f, true);
    torsoSide(CX, TORSO_Y, true, ARM[f].l);
    neck(CX+4, NECK_Y, true);
    headRight(CX-2, HEAD_Y+12);
    helmetRight(CX-2, HEAD_Y+12);
});

// ── Row 3: walk-up ────────────────────────────────────────────────────────────
for(let f=0;f<4;f++) frame(f,3,()=>{
    groundShadow(CX, SHADOW_Y);
    legsFront(CX, LEG_Y, f);
    torsoBack(CX, TORSO_Y, ARM[f].l, ARM[f].r);
    neck(CX, NECK_Y);
    headBack(CX, HEAD_Y+12);
    helmetBack(CX, HEAD_Y+12);
});

// ── Row 4: idle (copy frame 0 col 0) ─────────────────────────────────────────
for(let f=0;f<4;f++) frame(f,4,()=>{ g.drawImage(canvas,0,0,FW,FH,0,0,FW,FH); });

writeFileSync('assets/morgan_sprite.png', canvas.toBuffer('image/png'));
console.log(`✓ assets/morgan_sprite.png  (${canvas.width}×${canvas.height})`);
