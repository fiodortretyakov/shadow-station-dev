/**
 * Morgan Yu – female, black hair, no helmet
 * 256×256 per frame (drawn in 128-unit logical space × scale(2,2))
 * Row 0  walk-down   Row 1  walk-left   Row 2  walk-right
 * Row 3  walk-up     Row 4  idle-down
 */
import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync } from 'node:fs';

const FW = 256, FH = 256, COLS = 4, ROWS = 5;
const canvas = createCanvas(FW * COLS, FH * ROWS);
const g = canvas.getContext('2d');
g.imageSmoothingEnabled = true;

// ── Frame helper (128-unit logical space → 256px via scale 2) ─────────────────
function frame(col, row, fn) {
    g.save();
    g.translate(col * FW, row * FH);
    g.clearRect(0, 0, FW, FH);
    g.scale(2, 2);
    fn();
    g.restore();
}

// ── Gradient factories ────────────────────────────────────────────────────────
const vg = (x,y,h,...s) => { const gr=g.createLinearGradient(x,y,x,y+h); s.forEach(([t,c])=>gr.addColorStop(t,c)); return gr; };
const hg = (x,y,w,...s) => { const gr=g.createLinearGradient(x,y,x+w,y); s.forEach(([t,c])=>gr.addColorStop(t,c)); return gr; };
const rg = (x,y,r,...s) => { const gr=g.createRadialGradient(x,y,0,x,y,r); s.forEach(([t,c])=>gr.addColorStop(t,c)); return gr; };

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
    // Skin – warm East-Asian tone
    skinLight: '#F5D5A8', skin: '#ECC48C', skinMid: '#D4A870', skinDark: '#B88C58', skinShadow: '#9A7044',
    // Black hair with blue-black sheen
    hairBase: '#080810', hairMid: '#0E0E1C', hairLight: '#1E1E34', hairSheen: '#2E2E50',
    // TranStar suit – deep crimson red
    suit1: '#8A1A1A', suit2: '#701010', suit3: '#500A0A', suitLight: '#B83030', suitSheen: '#D04040',
    suitAccent: '#FF5040', suitAccent2: '#D03828',
    // Right arm – brighter red (wrist panel side)
    armRHi: '#C02828', armRLo: '#600C0C',
    // Left arm – deeper/shadowed red
    armLHi: '#902020', armLLo: '#500808',
    grey1: '#3A3E50', grey2: '#2E3244', grey3: '#242838',
    pantDark: '#142240', pant: '#1A2E58', pantLight: '#243870',
    bootBase: '#181820', bootMid: '#242432', bootLight: '#343448',
    eyeIris: '#3D2D8A', eyeDark: '#24186A', eyeLight: '#6A58C8', pupil: '#050508', eyeWhite: '#F4F4F8',
    brow: '#050508', lip: '#C8706A', lipLight: '#E09080', lipDark: '#A05848',
    gold: '#C8981A', goldLight: '#F0C040', goldDark: '#A07810',
    packBase: '#2A2E3C', packMid: '#343848', packLight: '#444858',
    // Wrist device (right arm)
    wristPanel: '#3A0808', wristGlow: '#FF5040',
};

