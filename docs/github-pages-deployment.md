# GitHub Pages Deployment Guide

## Overview

This document addresses common issues when deploying the Event Timer PWA to GitHub Pages and provides solutions for each problem.

## Subdirectory Deployment

The Event Timer PWA is deployed in a subdirectory (`/event-timer/`) on GitHub Pages. This requires special consideration for all asset paths and URLs.

### Key Points for Subdirectory Deployments:
- **Base URL**: `https://vergissberlin.github.io/event-timer/`
- **Asset Paths**: Must include `/event-timer/` prefix
- **Manifest URLs**: Must be absolute paths from domain root
- **Service Worker**: Must cache full URLs including subdirectory
- **Data Files**: Must use absolute paths for fetch requests

## Common Issues and Solutions

### 1. Tailwind CSS CDN Warning

**Problem:**
```
cdn.tailwindcss.com should not be used in production
```

**Solution:**
- Replace CDN with local CSS file
- Create `public/tailwind.css` with all required styles
- Update `index.html` to use local CSS instead of CDN
- Use absolute paths for subdirectory deployments

**Implementation:**
```html
<!-- Before -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- After -->
<link rel="stylesheet" href="/event-timer/tailwind.css">
```

### 2. Missing Icons (404 Errors)

**Problem:**
```
Failed to load resource: icons/icon-16x16.png (404)
Failed to load resource: icons/icon-32x32.png (404)
```

**Solution:**
- Create SVG icons for better compatibility
- Use absolute paths with full subdirectory path
- Ensure icons are in `public/icons/` directory

**Implementation:**
```html
<!-- Before -->
<link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png">

<!-- After -->
<link rel="icon" type="image/svg+xml" sizes="32x32" href="/event-timer/icons/icon-32x32.svg">
```

### 3. Service Worker Registration Failure

**Problem:**
```
SW registration failed: TypeError: Failed to register a ServiceWorker (404)
```

**Solution:**
- Create `public/sw.js` Service Worker file
- Use absolute paths in Service Worker cache for subdirectory deployments
- Ensure Service Worker is in the correct location

**Implementation:**
```javascript
// public/sw.js
const urlsToCache = [
  '/event-timer/',
  '/event-timer/index.html',
  '/event-timer/manifest.json',
  '/event-timer/tailwind.css',
  '/event-timer/icons/icon-16x16.svg',
  '/event-timer/icons/icon-32x32.svg',
  '/event-timer/icons/icon-192x192.png',
  '/event-timer/data/events.json',
  '/event-timer/data/settings.json'
];
```

### 4. Manifest URL Issues

**Problem:**
```
Manifest: property 'start_url' ignored, URL is invalid
Manifest: property 'scope' ignored, URL is invalid
```

**Solution:**
- Use absolute paths in manifest.json for subdirectory deployments
- Ensure all URLs include the full path (e.g., `/event-timer/`)
- Validate manifest structure

**Implementation:**
```json
{
  "name": "Event Timer",
  "short_name": "Timer",
  "start_url": "/event-timer/",
  "scope": "/event-timer/",
  "icons": [
    {
      "src": "/event-timer/icons/icon-16x16.svg",
      "sizes": "16x16",
      "type": "image/svg+xml"
    }
  ]
}
```

### 5. Missing Module Script

**Problem:**
```
Module script not found in dist/index.html
```

**Solution:**
- Configure Vite base path for subdirectory deployment
- Ensure script tag is properly generated in build output
- Use absolute paths in HTML for module scripts

**Implementation:**
```html
<!-- index.html -->
<script type="module" src="/src/main.ts"></script>

<!-- vite.config.ts -->
export default defineConfig({
  base: '/event-timer/',
  // ... other config
});
```

### 6. Missing PWA Manifest

**Problem:**
```
Failed to load resource: manifest.json (404)
```

**Solution:**
- Create `public/manifest.json` file
- Use correct PWA manifest structure
- Include all required fields

## File Structure for GitHub Pages

```
public/
├── icons/
│   ├── icon-16x16.svg
│   ├── icon-32x32.svg
│   └── icon-192x192.png
├── images/
├── data/
│   ├── events.json
│   └── settings.json
├── manifest.json
├── sw.js
└── tailwind.css
```

