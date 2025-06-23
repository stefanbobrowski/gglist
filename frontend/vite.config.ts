import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  preview: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: ["gglist-frontend-177352903615.us-central1.run.app"],
  },
});
