# Event Timer PWA

Eine moderne Progressive Web App (PWA) für Event-Timer mit Glassmorphism Design, entwickelt in TypeScript und Tailwind CSS.

## 🚀 Features

### Timer-Funktionalität
- **Präzise Zeitmessung**: Sekundengenaue Timer-Updates mit `requestAnimationFrame`
- **HH:MM:SS Format**: Vollständiges Zeitformat mit Stunden, Minuten und Sekunden
- **Countdown-Darstellung**: Haupt-Timer zeigt Event-Dauer, kleiner Timer zeigt Countdown
- **JSON-Konfiguration**: Events werden über `data/events.json` verwaltet
- **Automatischer Start**: Events starten automatisch basierend auf konfigurierten Startzeiten
- **Datum/Uhrzeit**: Jedes Event hat eine konkrete Startzeit
- **Vollbild-Modus**: Timer können auf den gesamten Bildschirm gebracht werden
- **Dark Mode**: Automatische und manuelle Dark Mode Unterstützung

### Audio & Benachrichtigungen
- **Warnung bei 1 Minute**: Timer blinkt und spielt Warnungston ab
- **Blinken bei letzten 10 Sekunden**: Zusätzliche visuelle Warnung
- **Event-Start Hinweis**: Blitz-Effekt und Audio bei Event-Start
- **Speech API**: Letzte 10 Sekunden werden runtergezählt
- **3-Sekunden Piepton**: Bei Timer-Ende
- **Push-Benachrichtigungen**: Desktop-Benachrichtigungen bei Timer-Ende

