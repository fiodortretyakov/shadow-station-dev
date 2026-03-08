import { SOUND_PATHS } from '../config/constants.js';

/**
 * Handles loading and playback of game audio
 */
export class SoundLoader {
    /**
     * Load all game sounds
     * @param {Object} k - Kaplay instance
     */
    static loadAllSounds(k) {
        k.loadSound('music', SOUND_PATHS.music);
    }

    /**
     * Play background music
     * @param {Object} k - Kaplay instance
     */
    static playMusic(k) {
        return k.play('music', {
            loop: true,
            volume: 0.5,
        });
    }
}
