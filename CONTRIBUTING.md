# Contributing Guide

Willkommen beim Event Timer PWA Projekt! Dieser Guide hilft dir dabei, zum Projekt beizutragen.

## 🚀 Schnellstart

### Voraussetzungen
- Node.js 18+
- pnpm 8+
- Git

### Setup
```bash
# Repository klonen
git clone https://github.com/vergissberlin/event-timer.git
cd event-timer

# Abhängigkeiten installieren
pnpm install

# Entwicklungsserver starten
pnpm dev

# Tests ausführen
pnpm test
```

## 🏗️ Projektstruktur

```
event-timer/
├── .github/workflows/   # GitHub Actions
│   ├── deploy.yml       # Deployment Workflow
│   ├── ci.yml          # CI/CD Pipeline
│   └── test.yml        # Test Workflow
├── src/
│   ├── main.ts          # Hauptanwendungslogik
│   ├── timer.ts         # Timer-Klasse
│   ├── audio.ts         # Audio-Management
│   ├── events.ts        # Event-Management
│   ├── settings.ts      # Settings-Management
│   ├── favicon.ts       # Favicon-Generator
│   └── types.ts         # TypeScript-Typen
├── tests/
│   ├── setup.ts         # Jest Setup & Mocks
│   ├── audio.test.ts    # AudioManager Tests
│   ├── timer.test.ts    # Timer Tests
│   ├── events.test.ts   # EventsManager Tests
│   ├── settings.test.ts # SettingsManager Tests
│   └── favicon.test.ts  # FaviconGenerator Tests
├── docs/                # Technische Dokumentation
├── data/
│   ├── events.json      # Event-Konfiguration
│   └── settings.json    # App-Einstellungen
└── public/              # Statische Assets
```

## 🧪 Testing

### Test-Framework
- **Jest** als Test-Runner
- **jsdom** für DOM-Tests
- **ts-jest** für TypeScript-Support
- **@testing-library/jest-dom** für DOM-Assertions

### Test-Befehle
```bash
pnpm test              # Alle Tests ausführen
pnpm test:watch        # Tests im Watch-Modus
pnpm test:coverage     # Tests mit Coverage-Report
pnpm test:ci           # Tests für CI/CD
```

### Test-Konventionen
- Unit Tests für alle Klassen und Funktionen
- Mock für externe Dependencies (fetch, Audio API, etc.)
- Test-Coverage mindestens 80%
- Beschreibende Test-Namen auf Deutsch

### Test-Struktur
```typescript
describe('ClassName', () => {
  describe('methodName', () => {
    it('should do something when condition', () => {
      // Arrange
      const instance = new ClassName();
      
      // Act
      const result = instance.methodName();
      
      // Assert
      expect(result).toBe(expectedValue);
    });
  });
});
```

## 🔧 Entwicklung

### Code-Stil
- **TypeScript**: Strikte Typisierung verwenden
- **ESLint**: Code-Qualität und Konsistenz
- **Prettier**: Automatische Formatierung
- **Conventional Commits**: Standardisierte Commit-Messages

### Befehle
```bash
pnpm type-check        # TypeScript Type Check
pnpm lint              # ESLint
pnpm format            # Prettier Formatierung
pnpm build             # Production Build
```

### Git Workflow
1. **Fork** das Repository
2. **Branch** erstellen: `git checkout -b feature/neue-funktion`
3. **Änderungen** committen: `git commit -m 'feat: neue Funktion hinzugefügt'`
4. **Push** zum Fork: `git push origin feature/neue-funktion`
5. **Pull Request** erstellen

