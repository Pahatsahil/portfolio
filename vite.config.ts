import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import sourceIdentifierPlugin from "vite-plugin-source-identifier";

const isProd = process.env.BUILD_MODE === "prod";
// For GitHub Pages deployment, change 'your-username' and 'your-repo-name' to your actual GitHub details
// Example: base: '/your-repo-name/'
const baseUrl = process.env.GITHUB_PAGES ? "/portfolio/" : "/";

export default defineConfig({
  plugins: [
    react(),
    sourceIdentifierPlugin({
      enabled: !isProd,
      attributePrefix: "data-matrix",
      includeProps: true,
    }),
  ],
  base: baseUrl,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
