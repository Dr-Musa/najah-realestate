import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],

    // مهم لـ GitHub Pages لأن المشروع داخل /najah-realestate/
    base: '/najah-realestate/',

    build: {
      outDir: 'dist',
      emptyOutDir: true
    },

    // لو كودك يستعمل process.env.GEMINI_API_KEY
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? env.VITE_GEMINI_API_KEY ?? ''),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? env.VITE_GEMINI_API_KEY ?? '')
    },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('.', import.meta.url))
      }
    }
  };
});
