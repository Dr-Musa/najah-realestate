import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],

    // مهم لـ GitHub Pages لأن مشروعك داخل /najah-realestate/
    base: '/najah-realestate/',

    // خلي build واضح 100%
    build: {
      outDir: 'dist',
      emptyOutDir: true
    },

    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? '')
    },

    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.')
      }
    },

    server: {
      port: 3000,
      host: '0.0.0.0'
    }
  };
});
