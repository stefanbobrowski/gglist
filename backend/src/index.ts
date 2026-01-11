import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";

import pokemonRoute from "./routes/pokemon";
import authRoutes from "./routes/auth";
import favoriteRoutes from "./routes/favorites";
import top from "./routes/top";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Configure helmet with a relaxed Cross-Origin-Opener-Policy so
// Google Sign-In's postMessage (and similar popup flows) are allowed.
// We also disable the embedder policy here to avoid strict COEP requirements.
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginEmbedderPolicy: false,
  })
);

// Ensure the header is present for clients that check it directly.
app.use((req: Request, res: Response, next: () => void) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://gglist-frontend-177352903615.us-central1.run.app",
      "https://gglist.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.set("trust proxy", 1);

// --- API Routes ---
app.use("/api", authRoutes);
app.use("/api/pokemon", pokemonRoute);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/top", top);

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

app.get("/api/hello", (_req: Request, res: Response) => {
  res.json({ message: "Hello from GGList API!" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// --- Error Handling ---
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`GGList Server running on port ${PORT}`);
});
