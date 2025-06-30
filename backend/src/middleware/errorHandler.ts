import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("🔥 Uncaught error:", err);
  res.status(500).json({ error: "Internal server error" });
};
