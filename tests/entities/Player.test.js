import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Player } from '../../src/entities/Player.js';
import { PLAYER_CONFIG, ANIMATIONS } from '../../src/config/constants.js';

// Mock Kaplay
const createMockKaplay = () => {
    const mockEntity = {
        pos: { x: 192, y: 192 },
        flipX: false,
        curAnim: vi.fn(() => 'idle-down'),
        play: vi.fn(),
        move: vi.fn(),
        onUpdate: vi.fn(),
    };

    return {
        add: vi.fn(() => mockEntity),
        sprite: vi.fn(),
        pos: vi.fn((x, y) => ({ x, y })),
        vec2: vi.fn((x, y) => ({ x, y })),
        area: vi.fn(),
        z: vi.fn(),
        body: vi.fn(),
        scale: vi.fn(),
        anchor: vi.fn(),
        setCamPos: vi.fn(),
        Rect: vi.fn(function(offset, width, height) {
            this.offset = offset;
            this.width = width;
            this.height = height;
        }),
        mockEntity,
    };
};

describe('Player', () => {
    let mockK;
    let player;

    beforeEach(() => {
        mockK = createMockKaplay();
        player = new Player(mockK, { x: 192, y: 192 });
    });

    describe('constructor', () => {
        it('should initialize with correct default values', () => {
            expect(player.k).toBe(mockK);
            expect(player.position).toEqual({ x: 192, y: 192 });
            expect(player.entity).toBeNull();
        });

        it('should use default position if not provided', () => {
            const defaultPlayer = new Player(mockK);
            expect(defaultPlayer.position).toEqual({ x: 192, y: 192 });
        });
    });

    describe('create', () => {
        it('should create player entity with correct components', () => {
            player.create();
            
            expect(mockK.add).toHaveBeenCalled();
            expect(player.entity).toBeDefined();
            expect(player.entity).not.toBeNull();
        });

        it('should setup camera to follow player', () => {
            player.create();
            expect(player.entity.onUpdate).toHaveBeenCalled();
        });
    });

    describe('move', () => {
        it('should move entity when created', () => {
            player.create();
            player.move(10, 20);
            
            expect(mockK.mockEntity.move).toHaveBeenCalledWith(10, 20);
        });

        it('should not throw when entity is null', () => {
            expect(() => player.move(10, 20)).not.toThrow();
        });
    });

    describe('playAnimation', () => {
        it('should play animation if different from current', () => {
            player.create();
            mockK.mockEntity.curAnim.mockReturnValue('idle-down');
            
            player.playAnimation(ANIMATIONS.walkDown);
            
            expect(mockK.mockEntity.play).toHaveBeenCalledWith(ANIMATIONS.walkDown);
        });

        it('should not play animation if same as current', () => {
            player.create();
            mockK.mockEntity.curAnim.mockReturnValue('walk-down');
            
            player.playAnimation(ANIMATIONS.walkDown);
            
            expect(mockK.mockEntity.play).not.toHaveBeenCalled();
        });

        it('should handle null entity gracefully', () => {
            expect(() => player.playAnimation('idle-down')).not.toThrow();
        });
    });

    describe('setFlip', () => {
        it('should set flipX property', () => {
            player.create();
            
            player.setFlip(true);
            expect(mockK.mockEntity.flipX).toBe(true);
            
            player.setFlip(false);
            expect(mockK.mockEntity.flipX).toBe(false);
        });

        it('should handle null entity gracefully', () => {
            expect(() => player.setFlip(true)).not.toThrow();
        });
    });

    describe('getCurrentAnimation', () => {
        it('should return current animation', () => {
            player.create();
            mockK.mockEntity.curAnim.mockReturnValue('walk-up');
            
            expect(player.getCurrentAnimation()).toBe('walk-up');
        });

        it('should return null when entity is null', () => {
            expect(player.getCurrentAnimation()).toBeNull();
        });
    });

    describe('getPosition', () => {
        it('should return entity position', () => {
            player.create();
            
            const pos = player.getPosition();
            expect(pos).toEqual({ x: 192, y: 192 });
        });

        it('should return null when entity is null', () => {
            expect(player.getPosition()).toBeNull();
        });
    });
});
