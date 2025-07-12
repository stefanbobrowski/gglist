import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { ensureUserExists } from "../utils/ensureUserExists";

interface AuthPayload {
  id: string;
  email: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Invalid or missing Authorization header" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token" });
    return;
  }

  let decoded: AuthPayload;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      console.warn("⚠️ JWT expired:", err.message);
      res.status(401).json({ error: "Token expired" });
    } else {
      console.error("❌ JWT verification error:", err);
      res.status(401).json({ error: "Invalid token" });
    }
    return;
  }

  if (!decoded.email) {
    res.status(400).json({ error: "JWT missing email" });
    return;
  }

  try {
    const userId = await ensureUserExists(decoded.email);
    req.user = { id: userId, email: decoded.email };
    next();
  } catch (err) {
    console.error("❌ ensureUserExists error:", err);
    res.status(401).json({ error: "Invalid token or user" });
  }
};
