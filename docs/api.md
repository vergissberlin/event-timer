# API-Dokumentation

## Übersicht

Die Event Timer PWA bietet verschiedene APIs für Timer-Management, Audio-Kontrolle und Event-Handling.

## Timer API

### Timer-Klasse

```typescript
class Timer {
  constructor(totalTime: number, callbacks: TimerCallbacks, audio: AudioManager);
  
  // Timer-Kontrolle
  start(): void;
  pause(): void;
  stop(): void;
  reset(): void;
  
  // Timer-Status
  isRunning(): boolean;
  isPaused(): boolean;
  isFinished(): boolean;
  
  // Timer-Daten
  getTimeRemaining(): number;
  getTotalTime(): number;
  getProgress(): number;
  getState(): TimerState;
  getStatus(): TimerStatus;
  
  // Zeit-Manipulation
  setTimeRemaining(seconds: number): void;
  addTime(seconds: number): void;
  subtractTime(seconds: number): void;
  
  // Formatierung
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

### Beispiele

```typescript
// Timer erstellen
const timer = new Timer(3600, {
  onTick: (time) => console.log(`Verbleibend: ${time}s`),
  onWarning: () => console.log('1 Minute verbleibend!'),
  onEnd: () => console.log('Timer beendet!'),
  onEventStart: () => console.log('Event gestartet!'),
  onPause: () => console.log('Timer pausiert'),
  onResume: () => console.log('Timer fortgesetzt'),
  onReset: () => console.log('Timer zurückgesetzt')
}, audioManager);

// Timer starten
timer.start();

// Timer pausieren
timer.pause();

// Zeit hinzufügen
timer.addTime(300); // 5 Minuten

// Fortschritt abrufen
const progress = timer.getProgress(); // 0-100
```

## Audio API

### AudioManager-Klasse

```typescript
class AudioManager {
  constructor();
  
  // Audio-Kontrolle
  setAudioEnabled(enabled: boolean): void;
  setSpeechEnabled(enabled: boolean): void;
  resumeAudioContext(): void;
  
  // Audio-Status
  isAudioSupported(): boolean;
  isSpeechSupported(): boolean;
  
  // Sound-Playback
  playWarning(): void;
  playEnd(): void;
  playStart(): void;
  speakCountdown(seconds: number): void;
}
```

### Beispiele

```typescript
// AudioManager erstellen
const audio = new AudioManager();

// Audio aktivieren
audio.setAudioEnabled(true);
audio.setSpeechEnabled(true);

// Sounds abspielen
audio.playWarning(); // 800Hz Warnungston
audio.playEnd();     // 3x Pieptöne
audio.playStart();   // Dramatischer Start-Sound

// Sprachausgabe
audio.speakCountdown(10); // "Zehn"
audio.speakCountdown(5);  // "Fünf"

// AudioContext aktivieren (für Autoplay-Policy)
document.addEventListener('click', () => {
  audio.resumeAudioContext();
}, { once: true });
```

## Events API

### EventsManager-Klasse

**Important**: No default events are provided. All events must be configured in the JSON file. Events are automatically sorted chronologically by start time.

```typescript
class EventsManager {
  constructor();
  
  // Event-Loading
  loadEvents(): Promise<Event[]>;
  preloadImages(events: Event[]): Promise<void>;
  
  // Event-Validierung
  validateEvent(event: any): Event;
  
  // Event-Status
  getEventStatus(event: Event): 'upcoming' | 'running' | 'finished';
  getTimeUntilStart(event: Event): number;
  getTimeRemaining(event: Event): number;
  
  // Event-Filtering
  getNextEvent(events: Event[]): Event | null;
  getCurrentEvent(events: Event[]): Event | null;
  getEventsByCategory(category: string): Event[];
  getEventsByDuration(minDuration?: number, maxDuration?: number): Event[];
  
  // Formatierung
  formatDuration(seconds: number): string;
  formatDateTime(dateTime: string): string;
  getDurationDescription(seconds: number): string;
  
  // Event-Zugriff
  getEvents(): Event[];
}
```

### Event Interface

```typescript
interface Event {
  id: string;
  title: string;
  startTime: string; // ISO 8601
  duration: number;  // Sekunden
  description?: string;
  icon?: string;     // Tabler Icon
  background?: string; // URL
}
```

### Beispiele

```typescript
// EventsManager erstellen
const eventsManager = new EventsManager();

// Events laden
const events = await eventsManager.loadEvents();

// Event-Status prüfen
const event = events[0];
const status = eventsManager.getEventStatus(event);
const timeUntilStart = eventsManager.getTimeUntilStart(event);
const timeRemaining = eventsManager.getTimeRemaining(event);

// Nächstes Event finden
const nextEvent = eventsManager.getNextEvent(events);

// Events filtern
const longEvents = eventsManager.getEventsByDuration(3600); // > 1h
const meetingEvents = eventsManager.getEventsByCategory('meeting');

// Formatierung
const duration = eventsManager.formatDuration(3661); // "1h 1min"
const dateTime = eventsManager.formatDateTime('2025-08-27T14:30:00');
```

## Settings API

### SettingsManager-Klasse

```typescript
class SettingsManager {
  constructor();
  
