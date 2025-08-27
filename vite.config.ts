import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    historyApiFallback: true
  },
  preview: {
    port: 4173,
    host: true
  },
  optimizeDeps: {
    include: []
  }
});
