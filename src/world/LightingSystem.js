/**
 * Dynamic lighting system — renders a full-screen darkness overlay
 * with a flashlight cone + ambient glow around the player.
 *
 * Uses a Kaplay custom GLSL shader on a fixed full-screen rectangle
 * so it integrates natively with the WebGL renderer.
 */
export class LightingSystem {
    constructor(k) {
        this.k = k;
        this.overlay = null;
        this.flickerTime = 0;
    }

    /**
     * Load shaders and create the overlay object.
     * Must be called after kaplay() is initialised.
     */
    init() {
        const k = this.k;

        k.loadShader('darkness', null, `
            uniform vec2  u_lightPos;      // player screen pos (px)
            uniform vec2  u_coneDir;       // normalised facing direction
            uniform float u_coneHalfAngle; // half-angle of flashlight cone (radians)
            uniform float u_coneLen;       // flashlight reach (px)
            uniform float u_ambientRadius; // soft ambient glow radius (px)
            uniform float u_flicker;       // 0..1 subtle flicker value
            uniform float u_darkness;      // overall darkness alpha 0..1

            vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
                vec2  d    = pos - u_lightPos;
                float dist = length(d);

                // ── Ambient glow (small soft circle around player) ─────────
                float ambient = smoothstep(u_ambientRadius, u_ambientRadius * 0.05, dist) * 0.75;

                // ── Flashlight cone ────────────────────────────────────────
                float cone = 0.0;
                if (dist > 0.5) {
                    vec2  dir     = d / dist;
                    float cosA    = dot(dir, u_coneDir);
                    float edge    = cos(u_coneHalfAngle);
                    // soft cone edge
                    float inCone  = smoothstep(edge - 0.12, edge + 0.04, cosA);
                    // distance falloff inside cone
                    float falloff = smoothstep(u_coneLen, u_coneLen * 0.15, dist);
                    // inner bright spot near player
                    float near    = smoothstep(u_coneLen * 0.55, 0.0, dist) * 0.35;
                    cone = clamp((inCone * falloff + near) * (0.92 + u_flicker * 0.08), 0.0, 1.0);
                }

                // ── Combine ────────────────────────────────────────────────
                float light    = clamp(ambient + cone, 0.0, 1.0);
                float darkness = (1.0 - light) * u_darkness;

                // Dark blue-tinted shadows (space-station atmosphere)
                return vec4(0.0, 0.01, 0.06, darkness);
            }
        `);

        // Full-screen fixed overlay — won't scroll with the camera
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

    /**
     * Update facing direction each frame.
     * @param {number} angle - radians (0=right, PI/2=down, PI=left, -PI/2=up)
     */
    setFacing(angle) {
        this.facingAngle = angle;
    }

    /**
     * Build uniform values for this frame.
     * @private
     */
    _uniforms() {
        const k = this.k;
        this.flickerTime += 0.016;

        // Subtle flicker (sin wave at ~3 Hz)
        const flicker = (Math.sin(this.flickerTime * 3.1) * 0.5 + 0.5) * 0.4;

        // Camera always follows player, so player is always at screen center
        const sx = k.width()  / 2;
        const sy = k.height() / 2;

        // Facing direction as a unit vector
        const angle = this.facingAngle ?? (Math.PI / 2);
        const dirX  = Math.cos(angle);
        const dirY  = Math.sin(angle);

        return {
            u_lightPos:      k.vec2(sx, sy),
            u_coneDir:       k.vec2(dirX, dirY),
            u_coneHalfAngle: Math.PI / 3.0,   // ~60° half = ~120° cone
            u_coneLen:       500,
            u_ambientRadius: 260,
            u_flicker:       flicker,
            u_darkness:      0.5,
        };
    }

    /**
     * Get player position — set externally each frame.
     * @private
     */
    _playerPos() {
        return this._pos ?? this.k.vec2(0, 0);
    }

    /**
     * Call this every frame with the player's world position.
     * @param {Vec2} pos
     */
    updatePlayerPos(pos) {
        this._pos = pos;
    }
}
