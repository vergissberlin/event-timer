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
  '<link rel="stylesheet" href="/tailwind.css">'
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
const jsPath = `/assets/${jsFile}`;

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

// Inject build timestamp into footer
try {
  const builtHtml = fs.readFileSync(distPath, 'utf8');
  const buildDate = new Date();
  const dateString = buildDate.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeString = buildDate.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const footerInjection = `\n    <div class="container mx-auto px-4 py-1">\n      <div class=\"flex justify-center items-center text-white text-opacity-60 text-[10px]\">\n        Zuletzt aktualisiert am: ${dateString} um: ${timeString}\n      </div>\n    </div>\n  </footer>`;

  const updatedHtml = builtHtml.replace('</footer>', footerInjection);
  fs.writeFileSync(distPath, updatedHtml);
  console.log(`🕒 Injected build timestamp: ${dateString} ${timeString}`);
} catch (e) {
  console.warn('⚠️ Could not inject build timestamp into footer:', e);
}
