# Event Timer PWA

A Progressive Web App for event timers with automatic switching and audio feedback.

## 🎯 Use This Template

This repository is designed to be used as a **GitHub Template** to quickly create your own event timer website.

### 🚀 Quick Setup (3 Steps)

1. **Create from Template**
   - Click the green "Use this template" button above
   - Choose "Create a new repository"
   - Name your repository (e.g., `my-event-timer`)
   - Make it public (required for GitHub Pages)

2. **Configure Your Events**
   - Edit `data/events.json` with your events
   - Edit `data/settings.json` with your app settings
   - Commit and push your changes

3. **Deploy to GitHub Pages**
   - Go to your repository Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` (will be created automatically)
   - Your site will be available at: `https://yourusername.github.io/my-event-timer/`

### 📝 Example: Conference Event Timer

```json
{
  "events": [
    {
      "id": "opening",
      "title": "Opening Ceremony",
      "startTime": "2025-09-15T09:00:00",
      "duration": 1800,
      "icon": "ti ti-microphone",
      "background": "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1920&h=1080&fit=crop",
      "description": "Welcome and opening remarks"
    },
    {
      "id": "keynote",
      "title": "Keynote Speech",
      "startTime": "2025-09-15T09:30:00",
      "duration": 3600,
      "icon": "ti ti-presentation",
      "background": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop",
      "description": "Main keynote presentation"
    },
    {
      "id": "lunch",
      "title": "Lunch Break",
      "startTime": "2025-09-15T10:30:00",
      "duration": 3600,
      "icon": "ti ti-coffee",
      "background": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&h=1080&fit=crop",
      "description": "Networking lunch"
    }
  ]
}
```

### ⚙️ Customize Your App

```json
{
  "app": {
    "name": "My Conference Timer",
    "shortName": "ConfTimer",
    "description": "Timer for My Awesome Conference 2025"
  },
  "autoSwitchSeconds": 60,
  "audioEnabled": true,
  "speechEnabled": true
}
```

### 🌐 Your Custom Domain

After deployment, you can:
- Use the default URL: `https://yourusername.github.io/repository-name/`
- Add a custom domain in repository Settings → Pages
- Share individual event URLs: `https://yourusername.github.io/repository-name/event/event-id`

### 📱 Features You Get

- ✅ **Progressive Web App** - Installable on mobile/desktop
- ✅ **Automatic Deployment** - Updates on every push to main
- ✅ **Responsive Design** - Works on all devices
- ✅ **Audio Feedback** - Sounds and speech synthesis
- ✅ **Auto-Switching** - Automatically shows current event
- ✅ **QR Code Sharing** - Share individual events
- ✅ **Dark/Light Mode** - Automatic theme detection
- ✅ **Timeline View** - Visual event scheduling
- ✅ **Break Time Display** - Shows pauses between events

📖 **For detailed template instructions, see [TEMPLATE.md](TEMPLATE.md)**

## 🚀 Quick Start (Local Development)

1. **Configure Events**: Edit `data/events.json`
2. **Adjust Settings**: Edit `data/settings.json`
3. **Start App**: Run `pnpm dev` or open directly in browser

## 📝 Event Configuration

**Important**: The app only displays events from `data/events.json`. No default events are provided - you must configure your own events. Events are automatically sorted chronologically by start time. If no events are configured, a helpful message will be displayed with instructions on how to add events.

Events are configured in `data/events.json`:

```json
{
  "events": [
    {
      "id": "morning-meeting",
      "title": "Morning Meeting",
      "startTime": "2025-08-27T09:00:00",
      "duration": 1800,
      "icon": "ti ti-users",
      "background": "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1920&h=1080&fit=crop",
      "description": "Daily morning meeting"
    }
  ]
}
```

### Event Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique event ID | `"morning-meeting"` |
| `title` | string | Event title | `"Morning Meeting"` |
| `startTime` | string | Start time (ISO 8601) | `"2025-08-27T09:00:00"` |
| `duration` | number | Duration in seconds | `1800` (30 min) |
| `icon` | string | Tabler icon (optional) | `"ti ti-users"` |
| `background` | string | Background image URL (optional) | `"https://..."` |
| `description` | string | Description (optional) | `"Daily meeting"` |

### Available Icons

