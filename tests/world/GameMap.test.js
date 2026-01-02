import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameMap } from '../../src/world/GameMap.js';
import { TILE_CONFIG } from '../../src/config/constants.js';

const createMockKaplay = () => ({
    addLevel: vi.fn((layout, config) => ({
        layout,
        config,
        getTileAt: vi.fn((x, y) => ({ x, y, type: 'wall' })),
    })),
    sprite: vi.fn(),
    scale: vi.fn(),
    area: vi.fn(),
    body: vi.fn(),
    opacity: vi.fn(),
});

describe('GameMap', () => {
    let mockK;
    let gameMap;
    const testLayout = [
        "wwww",
        "w  w",
        "wwww",
    ];

    beforeEach(() => {
        mockK = createMockKaplay();
        gameMap = new GameMap(mockK, testLayout);
    });

    describe('constructor', () => {
        it('should initialize with correct values', () => {
            expect(gameMap.k).toBe(mockK);
            expect(gameMap.layout).toBe(testLayout);
            expect(gameMap.map).toBeNull();
        });
    });

    describe('create', () => {
        it('should create level with correct layout', () => {
            gameMap.create();
            
            expect(mockK.addLevel).toHaveBeenCalledWith(
                testLayout,
                expect.objectContaining({
                    tileWidth: TILE_CONFIG.width,
                    tileHeight: TILE_CONFIG.height,
                })
            );
        });

        it('should return the created map', () => {
            const map = gameMap.create();
            
            expect(map).toBeDefined();
            expect(gameMap.map).toBe(map);
        });

        it('should have tile definitions', () => {
            gameMap.create();
            
            const call = mockK.addLevel.mock.calls[0];
            const config = call[1];
            
            expect(config.tiles).toBeDefined();
            expect(config.tiles.w).toBeDefined();
            expect(config.tiles.g).toBeDefined();
            expect(config.tiles['.']).toBeDefined();
        });
    });

    describe('getTileAt', () => {
        it('should return tile when map exists', () => {
            gameMap.create();
            const tile = gameMap.getTileAt(0, 0);
            
            expect(tile).toBeDefined();
        });

        it('should return null when map is null', () => {
            const tile = gameMap.getTileAt(0, 0);
            
            expect(tile).toBeNull();
        });
    });
});
