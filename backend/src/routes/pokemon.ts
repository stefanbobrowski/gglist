import express, { Request, Response, Router } from "express";
import { getCachedPokemon, setCachedPokemon } from "../utils/cache";
import { pool } from "../utils/db";

const router: Router = express.Router();

router.get("/debug", (_req, res) => {
  res.send("pokemon route working!");
});

router.get("/", async (_req: Request, res: Response): Promise<void> => {
  const cached = getCachedPokemon();
  if (cached) {
    console.log("Returning cached Pokémon data from memory");
    res.json(cached);
    return;
  }

  try {
    const result = await pool.query(
      "SELECT id, pokedex, name, image, number FROM pokemon_cards ORDER BY pokedex ASC"
    );

    const cards = result.rows;

    setCachedPokemon(cards);
    console.log("Returning Pokémon data from Cloud SQL");

    res.json(cards);
  } catch (err) {
    console.error("❌ Error fetching Pokémon cards from DB:", err);
    res.status(500).json({ error: "Failed to fetch cards from database" });
  }
});

export default router;
