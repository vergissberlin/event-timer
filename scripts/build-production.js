import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the original index.html
const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Replace Tailwind CDN with local CSS for production
html = html.replace(
  '<script src="https://cdn.tailwindcss.com"></script>',
  '<link rel="stylesheet" href="/event-timer/tailwind.css">'
);

// Find the compiled JavaScript file in dist/assets
const distAssetsPath = path.join(__dirname, '..', 'dist', 'assets');
const jsFiles = fs.readdirSync(distAssetsPath).filter(file => file.endsWith('.js'));

if (jsFiles.length === 0) {
  console.error('❌ No JavaScript files found in dist/assets');
  process.exit(1);
}

// Use the first JavaScript file (should be the main bundle)
const jsFile = jsFiles[0];
const jsPath = `/event-timer/assets/${jsFile}`;

// Replace the TypeScript script tag with the compiled JavaScript
html = html.replace(
  '<script type="module" src="/src/main.ts"></script>',
  `<script type="module" src="${jsPath}"></script>`
);

// Write the modified HTML to dist
const distPath = path.join(__dirname, '..', 'dist', 'index.html');
fs.writeFileSync(distPath, html);

console.log('✅ Production HTML updated with local CSS and compiled JavaScript');
console.log(`📦 Using JavaScript file: ${jsFile}`);
