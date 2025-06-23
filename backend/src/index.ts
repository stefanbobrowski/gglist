import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("GGList API running");
});

app.listen(3000, () => console.log("GGList backend listening on port 3000"));
