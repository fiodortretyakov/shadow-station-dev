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
            uniform vec2  u_lightPos;
            uniform vec2  u_coneDir;
            uniform float u_coneHalfAngle;
            uniform float u_coneLen;
            uniform float u_ambientRadius;
            uniform float u_flicker;
            uniform float u_darkness;

            vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
                vec2  d    = pos - u_lightPos;
                float dist = length(d);

                // Base room ambient — always lit, slight falloff at edges
                float roomLight = 0.55;

                // Soft player glow
                float ambient = smoothstep(u_ambientRadius, 20.0, dist) * 0.35;

                // Flashlight cone
                float cone = 0.0;
                if (dist > 0.5) {
                    vec2  dir    = d / dist;
                    float cosA   = dot(dir, u_coneDir);
                    float edge   = cos(u_coneHalfAngle);
                    float inCone = smoothstep(edge - 0.15, edge + 0.05, cosA);
                    float falloff= smoothstep(u_coneLen, u_coneLen * 0.1, dist);
                    float near   = smoothstep(u_coneLen * 0.4, 0.0, dist) * 0.2;
                    cone = clamp((inCone * falloff + near) * (0.95 + u_flicker * 0.05), 0.0, 1.0);
                }

                float light    = clamp(roomLight + ambient + cone, 0.0, 1.0);
                float darkness = (1.0 - light) * u_darkness;

                return vec4(0.0, 0.01, 0.05, darkness);
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
            u_coneHalfAngle: Math.PI / 3.0,
            u_coneLen:       420,
            u_ambientRadius: 200,
            u_flicker:       flicker,
            u_darkness:      0.62,
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
