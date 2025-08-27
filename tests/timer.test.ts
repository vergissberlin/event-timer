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

  describe('Start/Stop/Pause', () => {
    beforeEach(() => {
      timer = new Timer(60, mockCallbacks, mockAudioManager);
    });

    it('should start timer correctly', () => {
      timer.start();

      expect(timer.isRunning()).toBe(true);
      expect(timer.isPaused()).toBe(false);
      expect(mockCallbacks.onResume).toHaveBeenCalled();
    });

    it('should pause timer correctly', () => {
      timer.start();
      timer.pause();

      expect(timer.isRunning()).toBe(false);
      expect(timer.isPaused()).toBe(true);
      expect(mockCallbacks.onPause).toHaveBeenCalled();
    });

    it('should resume paused timer', () => {
      timer.start();
      timer.pause();
      timer.start();

      expect(timer.isRunning()).toBe(true);
      expect(timer.isPaused()).toBe(false);
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

  describe('Timer Updates', () => {
    beforeEach(() => {
      timer = new Timer(60, mockCallbacks, mockAudioManager);
    });

    it('should update time remaining correctly', () => {
      timer.start();
      jest.advanceTimersByTime(1000); // 1 second

      expect(timer.getTimeRemaining()).toBe(59);
      expect(mockCallbacks.onTick).toHaveBeenCalledWith(59);
    });

    it('should handle multiple seconds correctly', () => {
      timer.start();
      jest.advanceTimersByTime(5000); // 5 seconds

      expect(timer.getTimeRemaining()).toBe(55);
      expect(mockCallbacks.onTick).toHaveBeenCalledWith(55);
    });

    it('should stop at zero', () => {
      timer.start();
      jest.advanceTimersByTime(60000); // 60 seconds

      expect(timer.getTimeRemaining()).toBe(0);
      expect(timer.isFinished()).toBe(true);
      expect(mockCallbacks.onEnd).toHaveBeenCalled();
      expect(mockAudioManager.playEnd).toHaveBeenCalled();
    });
  });

  describe('Warning System', () => {
    beforeEach(() => {
      timer = new Timer(120, mockCallbacks, mockAudioManager); // 2 minutes
    });

    it('should trigger warning at 1 minute remaining', () => {
      timer.start();
      jest.advanceTimersByTime(60000); // 1 minute

      expect(mockCallbacks.onWarning).toHaveBeenCalled();
      expect(mockAudioManager.playWarning).toHaveBeenCalled();
      expect(timer.getStatus()).toBe('warning');
    });

    it('should trigger warning only once', () => {
      timer.start();
      jest.advanceTimersByTime(60000); // 1 minute
      jest.advanceTimersByTime(1000); // 1 more second

      expect(mockAudioManager.playWarning).toHaveBeenCalledTimes(1);
    });

    it('should not trigger warning for short timers', () => {
      const shortTimer = new Timer(30, mockCallbacks, mockAudioManager);
      shortTimer.start();
      jest.advanceTimersByTime(10000); // 10 seconds

      expect(mockAudioManager.playWarning).not.toHaveBeenCalled();
    });
  });

  describe('Speech Countdown', () => {
    beforeEach(() => {
      timer = new Timer(15, mockCallbacks, mockAudioManager); // 15 seconds
    });

    it('should trigger speech countdown for last 10 seconds', () => {
      timer.start();
      jest.advanceTimersByTime(5000); // 5 seconds (10 remaining)

      expect(mockAudioManager.speakCountdown).toHaveBeenCalledWith(10);
    });

    it('should speak each second in countdown', () => {
      timer.start();
      jest.advanceTimersByTime(5000); // 5 seconds (10 remaining)
      jest.advanceTimersByTime(1000); // 1 more second (9 remaining)

      expect(mockAudioManager.speakCountdown).toHaveBeenCalledWith(9);
    });

    it('should not speak when speech is disabled', () => {
      mockAudioManager.isSpeechSupported.mockReturnValue(false);
      timer.start();
      jest.advanceTimersByTime(5000); // 5 seconds

      expect(mockAudioManager.speakCountdown).not.toHaveBeenCalled();
    });
  });

  describe('Event Start Handling', () => {
    it('should handle event start correctly', () => {
      timer = new Timer(10, mockCallbacks, mockAudioManager);
      timer.start();
      jest.advanceTimersByTime(10000); // 10 seconds

      expect(mockCallbacks.onEventStart).toHaveBeenCalled();
      expect(mockAudioManager.playStart).toHaveBeenCalled();
    });

    it('should trigger event start only once', () => {
      timer = new Timer(10, mockCallbacks, mockAudioManager);
      timer.start();
      jest.advanceTimersByTime(10000); // 10 seconds
      jest.advanceTimersByTime(1000); // 1 more second

      expect(mockCallbacks.onEventStart).toHaveBeenCalledTimes(1);
      expect(mockAudioManager.playStart).toHaveBeenCalledTimes(1);
    });
  });

  describe('Time Formatting', () => {
    beforeEach(() => {
      timer = new Timer(3661, mockCallbacks, mockAudioManager); // 1:01:01
    });

    it('should format time correctly', () => {
      expect(timer.formatTime(3661)).toBe('01:01:01');
      expect(timer.formatTime(3600)).toBe('01:00:00');
      expect(timer.formatTime(61)).toBe('00:01:01');
      expect(timer.formatTime(1)).toBe('00:00:01');
      expect(timer.formatTime(0)).toBe('00:00:00');
    });

    it('should handle large durations', () => {
      expect(timer.formatTime(36661)).toBe('10:11:01'); // 10:11:01
    });
  });

  describe('Progress Calculation', () => {
    beforeEach(() => {
      timer = new Timer(100, mockCallbacks, mockAudioManager);
    });

    it('should calculate progress correctly', () => {
      expect(timer.getProgress()).toBe(0); // 0% at start

      timer.start();
      jest.advanceTimersByTime(50000); // 50 seconds

      expect(timer.getProgress()).toBe(50); // 50% complete
    });

    it('should handle edge cases', () => {
      expect(timer.getProgress()).toBe(0); // 0% at start

      timer.start();
      jest.advanceTimersByTime(100000); // 100 seconds (finished)

      expect(timer.getProgress()).toBe(100); // 100% complete
    });
  });

  describe('Time Manipulation', () => {
    beforeEach(() => {
      timer = new Timer(100, mockCallbacks, mockAudioManager);
    });

    it('should set time remaining correctly', () => {
      timer.setTimeRemaining(50);
      expect(timer.getTimeRemaining()).toBe(50);
      expect(mockCallbacks.onTick).toHaveBeenCalledWith(50);
    });

    it('should clamp time to valid range', () => {
      timer.setTimeRemaining(150); // Over total time
      expect(timer.getTimeRemaining()).toBe(100);

      timer.setTimeRemaining(-10); // Negative time
      expect(timer.getTimeRemaining()).toBe(0);
    });

    it('should add time correctly', () => {
      timer.start();
      jest.advanceTimersByTime(50000); // 50 seconds
      timer.addTime(10);

      expect(timer.getTimeRemaining()).toBe(60);
    });

    it('should subtract time correctly', () => {
      timer.start();
      jest.advanceTimersByTime(20000); // 20 seconds
      timer.subtractTime(10);

      expect(timer.getTimeRemaining()).toBe(70);
    });

    it('should not go below zero when subtracting', () => {
      timer.start();
      jest.advanceTimersByTime(50000); // 50 seconds
      timer.subtractTime(60); // Try to subtract more than remaining

      expect(timer.getTimeRemaining()).toBe(0);
    });
  });

  describe('State Management', () => {
    beforeEach(() => {
      timer = new Timer(60, mockCallbacks, mockAudioManager);
    });

    it('should return correct state', () => {
      const state = timer.getState();

      expect(state).toEqual({
        isRunning: false,
        isPaused: false,
        timeRemaining: 60,
        totalTime: 60,
      });
    });

    it('should update state when running', () => {
      timer.start();
      jest.advanceTimersByTime(10000); // 10 seconds

      const state = timer.getState();
      expect(state.isRunning).toBe(true);
      expect(state.timeRemaining).toBe(50);
    });

    it('should update state when paused', () => {
      timer.start();
      jest.advanceTimersByTime(10000); // 10 seconds
      timer.pause();

      const state = timer.getState();
      expect(state.isRunning).toBe(false);
      expect(state.isPaused).toBe(true);
      expect(state.timeRemaining).toBe(50);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very short timers', () => {
      timer = new Timer(1, mockCallbacks, mockAudioManager);
      timer.start();
      jest.advanceTimersByTime(1000); // 1 second

      expect(timer.isFinished()).toBe(true);
      expect(mockCallbacks.onEnd).toHaveBeenCalled();
    });

    it('should handle multiple start calls', () => {
      timer = new Timer(60, mockCallbacks, mockAudioManager);
      timer.start();
      timer.start(); // Second start call

      expect(timer.isRunning()).toBe(true);
      expect(mockCallbacks.onResume).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple pause calls', () => {
      timer = new Timer(60, mockCallbacks, mockAudioManager);
      timer.start();
      timer.pause();
      timer.pause(); // Second pause call

      expect(timer.isPaused()).toBe(true);
      expect(mockCallbacks.onPause).toHaveBeenCalledTimes(2);
    });
  });
});
