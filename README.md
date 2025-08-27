# Event Timer

A web application for event timers with automatic switching and audio feedback.

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

- ✅ **Web Application** - Works in any modern browser
- ✅ **Automatic Deployment** - Updates on every push to main
- ✅ **Responsive Design** - Works on all devices
- ✅ **Audio Feedback** - Sounds and speech synthesis
- ✅ **Auto-Switching** - Automatically shows current event
- ✅ **QR Code Sharing** - Share individual events
- ✅ **Dark/Light Mode** - Automatic theme detection
- ✅ **Timeline View** - Visual event scheduling
- ✅ **Break Time Display** - Shows pauses between events

📖 For detailed template instructions, see `TEMPLATE.md`

## 🚀 Quick Start (Local Development)

1. **Configure Events**: Edit `data/events.json`
2. **Adjust Settings**: Edit `data/settings.json`
3. **Start App**: Run `pnpm dev` and open `http://localhost:3000/event-timer/`

## 📝 Event Configuration

Important: The app only displays events from `data/events.json`. No default events are provided — you must configure your own events. Events are automatically sorted chronologically by start time. If no events are configured, a helpful message will be displayed with instructions on how to add events.

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
    "description": "Web application for event timers"
  },
  "audioEnabled": true,
  "speechEnabled": true,
  "autoStart": true,
  "autoSwitchSeconds": 30,
  "showBreakTimes": true
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
| `audioEnabled` | boolean | `true` | Enable audio |
| `speechEnabled` | boolean | `true` | Enable speech synthesis |
| `autoStart` | boolean | `true` | Auto-start timers |
| `autoSwitchSeconds` | number | `30` | Auto-switch X seconds before start |
| `showBreakTimes` | boolean | `true` | Show/hide break times |

## 🎵 Audio Features

### Automatic Sounds
- **Event Start**: Loud, dramatic sound sequence
- **1-Minute Warning**: 800Hz tone with blinking
- **Last 10 Seconds**: EKG-like beeps with "Ten seconds left" speech
- **Event End**: Long alarm tone (3 seconds) followed by warm, gentle 3-tone sequence

### Audio Settings
- `audioEnabled: true` - All sounds enabled
- `speechEnabled: true` - Speech synthesis enabled

## 🔄 Auto-Switch Feature

The app automatically switches to the event detail page:
- **Default**: 30 seconds before event start
- **Configurable**: `autoSwitchSeconds` in settings.json
- **Smart**: Only for upcoming events

## 📱 Web Application Features

- **Cross-Platform**: Works on any device with a modern browser
- **Fullscreen**: Optimized for presentations
- **Responsive**: Desktop, tablet, mobile

## 🎨 Design Features

- **Dark/Light Mode**: Automatic adaptation
- **Timeline**: Visual event scheduling
- **Status Display**: Planned, Running, Finished
- **Next Event**: Highlighting in list and timeline
- **QR Code**: Easy event sharing

## 📊 Event Status

| Status | Description | Color |
|--------|-------------|-------|
| **Planned** | Event starts in the future | Blue |
| **Running** | Event is currently active | Green |
| **Finished** | Event is over | Gray |

## 🧪 Testing & Code Coverage

See `docs/testing.md` for details.

## 🚀 CI/CD & Deployment

The project uses GitHub Actions for CI/CD and deployment to GitHub Pages. See `docs/github-pages-deployment.md`.

## 🔧 Development

For developers and contributors see:
- `CONTRIBUTING.md` - Development guidelines
- `docs/` - Technical documentation

## 📄 License

MIT License - see `LICENSE`.