### Design & UX
- **Timeline-Visualisierung**: Horizontale Zeitslot-Anzeige von 0-24 Uhr
- **Aktuelle Zeit-Marker**: Rote Markierung der aktuellen Uhrzeit
- **Event-Farbkodierung**: Blau (geplant), Grün (läuft), Grau (beendet)
- **Tabellen-Übersicht**: Übersichtliche Darstellung aller Events in Tabellenform
- **Tabler Icons**: Moderne Icons für verschiedene Event-Typen
- **Unsplash Hintergrundbilder**: Hochwertige Hintergrundbilder von [Unsplash](https://unsplash.com/)
- **Starke Abdunklung**: 70% schwarzer Overlay für maximale Lesbarkeit
- **Fullscreen-Button**: Vollbild-Modus für Präsentationen
- **Countdown-Timer**: Kleiner Timer unter dem Event-Titel
- **Solide Farben**: Keine Transparenzen oder Farbverläufe
- **Montserrat Schriftart**: Moderne, lesbare Typografie
- **Responsive Design**: Optimiert für Desktop, Tablet und Mobile
- **Konfigurierbare Themes**: Jedes Event hat eigene Farben
- **Status-Anzeige**: Geplant, Läuft, Beendet

### PWA-Features
- **Offline-Funktionalität**: Service Worker für Caching
- **Installierbar**: Kann als native App installiert werden
- **Push-Benachrichtigungen**: Desktop-Benachrichtigungen
- **Background Sync**: Synchronisation im Hintergrund

## 📦 Installation

### Voraussetzungen
- Node.js 18+ 
- pnpm 8+

### Setup
```bash
# Repository klonen
git clone https://github.com/vergissberlin/event-timer.git
cd event-timer

# Abhängigkeiten installieren
pnpm install

# Entwicklungsserver starten
pnpm dev

# Build für Produktion
pnpm build

# Preview des Builds
pnpm preview

# Code-Qualität
pnpm type-check  # TypeScript Type Check
pnpm lint        # ESLint
pnpm format      # Prettier Formatierung
```

## 🎯 Verwendung

### Event-Konfiguration
Events werden in `data/events.json` konfiguriert:

```json
{
  "events": [
    {
      "id": "morning-meeting",
      "title": "Morgen-Meeting",
      "startTime": "2024-01-15T09:00:00",
      "duration": 1800,
      "theme": {
        "primary": "#3b82f6",
        "secondary": "#1e40af",
        "accent": "#60a5fa"
      },
      "icon": "ti ti-users",
      "background": "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1920&h=1080&fit=crop",
      "description": "Tägliches Morgen-Meeting"
    }
  ],
  "settings": {
    "autoStart": true
  }
}
```

### Tastatur-Shortcuts
- **Leertaste**: Timer starten/pausieren
- **R**: Timer zurücksetzen
- **F**: Vollbild-Modus umschalten
- **Escape**: Vollbild verlassen / Zurück zur Event-Auswahl

## 🏗️ Projektstruktur

```
event-timer/
├── .github/workflows/   # GitHub Actions
│   ├── deploy.yml       # Deployment Workflow
│   └── ci.yml          # CI/CD Pipeline
├── src/
│   ├── main.ts          # Hauptanwendungslogik
│   ├── timer.ts         # Timer-Klasse
│   ├── audio.ts         # Audio-Management
│   ├── events.ts        # Event-Management
│   └── types.ts         # TypeScript-Typen
├── data/
│   └── events.json      # Event-Konfiguration
├── public/
│   ├── icons/           # PWA-Icons
│   ├── images/          # Event-Bilder
│   └── sounds/          # Audio-Dateien
├── index.html           # Haupt-HTML
├── manifest.json        # PWA-Manifest
├── sw.js               # Service Worker
├── package.json        # Abhängigkeiten
├── pnpm-workspace.yaml # pnpm Workspace
├── .eslintrc.json      # ESLint Konfiguration
├── .prettierrc         # Prettier Konfiguration
└── .cursorrules        # Cursor IDE Regeln
```

## 🚀 Deployment

### Automatisches GitHub Pages Deployment
Das Projekt verwendet GitHub Actions für automatisches Deployment:

1. **Push auf main Branch** → Automatisches Deployment
2. **Pull Request** → CI/CD Pipeline läuft
3. **Deployment** → Automatisch auf GitHub Pages verfügbar

### Manuelles Deployment
```bash
# Build erstellen
pnpm build

# Auf GitHub Pages deployen
pnpm deploy
```

### Manuelles Deployment
1. `npm run build` ausführen
2. `dist/` Ordner auf Webserver hochladen
3. HTTPS erforderlich für PWA-Features

### Docker (Optional)
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
```

## 🔧 Konfiguration

### PWA-Einstellungen
- `manifest.json`: App-Name, Icons, Theme-Farben
- `sw.js`: Caching-Strategien, Offline-Verhalten

### Audio-Einstellungen
- Warnungston: `sounds/warning.mp3` oder `sounds/warning.wav`
- End-Ton: `sounds/end.mp3` oder `sounds/end.wav`
- Speech API: Deutsche Sprache (`de-DE`)

### Theme-Konfiguration
Jedes Event kann eigene Farben haben:
- `primary`: Hauptfarbe
- `secondary`: Sekundärfarbe  
- `accent`: Akzentfarbe

## 🎨 Customization

### Neue Events hinzufügen
1. Event in `data/events.json` definieren
2. Optional: Logo und Hintergrundbild hinzufügen
3. Theme-Farben anpassen

### Audio-Dateien ersetzen
- `sounds/warning.mp3` für Warnungston
- `sounds/end.mp3` für End-Ton
- Unterstützte Formate: MP3, WAV

### Icons anpassen
- Verschiedene Größen in `public/icons/`
- Mindestens: 192x192, 512x512
- Format: PNG mit Transparenz

## 🔍 Browser-Support

### Vollständige Unterstützung
- Chrome 80+
- Firefox 76+
- Safari 13+
- Edge 80+

### Teilweise Unterstützung
- Ältere Browser: Basis-Timer-Funktionalität
- Keine PWA-Features
- Keine Speech API

## 🐛 Troubleshooting

### Timer läuft ungenau
- Browser im Hintergrund kann Timer verlangsamen
- `requestAnimationFrame` für bessere Präzision

### Audio funktioniert nicht
- Browser-Blockierung für Autoplay
- Nutzerinteraktion erforderlich
- HTTPS erforderlich

### PWA installiert sich nicht
- HTTPS erforderlich
- Manifest.json korrekt konfiguriert
- Service Worker registriert

### Bilder laden nicht
- Relative Pfade verwenden
- CORS-Einstellungen prüfen
- Dateigröße optimieren

## 📝 Changelog

### v1.0.0
- Initiale Version
- PWA-Funktionalität
- Glassmorphism Design
- Audio & Speech API
- Vollbild-Modus

## 🤝 Contributing

1. Fork erstellen
2. Feature-Branch: `git checkout -b feature/neue-funktion`
3. Commit: `git commit -am 'Neue Funktion hinzugefügt'`
4. Push: `git push origin feature/neue-funktion`
5. Pull Request erstellen

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei.

## 🙏 Credits

- **Design**: Moderne UI mit Tailwind CSS
- **Schriftart**: Montserrat von Google Fonts
- **Icons**: Tabler Icons für moderne Icon-Darstellung
- **Audio**: Eigene Töne oder lizenzfreie Sounds
- **Package Manager**: pnpm für bessere Performance

---

Entwickelt mit ❤️ von [VergissBerlin](https://github.com/vergissberlin)
