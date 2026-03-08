/**
 * Generates a beautiful Prey-style tile atlas  (tiles.png)
 * and a props atlas (props.png).
 *
 * tiles.png  – 320×320, 5×5 grid of 64×64 tiles
 *   col,row:
 *   0,0 floor-plain      1,0 floor-panel     2,0 floor-edge
 *   0,1 wall-plain       1,1 wall-tech        2,1 wall-vent
 *   3,1 wall-corner      4,1 wall-top
 *   0,2 window           1,2 door-closed      2,2 door-open
 *   0,3 space-void       1,3 ceiling-edge
 *
 * props.png – 256×192, 4×3 grid of 64×64
 *   0,0 desk   1,0 computer   2,0 bed   3,0 bookshelf
 *   0,1 chair  1,1 mug        2,1 lamp  3,1 locker
 */

import { createCanvas } from '@napi-rs/canvas';
import { writeFileSync }  from 'node:fs';

// ── helpers ───────────────────────────────────────────────────────────────────
function makePng(canvas) { return canvas.toBuffer('image/png'); }

function save(canvas, path) {
    writeFileSync(path, makePng(canvas));
    console.log(`✓ ${path}  (${canvas.width}×${canvas.height})`);
}

function tile(ctx, col, row, fn) {
    ctx.save();
    ctx.translate(col * 64, row * 64);
    fn(ctx);
    ctx.restore();
}

function vg(ctx, x, y, h, ...stops) {
    const g = ctx.createLinearGradient(x, y, x, y + h);
    stops.forEach(([t, c]) => g.addColorStop(t, c));
    return g;
}
function hg(ctx, x, y, w, ...stops) {
    const g = ctx.createLinearGradient(x, y, x + w, y);
    stops.forEach(([t, c]) => g.addColorStop(t, c));
    return g;
}
function rg(ctx, x, y, r, ...stops) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    stops.forEach(([t, c]) => g.addColorStop(t, c));
    return g;
}

