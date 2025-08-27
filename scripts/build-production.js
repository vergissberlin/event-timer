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

// Write the modified HTML to dist
const distPath = path.join(__dirname, '..', 'dist', 'index.html');
fs.writeFileSync(distPath, html);

console.log('✅ Production HTML updated with local CSS');
