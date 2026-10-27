import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // relative asset paths, so the built site works from any folder or sub-path on a static host
  base: './',
  build: {
    rollupOptions: {
      output: {
        // three.js is by far the largest dependency; keeping it in its own file lets the browser cache it across deploys
        manualChunks: { three: ['three'] },
      },
    },
  },
});
