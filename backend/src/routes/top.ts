import express from "express";
import { pool } from "../utils/db";
import { topRateLimiter } from "../middleware/rateLimit";

const router = express.Router();

router.get("/", topRateLimiter, async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        f.card_id,
        p.name,
        p.type,
        p.image,
        COUNT(*) AS favorite_count
      FROM 
        favorites f
      JOIN 
        pokemon_cards p ON f.card_id = p.id
      GROUP BY 
        f.card_id, p.name, p.type, p.image
      ORDER BY 
        favorite_count DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Failed to get top favorites:", err);
    res.status(500).json({ error: "Failed to fetch top favorites" });
  }
});

export default router;