  // Settings-Loading
  loadSettings(): Promise<AppSettings>;
  
  // Settings-Validierung
  validateSettings(data: any): AppSettings;
  validateTheme(theme: any): AppTheme;
  validateAppConfig(app: any): AppConfig;
  validateFaviconTheme(favicon: any): FaviconTheme;
  
  // Settings-Zugriff
  getSettings(): AppSettings;
  getTheme(): AppTheme;
  getAppConfig(): AppConfig;
  
  // Favicon
  updateFavicon(): void;
}
```

### AppSettings Interface

```typescript
interface AppSettings {
  theme: AppTheme;
  app: AppConfig;
  audioEnabled: boolean;
  speechEnabled: boolean;
  fullscreenByDefault: boolean;
  autoStart: boolean;
  autoSwitchSeconds: number;
}

interface AppTheme {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface AppConfig {
  name: string;
  shortName: string;
  description: string;
  favicon: FaviconTheme;
}

interface FaviconTheme {
  primary: string;
  secondary: string;
  accent: string;
}
```

### Beispiele

```typescript
// SettingsManager erstellen
const settingsManager = new SettingsManager();

// Settings laden
const settings = await settingsManager.loadSettings();

// Theme abrufen
const theme = settingsManager.getTheme();
const primaryColor = theme.primary; // "#3b82f6"

// App-Konfiguration
const appConfig = settingsManager.getAppConfig();
const appName = appConfig.name; // "Event Timer"

// Favicon aktualisieren
settingsManager.updateFavicon();
```

## Favicon API

### FaviconGenerator-Klasse

```typescript
class FaviconGenerator {
  // SVG-Generierung
  static generateSVG(theme: FaviconTheme): string;
  
  // PNG-Generierung
  static generatePNG(theme: FaviconTheme): string;
  
  // Favicon-Update
  static updateFavicon(theme?: FaviconTheme): void;
}
```

### Beispiele

```typescript
// SVG-Favicon generieren
const svg = FaviconGenerator.generateSVG({
  primary: '#3b82f6',
  secondary: '#1e40af',
  accent: '#60a5fa'
});

// PNG-Favicon generieren
const pngDataUrl = FaviconGenerator.generatePNG({
  primary: '#ff0000',
  secondary: '#00ff00',
  accent: '#0000ff'
});

// Favicon aktualisieren
FaviconGenerator.updateFavicon({
  primary: '#3b82f6',
  secondary: '#1e40af',
  accent: '#60a5fa'
});
```

## Browser APIs

### Web Audio API

```typescript
// AudioContext erstellen
const audioContext = new AudioContext();

// Oscillator erstellen
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

// Verbinden
oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

// Konfigurieren
oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
oscillator.type = 'sine';

// Abspielen
oscillator.start(audioContext.currentTime);
oscillator.stop(audioContext.currentTime + 0.5);
```

### Speech Synthesis API

```typescript
// Speech Synthesis verfügbar prüfen
if ('speechSynthesis' in window) {
  const utterance = new SpeechSynthesisUtterance('Zehn');
  utterance.lang = 'de-DE';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 0.8;
  
  speechSynthesis.speak(utterance);
}
```

### Fullscreen API

```typescript
// Vollbild aktivieren
if (document.documentElement.requestFullscreen) {
  document.documentElement.requestFullscreen();
}

// Vollbild verlassen
if (document.exitFullscreen) {
  document.exitFullscreen();
}

// Vollbild-Status prüfen
const isFullscreen = !!document.fullscreenElement;
```

### Service Worker API

```typescript
// Service Worker registrieren
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('SW registered:', registration);
    })
    .catch(error => {
      console.log('SW registration failed:', error);
    });
}
```

## Error Handling

### Audio Errors

```typescript
try {
  const audioContext = new AudioContext();
  // Audio-Operationen
} catch (error) {
  console.warn('Audio API not supported:', error);
  // Fallback-Verhalten
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
  // Fallback-Daten verwenden
}
```

### Timer Errors

```typescript
try {
  timer.start();
} catch (error) {
  console.error('Timer start failed:', error);
  // Fallback zu setInterval
}
```

## Performance APIs

### requestAnimationFrame

```typescript
let animationId: number;

function animate() {
  // Animation-Logik
  updateTimer();
  
  animationId = requestAnimationFrame(animate);
}

// Animation starten
animate();

// Animation stoppen
cancelAnimationFrame(animationId);
```

### Performance API

```typescript
// Performance-Markierung
performance.mark('timer-start');

// Timer-Logik
updateTimer();

performance.mark('timer-end');
performance.measure('timer-update', 'timer-start', 'timer-end');

// Performance-Daten abrufen
const measure = performance.getEntriesByName('timer-update')[0];
console.log(`Timer update took ${measure.duration}ms`);
```

## Local Storage API

```typescript
// Daten speichern
localStorage.setItem('theme', 'dark');
localStorage.setItem('audioEnabled', 'true');

// Daten abrufen
const theme = localStorage.getItem('theme');
const audioEnabled = localStorage.getItem('audioEnabled') === 'true';

// Daten entfernen
localStorage.removeItem('theme');

// Alle Daten löschen
localStorage.clear();
```
