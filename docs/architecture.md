# Systemarchitektur

## Übersicht

Die Event Timer PWA ist eine moderne Single-Page-Application (SPA) mit folgender Architektur:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │   Business      │    │   Data          │
│     Layer       │    │     Logic       │    │     Layer       │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ - main.ts       │    │ - timer.ts      │    │ - events.json   │
│ - index.html    │    │ - audio.ts      │    │ - settings.json │
│ - UI Components │    │ - events.ts     │    │ - localStorage  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Komponenten-Architektur

### Presentation Layer
- **main.ts**: Hauptanwendungslogik, UI-Management
- **index.html**: HTML-Struktur und PWA-Manifest
- **UI Components**: Timer-Display, Event-Liste, Timeline

### Business Logic Layer
- **Timer**: Timer-Logik mit requestAnimationFrame
- **AudioManager**: Web Audio API und Speech Synthesis
- **EventsManager**: Event-Management und Validierung
- **SettingsManager**: Konfigurations-Management
- **FaviconGenerator**: Dynamische Favicon-Generierung

### Data Layer
- **JSON Files**: Event- und Settings-Konfiguration
- **localStorage**: Persistierung von Benutzereinstellungen
- **Service Worker**: Offline-Caching

## Datenfluss

```mermaid
graph TD
    A[User Interaction] --> B[main.ts]
    B --> C[EventsManager]
    B --> D[Timer]
    B --> E[AudioManager]
    C --> F[events.json]
    D --> G[UI Update]
    E --> H[Web Audio API]
    B --> I[SettingsManager]
    I --> J[settings.json]
```

## Timer-Architektur

### Präzise Zeitmessung
```typescript
class Timer {
  private state: TimerState;
  private callbacks: TimerCallbacks;
  private animationId: number | null = null;
  
  start(): void {
    this.state.isRunning = true;
    this.animate();
  }
  
  private animate(): void {
    const now = performance.now();
    const deltaTime = now - this.lastUpdate;
    
    if (deltaTime >= 1000) {
      this.updateTimer();
      this.lastUpdate = now;
    }
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}
```

### Event-System
- **onTick**: Timer-Updates
- **onWarning**: 1-Minute-Warnung
- **onEnd**: Timer-Ende
- **onEventStart**: Event-Start

## Audio-Architektur

### Web Audio API Integration
```typescript
class AudioManager {
  private audioContext: AudioContext | null = null;
  
  private generateTone(frequency: number, duration: number): void {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }
}
```

### Audio-Features
- **Warning Sound**: 800Hz Sine-Wave
- **End Sound**: 3x 600Hz Square-Wave
- **Start Sound**: Dramatische Sequenz
- **Speech Countdown**: Letzte 10 Sekunden

## Event-Management

### Event-Lifecycle
1. **Loading**: Events aus JSON laden
2. **Validation**: Event-Daten validieren
3. **Processing**: Status und Timing berechnen
4. **Display**: UI aktualisieren

### Status-Management
```typescript
enum EventStatus {
  UPCOMING = 'upcoming',
  RUNNING = 'running',
  FINISHED = 'finished'
}

function getEventStatus(event: Event): EventStatus {
  const now = new Date();
  const startTime = new Date(event.startTime);
  const endTime = new Date(startTime.getTime() + event.duration * 1000);
  
  if (now < startTime) return EventStatus.UPCOMING;
  if (now >= startTime && now < endTime) return EventStatus.RUNNING;
  return EventStatus.FINISHED;
}
```

## PWA-Architektur

### Service Worker
```javascript
// sw.js
const CACHE_NAME = 'event-timer-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/data/events.json',
  '/data/settings.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
```

### Manifest
```json
{
  "name": "Event Timer",
  "short_name": "Timer",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [...]
}
```

## State Management

### Application State
```typescript
interface AppState {
  currentEvent: Event | null;
  currentTimer: Timer | null;
  isFullscreen: boolean;
  theme: 'light' | 'dark';
  audioEnabled: boolean;
  speechEnabled: boolean;
}
```

### State Updates
- **Event Selection**: Navigation zu Event-Detailseite
- **Timer State**: Start, Pause, Reset
- **UI State**: Fullscreen, Theme, Audio

## Performance-Optimierungen

### Rendering
- **requestAnimationFrame**: Für Timer-Updates
- **Debouncing**: Für Resize-Events
- **Lazy Loading**: Für Hintergrundbilder

### Memory Management
- **Event Listener Cleanup**: Automatisches Aufräumen
- **Timer Cleanup**: Animation-Frame-Cancellation
- **Audio Context**: Suspend/Resume Management

### Bundle Optimization
- **Tree Shaking**: Unused Code entfernen
- **Code Splitting**: Lazy Loading von Komponenten
- **Asset Optimization**: Bilder und Icons komprimieren

## Error Handling

### Graceful Degradation
```typescript
try {
  const audioContext = new AudioContext();
  // Audio-Features verwenden
} catch (error) {
  console.warn('Audio API not supported:', error);
  // Fallback-Verhalten
}
```

### Error Boundaries
- **Network Errors**: Offline-Fallback
- **Audio Errors**: Stumme Ausführung
- **Timer Errors**: Fallback zu setInterval

## Security

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;">
```

### Data Validation
- **Input Sanitization**: JSON-Validierung
- **Type Safety**: TypeScript-Compiler
- **Runtime Checks**: Event-Validierung

## Testing Architecture

### Test-Pyramide
```
    ┌─────────────┐
    │   E2E Tests │ ← Wenige, wichtige User-Journeys
    ├─────────────┤
    │Integration  │ ← Komponenten-Interaktion
    │   Tests     │
    ├─────────────┤
    │  Unit Tests │ ← Viele, isolierte Funktionen
    └─────────────┘
```

### Test-Strategien
- **Unit Tests**: Isolierte Komponenten-Tests
- **Integration Tests**: Komponenten-Interaktion
- **E2E Tests**: Vollständige User-Journeys

## Deployment Architecture

### Build Pipeline
```
Source Code → TypeScript Compilation → Bundle → Minification → Deployment
```

### CI/CD Pipeline
```
Push → Tests → Build → Deploy → GitHub Pages
```

### Environment Configuration
- **Development**: Hot Reload, Debug-Modus
- **Production**: Optimized Bundle, Service Worker
- **Testing**: Mock-APIs, Test-Daten

## Monitoring & Analytics

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS
- **Custom Metrics**: Timer-Genauigkeit, Audio-Latency
- **Error Tracking**: Console-Errors, User-Reports

### User Analytics
- **Event Tracking**: Timer-Starts, Audio-Interaktionen
- **Usage Patterns**: Häufig verwendete Features
- **Performance Metrics**: Load-Times, Runtime-Performance
