import express, { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface GoogleUser {
  id: string;
  email?: string;
  name?: string;
  picture?: string;
}

router.get("/debug", (_req, res) => {
  res.send("Auth route working!");
});

// POST /api/google-login
router.post(
  "/google-login",
  async (req: Request, res: Response): Promise<void> => {
    const { credential } = req.body;
    if (!credential) {
      res.status(400).json({ error: "Missing credential" });
      return;
    }

    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.sub) {
        res.status(401).json({ error: "Invalid token payload" });
        return;
      }

      const user: GoogleUser = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };

      const token = jwt.sign(user, process.env.JWT_SECRET!, {
        expiresIn: "7d",
      });

      res.json({ token, user });
    } catch (err) {
      console.error("Google login error:", err);
      res.status(401).json({ error: "Token verification failed" });
    }
  }
);

export default router;
