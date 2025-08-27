import { Timer } from '../src/timer';
import { AudioManager } from '../src/audio';
import { TimerCallbacks, TimerState, TimerStatus } from '../src/types';

describe('Timer', () => {
  let timer: Timer;
  let mockAudioManager: jest.Mocked<AudioManager>;
  let mockCallbacks: jest.Mocked<TimerCallbacks>;

  beforeEach(() => {
    // Mock AudioManager
    mockAudioManager = {
      playWarning: jest.fn(),
      playEnd: jest.fn(),
      playStart: jest.fn(),
      speakCountdown: jest.fn(),
      isSpeechSupported: jest.fn().mockReturnValue(true),
      isAudioSupported: jest.fn().mockReturnValue(true),
      setAudioEnabled: jest.fn(),
      setSpeechEnabled: jest.fn(),
      resumeAudioContext: jest.fn(),
      startSound: {} as HTMLAudioElement,
    };

    // Mock TimerCallbacks
    mockCallbacks = {
      onTick: jest.fn(),
      onWarning: jest.fn(),
      onEnd: jest.fn(),
      onEventStart: jest.fn(),
      onPause: jest.fn(),
      onResume: jest.fn(),
      onReset: jest.fn(),
    };

    // Mock timers
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should initialize with correct state', () => {
      timer = new Timer(60, mockCallbacks, mockAudioManager);

      expect(timer.getTotalTime()).toBe(60);
      expect(timer.getTimeRemaining()).toBe(60);
      expect(timer.isRunning()).toBe(false);
      expect(timer.isPaused()).toBe(false);
      expect(timer.getStatus()).toBe('ready');
    });

    it('should handle zero duration', () => {
      timer = new Timer(0, mockCallbacks, mockAudioManager);

      expect(timer.getTimeRemaining()).toBe(0);
      expect(timer.isFinished()).toBe(true);
    });
  });

  describe('Basic Functionality', () => {
    beforeEach(() => {
      timer = new Timer(60, mockCallbacks, mockAudioManager);
    });

    it('should pause timer correctly', () => {
      timer.start();
      timer.pause();

      expect(timer.isRunning()).toBe(false);
      expect(timer.isPaused()).toBe(true);
      expect(mockCallbacks.onPause).toHaveBeenCalled();
    });

    it('should stop timer correctly', () => {
      timer.start();
      timer.stop();

      expect(timer.isRunning()).toBe(false);
      expect(timer.isPaused()).toBe(false);
    });

    it('should reset timer correctly', () => {
      timer.start();
      jest.advanceTimersByTime(10000); // 10 seconds
      timer.reset();

      expect(timer.getTimeRemaining()).toBe(60);
      expect(timer.isRunning()).toBe(false);
      expect(timer.isPaused()).toBe(false);
      expect(mockCallbacks.onReset).toHaveBeenCalled();
    });
  });

  describe('State Management', () => {
    beforeEach(() => {
      timer = new Timer(60, mockCallbacks, mockAudioManager);
    });

    it('should return correct state', () => {
      const state = timer.getState();
      
      expect(state.isRunning).toBe(false);
      expect(state.isPaused).toBe(false);
      expect(state.timeRemaining).toBe(60);
      expect(state.totalTime).toBe(60);
    });

    it('should return correct status', () => {
      expect(timer.getStatus()).toBe('ready');
    });

    it('should return correct time values', () => {
      expect(timer.getTimeRemaining()).toBe(60);
      expect(timer.getTotalTime()).toBe(60);
    });

    it('should check running state correctly', () => {
      expect(timer.isRunning()).toBe(false);
      expect(timer.isPaused()).toBe(false);
      expect(timer.isFinished()).toBe(false);
    });
  });

  describe('Format Time', () => {
    beforeEach(() => {
      timer = new Timer(60, mockCallbacks, mockAudioManager);
    });

    it('should format time correctly', () => {
      expect(timer.formatTime(0)).toBe('00:00:00');
      expect(timer.formatTime(61)).toBe('00:01:01');
      expect(timer.formatTime(3661)).toBe('01:01:01');
    });
  });
});
