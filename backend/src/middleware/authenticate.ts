import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ensureUserExists } from "../utils/ensureUserExists";

interface AuthPayload {
  email: string;
  sub: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log("🛡️ Auth header:", req.headers.authorization);

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token" });
    return;
  }

  let decoded: AuthPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
  } catch (err) {
    console.error("❌ JWT verify error:", err);
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  if (!decoded.email) {
    res.status(400).json({ error: "JWT missing email" });
    return;
  }

  try {
    const userId = await ensureUserExists(decoded.email);
    (req as any).user = { id: userId, email: decoded.email };
    next();
  } catch (err) {
    console.error("❌ ensureUserExists error:", err);
    res.status(401).json({ error: "Invalid token or user" });
  }
};
