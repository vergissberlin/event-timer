# Deployment Guide - Event Timer

## 🚀 GitHub Pages Deployment

This project is built with Astro and is designed to be deployed to GitHub Pages under a subdirectory (`/event-timer/`).

### 1) Project Setup

```bash
# Clone repository
git clone https://github.com/vergissberlin/event-timer.git
cd event-timer

# Install dependencies (pnpm required)
pnpm install
```

### 2) Build

```bash
pnpm build
```

This generates a static site in `dist/` using Astro with `base: '/event-timer/'`.

### 3) Deploy to GitHub Pages

Use any preferred method. Example with `gh-pages` CLI:

```bash
pnpm dlx gh-pages -d dist
```

Or set up a GitHub Actions workflow to publish `dist/` to the `gh-pages` branch on push to `main`.

## 🌐 Subdirectory Deployment Notes

The site is served at `https://vergissberlin.github.io/event-timer/`. Important:

- Base URL is configured in `astro.config.mjs` (site + base)
- All asset and data paths are relative to the `<base href="/event-timer/">`
- Data files are in `public/data/` and are fetched via `base + /data/*.json`
- PWA (manifest / service worker) has been removed per current setup

## 🔍 Troubleshooting

### Missing CSS/JS or 404s
- Ensure `astro.config.mjs` has `base: '/event-timer/'`
- Use relative paths that respect `<base>` (e.g., `href="tailwind.css"`, `import '/src/main.ts'`)

### Data not loading
- Data files must exist in `public/data/` (copied to `dist/data/`)
- Fetch URLs are built from `<base>`; verify Network tab URLs include `/event-timer/`

### Local development
```bash
pnpm dev
# Astro will serve at http://localhost:3000 or next available port
# Access at http://localhost:3000/event-timer/
```

## ✅ Deployment Checklist

- [ ] `pnpm build` succeeds with Astro
- [ ] `dist/` contains `index.html`, `event/*/index.html`, `data/`
- [ ] All links and fetches work under `/event-timer/`
- [ ] GitHub Pages is configured to deploy from `gh-pages` branch
- [ ] Open `https://vergissberlin.github.io/event-timer/` and verify no console errors

## 📁 File Structure (relevant to deployment)

```
public/
├── icons/
├── images/
└── data/
    ├── events.json
    └── settings.json
```

## ℹ️ Notes
- For custom domains or different subdirectory names, update `site` and `base` in `astro.config.mjs` and the `<base>` tag in `src/shared/Layout.astro`.
- Re-add a PWA manifest/service worker later if needed; ensure all URLs include the base path.
