import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("GGList API running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`GGList Server running on port ${PORT}`);
});
