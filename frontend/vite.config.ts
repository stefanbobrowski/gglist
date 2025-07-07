import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Optional: explicitly define Vite dev port
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
  build: {
    outDir: "../backend/dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
