# Contributing zu Event Timer PWA

Vielen Dank für dein Interesse, zu Event Timer PWA beizutragen! 

## Entwicklung Setup

### Voraussetzungen
- Node.js 18+
- pnpm 8+

### Installation
```bash
# Repository klonen
git clone https://github.com/vergissberlin/event-timer.git
cd event-timer

# Dependencies installieren
pnpm install

# Entwicklungsserver starten
pnpm dev
```

## Code-Stil

### TypeScript
- Strikte Typisierung verwenden
- Interface-basierte Entwicklung
- Keine `any`-Typen ohne explizite Begründung

### CSS/Tailwind
- Tailwind CSS für Styling verwenden
- Montserrat als primäre Schriftart
- Responsive Design priorisieren

### Commits
- Conventional Commits Format verwenden
- Klare, beschreibende Commit Messages
- Englische Commit Messages

## Workflow

1. **Fork** das Repository
2. **Branch** erstellen (`git checkout -b feature/amazing-feature`)
3. **Änderungen** committen (`git commit -m 'feat: add amazing feature'`)
4. **Push** zum Branch (`git push origin feature/amazing-feature`)
5. **Pull Request** erstellen

## Scripts

```bash
# Entwicklung
pnpm dev          # Startet Entwicklungsserver
pnpm build        # Produktions-Build
pnpm preview      # Preview des Builds

# Code-Qualität
pnpm type-check   # TypeScript Type Check
pnpm lint         # ESLint
pnpm format       # Prettier Formatierung

# Deployment
pnpm deploy       # Deploy auf GitHub Pages
```

## GitHub Actions

Das Projekt verwendet GitHub Actions für:
- **CI**: Code-Qualität und Tests
- **Deploy**: Automatisches Deployment auf GitHub Pages

## PWA-spezifisch

### Manifest
- Korrekte Icons in verschiedenen Größen
- Theme-Farben konfiguriert
- Display: standalone

### Service Worker
- Offline-Funktionalität
- Cache-Strategien definiert
- Update-Handling

## Fragen?

Falls du Fragen hast, erstelle ein Issue oder kontaktiere uns direkt.

Vielen Dank für deine Beiträge! 🚀
