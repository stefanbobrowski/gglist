import express, { Request, RequestHandler } from "express";
import { authenticate } from "../middleware/authenticate";
import { pool } from "../utils/db";

const router = express.Router();

type AuthRequest = Request & {
  user: {
    id: string;
    email: string;
  };
};

// GET /api/favorites
router.get("/", authenticate, async (req, res) => {
  const userId = (req as AuthRequest).user.id;

  try {
    const result = await pool.query(
      "SELECT card_id FROM favorites WHERE user_id = $1",
      [userId]
    );
    res.json({ favorites: result.rows.map((r) => r.card_id) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

// POST /api/favorites
router.post("/", authenticate, (async (req, res) => {
  const userId = (req as AuthRequest).user.id;
  const { cardId } = req.body;

  if (!cardId) {
    return res.status(400).json({ error: "Missing cardId" });
  }

  try {
    const countRes = await pool.query(
      "SELECT COUNT(*) FROM favorites WHERE user_id = $1",
      [userId]
    );
    const currentCount = parseInt(countRes.rows[0].count);

    if (currentCount >= 10) {
      return res.status(400).json({ error: "Favorite limit reached" });
    }

    await pool.query(
      "INSERT INTO favorites (user_id, card_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [userId, cardId]
    );

    const updated = await pool.query(
      "SELECT card_id FROM favorites WHERE user_id = $1",
      [userId]
    );

    res.json({
      success: true,
      favorites: updated.rows.map((row) => row.card_id),
    });
  } catch (err) {
    console.error("❌ Error adding favorite:", err);
    res.status(500).json({ error: "Failed to add favorite" });
  }
}) as RequestHandler);

// DELETE /api/favorites?cardId=base1-4
router.delete("/", authenticate, (async (req, res) => {
  const userId = (req as AuthRequest).user.id;
  const cardId = req.query.cardId as string;

  if (!cardId) {
    return res.status(400).json({ error: "Missing cardId" });
  }

  try {
    await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND card_id = $2",
      [userId, cardId]
    );

    const updated = await pool.query(
      "SELECT card_id FROM favorites WHERE user_id = $1",
      [userId]
    );

    res.json({
      success: true,
      favorites: updated.rows.map((row) => row.card_id),
    });
  } catch (err) {
    console.error("❌ Error removing favorite:", err);
    res.status(500).json({ error: "Failed to remove favorite" });
  }
}) as RequestHandler);

export default router;