Use [Tabler Icons](https://tabler-icons.io/):
- `ti ti-users` - Users/Group
- `ti ti-calendar` - Calendar
- `ti ti-presentation` - Presentation
- `ti ti-coffee` - Break
- `ti ti-music` - Music
- `ti ti-video` - Video

## ⚙️ App Settings

Global settings in `data/settings.json`:

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
    "description": "Progressive Web App for Event Timers"
  },
  "audioEnabled": true,
  "speechEnabled": true,
  "fullscreenByDefault": false,
  "autoStart": true,
  "autoSwitchSeconds": 30
}
```

### Settings Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `theme.primary` | string | `"#3b82f6"` | Primary color |
| `theme.secondary` | string | `"#1e40af"` | Secondary color |
| `theme.accent` | string | `"#60a5fa"` | Accent color |
| `app.name` | string | `"Event Timer"` | App name |
| `app.shortName` | string | `"Timer"` | Short app name |
| `audioEnabled` | boolean | `true` | Audio enabled |
| `speechEnabled` | boolean | `true` | Speech synthesis enabled |
| `fullscreenByDefault` | boolean | `false` | Fullscreen by default |
| `autoStart` | boolean | `true` | Auto-start timers |
| `autoSwitchSeconds` | number | `30` | Auto-switch X seconds before start |

## 🎵 Audio Features

### Automatic Sounds
- **Event Start**: Loud, dramatic sound sequence
- **1-Minute Warning**: 800Hz tone with blinking
- **Last 10 Seconds**: EKG-like beeps with speech announcement "Noch 10 Sekunden"
- **Event End**: Long alarm tone (3 seconds) followed by warm, gentle 3-tone sequence

### Audio Settings
- `audioEnabled: true` - All sounds enabled
- `speechEnabled: true` - Speech synthesis enabled

## 🔄 Auto-Switch Feature

The app automatically switches to event detail page:
- **Default**: 30 seconds before event start
- **Configurable**: `autoSwitchSeconds` in settings.json
- **Smart**: Only for upcoming events

## 📱 PWA Features

- **Installable**: Install as native app
- **Offline**: Works without internet
- **Fullscreen**: Optimized for presentations
- **Responsive**: Desktop, tablet, mobile

## 🎨 Design Features

- **Dark/Light Mode**: Automatic adaptation
- **Timeline**: Visual event scheduling
- **Status Display**: Planned, Running, Finished
- **Next Event**: Color highlighting
- **QR Code**: Event sharing

## 📊 Event Status

| Status | Description | Color |
|--------|-------------|-------|
| **Planned** | Event starts in the future | Blue |
| **Running** | Event is currently active | Green |
| **Finished** | Event is over | Gray |

## 🧪 Testing & Code Coverage

### Automated Testing
- **Unit Tests**: Comprehensive test suite with Jest
- **Code Coverage**: Automated coverage reporting
- **CI/CD Integration**: GitHub Actions with coverage comments
- **Pull Request Coverage**: Automatic coverage reports on PRs

### Test Commands
```bash
pnpm test          # Run all tests
pnpm test:watch    # Watch mode
pnpm test:coverage # Coverage report
pnpm test:ci       # CI/CD mode
```

For detailed testing information see [docs/testing.md](docs/testing.md).

## 🚀 CI/CD & Deployment

The project uses GitHub Actions for continuous integration and deployment:

- **Tests**: Run on every push to `develop` and pull requests to `main`
- **Deployment**: Automatic deployment to GitHub Pages on push to `main`
- **Coverage**: Code coverage reports and PR comments

See [docs/github-actions.md](docs/github-actions.md) for detailed CI/CD configuration.

## 🔧 Development

For developers and contributors see:
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development guidelines
- [docs/](docs/) - Technical documentation

## 🔧 For Repository Owners

### Making This a GitHub Template

To make this repository available as a GitHub Template:

1. **Enable Template Repository**
   - Go to repository Settings → General
   - Scroll down to "Template repository"
   - Check "Template repository"
   - Click "Save"

2. **Update Repository Description**
   - Add: "🚀 GitHub Template for Event Timer PWA"
   - Add relevant topics: `template`, `pwa`, `event-timer`, `github-pages`

3. **Create Template Documentation**
   - This README already includes template usage instructions
   - Consider adding a `TEMPLATE.md` file for additional guidance

### Template Features

- ✅ **Zero Configuration**: Works out of the box
- ✅ **Automatic Deployment**: GitHub Actions ready
- ✅ **Customizable**: Easy to modify for different use cases
- ✅ **Well Documented**: Comprehensive setup instructions
- ✅ **Production Ready**: Optimized for real-world usage

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

## Features

### 🎨 **Theme Management**
- **Automatisches Dark/Light Mode**: Erkennt das Betriebssystem-Theme automatisch
- **Persistierung**: Speichert Theme-Auswahl im localStorage
- **Manueller Toggle**: Button zum Umschalten zwischen Light und Dark Mode
- **System-Integration**: Reagiert auf Änderungen des Betriebssystem-Themes (wenn kein Theme gespeichert ist)

### ⏰ **Timer-Funktionalität**
- **Vollbild-Timer**: Sekundengenaue Anzeige im Format HH:MM:SS
- **Automatische Events**: Events starten automatisch basierend auf ihrer Startzeit
- **Countdown-Modus**: Zeigt Countdown bis zum Event-Start an
- **Auto-Switch**: Automatisches Wechseln zur Detailseite 30 Sekunden vor Event-Start (konfigurierbar)

### 📊 **Pausenzeiten-Anzeige**
- **Automatische Berechnung**: Zeigt Pausenzeiten zwischen Events an
- **Ein-/Ausblenden**: Toggle-Button zum Verstecken der Pausenzeiten
- **Visuelle Darstellung**: Blaue Hintergrundfarbe für Pausenzeiten-Zeilen
- **Benutzerfreundlich**: Format wie "1h 30min Pause" mit Zeitraum