### Commit Messages
Verwende [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: neue Funktion hinzugefügt
fix: Bug in Timer-Logik behoben
docs: README aktualisiert
test: Tests für AudioManager hinzugefügt
refactor: Code-Refactoring
style: Formatierung verbessert
```

## 🎵 Audio-Entwicklung

### Web Audio API
Die App verwendet Web Audio API für dynamische Sound-Generierung:

```typescript
// Beispiel: Ton generieren
private generateTone(frequency: number, duration: number): void {
  const audioContext = this.getAudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}
```

### Audio-Features
- **Warning Sound**: 800Hz Sine-Wave, 0.5s
- **End Sound**: 3x 600Hz Square-Wave Pieptöne
- **Start Sound**: Dramatische Sequenz (Sweep + Akkord)
- **Speech Countdown**: Letzte 10 Sekunden

## 🎨 UI/UX-Entwicklung

### Design-System
- **Tailwind CSS**: Utility-First CSS Framework
- **Montserrat**: Primäre Schriftart
- **Tabler Icons**: Icon-Bibliothek
- **Dark/Light Mode**: Automatische Anpassung

### Responsive Design
- **Mobile First**: Mobile-optimiert
- **Breakpoints**: sm, md, lg, xl
- **Touch-Friendly**: Große Touch-Targets

### Accessibility
- **ARIA-Labels**: Screen Reader Support
- **Keyboard Navigation**: Vollständige Tastatur-Unterstützung
- **Color Contrast**: WCAG 2.1 AA Compliance
- **Focus Management**: Klare Fokus-Indikatoren

## 🔄 CI/CD Pipeline

### GitHub Actions
- **Type Check**: TypeScript-Kompilierung
- **Lint**: ESLint mit TypeScript-Regeln
- **Format**: Prettier Code-Formatierung
- **Tests**: Jest Unit Tests mit Coverage
- **Build**: Vite Production Build
- **Deploy**: Automatisches GitHub Pages Deployment

### Quality Gates
- ✅ Alle Tests müssen bestehen
- ✅ Code-Coverage mindestens 80%
- ✅ ESLint ohne Fehler
- ✅ Prettier Formatierung korrekt
- ✅ TypeScript ohne Fehler

## 📚 Dokumentation

### Technische Dokumentation
Siehe [docs/](docs/) Verzeichnis:
- [Architecture.md](docs/architecture.md) - Systemarchitektur
- [API.md](docs/api.md) - API-Dokumentation
- [Testing.md](docs/testing.md) - Test-Strategien
- [Deployment.md](docs/deployment.md) - Deployment-Guide

### Code-Dokumentation
- **JSDoc**: Für alle öffentlichen Methoden
- **TypeScript**: Strikte Typisierung
- **README**: Anwender-Dokumentation
- **Inline Comments**: Für komplexe Logik

## 🐛 Bug Reports

### Bug Report Template
```markdown
## Bug Description
Kurze Beschreibung des Problems

## Steps to Reproduce
1. Öffne die App
2. Klicke auf Event X
3. Beobachte Fehler Y

## Expected Behavior
Was sollte passieren

## Actual Behavior
Was passiert tatsächlich

## Environment
- Browser: Chrome 120
- OS: macOS 14.0
- App Version: 1.0.0

## Additional Information
Screenshots, Console-Logs, etc.
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## Feature Description
Kurze Beschreibung der gewünschten Funktion

## Use Case
Warum wird diese Funktion benötigt

## Proposed Solution
Wie könnte die Implementierung aussehen

## Alternatives Considered
Andere Lösungsansätze

## Additional Information
Mockups, Beispiele, etc.
```

## 🤝 Pull Request Process

### PR Checklist
- [ ] Tests hinzugefügt/aktualisiert
- [ ] Dokumentation aktualisiert
- [ ] Code-Review durchgeführt
- [ ] CI/CD Pipeline bestanden
- [ ] Keine Breaking Changes (oder dokumentiert)

### PR Template
```markdown
## Changes
Beschreibung der Änderungen

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Wie wurden die Änderungen getestet

## Screenshots
Falls UI-Änderungen

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
```

## 📋 Coding Standards

### TypeScript
```typescript
// Strikte Typisierung
interface Event {
  id: string;
  title: string;
  startTime: string;
  duration: number;
}

// Keine any-Typen ohne Begründung
function processEvent(event: Event): void {
  // Implementation
}
```

### Error Handling
```typescript
// Graceful Degradation
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.warn('Operation failed:', error);
  return fallbackValue;
}
```

### Performance
- **Lazy Loading**: Bilder und Assets
- **Debouncing**: Event-Handler
- **Memoization**: Expensive Calculations
- **Bundle Optimization**: Tree Shaking

## 🎯 Roadmap

### Geplante Features
- [ ] Offline-Synchronisation
- [ ] Push-Benachrichtigungen
- [ ] Multi-Event-Timer
- [ ] Export/Import von Events
- [ ] Erweiterte Audio-Optionen

### Technische Verbesserungen
- [ ] Performance-Optimierung
- [ ] Accessibility-Verbesserungen
- [ ] Test-Coverage erhöhen
- [ ] Bundle-Größe reduzieren

## 📞 Support

### Fragen & Diskussion
- **Issues**: Für Bugs und Feature Requests
- **Discussions**: Für allgemeine Fragen
- **Wiki**: Für detaillierte Dokumentation

### Kontakt
- **Maintainer**: [@vergissberlin](https://github.com/vergissberlin)
- **Repository**: [event-timer](https://github.com/vergissberlin/event-timer)

## 📄 Lizenz

Durch das Beitragen zum Projekt stimmst du zu, dass deine Beiträge unter der MIT-Lizenz lizenziert werden.

---

Vielen Dank für deine Beiträge! 🚀