## Build Configuration

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  base: '/event-timer/', // Required for subdirectory deployment
  build: {
    copyPublicDir: true, // Ensures public files are copied to dist
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
});
```

### Package.json Scripts
```json
{
  "scripts": {
    "build": "tsc && vite build",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

## Deployment Checklist

### Before Deployment
- [ ] All icons are present in `public/icons/`
- [ ] Service Worker is created (`public/sw.js`)
- [ ] Manifest file is valid (`public/manifest.json`)
- [ ] Local Tailwind CSS is used (not CDN)
- [ ] All paths use absolute URLs for subdirectory deployment (`/event-timer/` prefix)
- [ ] Vite base path is configured (`base: '/event-timer/'`)
- [ ] Build completes without errors

### After Deployment
- [ ] Check browser console for errors
- [ ] Verify PWA installation works
- [ ] Test offline functionality
- [ ] Validate manifest in browser dev tools
- [ ] Check Service Worker registration

## Troubleshooting

### Console Error Analysis

#### 404 Errors
- **Missing files**: Check if files exist in `public/` directory
- **Wrong paths**: Ensure all paths use `/event-timer/` prefix for subdirectory deployment
- **Build issues**: Verify files are copied to `dist/` during build
- **Module script missing**: Check if Vite base path is configured correctly

#### Manifest Errors
- **Invalid URLs**: Use relative paths starting with `./`
- **Missing fields**: Include all required PWA manifest fields
- **JSON syntax**: Validate JSON structure

#### Service Worker Errors
- **Registration failure**: Check if `sw.js` exists in root
- **Cache errors**: Verify cache URLs are correct
- **Scope issues**: Ensure Service Worker scope matches manifest

### Debug Steps

1. **Check File Structure**
   ```bash
   ls -la dist/
   ls -la dist/icons/
   ```

2. **Validate Manifest**
   ```bash
   # Use online manifest validator
   # https://manifest-validator.appspot.com/
   ```

3. **Test Service Worker**
   ```javascript
   // In browser console
   navigator.serviceWorker.getRegistrations().then(registrations => {
     console.log('SW registrations:', registrations);
   });
   ```

4. **Check Network Tab**
   - Open browser dev tools
   - Go to Network tab
   - Reload page
   - Look for failed requests (red entries)

## Best Practices

### File Organization
- Keep all static assets in `public/` directory
- Use consistent naming conventions
- Organize files by type (icons, images, data)

### Path Management
- Always use relative paths for GitHub Pages
- Prefix paths with `./` for clarity
- Test paths locally before deployment

### PWA Requirements
- Include all required manifest fields
- Provide multiple icon sizes
- Implement proper Service Worker caching
- Test offline functionality

### Performance
- Optimize images for web
- Minimize CSS and JavaScript
- Use appropriate cache strategies
- Enable compression on server

## Common Pitfalls

### 1. Path Issues for Subdirectory Deployments
```html
<!-- ❌ Wrong for subdirectory -->
<link rel="manifest" href="/manifest.json">

<!-- ✅ Correct for subdirectory -->
<link rel="manifest" href="/event-timer/manifest.json">

<!-- ✅ Correct for root deployment -->
<link rel="manifest" href="./manifest.json">
```

### 2. Missing Files
- Always check if referenced files exist
- Use build process to copy required files
- Validate file paths before deployment

### 3. Invalid JSON
- Validate JSON syntax before deployment
- Use JSON linter to catch errors
- Test manifest in browser dev tools

### 4. CORS Issues
- Ensure all resources are served from same origin
- Use relative paths to avoid CORS problems
- Test in incognito mode to avoid cache issues

## Monitoring and Maintenance

### Regular Checks
- Monitor browser console for errors
- Test PWA installation regularly
- Validate manifest periodically
- Check Service Worker functionality

### Updates
- Update cache version when files change
- Test new deployments thoroughly
- Monitor user feedback for issues
- Keep dependencies updated

## Resources

- [GitHub Pages Documentation](https://pages.github.com/)
- [PWA Manifest Specification](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest Validator](https://manifest-validator.appspot.com/)
