# API Documentation

## Overview

The Event Timer web application provides APIs for timer management, audio control, event handling, and settings management.

## Timer API

### Timer Class

```typescript
class Timer {
  constructor(totalTime: number, callbacks: TimerCallbacks, audio: AudioManager);
  
  // Timer controls
  start(): void;
  pause(): void;
  stop(): void;
  reset(): void;
  
  // Timer status
  isRunning(): boolean;
  isPaused(): boolean;
  isFinished(): boolean;
  
  // Timer data
  getTimeRemaining(): number;
  getTotalTime(): number;
  getProgress(): number;
  getState(): TimerState;
  getStatus(): TimerStatus;
  
  // Time manipulation
  setTimeRemaining(seconds: number): void;
  addTime(seconds: number): void;
  subtractTime(seconds: number): void;
  
  // Formatting
  formatTime(seconds: number): string;
}
```

### TimerCallbacks Interface

```typescript
interface TimerCallbacks {
  onTick: (timeRemaining: number) => void;
  onWarning: () => void;
  onEnd: () => void;
  onEventStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}
```

### TimerState Interface

```typescript
interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  timeRemaining: number;
  totalTime: number;
}
```

### TimerStatus Type

```typescript
type TimerStatus = 'ready' | 'running' | 'paused' | 'warning' | 'finished';
```

### Examples

```typescript
// Create timer
const timer = new Timer(3600, {
  onTick: (time) => console.log(`Remaining: ${time}s`),
  onWarning: () => console.log('1 minute remaining!'),
  onEnd: () => console.log('Timer finished!'),
  onEventStart: () => console.log('Event started!'),
  onPause: () => console.log('Timer paused'),
  onResume: () => console.log('Timer resumed'),
  onReset: () => console.log('Timer reset')
}, audioManager);

// Start timer
timer.start();

// Pause timer
timer.pause();

// Add time (5 minutes)
timer.addTime(300);

// Get progress
const progress = timer.getProgress(); // 0-100
```

## Audio API

### AudioManager Class

```typescript
class AudioManager {
  constructor();
  
  // Audio controls
  setAudioEnabled(enabled: boolean): void;
  setSpeechEnabled(enabled: boolean): void;
  resumeAudioContext(): void;
  
  // Audio status
  isAudioSupported(): boolean;
  isSpeechSupported(): boolean;
  
  // Sound playback
  playWarning(): void;
  playEnd(): void;
  playStart(): void;
  speakCountdown(seconds: number): void;
}
```

### Examples

```typescript
// Create AudioManager
const audio = new AudioManager();

// Enable audio
audio.setAudioEnabled(true);
audio.setSpeechEnabled(true);

// Play sounds
audio.playWarning(); // 800Hz warning tone
audio.playEnd();     // 3x beeps
audio.playStart();   // dramatic start sound

// Speech output
audio.speakCountdown(10); // "Ten"
audio.speakCountdown(5);  // "Five"

// Resume AudioContext (browser autoplay policy)
document.addEventListener('click', () => {
  audio.resumeAudioContext();
}, { once: true });
```

## Events API

### EventsManager Class

Important: No default events are provided. All events must be configured in the JSON file. Events are automatically sorted chronologically by start time.

```typescript
class EventsManager {
  constructor();
  
  // Event loading
  loadEvents(): Promise<Event[]>;
  preloadImages(): Promise<void>;
  
  // Event validation
  validateEvent(event: any): Event;
  
  // Event status
  getEventStatus(event: Event): 'upcoming' | 'running' | 'finished';
  getTimeUntilStart(event: Event): number;
  getTimeRemaining(event: Event): number;
  
  // Event filtering
  getNextEvent(events: Event[]): Event | null;
  getCurrentEvent(events: Event[]): Event | null;
  getEventsByCategory(category: string): Event[];
  getEventsByDuration(minDuration?: number, maxDuration?: number): Event[];
  
  // Formatting
  formatDuration(seconds: number): string;
  formatDateTime(dateTime: string): string;
  getDurationDescription(seconds: number): string;
  
  // Event access
  getEvents(): Event[];
}
```

### Event Interface

```typescript
interface Event {
  id: string;
  title: string;
  startTime: string; // ISO 8601
  duration: number;  // seconds
  description?: string;
  icon?: string;       // Tabler icon
  background?: string; // URL
}
```

