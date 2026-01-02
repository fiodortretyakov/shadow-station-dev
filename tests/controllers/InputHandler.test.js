import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InputHandler } from '../../src/controllers/InputHandler.js';
import { ANIMATIONS, PLAYER_CONFIG } from '../../src/config/constants.js';

const createMockPlayer = () => ({
    move: vi.fn(),
    setFlip: vi.fn(),
    playAnimation: vi.fn(),
});

const createMockKaplay = () => ({
    onKeyDown: vi.fn(),
    onKeyRelease: vi.fn(),
    isKeyDown: vi.fn(() => false),
});

describe('InputHandler', () => {
    let mockK;
    let mockPlayer;
    let inputHandler;

    beforeEach(() => {
        mockK = createMockKaplay();
        mockPlayer = createMockPlayer();
        inputHandler = new InputHandler(mockK, mockPlayer);
    });

    describe('constructor', () => {
        it('should initialize with correct values', () => {
            expect(inputHandler.k).toBe(mockK);
            expect(inputHandler.player).toBe(mockPlayer);
            expect(inputHandler.speed).toBe(PLAYER_CONFIG.speed);
        });
    });

    describe('setupControls', () => {
        it('should call setupKeyboardControls', () => {
            const spy = vi.spyOn(inputHandler, 'setupKeyboardControls');
            inputHandler.setupControls();
            
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('setupKeyboardControls', () => {
        it('should register all directional key handlers', () => {
            inputHandler.setupKeyboardControls();
            
            expect(mockK.onKeyDown).toHaveBeenCalledWith("left", expect.any(Function));
            expect(mockK.onKeyDown).toHaveBeenCalledWith("right", expect.any(Function));
            expect(mockK.onKeyDown).toHaveBeenCalledWith("up", expect.any(Function));
            expect(mockK.onKeyDown).toHaveBeenCalledWith("down", expect.any(Function));
        });

        it('should register key release handler', () => {
            inputHandler.setupKeyboardControls();
            
            expect(mockK.onKeyRelease).toHaveBeenCalledWith(
                ["left", "right", "up", "down"],
                expect.any(Function)
            );
        });

        it('should handle left key correctly', () => {
            inputHandler.setupKeyboardControls();
            
            const leftHandler = mockK.onKeyDown.mock.calls.find(call => call[0] === "left")[1];
            leftHandler();
            
            expect(mockPlayer.move).toHaveBeenCalledWith(-PLAYER_CONFIG.speed, 0);
            expect(mockPlayer.setFlip).toHaveBeenCalledWith(true);
            expect(mockPlayer.playAnimation).toHaveBeenCalledWith(ANIMATIONS.walkRight);
        });

        it('should handle right key correctly', () => {
            inputHandler.setupKeyboardControls();
            
            const rightHandler = mockK.onKeyDown.mock.calls.find(call => call[0] === "right")[1];
            rightHandler();
            
            expect(mockPlayer.move).toHaveBeenCalledWith(PLAYER_CONFIG.speed, 0);
            expect(mockPlayer.setFlip).toHaveBeenCalledWith(false);
            expect(mockPlayer.playAnimation).toHaveBeenCalledWith(ANIMATIONS.walkRight);
        });

        it('should handle up key correctly', () => {
            inputHandler.setupKeyboardControls();
            
            const upHandler = mockK.onKeyDown.mock.calls.find(call => call[0] === "up")[1];
            upHandler();
            
            expect(mockPlayer.move).toHaveBeenCalledWith(0, -PLAYER_CONFIG.speed);
            expect(mockPlayer.playAnimation).toHaveBeenCalledWith(ANIMATIONS.walkUp);
        });

        it('should handle down key correctly', () => {
            inputHandler.setupKeyboardControls();
            
            const downHandler = mockK.onKeyDown.mock.calls.find(call => call[0] === "down")[1];
            downHandler();
            
            expect(mockPlayer.move).toHaveBeenCalledWith(0, PLAYER_CONFIG.speed);
            expect(mockPlayer.playAnimation).toHaveBeenCalledWith(ANIMATIONS.walkDown);
        });

        it('should play idle animation when no keys are pressed', () => {
            inputHandler.setupKeyboardControls();
            mockK.isKeyDown.mockReturnValue(false);
            
            const releaseHandler = mockK.onKeyRelease.mock.calls[0][1];
            releaseHandler();
            
            expect(mockPlayer.playAnimation).toHaveBeenCalledWith(ANIMATIONS.idleDown);
        });

        it('should not play idle animation when keys are still pressed', () => {
            inputHandler.setupKeyboardControls();
            mockK.isKeyDown.mockReturnValue(true);
            
            const releaseHandler = mockK.onKeyRelease.mock.calls[0][1];
            releaseHandler();
            
            expect(mockPlayer.playAnimation).not.toHaveBeenCalledWith(ANIMATIONS.idleDown);
        });
    });
});
