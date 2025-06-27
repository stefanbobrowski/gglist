import express from "express";
import { POKEMON_API_KEY } from "../config/env";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    let allCards: any[] = [];
    let page = 1;
    let hasMore = true;

    // Fetch all pages of cards
    while (hasMore) {
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=(set.id:base1 OR set.id:base2 OR set.id:base3)&pageSize=250&page=${page}`,
        {
          headers: {
            "X-Api-Key": POKEMON_API_KEY!,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Pokémon API error: ${response.status}`);
      }

      const data = await response.json();
      allCards.push(...data.data);
      hasMore = data.data.length === 250;
      page++;
    }

    // Step 1: Only Gen 1 Pokémon (with valid pokedex numbers)
    const gen1Cards = allCards.filter(
      (card) =>
        Array.isArray(card.nationalPokedexNumbers) &&
        card.nationalPokedexNumbers[0] <= 151
    );

    // Step 2: Deduplicate by Pokédex number
    const seen = new Set<number>();
    const unique = gen1Cards.filter((card) => {
      const dex = card.nationalPokedexNumbers[0];
      if (seen.has(dex)) return false;
      seen.add(dex);
      return true;
    });

    // Step 3: Sort by Pokédex number
    const sorted = unique.sort(
      (a, b) => a.nationalPokedexNumbers[0] - b.nationalPokedexNumbers[0]
    );

    // Step 4: Trim to clean output
    const result = sorted.map((card) => ({
      id: card.id,
      pokedex: card.nationalPokedexNumbers[0],
      name: card.name,
      image: card.images?.large,
      number: card.number,
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching Pokémon cards:", err);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

export default router;
