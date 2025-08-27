import { AudioManager } from '../src/audio';

describe('AudioManager', () => {
  let audioManager: AudioManager;

  beforeEach(() => {
    // Mock console methods
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    audioManager = new AudioManager();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Audio Support Detection', () => {
    it('should detect Web Audio API support', () => {
      expect(audioManager.isAudioSupported()).toBe(true);
    });

    it('should detect Speech Synthesis support', () => {
      expect(audioManager.isSpeechSupported()).toBe(true);
    });
  });

  describe('Audio Settings', () => {
    it('should enable and disable audio', () => {
      audioManager.setAudioEnabled(true);
      expect(audioManager.isAudioEnabled).toBe(true);
      
      audioManager.setAudioEnabled(false);
      expect(audioManager.isAudioEnabled).toBe(false);
    });

    it('should enable and disable speech', () => {
      audioManager.setSpeechEnabled(true);
      expect(audioManager.isSpeechEnabled).toBe(true);
      
      audioManager.setSpeechEnabled(false);
      expect(audioManager.isSpeechEnabled).toBe(false);
    });
  });

  describe('Basic Audio Methods', () => {
    it('should have playWarning method', () => {
      expect(typeof audioManager.playWarning).toBe('function');
    });

    it('should have playEnd method', () => {
      expect(typeof audioManager.playEnd).toBe('function');
    });

    it('should have playStart method', () => {
      expect(typeof audioManager.playStart).toBe('function');
    });

    it('should have speakCountdown method', () => {
      expect(typeof audioManager.speakCountdown).toBe('function');
    });
  });
});