// ── TILES ATLAS ───────────────────────────────────────────────────────────────
{
    const COLS = 5, ROWS = 5, S = 64;
    const canvas = createCanvas(COLS * S, ROWS * S);
    const ctx = canvas.getContext('2d');

    // ── floor-plain (0,0) ─────────────────────────────────────────────────────
    tile(ctx, 0, 0, c => {
        // Base dark metal
        c.fillStyle = vg(c, 0,0,64, [0,'#1c1e28'], [1,'#161820']);
        c.fillRect(0, 0, 64, 64);
        // Subtle grid lines
        c.strokeStyle = '#23263080'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(32,0); c.lineTo(32,64); c.stroke();
        c.beginPath(); c.moveTo(0,32); c.lineTo(64,32); c.stroke();
        // Panel seam lines
        c.strokeStyle = '#0d0f1680'; c.lineWidth = 1;
        c.strokeRect(2, 2, 60, 60);
        // Reflection highlight
        c.fillStyle = 'rgba(100,160,200,0.04)';
        c.fillRect(0, 0, 64, 20);
        // Floor drain accent
        c.strokeStyle = '#1d4d6040'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(0,63); c.lineTo(64,63); c.stroke();
    });

    // ── floor-panel (1,0) – darker floor with teal trim ──────────────────────
    tile(ctx, 1, 0, c => {
        c.fillStyle = vg(c, 0,0,64, [0,'#181a24'], [1,'#131520']);
        c.fillRect(0, 0, 64, 64);
        // Cross inset
        c.fillStyle = '#1e2030'; c.fillRect(4,4,56,56);
        c.strokeStyle = '#12141e'; c.lineWidth = 1; c.strokeRect(4,4,56,56);
        // Teal corner accents
        c.fillStyle = '#0d4a6a';
        [[4,4,8,2],[52,4,8,2],[4,58,8,2],[52,58,8,2]].forEach(([x,y,w,h])=>c.fillRect(x,y,w,h));
        [[4,4,2,8],[58,4,2,8],[4,52,2,8],[58,52,2,8]].forEach(([x,y,w,h])=>c.fillRect(x,y,w,h));
        // Centre pip
        c.fillStyle = '#0d3d54';
        c.beginPath(); c.arc(32,32,4,0,Math.PI*2); c.fill();
        c.fillStyle = '#1a7090';
        c.beginPath(); c.arc(32,32,2,0,Math.PI*2); c.fill();
    });

    // ── floor-edge (2,0) – floor with wall-base strip ────────────────────────
    tile(ctx, 2, 0, c => {
        // Re-use floor-plain look
        c.fillStyle = vg(c, 0,0,64, [0,'#1c1e28'], [1,'#161820']);
        c.fillRect(0, 0, 64, 64);
        c.strokeStyle = '#23263060'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(32,0); c.lineTo(32,64); c.stroke();
        c.beginPath(); c.moveTo(0,32); c.lineTo(64,32); c.stroke();
        // Wall base strip at top
        c.fillStyle = vg(c,0,0,10, [0,'#2a2e3c'],[1,'#1e2230']);
        c.fillRect(0,0,64,10);
        c.fillStyle = '#1d6080'; c.fillRect(0,9,64,1);
    });

    // ── wall-plain (0,1) ─────────────────────────────────────────────────────
    tile(ctx, 0, 1, c => {
        // Wall gradient
        c.fillStyle = vg(c,0,0,64, [0,'#2e3244'], [0.6,'#252838'], [1,'#1a1d28']);
        c.fillRect(0,0,64,64);
        // Panel vertical dividers
        c.strokeStyle = '#1a1e2c'; c.lineWidth = 1;
        [16,32,48].forEach(x => {
            c.beginPath(); c.moveTo(x,0); c.lineTo(x,64); c.stroke();
        });
        // Panel highlight
        c.fillStyle = hg(c,0,0,64, [0,'rgba(80,100,140,0.12)'], [0.5,'rgba(80,100,140,0.04)'], [1,'rgba(0,0,0,0)']);
        c.fillRect(0,0,64,64);
        // Teal floor-strip light at base
        c.fillStyle = vg(c,0,56,8, [0,'#1a6890'], [1,'#0d3d52']);
        c.fillRect(0,57,64,7);
        c.fillStyle = '#41b8d8'; c.fillRect(0,56,64,1);
        // Top shadow (ceiling)
        c.fillStyle = vg(c,0,0,12, [0,'rgba(0,0,0,0.5)'], [1,'rgba(0,0,0,0)']);
        c.fillRect(0,0,64,12);
    });

    // ── wall-tech (1,1) – wall with panel/monitor ────────────────────────────
    tile(ctx, 1, 1, c => {
        // Base
        c.fillStyle = vg(c,0,0,64, [0,'#2a2e40'], [1,'#1c1e2c']);
        c.fillRect(0,0,64,64);
        // Panel inset
        c.fillStyle = '#1a1e2c';
        c.beginPath(); c.roundRect(8,10,48,36,3); c.fill();
        c.strokeStyle = '#0d3d54'; c.lineWidth = 1.5;
        c.beginPath(); c.roundRect(8,10,48,36,3); c.stroke();
        // Screen glow
        c.fillStyle = rg(c,32,28,22, [0,'rgba(30,130,170,0.4)'],[1,'rgba(10,40,60,0)']);
        c.beginPath(); c.roundRect(10,12,44,32,2); c.fill();
        // Screen lines
        c.strokeStyle = '#1a6080'; c.lineWidth = 0.7;
        for (let y=15; y<42; y+=4) {
            c.beginPath(); c.moveTo(12,y); c.lineTo(52,y); c.stroke();
        }
        // Status lights
        [[16,50,'#20d060'],[28,50,'#d04020'],[40,50,'#2080d0']].forEach(([x,y,col])=>{
            c.fillStyle = col; c.beginPath(); c.arc(x,y,3,0,Math.PI*2); c.fill();
            c.fillStyle = col.replace(')',',0.4)').replace('rgb','rgba'); c.beginPath(); c.arc(x,y,5,0,Math.PI*2); c.fill();
        });
        // Base strip
        c.fillStyle = '#41b8d8'; c.fillRect(0,56,64,1);
        c.fillStyle = vg(c,0,57,7, [0,'#1a6890'],[1,'#0d3d52']); c.fillRect(0,57,64,7);
    });

    // ── wall-vent (2,1) ───────────────────────────────────────────────────────
    tile(ctx, 2, 1, c => {
        c.fillStyle = vg(c,0,0,64, [0,'#2e3244'],[1,'#1a1d28']);
        c.fillRect(0,0,64,64);
        // Vent frame
        c.fillStyle = '#1e2230';
        c.beginPath(); c.roundRect(10,14,44,32,2); c.fill();
        c.strokeStyle = '#0d3d54'; c.lineWidth = 1;
        c.beginPath(); c.roundRect(10,14,44,32,2); c.stroke();
        // Vent slats
        c.strokeStyle = '#282c3c'; c.lineWidth = 2;
        for (let y=19; y<44; y+=6) {
            c.beginPath(); c.moveTo(12,y); c.lineTo(52,y); c.stroke();
        }
        // Interior shadow on slats
        c.strokeStyle = '#080c14'; c.lineWidth = 1;
        for (let y=21; y<44; y+=6) {
            c.beginPath(); c.moveTo(12,y); c.lineTo(52,y); c.stroke();
        }
        // Dark interior glow (air shaft)
        c.fillStyle = 'rgba(0,20,40,0.6)'; c.fillRect(12,16,40,28);
        // Base strip
        c.fillStyle = '#41b8d8'; c.fillRect(0,56,64,1);
        c.fillStyle = vg(c,0,57,7,[0,'#1a6890'],[1,'#0d3d52']); c.fillRect(0,57,64,7);
    });

    // ── wall-corner (3,1) ─────────────────────────────────────────────────────
    tile(ctx, 3, 1, c => {
        c.fillStyle = vg(c,0,0,64, [0,'#2e3244'],[1,'#1a1d28']);
        c.fillRect(0,0,64,64);
        // Corner trim
        c.fillStyle = vg(c,0,0,64, [0,'#3a3e52'],[1,'#282c3a']);
        c.fillRect(56,0,8,64);
        c.strokeStyle = '#1a1e2c'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(56,0); c.lineTo(56,64); c.stroke();
        // Gold edge trim
        c.fillStyle = vg(c,0,0,64,[0,'#a07010'],[0.5,'#d4a820'],[1,'#a07010']);
        c.fillRect(55,0,2,64);
        // Base strip
        c.fillStyle = '#41b8d8'; c.fillRect(0,56,64,1);
        c.fillStyle = vg(c,0,57,7,[0,'#1a6890'],[1,'#0d3d52']); c.fillRect(0,57,64,7);
    });

    // ── wall-top (4,1) – top-facing wall (horizontal) ────────────────────────
    tile(ctx, 4, 1, c => {
        // Floor part (bottom half)
        c.fillStyle = vg(c,0,32,32,[0,'#1c1e28'],[1,'#161820']);
        c.fillRect(0,32,64,32);
        c.strokeStyle = '#23263060'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(0,48); c.lineTo(64,48); c.stroke();
        // Wall face (top half)
        c.fillStyle = vg(c,0,0,32,[0,'#2e3244'],[1,'#22263a']);
        c.fillRect(0,0,64,32);
        c.strokeStyle = '#1a1e2c'; c.lineWidth = 1;
        [16,32,48].forEach(x=>{c.beginPath();c.moveTo(x,0);c.lineTo(x,32);c.stroke();});
        // Junction strip
        c.fillStyle = '#41b8d8'; c.fillRect(0,31,64,1);
        c.fillStyle = vg(c,0,32,6,[0,'#1a6890'],[1,'rgba(10,60,80,0)']); c.fillRect(0,32,64,6);
    });

    // ── window (0,2) ─────────────────────────────────────────────────────────
    tile(ctx, 0, 2, c => {
        // Space background
        c.fillStyle = '#050810'; c.fillRect(0,0,64,64);
        // Nebula cloud
        c.fillStyle = rg(c,20,20,30, [0,'rgba(40,10,80,0.4)'],[1,'rgba(0,0,0,0)']);
        c.fillRect(0,0,64,64);
        c.fillStyle = rg(c,50,40,25, [0,'rgba(10,30,80,0.3)'],[1,'rgba(0,0,0,0)']);
        c.fillRect(0,0,64,64);
        // Stars
        const stars = [[8,12],[15,5],[22,18],[30,8],[40,15],[50,6],[58,20],[12,30],[25,35],[38,28],[52,32],[6,50],[18,45],[32,52],[45,48],[60,55],[28,58],[48,60],[10,58]];
        stars.forEach(([x,y])=>{
            const size = Math.random() * 1.2 + 0.4;
            c.fillStyle = `rgba(240,245,255,${0.5+Math.random()*0.5})`;
            c.beginPath(); c.arc(x,y,size,0,Math.PI*2); c.fill();
        });
        // Distant planet (faint)
        c.fillStyle = rg(c,50,50,10, [0,'rgba(80,60,30,0.3)'],[0.7,'rgba(60,40,20,0.15)'],[1,'rgba(0,0,0,0)']);
        c.beginPath(); c.arc(50,50,10,0,Math.PI*2); c.fill();
        // Window frame
        c.strokeStyle = '#3a3e50'; c.lineWidth = 4;
        c.strokeRect(2,2,60,60);
        c.strokeStyle = '#505568'; c.lineWidth = 1.5;
        c.strokeRect(3,3,58,58);
        // Frame interior shadow
        c.fillStyle = 'rgba(0,0,0,0.4)';
        c.fillRect(2,2,60,5); c.fillRect(2,2,5,60);
        c.fillRect(57,2,5,60); c.fillRect(2,57,60,5);
        // Crossbar
        c.strokeStyle = '#3a3e50'; c.lineWidth = 2.5;
        c.beginPath(); c.moveTo(32,2); c.lineTo(32,62); c.stroke();
        c.beginPath(); c.moveTo(2,32); c.lineTo(62,32); c.stroke();
        // Window reflection glint
        c.strokeStyle = 'rgba(180,220,255,0.2)'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(5,5); c.lineTo(20,5); c.stroke();
        c.beginPath(); c.moveTo(5,5); c.lineTo(5,20); c.stroke();
    });

    // ── door-closed (1,2) ────────────────────────────────────────────────────
    tile(ctx, 1, 2, c => {
        c.fillStyle = vg(c,0,0,64,[0,'#2a2e3c'],[1,'#1c1e28']);
        c.fillRect(0,0,64,64);
        // Door frame
        c.fillStyle = '#383c4e'; c.fillRect(4,0,56,60);
        c.strokeStyle = '#1a1e2c'; c.lineWidth = 2;
        c.strokeRect(4,0,56,60);
        // Door panels
        c.fillStyle = vg(c,0,0,64,[0,'#2e3244'],[1,'#22263a']);
        c.fillRect(6,2,24,56); c.fillRect(34,2,24,56);
        // Door gap (center)
        c.fillStyle = '#080c14'; c.fillRect(29,2,6,56);
        c.fillStyle = vg(c,29,0,6,[0,'#1a6890'],[0.5,'rgba(10,60,80,0.3)'],[1,'rgba(0,0,0,0)']);
        c.fillRect(29,2,6,56);
        // Door handle / sensor
        c.fillStyle = '#d4a820';
        c.beginPath(); c.roundRect(25,28,14,8,3); c.fill();
        c.fillStyle = '#20d060';
        c.beginPath(); c.arc(32,32,3,0,Math.PI*2); c.fill();
        // Frame lights
        c.fillStyle = '#41b8d8'; c.fillRect(0,56,64,1);
        c.fillStyle = vg(c,0,57,7,[0,'#1a6890'],[1,'#0d3d52']); c.fillRect(0,57,64,7);
    });

    // ── door-open (2,2) ──────────────────────────────────────────────────────
    tile(ctx, 2, 2, c => {
        c.fillStyle = vg(c,0,0,64,[0,'#1c1e28'],[1,'#161820']);
        c.fillRect(0,0,64,64);
        // Floor continuation
        c.strokeStyle = '#23263060'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(32,0); c.lineTo(32,64); c.stroke();
        // Door panels slid to sides
        c.fillStyle = vg(c,0,0,64,[0,'#2e3244'],[1,'#22263a']);
        c.fillRect(0,2,14,56); c.fillRect(50,2,14,56);
        c.strokeStyle = '#1a1e2c'; c.lineWidth = 1;
        c.strokeRect(0,2,14,56); c.strokeRect(50,2,14,56);
        // Frame top
        c.fillStyle = '#383c4e'; c.fillRect(0,0,64,3);
        c.fillStyle = '#41b8d8'; c.fillRect(0,3,64,1);
        // Sensor light (green = open)
        c.fillStyle = '#20d060'; c.beginPath(); c.arc(32,10,3,0,Math.PI*2); c.fill();
        c.fillStyle = 'rgba(32,208,96,0.3)'; c.beginPath(); c.arc(32,10,6,0,Math.PI*2); c.fill();
        // Base strip
        c.fillStyle = '#41b8d8'; c.fillRect(0,56,64,1);
        c.fillStyle = vg(c,0,57,7,[0,'#1a6890'],[1,'#0d3d52']); c.fillRect(0,57,64,7);
    });

    // ── space-void (0,3) ─────────────────────────────────────────────────────
    tile(ctx, 0, 3, c => {
        c.fillStyle = '#030508'; c.fillRect(0,0,64,64);
        // Very faint nebula
        c.fillStyle = rg(c,32,32,32,[0,'rgba(20,5,40,0.3)'],[1,'rgba(0,0,0,0)']);
        c.fillRect(0,0,64,64);
        // Distant stars
        [[5,8],[12,20],[20,5],[35,12],[50,8],[58,22],[8,35],[22,42],[40,35],[55,45],[15,55],[32,58],[48,52],[60,60]].forEach(([x,y])=>{
            c.fillStyle = `rgba(200,210,255,${0.2+Math.random()*0.3})`;
            c.beginPath(); c.arc(x,y,0.6,0,Math.PI*2); c.fill();
        });
    });

    // ── ceiling-edge (1,3) – wall seen from below ────────────────────────────
    tile(ctx, 1, 3, c => {
        // Floor part
        c.fillStyle = vg(c,0,32,32,[0,'#1c1e28'],[1,'#161820']);
        c.fillRect(0,32,64,32);
        // Ceiling/wall face (bottom half of wall tile)
        c.fillStyle = vg(c,0,0,32,[0,'#1a1d28'],[1,'#22263a']);
        c.fillRect(0,0,64,32);
        c.strokeStyle = '#1a1e2c'; c.lineWidth = 1;
        [16,32,48].forEach(x=>{c.beginPath();c.moveTo(x,0);c.lineTo(x,32);c.stroke();});
        // Light strip at junction
        c.fillStyle = '#41b8d8'; c.fillRect(0,31,64,1);
        c.fillStyle = vg(c,0,32,8,[0,'#1a6890'],[1,'rgba(10,60,80,0)']); c.fillRect(0,32,64,8);
    });

    save(canvas, 'assets/tiles.png');
}

