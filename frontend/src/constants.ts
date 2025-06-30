const IS_PROD = import.meta.env.PROD;
export const API_BASE = IS_PROD
  ? "https://gglist-backend-177352903615.us-central1.run.app"
  : "http://localhost:8080";

export const GOOGLE_CLIENT_ID =
  "177352903615-8chhnvogug9defad7j69hk7obvs1kgl7.apps.googleusercontent.com";
