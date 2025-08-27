import { defineConfig } from 'astro/config';

// Hinweis: Wir nutzen immer den Basis-Pfad "/event-timer/" – auch lokal –
// um die Komplexität gering zu halten und Deep-Links auf GitHub Pages zu unterstützen.
export default defineConfig({
  site: 'https://vergissberlin.github.io/event-timer/',
  base: '/event-timer/',
  output: 'static',
  server: {
    port: 3000,
    host: true
  }
});


