import { AudioManager } from '../src/audio';

describe('AudioManager', () => {
  let audioManager: AudioManager;
  let mockAudioElement: HTMLAudioElement;

  beforeEach(() => {
    // Mock HTML Audio Element
    mockAudioElement = {
      currentTime: 0,
      volume: 1,
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn(),
      load: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as unknown as HTMLAudioElement;

    // Mock document.getElementById
    document.getElementById = jest.fn().mockReturnValue(mockAudioElement);

    audioManager = new AudioManager();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should initialize with default settings', () => {
      expect(audioManager).toBeInstanceOf(AudioManager);
      expect(document.getElementById).toHaveBeenCalledWith('startSound');
    });

    it('should handle missing audio elements gracefully', () => {
      document.getElementById = jest.fn().mockReturnValue(null);
      
      expect(() => new AudioManager()).not.toThrow();
    });
  });

  describe('Audio Support Detection', () => {
    it('should detect Web Audio API support', () => {
      expect(audioManager.isAudioSupported()).toBe(true);
    });

    it('should detect Speech API support', () => {
      expect(audioManager.isSpeechSupported()).toBe(true);
    });

    it.skip('should handle missing Web Audio API', () => {
      const originalAudioContext = window.AudioContext;
      delete (window as any).AudioContext;
      delete (window as any).webkitAudioContext;

      expect(audioManager.isAudioSupported()).toBe(false);

      // Restore
      window.AudioContext = originalAudioContext;
    });
  });

  describe('Audio Controls', () => {
    it('should enable/disable audio', () => {
      audioManager.setAudioEnabled(false);
      audioManager.playWarning();
      
      // Should not play audio when disabled
      expect(mockAudioElement.play).not.toHaveBeenCalled();
    });

    it('should enable/disable speech', () => {
      audioManager.setSpeechEnabled(false);
      audioManager.speakCountdown(5);
      
      // Should not speak when disabled
      expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    });
  });

  describe('Play Methods', () => {
    beforeEach(() => {
      audioManager.setAudioEnabled(true);
    });

    it('should play warning sound', () => {
      audioManager.playWarning();
      
      // Should generate tone via Web Audio API
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should play end sound', () => {
      audioManager.playEnd();
      
      // Should generate beep sequence via Web Audio API
      expect(console.warn).not.toHaveBeenCalled();
    });

    it.skip('should play start sound', () => {
      audioManager.playStart();
      
      // Should generate start sequence via Web Audio API
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should handle Web Audio API errors gracefully', () => {
      // Mock Web Audio API to throw error
      const originalAudioContext = window.AudioContext;
      window.AudioContext = jest.fn().mockImplementation(() => {
        throw new Error('Audio API not supported');
      });

      audioManager.playWarning();
      
      expect(console.warn).toHaveBeenCalledWith(
        'Fehler beim Generieren des Tons:',
        expect.any(Error)
      );

      // Restore
      window.AudioContext = originalAudioContext;
    });
  });

  describe('Speech Synthesis', () => {
    beforeEach(() => {
      audioManager.setSpeechEnabled(true);
    });

    it.skip('should speak countdown at 10 seconds', () => {
      // Reset mock calls
      jest.clearAllMocks();
      
      audioManager.speakCountdown(10);
      
      expect(window.speechSynthesis.cancel).toHaveBeenCalled();
      expect(window.speechSynthesis.speak).toHaveBeenCalled();
    });

    it('should not speak for other countdown numbers', () => {
      audioManager.speakCountdown(5);
      
      expect(window.speechSynthesis.cancel).toHaveBeenCalled();
      expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    });

    it('should handle speech synthesis errors', () => {
      window.speechSynthesis.speak = jest.fn().mockImplementation(() => {
        throw new Error('Speech synthesis failed');
      });

      audioManager.speakCountdown(3);
      
      expect(console.warn).toHaveBeenCalledWith(
        'Speech API nicht verfügbar:',
        expect.any(Error)
      );
    });

    it('should not speak when speech is disabled', () => {
      audioManager.setSpeechEnabled(false);
      audioManager.speakCountdown(5);
      
      expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    });
  });

  describe('AudioContext Management', () => {
    it('should resume suspended audio context', () => {
      const mockAudioContext = {
        state: 'suspended',
        resume: jest.fn(),
      };
      
      // Mock getAudioContext to return our mock
      jest.spyOn(audioManager as any, 'getAudioContext').mockReturnValue(mockAudioContext);
      
      audioManager.resumeAudioContext();
      
      expect(mockAudioContext.resume).toHaveBeenCalled();
    });

    it('should not resume running audio context', () => {
      const mockAudioContext = {
        state: 'running',
        resume: jest.fn(),
      };
      
      jest.spyOn(audioManager as any, 'getAudioContext').mockReturnValue(mockAudioContext);
      
      audioManager.resumeAudioContext();
      
      expect(mockAudioContext.resume).not.toHaveBeenCalled();
    });
  });

  describe('Fallback Audio', () => {
    it('should handle fallback when Web Audio API fails', () => {
      // Mock Web Audio API to throw error
      const originalAudioContext = window.AudioContext;
      window.AudioContext = jest.fn().mockImplementation(() => {
        throw new Error('Audio API not supported');
      });

      audioManager.playWarning();
      
      expect(console.warn).toHaveBeenCalledWith(
        'Web Audio API nicht verfügbar - warning Sound kann nicht abgespielt werden'
      );

      // Restore
      window.AudioContext = originalAudioContext;
    });
  });
});
