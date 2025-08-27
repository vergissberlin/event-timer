# Event Timer PWA

A Progressive Web App for event timers with automatic switching and audio feedback.

## 🚀 Quick Start

1. **Configure Events**: Edit `data/events.json`
2. **Adjust Settings**: Edit `data/settings.json`
3. **Start App**: Run `pnpm dev` or open directly in browser

## 📝 Event Configuration

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
- **Last 10 Seconds**: Speech announcement "Noch 10 Sekunden"
- **Event End**: Warm, gentle 3-tone sequence (300-400Hz)

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

## 📄 License

MIT License - see [LICENSE](LICENSE) file.