// ── PROPS ATLAS ───────────────────────────────────────────────────────────────
{
    const COLS = 4, ROWS = 3, S = 64;
    const canvas = createCanvas(COLS * S, ROWS * S);
    const ctx = canvas.getContext('2d');

    // All props are top-down view, transparent background

    // ── desk (0,0) ────────────────────────────────────────────────────────────
    tile(ctx, 0, 0, c => {
        // Desk surface
        c.fillStyle = vg(c,8,8,48,[0,'#3a3020'],[1,'#2c2418']);
        c.beginPath(); c.roundRect(6,12,52,44,4); c.fill();
        c.strokeStyle = '#1c1610'; c.lineWidth = 1.5;
        c.beginPath(); c.roundRect(6,12,52,44,4); c.stroke();
        // Highlight on surface
        c.fillStyle = 'rgba(255,220,160,0.07)';
        c.beginPath(); c.roundRect(7,13,50,10,3); c.fill();
        // Computer monitor
        c.fillStyle = '#1a1e2c';
        c.beginPath(); c.roundRect(14,14,36,24,3); c.fill();
        c.fillStyle = rg(c,32,26,14,[0,'rgba(30,120,160,0.8)'],[1,'rgba(10,40,60,0.2)']);
        c.beginPath(); c.roundRect(16,16,32,20,2); c.fill();
        // Screen glow lines
        c.strokeStyle = 'rgba(60,180,220,0.5)'; c.lineWidth = 0.8;
        for(let y=18;y<34;y+=4){c.beginPath();c.moveTo(18,y);c.lineTo(46,y);c.stroke();}
        // Monitor stand
        c.fillStyle = '#252830'; c.fillRect(29,38,6,6);
        c.fillRect(26,43,12,3);
        // Keyboard
        c.fillStyle = '#2a2e3c';
        c.beginPath(); c.roundRect(16,44,32,8,2); c.fill();
        c.strokeStyle = '#1a1e2c'; c.lineWidth = 0.5;
        for(let x=19;x<46;x+=4){c.beginPath();c.moveTo(x,45);c.lineTo(x,51);c.stroke();}
        // Mug on desk
        c.fillStyle = '#1a6890'; c.beginPath(); c.arc(54,54,5,0,Math.PI*2); c.fill();
        c.fillStyle = '#0d3d54'; c.beginPath(); c.arc(54,54,3,0,Math.PI*2); c.fill();
        c.fillStyle = 'rgba(200,220,255,0.6)'; c.beginPath(); c.arc(53,53,1.5,0,Math.PI*2); c.fill();
    });

    // ── computer terminal (1,0) ────────────────────────────────────────────────
    tile(ctx, 1, 0, c => {
        // Base
        c.fillStyle = vg(c,8,8,48,[0,'#282c3c'],[1,'#1c1e2c']);
        c.beginPath(); c.roundRect(8,8,48,48,4); c.fill();
        c.strokeStyle = '#0d3d54'; c.lineWidth = 1.5;
        c.beginPath(); c.roundRect(8,8,48,48,4); c.stroke();
        // Screen
        c.fillStyle = '#0a0e1c';
        c.beginPath(); c.roundRect(12,12,40,32,3); c.fill();
        c.fillStyle = rg(c,32,28,18,[0,'rgba(20,140,180,0.6)'],[1,'rgba(5,20,40,0)']);
        c.beginPath(); c.roundRect(14,14,36,28,2); c.fill();
        // Scrolling text lines
        c.strokeStyle = '#20c080'; c.lineWidth = 1;
        [16,20,24,28,32,36].forEach(y=>{
            const w = 10+Math.random()*20;
            c.beginPath();c.moveTo(16,y);c.lineTo(16+w,y);c.stroke();
        });
        // Status bar
        c.fillStyle = '#1a6080'; c.fillRect(12,41,40,4);
        c.fillStyle = '#20c080'; c.fillRect(12,41,15,4);
        // Buttons
        [[16,50,'#d04020'],[28,50,'#d4a820'],[40,50,'#1a6890']].forEach(([x,y,col])=>{
            c.fillStyle=col; c.beginPath(); c.roundRect(x-4,y-4,8,8,2); c.fill();
        });
    });

    // ── bed (2,0) ─────────────────────────────────────────────────────────────
    tile(ctx, 2, 0, c => {
        // Bed frame
        c.fillStyle = vg(c,4,4,56,[0,'#2a2c3a'],[1,'#1e2030']);
        c.beginPath(); c.roundRect(4,4,56,56,4); c.fill();
        c.strokeStyle = '#14161e'; c.lineWidth = 1.5;
        c.beginPath(); c.roundRect(4,4,56,56,4); c.stroke();
        // Headboard
        c.fillStyle = vg(c,4,4,14,[0,'#383c4e'],[1,'#2a2e3e']);
        c.beginPath(); c.roundRect(4,4,56,14,4); c.fill();
        c.strokeStyle = '#1a1e2c'; c.lineWidth = 1;
        c.strokeRect(6,6,52,10);
        // TranStar logo on headboard
        c.fillStyle = '#d4a820'; c.font = 'bold 8px sans-serif';
        c.textAlign='center'; c.textBaseline='middle';
        c.fillText('TRANSTAR', 32, 11);
        // Mattress
        c.fillStyle = '#ddd8c8';
        c.beginPath(); c.roundRect(6,18,52,40,3); c.fill();
        // Pillow
        c.fillStyle = '#f0ece0';
        c.beginPath(); c.roundRect(10,20,18,14,4); c.fill();
        c.beginPath(); c.roundRect(36,20,18,14,4); c.fill();
        c.strokeStyle = '#c8c4b4'; c.lineWidth = 1;
        c.beginPath(); c.roundRect(10,20,18,14,4); c.stroke();
        c.beginPath(); c.roundRect(36,20,18,14,4); c.stroke();
        // Blanket
        c.fillStyle = vg(c,6,34,24,[0,'#1e3a5a'],[1,'#142840']);
        c.beginPath(); c.roundRect(6,34,52,22,3); c.fill();
        c.strokeStyle = '#1a6890'; c.lineWidth = 0.8;
        [40,46,52].forEach(y=>{c.beginPath();c.moveTo(8,y);c.lineTo(56,y);c.stroke();});
        // Blanket pattern
        c.strokeStyle = 'rgba(65,184,216,0.25)'; c.lineWidth = 1;
        c.beginPath(); c.roundRect(8,36,48,18,2); c.stroke();
    });

    // ── bookshelf (3,0) ───────────────────────────────────────────────────────
    tile(ctx, 3, 0, c => {
        // Frame
        c.fillStyle = vg(c,4,2,60,[0,'#2c2418'],[1,'#1e1810']);
        c.beginPath(); c.roundRect(4,2,56,60,3); c.fill();
        c.strokeStyle = '#14100a'; c.lineWidth = 1.5;
        c.beginPath(); c.roundRect(4,2,56,60,3); c.stroke();
        // Shelves
        c.fillStyle = '#3a3020';
        [20,38,56].forEach(y=>{c.fillRect(6,y,52,3);});
        // Books row 1
        const bookColors = ['#8b2020','#204080','#1a6030','#806010','#6020a0','#204040','#802040','#1a4060'];
        let bx = 8;
        for(let i=0;i<7;i++){
            const bw = 5+Math.random()*4;
            c.fillStyle = bookColors[i%bookColors.length];
            c.fillRect(bx,6,bw,14);
            c.strokeStyle = 'rgba(0,0,0,0.4)'; c.lineWidth = 0.5;
            c.strokeRect(bx,6,bw,14);
            bx += bw+1;
        }
        // Books row 2
        bx = 8;
        for(let i=0;i<6;i++){
            const bw = 6+Math.random()*5;
            c.fillStyle = bookColors[(i+3)%bookColors.length];
            c.fillRect(bx,24,bw,14);
            c.strokeStyle = 'rgba(0,0,0,0.4)'; c.lineWidth = 0.5;
            c.strokeRect(bx,24,bw,14);
            bx += bw+1;
        }
        // Small items row 3 (datapad, small box)
        c.fillStyle = '#1a6890'; c.beginPath(); c.roundRect(8,42,12,12,2); c.fill();
        c.fillStyle = 'rgba(30,120,160,0.7)'; c.fillRect(9,43,10,5);
        c.fillStyle = '#d4a820'; c.beginPath(); c.roundRect(24,44,10,8,1); c.fill();
        c.fillStyle = '#d04020'; c.beginPath(); c.roundRect(38,43,8,9,1); c.fill();
    });

    // ── chair (0,1) ───────────────────────────────────────────────────────────
    tile(ctx, 0, 1, c => {
        // Chair shadow
        c.fillStyle = 'rgba(0,0,30,0.25)';
        c.beginPath(); c.ellipse(32,38,22,12,0,0,Math.PI*2); c.fill();
        // Chair base/wheels
        c.fillStyle = '#282c38';
        [[32,46],[20,44],[44,44],[18,52],[46,52]].forEach(([x,y])=>{
            c.beginPath(); c.arc(x,y,3,0,Math.PI*2); c.fill();
        });
        // Chair stem
        c.fillStyle = '#3a3e4e'; c.beginPath(); c.arc(32,40,4,0,Math.PI*2); c.fill();
        // Seat
        c.fillStyle = vg(c,10,24,20,[0,'#2a2e3c'],[1,'#1e2230']);
        c.beginPath(); c.roundRect(10,24,44,20,8); c.fill();
        c.strokeStyle = '#1a1e2c'; c.lineWidth = 1;
        c.beginPath(); c.roundRect(10,24,44,20,8); c.stroke();
        // Seat highlight
        c.fillStyle = 'rgba(80,100,140,0.15)';
        c.beginPath(); c.roundRect(12,25,40,8,6); c.fill();
        // Backrest
        c.fillStyle = vg(c,14,6,18,[0,'#303444'],[1,'#222638']);
        c.beginPath(); c.roundRect(14,6,36,20,6); c.fill();
        c.strokeStyle = '#1a1e2c'; c.lineWidth = 1;
        c.beginPath(); c.roundRect(14,6,36,20,6); c.stroke();
        // Headrest
        c.fillStyle = '#383c4e';
        c.beginPath(); c.roundRect(20,4,24,8,4); c.fill();
        // Armrests
        c.fillStyle = '#2a2e3c';
        c.beginPath(); c.roundRect(8,24,6,16,3); c.fill();
        c.beginPath(); c.roundRect(50,24,6,16,3); c.fill();
    });

    // ── mug (1,1) ─────────────────────────────────────────────────────────────
    tile(ctx, 1, 1, c => {
        c.fillStyle = 'rgba(0,0,30,0.2)';
        c.beginPath(); c.ellipse(32,38,14,6,0,0,Math.PI*2); c.fill();
        // Mug body
        c.fillStyle = vg(c,18,16,32,[0,'#1a6890'],[1,'#0d3d54']);
        c.beginPath(); c.roundRect(18,16,28,30,4); c.fill();
        c.strokeStyle = '#0a2a40'; c.lineWidth = 1.5;
        c.beginPath(); c.roundRect(18,16,28,30,4); c.stroke();
        // Handle
        c.strokeStyle = '#0d3d54'; c.lineWidth = 5; c.lineCap='round';
        c.beginPath(); c.arc(50,31,8,Math.PI*0.6,Math.PI*1.4); c.stroke();
        // Coffee
        c.fillStyle = vg(c,20,18,8,[0,'#1a0a04'],[1,'#2a1208']);
        c.beginPath(); c.ellipse(32,22,12,5,0,0,Math.PI*2); c.fill();
        // Logo
        c.fillStyle = '#d4a820'; c.font = 'bold 7px sans-serif';
        c.textAlign='center'; c.textBaseline='middle';
        c.fillText('TI', 32, 33);
        // Steam
        c.strokeStyle = 'rgba(200,200,200,0.3)'; c.lineWidth = 1.5; c.lineCap='round';
        c.beginPath(); c.moveTo(26,14); c.bezierCurveTo(24,10,28,6,26,2); c.stroke();
        c.beginPath(); c.moveTo(32,13); c.bezierCurveTo(30,9,34,5,32,1); c.stroke();
        c.beginPath(); c.moveTo(38,14); c.bezierCurveTo(36,10,40,6,38,2); c.stroke();
    });

    // ── lamp / ceiling light (2,1) ────────────────────────────────────────────
    tile(ctx, 2, 1, c => {
        // Glow
        c.fillStyle = rg(c,32,32,28,[0,'rgba(255,240,180,0.35)'],[1,'rgba(255,220,100,0)']);
        c.fillRect(0,0,64,64);
        // Lamp base (top-down)
        c.fillStyle = vg(c,16,16,32,[0,'#505060'],[1,'#383844']);
        c.beginPath(); c.ellipse(32,32,20,20,0,0,Math.PI*2); c.fill();
        c.strokeStyle = '#282830'; c.lineWidth = 2;
        c.beginPath(); c.ellipse(32,32,20,20,0,0,Math.PI*2); c.stroke();
        // Bulb
        c.fillStyle = rg(c,32,32,10,[0,'rgba(255,245,200,0.95)'],[1,'rgba(255,220,100,0.3)']);
        c.beginPath(); c.ellipse(32,32,10,10,0,0,Math.PI*2); c.fill();
        // Cross shadow
        c.strokeStyle = 'rgba(40,40,50,0.4)'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(32,12); c.lineTo(32,52); c.stroke();
        c.beginPath(); c.moveTo(12,32); c.lineTo(52,32); c.stroke();
    });

    // ── locker (3,1) ─────────────────────────────────────────────────────────
    tile(ctx, 3, 1, c => {
        // Body
        c.fillStyle = vg(c,6,4,56,[0,'#303444'],[1,'#20232e']);
        c.beginPath(); c.roundRect(6,4,52,56,3); c.fill();
        c.strokeStyle = '#1a1e28'; c.lineWidth = 1.5;
        c.beginPath(); c.roundRect(6,4,52,56,3); c.stroke();
        // Highlight
        c.fillStyle = 'rgba(80,100,140,0.1)';
        c.fillRect(8,6,6,52);
        // Centre divider
        c.strokeStyle = '#1a1e28'; c.lineWidth = 2;
        c.beginPath(); c.moveTo(32,4); c.lineTo(32,60); c.stroke();
        // Locker doors
        c.strokeStyle = '#2a2e3c'; c.lineWidth = 1;
        c.beginPath(); c.roundRect(8,6,22,52,2); c.stroke();
        c.beginPath(); c.roundRect(34,6,22,52,2); c.stroke();
        // Handles
        c.fillStyle = '#d4a820';
        c.beginPath(); c.roundRect(26,28,4,8,2); c.fill();
        c.beginPath(); c.roundRect(34,28,4,8,2); c.fill();
        // Ventilation slats
        c.strokeStyle = '#1a1e28'; c.lineWidth = 0.8;
        [12,16,20].forEach(y=>{
            c.beginPath(); c.moveTo(10,y); c.lineTo(28,y); c.stroke();
            c.beginPath(); c.moveTo(36,y); c.lineTo(54,y); c.stroke();
        });
        // Nameplate
        c.fillStyle = '#1a6890';
        c.beginPath(); c.roundRect(10,42,18,6,1); c.fill();
        c.beginPath(); c.roundRect(36,42,18,6,1); c.fill();
        c.fillStyle = 'rgba(200,240,255,0.6)'; c.font = '5px sans-serif';
        c.textAlign='center'; c.textBaseline='middle';
        c.fillText('YU', 19, 45); c.fillText('YU', 45, 45);
    });

    // ── empty slots (rows 2) – fill transparent ───────────────────────────────
    // (already transparent by default)

    save(canvas, 'assets/props.png');
}

console.log('\nDone! Run the game to see the new tiles.');
