import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// Hinweis: Wir nutzen immer den Basis-Pfad "/event-timer/" – auch lokal –
// um die Komplexität gering zu halten und Deep-Links auf GitHub Pages zu unterstützen.
export default defineConfig({
  integrations: [react(), tailwind({
    // Tailwind v4 nutzt die neue Datei-Struktur; wir behalten Astro-Integration für DX
  })],
  site: 'https://vergissberlin.github.io/event-timer/',
  base: '/event-timer/',
  output: 'static',
  server: {
    port: 3000,
    host: true
  }
});


