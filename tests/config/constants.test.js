import { describe, it, expect } from 'vitest';
import {
    GAME_CONFIG,
    PLAYER_CONFIG,
    TILE_CONFIG,
    SPRITE_PATHS,
    ANIMATIONS,
} from '../../src/config/constants.js';

describe('Constants Configuration', () => {
    describe('GAME_CONFIG', () => {
        it('should have correct game settings', () => {
            expect(GAME_CONFIG.crisp).toBe(true);
            expect(GAME_CONFIG.pixelDensity).toBe(2);
            expect(GAME_CONFIG.pixelate).toBe(true);
            expect(GAME_CONFIG.texFilter).toBe('nearest');
        });
    });

    describe('PLAYER_CONFIG', () => {
        it('should have correct player settings', () => {
            expect(PLAYER_CONFIG.speed).toBe(256);
            expect(PLAYER_CONFIG.scale).toBe(0.8);
            expect(PLAYER_CONFIG.zIndex).toBe(10);
        });

        it('should have valid collision box configuration', () => {
            expect(PLAYER_CONFIG.collisionBox.offsetX).toBe(2);
            expect(PLAYER_CONFIG.collisionBox.offsetY).toBe(10);
            expect(PLAYER_CONFIG.collisionBox.width).toBe(12);
            expect(PLAYER_CONFIG.collisionBox.height).toBe(6);
        });
    });

    describe('TILE_CONFIG', () => {
        it('should have correct tile dimensions', () => {
            expect(TILE_CONFIG.width).toBe(64);
            expect(TILE_CONFIG.height).toBe(64);
        });

        it('should have correct scale values', () => {
            expect(TILE_CONFIG.wallScale).toBe(1);
            expect(TILE_CONFIG.glassScale).toBe(1);
            expect(TILE_CONFIG.floorScale).toBe(1);
        });
    });

    describe('SPRITE_PATHS', () => {
        it('should have all required sprite paths', () => {
            expect(SPRITE_PATHS.walls).toBe('assets/Gemini_Generated_Image_3f987a3f987a3f98.png');
            expect(SPRITE_PATHS.floor).toBe('assets/Gemini_Generated_Image_c5hlgmc5hlgmc5hl.png');
            expect(SPRITE_PATHS.character).toBe('assets/Gemini_Generated_Image_oe0aakoe0aakoe0a.png');
            expect(SPRITE_PATHS.atlas).toBe('assets/Gemini_Generated_Image_3f987a3f987a3f98.png');
        });
    });

    describe('ANIMATIONS', () => {
        it('should have all required animation names', () => {
            expect(ANIMATIONS.idleDown).toBe('idle-down');
            expect(ANIMATIONS.walkDown).toBe('walk-down');
            expect(ANIMATIONS.walkLeft).toBe('walk-left');
            expect(ANIMATIONS.walkRight).toBe('walk-right');
            expect(ANIMATIONS.walkUp).toBe('walk-up');
        });
    });
});
