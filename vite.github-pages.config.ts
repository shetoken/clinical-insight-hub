import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/clinical-insight-hub/",
  plugins: [tailwindcss(), tsConfigPaths(), react()],
  build: {
    outDir: "dist/github-pages",
    rollupOptions: {
      input: "github-pages.html",
    },
  },
});