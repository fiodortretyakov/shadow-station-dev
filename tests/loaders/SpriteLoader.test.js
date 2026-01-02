import { describe, it, expect, vi } from 'vitest';
import { SpriteLoader } from '../../src/loaders/SpriteLoader.js';
import { SPRITE_PATHS } from '../../src/config/constants.js';

const createMockKaplay = () => ({
    loadSpriteAtlas: vi.fn(),
    loadSprite: vi.fn(),
});

describe('SpriteLoader', () => {
    describe('loadAllSprites', () => {
        it('should call all loader methods', () => {
            const mockK = createMockKaplay();
            const spyWalls = vi.spyOn(SpriteLoader, 'loadWalls');
            const spyFloor = vi.spyOn(SpriteLoader, 'loadFloor');
            const spyCharacter = vi.spyOn(SpriteLoader, 'loadCharacter');
            const spyProps = vi.spyOn(SpriteLoader, 'loadProps');
            
            SpriteLoader.loadAllSprites(mockK);
            
            expect(spyWalls).toHaveBeenCalledWith(mockK);
            expect(spyFloor).toHaveBeenCalledWith(mockK);
            expect(spyCharacter).toHaveBeenCalledWith(mockK);
            expect(spyProps).toHaveBeenCalledWith(mockK);
        });
    });

    describe('loadWalls', () => {
        it('should load wall sprite atlas', () => {
            const mockK = createMockKaplay();
            SpriteLoader.loadWalls(mockK);
            
            expect(mockK.loadSpriteAtlas).toHaveBeenCalledWith(
                SPRITE_PATHS.walls,
                expect.objectContaining({
                    "wall0": expect.any(Object),
                    "glass-panel": expect.any(Object),
                })
            );
        });
    });

    describe('loadFloor', () => {
        it('should load floor sprite', () => {
            const mockK = createMockKaplay();
            SpriteLoader.loadFloor(mockK);
            
            expect(mockK.loadSprite).toHaveBeenCalledWith(
                "floor",
                SPRITE_PATHS.floor,
                expect.objectContaining({
                    sliceX: 3,
                    sliceY: 2,
                })
            );
        });
    });

    describe('loadCharacter', () => {
        it('should load character sprite with animations', () => {
            const mockK = createMockKaplay();
            SpriteLoader.loadCharacter(mockK);
            
            expect(mockK.loadSprite).toHaveBeenCalledWith(
                "morgan",
                SPRITE_PATHS.character,
                expect.objectContaining({
                    sliceX: 12,
                    sliceY: 8,
                    anims: expect.objectContaining({
                        "idle-down": expect.any(Number),
                        "walk-down": expect.any(Object),
                        "walk-left": expect.any(Object),
                        "walk-right": expect.any(Object),
                        "walk-up": expect.any(Object),
                    })
                })
            );
        });
    });

    describe('loadProps', () => {
        it('should load prop atlas with all props', () => {
            const mockK = createMockKaplay();
            SpriteLoader.loadProps(mockK);
            
            expect(mockK.loadSpriteAtlas).toHaveBeenCalledWith(
                SPRITE_PATHS.atlas,
                expect.objectContaining({
                    "bed": expect.any(Object),
                    "desk": expect.any(Object),
                    "pc": expect.any(Object),
                    "chair": expect.any(Object),
                    "bookshelf": expect.any(Object),
                })
            );
        });
    });
});
