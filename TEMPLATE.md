# 🚀 Event Timer Template

This template creates a **web application** for event timers that automatically deploys to GitHub Pages.

## 🎯 What You Get

A fully functional event timer website with:
- ⏰ **Automatic Event Switching** - Shows current event automatically
- 🔊 **Audio Feedback** - Sounds and speech synthesis
- 🌐 **Web Application** - Works in any modern browser
- 🎨 **Responsive Design** - Works on all devices
- 🌙 **Dark/Light Mode** - Automatic theme detection
- 📊 **Timeline View** - Visual event scheduling
- 🔗 **QR Code Sharing** - Share individual events
- ⚡ **Auto-Deployment** - Updates on every push

## 🚀 Quick Start

### Step 1: Create Your Repository
1. Click "Use this template" → "Create a new repository"
2. Name it (e.g., `my-conference-timer`)
3. Make it **public** (required for GitHub Pages)
4. Click "Create repository from template"

### Step 2: Configure Your Events
Edit `data/events.json`:

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
    }
  ]
}
```

### Step 3: Customize Settings
Edit `data/settings.json`:

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

### Step 4: Deploy
1. Commit and push your changes
2. GitHub Actions will automatically deploy to GitHub Pages
3. Your site will be available at: `https://yourusername.github.io/my-conference-timer/`

## 📝 Event Configuration

### Required Fields
- `id`: Unique identifier (used in URLs)
- `title`: Event name
- `startTime`: ISO 8601 format (`2025-09-15T09:00:00`)
- `duration`: Duration in seconds

### Optional Fields
- `icon`: Tabler icon (see [tabler-icons.io](https://tabler-icons.io/))
- `background`: Background image URL
- `description`: Event description

### Icon Examples
- `ti ti-users` - Group/Meeting
- `ti ti-presentation` - Presentation
- `ti ti-coffee` - Break
- `ti ti-music` - Music
- `ti ti-video` - Video
- `ti ti-calendar` - General event

## ⚙️ Settings Configuration

### App Settings
- `app.name`: Main app title
- `app.shortName`: Short name for PWA
- `app.description`: App description

### Behavior Settings
- `autoSwitchSeconds`: Seconds before event to auto-switch (default: 30)
- `audioEnabled`: Enable/disable all sounds
- `speechEnabled`: Enable/disable speech synthesis
- `showBreakTimes`: Show/hide break times between events

## 🌐 Customization Options

### Custom Domain
1. Go to repository Settings → Pages
2. Add your custom domain
3. Update DNS settings as instructed

### Custom Styling
- Edit `public/tailwind.css` for custom styles
- Modify colors in `data/settings.json`
- Add custom icons to `public/icons/`

### Background Images
- Use Unsplash URLs: `https://images.unsplash.com/photo-ID?w=1920&h=1080&fit=crop`
- Or upload images to your repository
- Or use any public image URL

## 🌐 Web Application Features

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Desktop**: All major browsers

### Cross-Platform
- Works on any device with a modern browser
- No installation required
- Instant access via URL

## 🔧 Advanced Configuration

### Local Development
```bash
# Clone your repository
git clone https://github.com/yourusername/my-conference-timer.git
cd my-conference-timer

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

### Environment Variables
- No environment variables needed
- All configuration is in JSON files
- Works out of the box

### Deployment
- **Automatic**: GitHub Actions deploys on every push to `main`
- **Manual**: Run `pnpm build` and push `dist/` folder
- **Branch**: Deploys to `gh-pages` branch

## 🎵 Audio Features

### Automatic Sounds
- **Event Start**: Dramatic sound sequence
- **1-Minute Warning**: Tone with blinking
- **Last 10 Seconds**: EKG beeps + "Noch 10 Sekunden"
- **Event End**: Long alarm + gentle sequence

### Audio Settings
- `audioEnabled: true` - Enable all sounds
- `speechEnabled: true` - Enable speech synthesis

## 🔄 Auto-Switch Feature

The app automatically switches to show the current event:
- **Default**: 30 seconds before event start
- **Configurable**: `autoSwitchSeconds` in settings
- **Smart**: Only for upcoming events

## 📊 Event Status

| Status | Description | Color |
|--------|-------------|-------|
| **Planned** | Future event | Blue |
| **Running** | Current event | Green |
| **Finished** | Past event | Gray |

## 🆘 Troubleshooting

### Common Issues

**Events not showing**
- Check event dates are in the future
- Verify JSON syntax is valid
- Ensure events are in `data/events.json`

**Audio not working**
- Check `audioEnabled: true` in settings
- Ensure browser allows audio
- Try clicking on page first (browser requirement)

**Deployment not working**
- Check repository is public
- Verify GitHub Actions are enabled
- Check for build errors in Actions tab

**QR Code not working**
- Ensure event IDs are unique
- Check URL format is correct
- Verify QR code library is loaded

### Getting Help

1. Check the [main README.md](README.md) for detailed documentation
2. Look at [docs/](docs/) for technical details
3. Open an issue in the original template repository
4. Check GitHub Actions logs for deployment issues

## 📄 License

This template is MIT licensed. You can use it for any purpose.

## 🎉 You're Ready!

Your event timer website is now live and ready to use! Share the URL with your audience and enjoy automatic event switching with audio feedback.
