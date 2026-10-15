import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icon.svg", "apple-touch-icon-180x180.png"],
      workbox: {
        globPatterns: ["**/*.{js,css,ico,png,svg,webmanifest}"],
        navigateFallback: undefined,
      },
      manifest: {
        name: "Ganado",
        short_name: "Ganado",
        description: "Gestión personal de animales.",
        lang: "es",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#0a0a0a",
        background_color: "#f4f4f5",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
