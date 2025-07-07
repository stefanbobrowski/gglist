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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

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

// API Routes
app.use("/api", authRoutes);
app.use("/api/pokemon", pokemonRoute);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/top", top);

// Health routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});

app.get("/api/hello", (_req: Request, res: Response) => {
  res.json({ message: "Hello from GGList API!" });
});

// Serve frontend
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// React Router fallback (serve index.html)
app.get("*", ((req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  } else {
    res.status(404).json({ error: "Not found" });
  }
}) as express.RequestHandler);

// Error/404 handling
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`GGList Server running on port ${PORT}`);
});
