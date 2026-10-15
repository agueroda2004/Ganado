import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

const whiteBackground = { fit: "contain" as const, background: "white" };

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    transparent: {
      ...minimal2023Preset.transparent,
      resizeOptions: whiteBackground,
    },
    maskable: {
      ...minimal2023Preset.maskable,
      resizeOptions: whiteBackground,
    },
    apple: {
      ...minimal2023Preset.apple,
      resizeOptions: whiteBackground,
    },
  },
  images: ["public/icon.svg"],
});
