// src/constants.ts
export const API_BASE =
  import.meta.env.MODE === "production"
    ? "https://gglist-backend-177352903615.us-central1.run.app"
    : "http://localhost:8080";
