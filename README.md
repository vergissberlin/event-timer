# Event Timer PWA

Eine Progressive Web App für Event-Timer mit automatischem Wechsel und Audio-Feedback.

## 🚀 Schnellstart

1. **Events konfigurieren**: Bearbeite `data/events.json`
2. **Einstellungen anpassen**: Bearbeite `data/settings.json`
3. **App starten**: `pnpm dev` oder direkt im Browser öffnen

## 📝 Event-Konfiguration

Events werden in `data/events.json` konfiguriert:

```json
{
  "events": [
    {
      "id": "morning-meeting",
      "title": "Morgen-Meeting",
      "startTime": "2025-08-27T09:00:00",
      "duration": 1800,
      "icon": "ti ti-users",
      "background": "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1920&h=1080&fit=crop",
      "description": "Tägliches Morgen-Meeting"
    }
  ]
}
```

### Event-Felder

| Feld | Typ | Beschreibung | Beispiel |
|------|-----|--------------|----------|
| `id` | string | Eindeutige Event-ID | `"morning-meeting"` |
| `title` | string | Event-Titel | `"Morgen-Meeting"` |
| `startTime` | string | Start-Zeit (ISO 8601) | `"2025-08-27T09:00:00"` |
| `duration` | number | Dauer in Sekunden | `1800` (30 Min) |
| `icon` | string | Tabler Icon (optional) | `"ti ti-users"` |
| `background` | string | Hintergrundbild URL (optional) | `"https://..."` |
| `description` | string | Beschreibung (optional) | `"Tägliches Meeting"` |

### Icon-Verfügbarkeit

Verwende [Tabler Icons](https://tabler-icons.io/):
- `ti ti-users` - Benutzer/Gruppe
- `ti ti-calendar` - Kalender
- `ti ti-presentation` - Präsentation
- `ti ti-coffee` - Pause
- `ti ti-music` - Musik
- `ti ti-video` - Video

## ⚙️ App-Einstellungen

Globale Einstellungen in `data/settings.json`:

```json
{
  "theme": {
    "primary": "#3b82f6",
    "secondary": "#1e40af",
    "accent": "#60a5fa"
  },
  "app": {
    "name": "Event Timer",
    "shortName": "Timer",
    "description": "Progressive Web App für Event-Timer"
  },
  "audioEnabled": true,
  "speechEnabled": true,
  "fullscreenByDefault": false,
  "autoStart": true,
  "autoSwitchSeconds": 30
}
```

### Einstellungs-Felder

| Feld | Typ | Standard | Beschreibung |
|------|-----|----------|--------------|
| `theme.primary` | string | `"#3b82f6"` | Hauptfarbe |
| `theme.secondary` | string | `"#1e40af"` | Sekundärfarbe |
| `theme.accent` | string | `"#60a5fa"` | Akzentfarbe |
| `app.name` | string | `"Event Timer"` | App-Name |
| `app.shortName` | string | `"Timer"` | Kurzer App-Name |
| `audioEnabled` | boolean | `true` | Audio aktiviert |
| `speechEnabled` | boolean | `true` | Sprachausgabe aktiviert |
| `fullscreenByDefault` | boolean | `false` | Standardmäßig Vollbild |
| `autoStart` | boolean | `true` | Timer automatisch starten |
| `autoSwitchSeconds` | number | `30` | Auto-Wechsel X Sekunden vor Start |

## 🎵 Audio-Features

### Automatische Sounds
- **Event-Start**: Lauter, dramatischer Sound
- **1-Minute-Warnung**: 800Hz Ton mit Blinken
- **Letzte 10 Sekunden**: Sprachausgabe "10, 9, 8..."
- **Event-Ende**: 3x Pieptöne

### Audio-Einstellungen
- `audioEnabled: true` - Alle Sounds aktiviert
- `speechEnabled: true` - Sprachausgabe aktiviert

## 🔄 Auto-Switch Feature

Die App wechselt automatisch zur Event-Detailseite:
- **Standard**: 30 Sekunden vor Event-Start
- **Konfigurierbar**: `autoSwitchSeconds` in settings.json
- **Intelligent**: Nur bei zukünftigen Events

## 📱 PWA-Features

- **Installierbar**: Als native App installieren
- **Offline**: Funktioniert ohne Internet
- **Vollbild**: Optimiert für Präsentationen
- **Responsive**: Desktop, Tablet, Mobile

## 🎨 Design-Features

- **Dark/Light Mode**: Automatische Anpassung
- **Timeline**: Visuelle Event-Zeitplanung
- **Status-Anzeige**: Geplant, Läuft, Beendet
- **Nächstes Event**: Farbliche Hervorhebung
- **QR-Code**: Event-Sharing

## 📊 Event-Status

| Status | Beschreibung | Farbe |
|--------|--------------|-------|
| **Geplant** | Event startet in der Zukunft | Blau |
| **Läuft** | Event ist aktuell aktiv | Grün |
| **Beendet** | Event ist vorbei | Grau |

## 🔧 Entwicklung

Für Entwickler und Beiträge siehe:
- [CONTRIBUTING.md](CONTRIBUTING.md) - Entwicklungsrichtlinien
- [docs/](docs/) - Technische Dokumentation

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) Datei.
