import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Optional: explicitly define Vite dev port
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: [
      "gglist.app",
      // "www.gglist.app",
      "gglist-frontend-177352903615.us-central1.run.app",
    ],
  },
});