// ── Ground shadow ─────────────────────────────────────────────────────────────
function groundShadow(cx, y) {
    g.fillStyle = rg(cx,y,22, [0,'rgba(0,0,20,0.28)'],[1,'rgba(0,0,0,0)']);
    g.beginPath(); g.ellipse(cx, y, 22, 7, 0, 0, Math.PI*2); g.fill();
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEAD – FRONT (female, black hair)
// ═══════════════════════════════════════════════════════════════════════════════
function headFront(cx, cy) {
    // ── Hair back mass ────────────────────────────────────────────────────────
    g.fillStyle = C.hairBase;
    g.beginPath();
    g.moveTo(cx-16, cy-4);
    g.bezierCurveTo(cx-17, cy-24, cx-9, cy-30, cx, cy-30);
    g.bezierCurveTo(cx+9, cy-30, cx+17, cy-24, cx+16, cy-4);
    // hair falls to shoulders
    g.bezierCurveTo(cx+18, cy+6, cx+20, cy+22, cx+18, cy+32);
    g.bezierCurveTo(cx+8, cy+38, cx-8, cy+38, cx-18, cy+32);
    g.bezierCurveTo(cx-20, cy+22, cx-18, cy+6, cx-16, cy-4);
    g.fill();

    // ── Face oval – slightly narrower, feminine ────────────────────────────────
    const faceGr = vg(cx-11, cy-20, 38, [0,C.skinLight],[0.35,C.skin],[1,C.skinMid]);
    g.fillStyle = faceGr;
    g.beginPath();
    g.moveTo(cx-10, cy-20);
    g.bezierCurveTo(cx-14, cy-18, cx-14, cy+10, cx-9, cy+18);
    g.bezierCurveTo(cx-3, cy+22, cx+3, cy+22, cx+9, cy+18);
    g.bezierCurveTo(cx+14, cy+10, cx+14, cy-18, cx+10, cy-20);
    g.bezierCurveTo(cx+5, cy-24, cx-5, cy-24, cx-10, cy-20);
    g.fill();

    // ── Hair front with bangs ─────────────────────────────────────────────────
    const hairFrGr = vg(cx-17, cy-30, 22, [0,C.hairLight],[0.4,C.hairMid],[1,C.hairBase]);
    g.fillStyle = hairFrGr;
    // main top
    g.beginPath();
    g.moveTo(cx-16, cy-4);
    g.bezierCurveTo(cx-17, cy-22, cx-10, cy-30, cx, cy-30);
    g.bezierCurveTo(cx+10, cy-30, cx+17, cy-22, cx+16, cy-4);
    g.bezierCurveTo(cx+14, cy-12, cx+12, cy-16, cx+8, cy-20);
    g.bezierCurveTo(cx+3, cy-24, cx, cy-24, cx, cy-24);
    g.bezierCurveTo(cx, cy-24, cx-3, cy-24, cx-8, cy-20);
    g.bezierCurveTo(cx-12, cy-16, cx-14, cy-12, cx-16, cy-4);
    g.fill();
    // bangs – sweep right side
    g.beginPath();
    g.moveTo(cx-8, cy-24);
    g.bezierCurveTo(cx-14, cy-20, cx-14, cy-10, cx-12, cy-2);
    g.bezierCurveTo(cx-10, cy+4, cx-12, cy+2, cx-14, cy+0);
    g.bezierCurveTo(cx-16, cy-6, cx-16, cy-20, cx-8, cy-24);
    g.fill();
    // hair sheen highlight
    g.fillStyle = C.hairSheen;
    g.beginPath(); g.ellipse(cx-2, cy-24, 7, 3, -0.3, 0, Math.PI*2); g.fill();
    // side locks falling down
    const sideHairGr = vg(cx-16, cy, 36, [0,C.hairMid],[1,C.hairBase]);
    g.fillStyle = sideHairGr;
    g.beginPath();
    g.moveTo(cx-13, cy-8); g.bezierCurveTo(cx-18, cy-2, cx-20, cy+20, cx-17, cy+34);
    g.lineTo(cx-14, cy+34); g.bezierCurveTo(cx-17, cy+20, cx-15, cy+2, cx-11, cy-6); g.fill();
    g.beginPath();
    g.moveTo(cx+13, cy-8); g.bezierCurveTo(cx+18, cy-2, cx+20, cy+20, cx+17, cy+34);
    g.lineTo(cx+14, cy+34); g.bezierCurveTo(cx+17, cy+20, cx+15, cy+2, cx+11, cy-6); g.fill();

    // ── Eyebrows – fine, arched ────────────────────────────────────────────────
    g.strokeStyle = C.brow; g.lineWidth = 2; g.lineCap='round';
    g.beginPath(); g.moveTo(cx-9, cy-10); g.quadraticCurveTo(cx-5, cy-14, cx-1, cy-11); g.stroke();
    g.beginPath(); g.moveTo(cx+9, cy-10); g.quadraticCurveTo(cx+5, cy-14, cx+1, cy-11); g.stroke();

    // ── Eyes – large, expressive ───────────────────────────────────────────────
    g.fillStyle = C.eyeWhite;
    g.beginPath(); g.ellipse(cx-6, cy-4, 6, 4.5, 0, 0, Math.PI*2); g.fill();
    g.beginPath(); g.ellipse(cx+6, cy-4, 6, 4.5, 0, 0, Math.PI*2); g.fill();
    const eyeGrL = rg(cx-6, cy-4, 4.5, [0,C.eyeLight],[0.5,C.eyeIris],[1,C.eyeDark]);
    const eyeGrR = rg(cx+6, cy-4, 4.5, [0,C.eyeLight],[0.5,C.eyeIris],[1,C.eyeDark]);
    g.fillStyle = eyeGrL; g.beginPath(); g.ellipse(cx-6, cy-4, 4, 4, 0, 0, Math.PI*2); g.fill();
    g.fillStyle = eyeGrR; g.beginPath(); g.ellipse(cx+6, cy-4, 4, 4, 0, 0, Math.PI*2); g.fill();
    g.fillStyle = C.pupil;
    g.beginPath(); g.ellipse(cx-6, cy-4, 2.2, 2.2, 0, 0, Math.PI*2); g.fill();
    g.beginPath(); g.ellipse(cx+6, cy-4, 2.2, 2.2, 0, 0, Math.PI*2); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.88)';
    g.beginPath(); g.ellipse(cx-7.5, cy-5.5, 1.5, 1, 0, 0, Math.PI*2); g.fill();
    g.beginPath(); g.ellipse(cx+4.5, cy-5.5, 1.5, 1, 0, 0, Math.PI*2); g.fill();
    // lash line – thin stroke along upper eyelid only
    g.strokeStyle = 'rgba(5,5,10,0.7)'; g.lineWidth = 1;
    g.beginPath(); g.arc(cx-6, cy-4, 4.5, Math.PI, 0); g.stroke();
    g.beginPath(); g.arc(cx+6, cy-4, 4.5, Math.PI, 0); g.stroke();

    // ── Nose – delicate ────────────────────────────────────────────────────────
    g.strokeStyle = C.skinDark; g.lineWidth = 1.2; g.lineCap='round';
    g.beginPath(); g.moveTo(cx-1.5, cy+2); g.lineTo(cx, cy+5); g.lineTo(cx+1.5, cy+2); g.stroke();
    g.fillStyle = C.skinMid;
    g.beginPath(); g.ellipse(cx-2.5, cy+5.5, 1.8, 1.3, 0, 0, Math.PI*2); g.fill();
    g.beginPath(); g.ellipse(cx+2.5, cy+5.5, 1.8, 1.3, 0, 0, Math.PI*2); g.fill();

    // ── Lips – fuller, defined ─────────────────────────────────────────────────
    g.fillStyle = C.lipLight;
    g.beginPath();
    g.moveTo(cx-6, cy+11);
    g.bezierCurveTo(cx-3, cy+9.5, cx-1, cy+10, cx, cy+10.5);
    g.bezierCurveTo(cx+1, cy+10, cx+3, cy+9.5, cx+6, cy+11);
    g.bezierCurveTo(cx+3, cy+12, cx+1, cy+12.5, cx, cy+12);
    g.bezierCurveTo(cx-1, cy+12.5, cx-3, cy+12, cx-6, cy+11);
    g.fill();
    g.fillStyle = C.lip;
    g.beginPath();
    g.moveTo(cx-5.5, cy+11.5);
    g.bezierCurveTo(cx-2, cy+15, cx+2, cy+15, cx+5.5, cy+11.5);
    g.bezierCurveTo(cx+2, cy+16.5, cx-2, cy+16.5, cx-5.5, cy+11.5);
    g.fill();
    g.strokeStyle = C.lipDark; g.lineWidth = 0.8;
    g.beginPath(); g.moveTo(cx-6, cy+11); g.lineTo(cx+6, cy+11); g.stroke();

    // ── Face shadow / chin ─────────────────────────────────────────────────────
    g.fillStyle = vg(cx-10, cy+14, 10, [0,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,0.10)']);
    g.beginPath();
    g.moveTo(cx-9, cy+18); g.bezierCurveTo(cx-3, cy+22, cx+3, cy+22, cx+9, cy+18);
    g.bezierCurveTo(cx+3, cy+24, cx-3, cy+24, cx-9, cy+18); g.fill();
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEAD – BACK (long black hair)
// ═══════════════════════════════════════════════════════════════════════════════
function headBack(cx, cy) {
    // Long hair – main mass
    const hGr = vg(cx, cy-30, 68, [0,C.hairLight],[0.25,C.hairMid],[1,C.hairBase]);
    g.fillStyle = hGr;
    g.beginPath();
    g.moveTo(cx-16, cy-4);
    g.bezierCurveTo(cx-17, cy-24, cx-9, cy-30, cx, cy-30);
    g.bezierCurveTo(cx+9, cy-30, cx+17, cy-24, cx+16, cy-4);
    g.bezierCurveTo(cx+20, cy+10, cx+22, cy+28, cx+18, cy+38);
    g.bezierCurveTo(cx+8, cy+44, cx-8, cy+44, cx-18, cy+38);
    g.bezierCurveTo(cx-22, cy+28, cx-20, cy+10, cx-16, cy-4);
    g.fill();
    // hair centre parting line
    g.strokeStyle = C.hairBase; g.lineWidth = 1.5; g.lineCap='round';
    g.beginPath(); g.moveTo(cx, cy-30); g.lineTo(cx, cy); g.stroke();
    // hair strand lines
    g.strokeStyle = C.hairMid; g.lineWidth = 1;
    for(let i=-2;i<=2;i++){
        g.beginPath();
        g.moveTo(cx+i*5, cy-28);
        g.bezierCurveTo(cx+i*6, cy-10, cx+i*7, cy+12, cx+i*6, cy+38);
        g.stroke();
    }
    // sheen
    g.fillStyle = C.hairSheen;
    g.beginPath(); g.ellipse(cx-3, cy-22, 8, 3.5, -0.25, 0, Math.PI*2); g.fill();
    // Neck
    g.fillStyle = vg(cx-4, cy+14, 12, [0,C.skinMid],[1,C.skinDark]);
    g.beginPath(); g.roundRect(cx-4, cy+14, 8, 12, 3); g.fill();
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEAD – LEFT PROFILE (female, long black hair)
// ═══════════════════════════════════════════════════════════════════════════════
function headLeft(cx, cy) {
    // Back-of-head hair mass
    const hGr = hg(cx, cy, 26, [0,C.hairLight],[1,C.hairBase]);
    g.fillStyle = hGr;
    g.beginPath();
    g.moveTo(cx, cy-26);
    g.bezierCurveTo(cx+22, cy-26, cx+26, cy-6, cx+22, cy+16);
    g.bezierCurveTo(cx+20, cy+30, cx+18, cy+40, cx+16, cy+44);
    g.lineTo(cx+4, cy+44);
    g.bezierCurveTo(cx-2, cy+30, cx-2, cy+16, cx-2, cy-2);
    g.bezierCurveTo(cx-2, cy-14, cx, cy-26, cx, cy-26);
    g.fill();
    // hair sheen
    g.fillStyle = C.hairSheen;
    g.beginPath(); g.ellipse(cx+8, cy-20, 7, 3, -0.2, 0, Math.PI*2); g.fill();

    // Face profile
    const fGr = hg(cx-14, cy, 17, [0,C.skinLight],[1,C.skinMid]);
    g.fillStyle = fGr;
    g.beginPath();
    g.moveTo(cx, cy-24);
    g.bezierCurveTo(cx-7, cy-24, cx-15, cy-14, cx-15, cy);
    g.bezierCurveTo(cx-15, cy+10, cx-9, cy+20, cx, cy+20);
    g.bezierCurveTo(cx+4, cy+20, cx+4, cy-24, cx, cy-24);
    g.fill();

    // front bang draping over forehead
    g.fillStyle = C.hairBase;
    g.beginPath();
    g.moveTo(cx-2, cy-24);
    g.bezierCurveTo(cx-6, cy-22, cx-6, cy-14, cx-4, cy-8);
    g.lineTo(cx-2, cy-6);
    g.bezierCurveTo(cx-4, cy-12, cx-4, cy-20, cx, cy-22); g.fill();

    // Ear
    g.fillStyle = C.skinMid;
    g.beginPath(); g.ellipse(cx+3, cy+2, 3, 5, 0.1, 0, Math.PI*2); g.fill();
    g.strokeStyle = C.skinDark; g.lineWidth = 0.8;
    g.beginPath(); g.ellipse(cx+3, cy+2, 1.5, 3, 0.1, 0, Math.PI*2); g.stroke();

    // Eyebrow
    g.strokeStyle = C.brow; g.lineWidth = 2; g.lineCap='round';
    g.beginPath(); g.moveTo(cx-11, cy-10); g.quadraticCurveTo(cx-6, cy-15, cx-1, cy-12); g.stroke();

    // Eye
    g.fillStyle = C.eyeWhite;
    g.beginPath(); g.ellipse(cx-8, cy-4, 5, 4.5, 0, 0, Math.PI*2); g.fill();
    const eyeGr = rg(cx-8, cy-4, 4, [0,C.eyeLight],[0.5,C.eyeIris],[1,C.eyeDark]);
    g.fillStyle = eyeGr;
    g.beginPath(); g.ellipse(cx-9, cy-4, 3.5, 3.5, 0, 0, Math.PI*2); g.fill();
    g.fillStyle = C.pupil;
    g.beginPath(); g.ellipse(cx-9.5, cy-4, 1.8, 1.8, 0, 0, Math.PI*2); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.85)';
    g.beginPath(); g.ellipse(cx-10.5, cy-5.5, 1.2, 0.9, 0, 0, Math.PI*2); g.fill();
    // lash line – upper eyelid
    g.strokeStyle = 'rgba(5,5,10,0.7)'; g.lineWidth = 1;
    g.beginPath(); g.arc(cx-8, cy-4, 4.5, Math.PI, 0); g.stroke();

    // Nose profile
    g.fillStyle = C.skin;
    g.beginPath();
    g.moveTo(cx-11, cy); g.bezierCurveTo(cx-15, cy+2, cx-15, cy+6, cx-12, cy+7);
    g.lineTo(cx-11, cy+5); g.bezierCurveTo(cx-13, cy+4, cx-13, cy+2, cx-11, cy+1); g.fill();

    // Lips profile
    g.strokeStyle = C.lip; g.lineWidth = 2.2; g.lineCap='round';
    g.beginPath(); g.moveTo(cx-12, cy+12); g.quadraticCurveTo(cx-8, cy+16, cx-3, cy+14); g.stroke();
    g.fillStyle = C.lip;
    g.beginPath(); g.ellipse(cx-8, cy+13, 3.5, 2, 0, 0, Math.PI*2); g.fill();
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEAD – RIGHT PROFILE
// ═══════════════════════════════════════════════════════════════════════════════
function headRight(cx, cy) {
    g.save(); g.translate(cx*2, 0); g.scale(-1, 1); headLeft(cx, cy); g.restore();
}

// ═══════════════════════════════════════════════════════════════════════════════
// NECK
// ═══════════════════════════════════════════════════════════════════════════════
function neck(cx, ny, side=false) {
    const w = side ? 7 : 9;
    g.fillStyle = vg(cx-w/2, ny, 14, [0,C.skin],[1,C.skinDark]);
    g.beginPath(); g.roundRect(cx-w/2, ny, w, 14, 4); g.fill();
    if (!side) {
        g.fillStyle = 'rgba(0,0,0,0.10)';
        g.beginPath(); g.moveTo(cx-4, ny+14); g.lineTo(cx+4, ny+14); g.lineTo(cx+5, ny+8); g.lineTo(cx-5, ny+8); g.fill();
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ARMS – distinct left (shadowed) and right (wrist panel)
// ═══════════════════════════════════════════════════════════════════════════════
function drawArmLeft(ax, ay) {
    // Left arm – slightly darker/cooler, shadow on outer edge
    const aw=11, ah=30;
    g.fillStyle = vg(ax, ay, ah, [0,C.armLHi],[0.6,C.suit2],[1,C.armLLo]);
    g.beginPath(); g.roundRect(ax, ay, aw, ah, 5); g.fill();
    // inner highlight
    g.fillStyle = hg(ax, ay, aw, [0,'rgba(255,255,255,0.12)'],[1,'rgba(0,0,0,0)']);
    g.beginPath(); g.roundRect(ax+1, ay+2, 4, ah-4, 3); g.fill();
    // cuff
    g.fillStyle = C.grey2; g.beginPath(); g.roundRect(ax-1, ay+ah-9, aw+2, 6, 2); g.fill();
    g.strokeStyle = C.suitAccent2; g.lineWidth = 0.8;
    g.beginPath(); g.moveTo(ax, ay+ah-5); g.lineTo(ax+aw, ay+ah-5); g.stroke();
    // hand
    g.fillStyle = vg(ax, ay+ah-3, 16, [0,C.skin],[1,C.skinDark]);
    g.beginPath(); g.ellipse(ax+aw/2, ay+ah+5, 6, 8, 0, 0, Math.PI*2); g.fill();
    g.strokeStyle = C.skinDark; g.lineWidth = 0.8;
    [-1.5,0,1.5].forEach(dx => {
        g.beginPath(); g.moveTo(ax+aw/2+dx, ay+ah+1); g.lineTo(ax+aw/2+dx, ay+ah+12); g.stroke();
    });
}

function drawArmRight(ax, ay) {
    // Right arm – warmer highlight, wrist-mounted data panel
    const aw=11, ah=30;
    g.fillStyle = vg(ax, ay, ah, [0,C.armRHi],[0.6,C.suit1],[1,C.armRLo]);
    g.beginPath(); g.roundRect(ax, ay, aw, ah, 5); g.fill();
    // highlight streak
    g.fillStyle = hg(ax+aw-5, ay, 5, [0,'rgba(0,0,0,0)'],[1,'rgba(255,255,255,0.15)']);
    g.beginPath(); g.roundRect(ax+aw-5, ay+2, 4, ah-4, 3); g.fill();
    // wrist data panel
    g.fillStyle = C.wristPanel;
    g.beginPath(); g.roundRect(ax, ay+ah-14, aw, 8, 2); g.fill();
    g.strokeStyle = C.wristGlow; g.lineWidth = 0.8;
    g.beginPath(); g.roundRect(ax+1, ay+ah-13, aw-2, 6, 1); g.stroke();
    // panel glow lines
    g.strokeStyle = C.wristGlow; g.lineWidth = 0.6;
    g.beginPath(); g.moveTo(ax+2, ay+ah-11); g.lineTo(ax+aw-2, ay+ah-11); g.stroke();
    g.beginPath(); g.moveTo(ax+2, ay+ah-9); g.lineTo(ax+aw-4, ay+ah-9); g.stroke();
    // cuff
    g.fillStyle = C.grey2; g.beginPath(); g.roundRect(ax-1, ay+ah-5, aw+2, 4, 2); g.fill();
    // hand
    g.fillStyle = vg(ax, ay+ah-3, 16, [0,C.skin],[1,C.skinDark]);
    g.beginPath(); g.ellipse(ax+aw/2, ay+ah+5, 6, 8, 0, 0, Math.PI*2); g.fill();
    g.strokeStyle = C.skinDark; g.lineWidth = 0.8;
    [-1.5,0,1.5].forEach(dx => {
        g.beginPath(); g.moveTo(ax+aw/2+dx, ay+ah+1); g.lineTo(ax+aw/2+dx, ay+ah+12); g.stroke();
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// TORSO – FRONT
// ═══════════════════════════════════════════════════════════════════════════════
function torsoFront(cx, ty, aLY, aRY) {
    const tw=35, th=38, tx=cx-tw/2;

    g.fillStyle = 'rgba(0,0,20,0.15)';
    g.beginPath(); g.ellipse(cx, ty+th+2, tw/2+2, 5, 0, 0, Math.PI*2); g.fill();

    // Body shape – slightly narrower at waist
    const bodyGr = hg(tx, ty, tw, [0,C.suitLight],[0.5,C.suit1],[1,C.suit3]);
    g.fillStyle = bodyGr;
    g.beginPath();
    g.moveTo(tx+5, ty); g.lineTo(tx+tw-5, ty);
    g.bezierCurveTo(tx+tw+2, ty+4, tx+tw+2, ty+th, tx+tw-2, ty+th);
    g.lineTo(tx+2, ty+th);
    g.bezierCurveTo(tx-2, ty+th, tx-2, ty+4, tx+5, ty);
    g.fill();

    // edge shadows
    g.fillStyle = hg(tx, ty, 7, [0,'rgba(0,0,20,0.22)'],[1,'rgba(0,0,0,0)']);
    g.fillRect(tx, ty, 7, th);
    g.fillStyle = hg(tx+tw-7, ty, 7, [0,'rgba(0,0,0,0)'],[1,'rgba(0,0,20,0.22)']);
    g.fillRect(tx+tw-7, ty, 7, th);
    // highlight
    g.fillStyle = hg(tx+2, ty, 6, [0,C.suitSheen],[1,'rgba(0,0,0,0)']);
    g.beginPath(); g.roundRect(tx+2, ty+2, 5, th-4, 2); g.fill();

    // chest panel
    g.fillStyle = C.suit3;
    g.beginPath(); g.roundRect(cx-10, ty+4, 20, 16, 3); g.fill();
    g.strokeStyle = C.suitAccent2; g.lineWidth = 0.8;
    g.beginPath(); g.roundRect(cx-10, ty+4, 20, 16, 3); g.stroke();
    // centre stripe
    g.fillStyle = vg(cx-2, ty, th, [0,C.suitAccent],[1,C.suitAccent2]);
    g.beginPath(); g.roundRect(cx-2, ty+5, 4, th-9, 2); g.fill();
    // TI logo
    g.fillStyle = C.gold;
    g.font = 'bold 8px sans-serif'; g.textAlign='center'; g.textBaseline='middle';
    g.fillText('TI', cx, ty+12);

    // belt
    const bGr = hg(tx-2, ty+th, tw+4, [0,C.grey1],[0.5,C.grey2],[1,C.grey1]);
    g.fillStyle = bGr; g.beginPath(); g.roundRect(tx-2, ty+th, tw+4, 7, 2); g.fill();
    g.fillStyle = C.goldLight; g.beginPath(); g.roundRect(cx-5, ty+th+1, 10, 5, 2); g.fill();
    g.fillStyle = C.goldDark; g.beginPath(); g.roundRect(cx-3, ty+th+2, 6, 3, 1); g.fill();
    // collar
    g.fillStyle = C.suit3; g.beginPath(); g.roundRect(cx-8, ty-5, 16, 8, 4); g.fill();
    g.strokeStyle = C.suitAccent2; g.lineWidth = 0.8;
    g.beginPath(); g.roundRect(cx-8, ty-5, 16, 8, 4); g.stroke();

    // arms – left (viewer's right) and right (viewer's left) with distinct look
    drawArmLeft(tx-13, ty+aLY);
    drawArmRight(tx+tw+2, ty+aRY);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TORSO – BACK
// ═══════════════════════════════════════════════════════════════════════════════
function torsoBack(cx, ty, aLY, aRY) {
    const tw=35, th=38, tx=cx-tw/2;
    const bodyGr = hg(tx, ty, tw, [0,C.suit2],[0.5,C.suit1],[1,C.suit2]);
    g.fillStyle = bodyGr;
    g.beginPath();
    g.moveTo(tx+5, ty); g.lineTo(tx+tw-5, ty);
    g.bezierCurveTo(tx+tw+2, ty+4, tx+tw+2, ty+th, tx+tw-2, ty+th);
    g.lineTo(tx+2, ty+th);
    g.bezierCurveTo(tx-2, ty+th, tx-2, ty+4, tx+5, ty);
    g.fill();

    // backpack
    const pkGr = vg(cx-12, ty+2, 26, [0,C.packLight],[0.4,C.packMid],[1,C.packBase]);
    g.fillStyle = pkGr; g.beginPath(); g.roundRect(cx-12, ty+2, 24, 26, 4); g.fill();
    g.strokeStyle = C.suitAccent2; g.lineWidth = 0.8;
    g.beginPath(); g.roundRect(cx-12, ty+2, 24, 26, 4); g.stroke();
    g.fillStyle = C.packBase; g.beginPath(); g.roundRect(cx-10, ty+4, 20, 8, 2); g.fill();
    g.fillStyle = C.packMid; g.beginPath(); g.roundRect(cx-9, ty+5, 18, 6, 2); g.fill();
    g.fillStyle = C.goldLight;
    g.beginPath(); g.roundRect(cx-12, ty+7, 3, 7, 2); g.fill();
    g.beginPath(); g.roundRect(cx+9, ty+7, 3, 7, 2); g.fill();
    g.fillStyle = vg(cx-2, ty, th, [0,C.suitAccent],[1,C.suitAccent2]);
    g.beginPath(); g.roundRect(cx-2, ty+2, 4, 26, 2); g.fill();
    g.fillStyle = C.grey2; g.beginPath(); g.roundRect(tx-2, ty+th, tw+4, 7, 2); g.fill();
    g.fillStyle = C.gold; g.beginPath(); g.roundRect(cx-5, ty+th+1, 10, 5, 2); g.fill();
    g.fillStyle = C.suit3; g.beginPath(); g.roundRect(cx-8, ty-5, 16, 8, 4); g.fill();

    // arms from back – left arm (wrist panel visible on back), right arm darker
    drawArmRight(tx-13, ty+aLY);
    drawArmLeft(tx+tw+2, ty+aRY);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TORSO – SIDE
// ═══════════════════════════════════════════════════════════════════════════════
function torsoSide(cx, ty, facingRight, frontArmY) {
    const tw=19, th=38, tx = facingRight ? cx-3 : cx-tw+3;
    const bodyGr = hg(tx, ty, tw, facingRight?[0,C.suitLight]:[0,C.suit3],
                                   facingRight?[1,C.suit3]:[1,C.suitLight]);
    g.fillStyle = bodyGr; g.beginPath(); g.roundRect(tx, ty, tw, th, 4); g.fill();

    g.fillStyle = vg(facingRight?tx+7:tx+2, ty, th, [0,C.suitAccent],[1,C.suitAccent2]);
    g.beginPath(); g.roundRect(facingRight?tx+7:tx+2, ty+4, 3, th-8, 2); g.fill();

    const bpX = facingRight ? tx-9 : tx+tw-2;
    g.fillStyle = C.packMid; g.beginPath(); g.roundRect(bpX, ty+4, 11, 22, 3); g.fill();
    g.fillStyle = C.packBase; g.beginPath(); g.roundRect(bpX+1, ty+5, 9, 7, 2); g.fill();
    g.fillStyle = C.goldLight; g.beginPath(); g.roundRect(bpX+1, ty+8, 2.5, 5, 1); g.fill();

    g.fillStyle = C.suit3;
    g.beginPath(); g.roundRect(facingRight?tx+2:tx+3, ty+4, 9, 13, 2); g.fill();

    g.fillStyle = C.grey2; g.beginPath(); g.roundRect(tx-1, ty+th, tw+2, 7, 2); g.fill();
    g.fillStyle = C.suit3;
    g.beginPath(); g.roundRect(facingRight?tx+1:tx-4, ty-5, 14, 8, 4); g.fill();

    // front arm (visible) – use right arm if facing right else left
    const fax = facingRight ? tx+tw+1 : tx-12;
    if (facingRight) drawArmRight(fax, ty+frontArmY);
    else             drawArmLeft(fax, ty+frontArmY);

    // back arm (tucked, partially visible)
    const bax = facingRight ? tx-8 : tx+tw-2;
    g.fillStyle = C.suit2; g.beginPath(); g.roundRect(bax, ty+4, 8, 24, 4); g.fill();
    g.fillStyle = C.skin; g.beginPath(); g.ellipse(bax+4, ty+32, 5, 7, 0, 0, Math.PI*2); g.fill();
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEGS
// ═══════════════════════════════════════════════════════════════════════════════
function legsFront(cx, ly, phase) {
    const off = [[0,0],[-6,4],[0,0],[4,-6]];
    const [lo, ro] = off[phase];
    _leg(cx-18, ly+lo, true);
    _leg(cx+2,  ly+ro, false);
}

function _leg(lx, ly, left) {
    const gr = hg(lx, ly, 17, left?[0,C.pantLight]:[0,C.pant], left?[1,C.pant]:[1,C.pantLight]);
    g.fillStyle = vg(lx, ly, 30, [0,C.pant],[0.5,C.pantDark],[1,C.pant]);
    g.beginPath(); g.roundRect(lx, ly, 17, 30, 4); g.fill();
    g.fillStyle = gr; g.fillRect(lx+1, ly+1, 15, 28);
    g.fillStyle = 'rgba(255,255,255,0.07)';
    g.beginPath(); g.ellipse(lx+8.5, ly+15, 6, 5, 0, 0, Math.PI*2); g.fill();
    const bGr = hg(lx-2, ly+28, 21, left?[0,C.bootLight]:[0,C.bootBase],
                                     left?[1,C.bootBase]:[1,C.bootLight]);
    g.fillStyle = bGr; g.beginPath(); g.roundRect(lx-2, ly+27, 21, 10, 3); g.fill();
    g.fillStyle = C.bootLight; g.beginPath(); g.roundRect(lx, ly+28, 17, 5, 2); g.fill();
    const toeSide = left ? lx-2 : lx+13;
    g.fillStyle = C.grey1; g.beginPath(); g.roundRect(toeSide, ly+33, 7, 4, 2); g.fill();
}

function legsSide(cx, ly, phase, facingRight) {
    const off = [[0,0],[-6,4],[0,0],[4,-6]];
    const [fo, bo] = off[phase];
    _legSide(cx-8, ly+bo, false, facingRight);
    _legSide(cx-8, ly+fo, true, facingRight);
}

function _legSide(lx, ly, front, facingRight) {
    g.fillStyle = vg(lx, ly, 30, front?[0,C.pantLight]:[0,C.pantDark],
                                  front?[1,C.pantDark]:[1,C.pant]);
    g.beginPath(); g.roundRect(lx, ly, 17, 30, 4); g.fill();
    if(front){ g.fillStyle='rgba(255,255,255,0.07)'; g.beginPath(); g.ellipse(lx+8.5,ly+15,5.5,4,0,0,Math.PI*2); g.fill(); }
    g.fillStyle = front ? C.bootMid : C.bootBase;
    g.beginPath(); g.roundRect(lx-2, ly+27, 21, 10, 3); g.fill();
    g.fillStyle = front ? C.bootLight : C.bootMid;
    g.beginPath(); g.roundRect(lx, ly+28, 17, 5, 2); g.fill();
    const toeX = facingRight ? lx+13 : lx-2;
    g.fillStyle = C.grey1; g.beginPath(); g.roundRect(toeX, ly+33, 7, 4, 2); g.fill();
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
});

// ── Row 1: walk-left ──────────────────────────────────────────────────────────
for(let f=0;f<4;f++) frame(f,1,()=>{
    groundShadow(CX, SHADOW_Y);
    legsSide(CX, LEG_Y, f, false);
    torsoSide(CX, TORSO_Y, false, ARM[f].r);
    neck(CX-4, NECK_Y, true);
    headLeft(CX+2, HEAD_Y+12);
});

// ── Row 2: walk-right ─────────────────────────────────────────────────────────
for(let f=0;f<4;f++) frame(f,2,()=>{
    groundShadow(CX, SHADOW_Y);
    legsSide(CX, LEG_Y, f, true);
    torsoSide(CX, TORSO_Y, true, ARM[f].l);
    neck(CX+4, NECK_Y, true);
    headRight(CX-2, HEAD_Y+12);
});

// ── Row 3: walk-up ────────────────────────────────────────────────────────────
for(let f=0;f<4;f++) frame(f,3,()=>{
    groundShadow(CX, SHADOW_Y);
    legsFront(CX, LEG_Y, f);
    torsoBack(CX, TORSO_Y, ARM[f].l, ARM[f].r);
    neck(CX, NECK_Y);
    headBack(CX, HEAD_Y+12);
});

// ── Row 4: idle-down ──────────────────────────────────────────────────────────
for(let f=0;f<4;f++) frame(f,4,()=>{
    groundShadow(CX, SHADOW_Y);
    legsFront(CX, LEG_Y, 0);
    torsoFront(CX, TORSO_Y, 0, 0);
    neck(CX, NECK_Y);
    headFront(CX, HEAD_Y+12);
});

writeFileSync('assets/morgan_sprite.png', canvas.toBuffer('image/png'));
console.log(`✓ assets/morgan_sprite.png  (${canvas.width}×${canvas.height})`);
