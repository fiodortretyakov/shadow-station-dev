/**
 * Custom error classes for better error handling
 */

export class GameError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GameError';
    }
}

export class SpriteLoadError extends GameError {
    constructor(spriteName, originalError) {
        super(`Failed to load sprite: ${spriteName}`);
        this.name = 'SpriteLoadError';
        this.spriteName = spriteName;
        this.originalError = originalError;
    }
}

export class EntityCreationError extends GameError {
    constructor(entityType, originalError) {
        super(`Failed to create entity: ${entityType}`);
        this.name = 'EntityCreationError';
        this.entityType = entityType;
        this.originalError = originalError;
    }
}

export class MapCreationError extends GameError {
    constructor(message, originalError) {
        super(message);
        this.name = 'MapCreationError';
        this.originalError = originalError;
    }
}

/**
 * Error handler utility
 */
export class ErrorHandler {
    /**
     * Log error and optionally show to user
     * @param {Error} error - The error to handle
     * @param {boolean} showToUser - Whether to show error to user
     */
    static handle(error, showToUser = false) {
        console.error('[Game Error]', error);
        
        if (showToUser) {
            // In a production game, this could show an in-game error message
            alert(`An error occurred: ${error.message}`);
        }
    }

    /**
     * Wrap async functions with error handling
     * @param {Function} fn - Async function to wrap
     * @param {string} context - Context for error messages
     * @returns {Function} Wrapped function
     */
    static wrapAsync(fn, context = 'Operation') {
        return async (...args) => {
            try {
                return await fn(...args);
            } catch (error) {
                ErrorHandler.handle(new GameError(`${context} failed: ${error.message}`));
                throw error;
            }
        };
    }
}