### Examples

```typescript
// Create EventsManager
const eventsManager = new EventsManager();

// Load events
const events = await eventsManager.loadEvents();

// Check event status
const event = events[0];
const status = eventsManager.getEventStatus(event);
const timeUntilStart = eventsManager.getTimeUntilStart(event);
const timeRemaining = eventsManager.getTimeRemaining(event);

// Find next event
const nextEvent = eventsManager.getNextEvent(events);

// Filter events
const longEvents = eventsManager.getEventsByDuration(3600); // > 1h
const meetingEvents = eventsManager.getEventsByCategory('meeting');

// Formatting
const duration = eventsManager.formatDuration(3661); // "1h 1min"
const dateTime = eventsManager.formatDateTime('2025-08-27T14:30:00');
```

## Settings API

### SettingsManager Class

```typescript
class SettingsManager {
  constructor();
  
  // Settings loading
  loadSettings(): Promise<AppSettings>;
  
  // Settings validation
  validateSettings(data: any): AppSettings;
  
  // Settings access
  getSettings(): AppSettings;
  getAppConfig(): AppConfig;
}
```

### AppSettings Interface

```typescript
interface AppSettings {
  app: AppConfig;
  audioEnabled: boolean;
  speechEnabled: boolean;
  autoStart: boolean;
  autoSwitchSeconds: number;
  showBreakTimes: boolean;
}

interface AppConfig {
  name: string;
  shortName: string;
  description: string;
}
```

### Examples

```typescript
// Create SettingsManager
const settingsManager = new SettingsManager();

// Load settings
const settings = await settingsManager.loadSettings();

// App config
const appConfig = settingsManager.getAppConfig();
const appName = appConfig.name; // "Event Timer"
```

## Browser APIs

### Web Audio API

```typescript
// Create AudioContext
const audioContext = new AudioContext();

// Create oscillator
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

// Connect
oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

// Configure
oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
oscillator.type = 'sine';

// Play
oscillator.start(audioContext.currentTime);
oscillator.stop(audioContext.currentTime + 0.5);
```

### Speech Synthesis API

```typescript
// Check availability of Speech Synthesis
if ('speechSynthesis' in window) {
  const utterance = new SpeechSynthesisUtterance('Ten');
  utterance.lang = 'en-US';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 0.8;
  
  speechSynthesis.speak(utterance);
}
```

### Fullscreen API

```typescript
// Enter fullscreen
if (document.documentElement.requestFullscreen) {
  document.documentElement.requestFullscreen();
}

// Exit fullscreen
if (document.exitFullscreen) {
  document.exitFullscreen();
}

// Check fullscreen state
const isFullscreen = !!document.fullscreenElement;
```

## Error Handling

### Audio Errors

```typescript
try {
  const audioContext = new AudioContext();
  // Audio operations
} catch (error) {
  console.warn('Audio API not supported:', error);
  // Fallback behavior
}
```

### Network Errors

```typescript
try {
  const response = await fetch('/data/events.json');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  console.error('Failed to load events:', error);
  // Use fallback data
}
```

### Timer Errors

```typescript
try {
  timer.start();
} catch (error) {
  console.error('Timer start failed:', error);
  // Fallback to setInterval
}
```

## Performance APIs

### requestAnimationFrame

```typescript
let animationId: number;

function animate() {
  // Animation logic
  updateTimer();
  
  animationId = requestAnimationFrame(() => animate());
}

// Start animation
animate();

// Stop animation
cancelAnimationFrame(animationId);
```

### Performance API

```typescript
// Performance marks
performance.mark('timer-start');

// Timer logic
updateTimer();

performance.mark('timer-end');
performance.measure('timer-update', 'timer-start', 'timer-end');

// Read performance data
const measure = performance.getEntriesByName('timer-update')[0];
console.log(`Timer update took ${measure.duration}ms`);
```

## Local Storage API

```typescript
// Store data
localStorage.setItem('theme', 'dark');
localStorage.setItem('audioEnabled', 'true');

// Read data
const theme = localStorage.getItem('theme');
const audioEnabled = localStorage.getItem('audioEnabled') === 'true';

// Remove data
localStorage.removeItem('theme');

// Clear all data
localStorage.clear();
```
