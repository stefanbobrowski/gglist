import express from "express";
import { pool } from "../utils/db";
import { topRateLimiter } from "../middleware/rateLimit";

const router = express.Router();
// Simple per-instance in-memory TTL cache to reduce DB load on spikes.
const TOP_CACHE_TTL = parseInt(process.env.TOP_CACHE_TTL_MS || "60000"); // 60s default
let topCache: { ts: number; rows: any[] | null } = { ts: 0, rows: null };
let topRefreshPromise: Promise<void> | null = null;

router.get("/", topRateLimiter, async (_req, res) => {
  // Serve cached value if still fresh
  if (topCache.rows && Date.now() - topCache.ts < TOP_CACHE_TTL) {
    res.json(topCache.rows);
    return;
  }

  // If another request is already refreshing the cache, wait for it
  if (topRefreshPromise) {
    try {
      await topRefreshPromise;
      if (topCache.rows) {
        res.json(topCache.rows);
        return;
      }
    } catch (err) {
      // fall through to attempt fetch below
    }
  }

  // Refresh cache (coalesced so only one refresh runs concurrently)
  topRefreshPromise = (async () => {
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
      topCache = { ts: Date.now(), rows: result.rows };
    } catch (err) {
      console.error("❌ Failed to get top favorites:", err);
      // set ts so we don't hammer the DB repeatedly on immediate failures
      topCache = { ts: Date.now(), rows: topCache.rows };
    } finally {
      topRefreshPromise = null;
    }
  })();

  await topRefreshPromise;
  if (topCache.rows) {
    res.json(topCache.rows);
    return;
  }
  res.status(500).json({ error: "Failed to fetch top favorites" });
});

export default router;
