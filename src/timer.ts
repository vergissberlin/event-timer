import { TimerState, TimerCallbacks, TimerStatus } from './types';
import { AudioController } from './audio';

export class Timer {
  private state: TimerState;
  private callbacks: TimerCallbacks;
  private audio: AudioController;
  private intervalId: number | null = null;
  private animationFrameId: number | null = null;
  private lastUpdateTime: number = 0;
  private status: TimerStatus = 'ready';
  private warningTriggered: boolean = false;
  private speechTriggered: boolean = false;

  constructor(totalTime: number, callbacks: TimerCallbacks, audio: AudioController) {
    this.state = {
      isRunning: false,
      isPaused: false,
      timeRemaining: totalTime,
      totalTime: totalTime
    };
    
    this.callbacks = callbacks;
    this.audio = audio;
  }

  public start(): void {
    if (this.state.isRunning) return;
    
    this.state.isRunning = true;
    this.state.isPaused = false;
    this.state.startTime = Date.now() - (this.state.totalTime - this.state.timeRemaining) * 1000;
    this.status = 'running';
    
    this.startTimer();
    this.callbacks.onTick(this.state.timeRemaining);
  }

  public pause(): void {
    if (!this.state.isRunning || this.state.isPaused) return;
    
    this.state.isPaused = true;
    this.state.pauseTime = Date.now();
    this.status = 'paused';
    
    this.stopTimer();
    this.callbacks.onPause();
  }

  public resume(): void {
    if (!this.state.isRunning || !this.state.isPaused) return;
    
    this.state.isPaused = false;
    if (this.state.startTime && this.state.pauseTime) {
      const pauseDuration = Date.now() - this.state.pauseTime;
      this.state.startTime += pauseDuration;
    }
    this.status = 'running';
    
    this.startTimer();
    this.callbacks.onResume();
  }

  public reset(): void {
    this.stopTimer();
    
    this.state = {
      isRunning: false,
      isPaused: false,
      timeRemaining: this.state.totalTime,
      totalTime: this.state.totalTime
    };
    
    this.status = 'ready';
    this.warningTriggered = false;
    this.speechTriggered = false;
    
    this.callbacks.onReset();
    this.callbacks.onTick(this.state.timeRemaining);
  }

  public stop(): void {
    this.stopTimer();
    this.state.isRunning = false;
    this.state.isPaused = false;
    this.status = 'finished';
  }

  private startTimer(): void {
    this.lastUpdateTime = Date.now();
    this.updateTimer();
  }

  private stopTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private updateTimer(): void {
    if (!this.state.isRunning || this.state.isPaused) return;

    const now = Date.now();
    const deltaTime = now - this.lastUpdateTime;
    
    // Use requestAnimationFrame for smoother updates
    this.animationFrameId = requestAnimationFrame(() => this.updateTimer());
    
    // Update every 100ms for better performance
    if (deltaTime >= 100) {
      this.lastUpdateTime = now;
      
      if (this.state.startTime) {
        const elapsed = Math.floor((now - this.state.startTime) / 1000);
        this.state.timeRemaining = Math.max(0, this.state.totalTime - elapsed);
        
        this.handleTimerUpdate();
        
        if (this.state.timeRemaining <= 0) {
          this.handleTimerEnd();
        }
      }
    }
  }

  private handleTimerUpdate(): void {
    this.callbacks.onTick(this.state.timeRemaining);
    
    // Check if countdown reached zero (event starting)
    if (this.state.timeRemaining === 0 && this.state.totalTime > 0) {
      this.handleEventStart();
      return;
    }
    
    // Warning at 1 minute remaining
    if (this.state.timeRemaining <= 60 && this.state.timeRemaining > 0 && !this.warningTriggered) {
      this.warningTriggered = true;
      this.status = 'warning';
      this.audio.playWarning();
      this.callbacks.onWarning();
    }
    
    // Blinking and speech countdown for last 10 seconds
    if (this.state.timeRemaining <= 10 && this.state.timeRemaining > 0 && !this.speechTriggered) {
      this.speechTriggered = true;
      this.status = 'warning';
    }
    
    if (this.speechTriggered && this.state.timeRemaining <= 10 && this.state.timeRemaining > 0) {
      this.audio.countdownSpeech(this.state.timeRemaining);
    }
  }
  
  private handleEventStart(): void {
    // Play start sound and flash effect
    this.audio.playStart();
    this.callbacks.onEventStart();
  }

  private handleTimerEnd(): void {
    this.stop();
    this.audio.playEnd();
    this.callbacks.onEnd();
  }

  public getState(): TimerState {
    return { ...this.state };
  }

  public getStatus(): TimerStatus {
    return this.status;
  }

  public getTimeRemaining(): number {
    return this.state.timeRemaining;
  }

  public getTotalTime(): number {
    return this.state.totalTime;
  }

  public isRunning(): boolean {
    return this.state.isRunning && !this.state.isPaused;
  }

  public isPaused(): boolean {
    return this.state.isPaused;
  }

  public isFinished(): boolean {
    return this.state.timeRemaining <= 0;
  }

  public formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  public getProgress(): number {
    return ((this.state.totalTime - this.state.timeRemaining) / this.state.totalTime) * 100;
  }

  public setTimeRemaining(seconds: number): void {
    this.state.timeRemaining = Math.max(0, Math.min(this.state.totalTime, seconds));
    this.callbacks.onTick(this.state.timeRemaining);
  }

  public addTime(seconds: number): void {
    this.setTimeRemaining(this.state.timeRemaining + seconds);
  }

  public subtractTime(seconds: number): void {
    this.setTimeRemaining(this.state.timeRemaining - seconds);
  }
}
