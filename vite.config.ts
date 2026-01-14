import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react()],

    // مهم لـ GitHub Pages لأن مشروعك داخل /najah-realestate/
    base: "/najah-realestate/",

    // تأكيد مجلد الإخراج
    build: {
      outDir: "dist",
      emptyOutDir: true
    },

    define: {
      // fallback آمن لو ما كان فيه GEMINI_API_KEY وقت الـ build
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY ?? ""),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY ?? "")
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, ".")
      }
    }
  };
});
