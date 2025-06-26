import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (_req: Request, res: Response) => {
  res.send("GGList API running");
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", time: new Date().toISOString() });
});
app.get("/api/hello", (_req: Request, res: Response) => {
  res.json({ message: "Hello from GGList API!" });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`GGList Server running on port ${PORT}`);
});

// Error handling middleware

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});
