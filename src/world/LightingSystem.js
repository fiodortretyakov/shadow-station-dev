/**
 * Dynamic lighting system.
 * Supports: player flashlight cone + up to 8 room point lights (ceiling/desk).
 */
export class LightingSystem {
    constructor(k) {
        this.k = k;
        this.overlay = null;
        this.flickerTime = 0;
        this._pos = null;
        this.facingAngle = Math.PI / 2;
        // World-space point lights  { x, y, radius, r, g, b }
        this.pointLights = [];
    }

    addPointLight(x, y, radius = 220, r = 1.0, g = 0.92, b = 0.75) {
        this.pointLights.push({ x, y, radius, r, g, b });
    }

    init() {
        const k = this.k;

        k.loadShader('darkness', null, `
            uniform vec2  u_lightPos;
            uniform vec2  u_coneDir;
            uniform float u_coneHalfAngle;
            uniform float u_coneLen;
            uniform float u_ambientRadius;
            uniform float u_flicker;
            uniform float u_darkness;

            // Up to 8 room point lights
            uniform vec2  u_pl[8];       // screen positions
            uniform float u_plRadius[8]; // radii
            uniform vec3  u_plColor[8];  // rgb colour tints
            uniform int   u_plCount;     // how many are active

            vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
                vec2  d    = pos - u_lightPos;
                float dist = length(d);

                // ── Room ambient (always visible) ──────────────────────────
                float room = 0.48;

                // ── Per-lamp point lights ──────────────────────────────────
                vec3 lampTint = vec3(0.0);
                for (int i = 0; i < 8; i++) {
                    if (i >= u_plCount) break;
                    float ld = distance(pos, u_pl[i]);
                    float li = smoothstep(u_plRadius[i], u_plRadius[i] * 0.05, ld) * 0.55;
                    lampTint += u_plColor[i] * li;
                }
                float lampTotal = clamp(length(lampTint) * 0.7, 0.0, 0.55);

                // ── Player ambient glow ────────────────────────────────────
                float ambient = smoothstep(u_ambientRadius, 18.0, dist) * 0.28;

                // ── Flashlight cone ────────────────────────────────────────
                float cone = 0.0;
                if (dist > 0.5) {
                    vec2  dir    = d / dist;
                    float cosA   = dot(dir, u_coneDir);
                    float edge   = cos(u_coneHalfAngle);
                    float inCone = smoothstep(edge - 0.15, edge + 0.05, cosA);
                    float falloff= smoothstep(u_coneLen, u_coneLen * 0.08, dist);
                    float near   = smoothstep(u_coneLen * 0.35, 0.0, dist) * 0.15;
                    cone = clamp((inCone * falloff + near) * (0.95 + u_flicker * 0.05), 0.0, 1.0);
                }

                float light    = clamp(room + lampTotal + ambient + cone, 0.0, 1.0);
                float darkness = (1.0 - light) * u_darkness;

                // Warm lamp tint bleeds into shadows near lamps
                vec3 tintCol = mix(vec3(0.0, 0.01, 0.05), lampTint * 0.4, clamp(lampTotal * 2.0, 0.0, 0.6));
                return vec4(tintCol, darkness);
            }
        `);

        this.overlay = k.add([
            k.rect(k.width(), k.height()),
            k.pos(0, 0),
            k.fixed(),
            k.z(50),
            k.shader('darkness', () => this._uniforms()),
            k.opacity(1),
        ]);

        return this;
    }

    setFacing(angle)         { this.facingAngle = angle; }
    updatePlayerPos(pos)     { this._pos = pos; }

    _uniforms() {
        const k = this.k;
        this.flickerTime += 0.016;
        const flicker = (Math.sin(this.flickerTime * 3.1) * 0.5 + 0.5) * 0.4;

        const sx = k.width()  / 2;
        const sy = k.height() / 2;

        const camPos   = k.getCamPos();
        const camScale = k.getCamScale();

        // Convert world-space point lights → screen space
        const MAX = 8;
        const plPos    = [];
        const plRadius = [];
        const plColor  = [];

        for (let i = 0; i < MAX; i++) {
            const pl = this.pointLights[i];
            if (pl) {
                const screenX = (pl.x - camPos.x) * camScale.x + k.width()  / 2;
                const screenY = (pl.y - camPos.y) * camScale.y + k.height() / 2;
                plPos.push(k.vec2(screenX, screenY));
                plRadius.push(pl.radius);
                plColor.push(k.vec3(pl.r, pl.g, pl.b));
            } else {
                plPos.push(k.vec2(-9999, -9999));
                plRadius.push(1);
                plColor.push(k.vec3(0, 0, 0));
            }
        }

        const angle = this.facingAngle;
        return {
            u_lightPos:      k.vec2(sx, sy),
            u_coneDir:       k.vec2(Math.cos(angle), Math.sin(angle)),
            u_coneHalfAngle: Math.PI / 3.0,
            u_coneLen:       380,
            u_ambientRadius: 160,
            u_flicker:       flicker,
            u_darkness:      0.58,
            u_pl:            plPos,
            u_plRadius:      plRadius,
            u_plColor:       plColor,
            u_plCount:       Math.min(this.pointLights.length, MAX),
        };
    }
}
