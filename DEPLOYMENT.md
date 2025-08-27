# Deployment Guide - Event Timer PWA

## 🚀 GitHub Pages Deployment

### Automatisches Deployment

1. **Repository Setup**
   ```bash
   # Repository klonen
   git clone https://github.com/vergissberlin/event-timer.git
   cd event-timer
   
   # Abhängigkeiten installieren
   npm install
   ```

2. **Build erstellen**
   ```bash
   npm run build
   ```

3. **Deploy auf GitHub Pages**
   ```bash
   npm run deploy
   ```

### Manuelles GitHub Pages Setup

1. **GitHub Repository erstellen**
   - Neues Repository auf GitHub erstellen
   - Code hochladen

2. **GitHub Pages aktivieren**
   - Repository Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` oder `main` (mit `/docs` Ordner)

3. **Build und Deploy**
   ```bash
   # Build erstellen
   npm run build
   
   # Für gh-pages Branch
   npx gh-pages -d dist
   
   # Oder für main/docs
   cp -r dist/* docs/
   git add docs/
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

## 🌐 Andere Hosting-Optionen

### Netlify

1. **Netlify CLI Installation**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Vercel

1. **Vercel CLI Installation**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   npm run build
   vercel --prod
   ```

### Firebase Hosting

1. **Firebase CLI Installation**
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Setup**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Docker Deployment

1. **Dockerfile erstellen**
   ```dockerfile
   FROM nginx:alpine
   COPY dist/ /usr/share/nginx/html/
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build und Deploy**
   ```bash
   npm run build
   docker build -t event-timer .
   docker run -p 80:80 event-timer
   ```

## 🔧 PWA-spezifische Konfiguration

### HTTPS erforderlich
- PWA-Features funktionieren nur über HTTPS
- GitHub Pages, Netlify, Vercel bieten automatisch HTTPS
- Für eigene Server: SSL-Zertifikat erforderlich

### Service Worker
- Service Worker wird automatisch registriert
- Caching-Strategie: Cache-First für statische Assets
- Offline-Funktionalität aktiviert

### Manifest.json
- PWA-Manifest ist bereits konfiguriert
- Icons müssen in verschiedenen Größen vorhanden sein
- Theme-Farben sind konfiguriert

## 📱 PWA Installation

### Desktop
- Chrome/Edge: "Install" Button in Adressleiste
- Firefox: "Add to Home Screen" im Menü

### Mobile
- iOS Safari: "Add to Home Screen" im Share-Menü
- Android Chrome: "Add to Home Screen" im Menü

### Installation testen
```bash
# Lighthouse PWA Audit
npx lighthouse https://your-domain.com --view
```

## 🔍 Troubleshooting

### PWA installiert sich nicht
- HTTPS erforderlich
- Manifest.json korrekt
- Service Worker registriert
- Icons vorhanden

### Offline-Funktionalität funktioniert nicht
- Service Worker lädt nicht
- Cache-Strategie prüfen
- Network-First vs Cache-First

### Audio funktioniert nicht
- HTTPS erforderlich
- Nutzerinteraktion notwendig
- Browser-Autoplay-Policy

### Bilder laden nicht
- Relative Pfade verwenden
- CORS-Einstellungen
- Dateigröße optimieren

## 📊 Performance-Optimierung

### Build-Optimierung
```bash
# Produktions-Build
npm run build

# Bundle-Analyse
npx vite-bundle-analyzer dist
```

### Asset-Optimierung
- Bilder: WebP-Format verwenden
- Audio: MP3 für Kompatibilität
- Icons: SVG wenn möglich

### Caching-Strategie
- Statische Assets: Cache-First
- JSON-Daten: Network-First
- API-Calls: Network-First

## 🔒 Sicherheit

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

### HTTPS-Only
- Alle Ressourcen über HTTPS laden
- Mixed Content vermeiden
- HSTS-Header setzen

## 📈 Monitoring

### Analytics
- Google Analytics 4
- Web Vitals Monitoring
- PWA-Metriken

### Error Tracking
- Sentry Integration
- Console Error Logging
- Service Worker Error Handling

## 🚀 Continuous Deployment

### GitHub Actions
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Netlify
- Automatisches Deployment bei Git-Push
- Preview-Deployments für Pull Requests
- Branch-Deployments

---

**Wichtig**: Nach dem Deployment die PWA-Features testen:
1. Offline-Funktionalität
2. Installation
3. Push-Benachrichtigungen
4. Audio-Funktionalität
