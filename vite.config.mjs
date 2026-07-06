import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  ssgOptions: {
    // Prerender every route, including dynamic /services/:slug
    includeAllRoutes: true,
    // Output directory structure: /services/slug/index.html
    dirStyle: 'nested',
    script: 'async',
    formatting: 'none',
    beastiesOptions: {
      inlineFonts: false,
      preloadFonts: false,
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});
