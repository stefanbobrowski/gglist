import { pool } from "../utils/db";
import { POKEMON_API_KEY } from "../config/env";

async function fetchPokemonCards() {
  let allCards: any[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await fetch(
      `https://api.pokemontcg.io/v2/cards?q=(set.id:base1 OR set.id:base2 OR set.id:base3)&pageSize=250&page=${page}`,
      {
        headers: {
          "X-Api-Key": POKEMON_API_KEY!,
        },
      }
    );

    if (!res.ok) throw new Error(`API error ${res.status}`);

    const data = await res.json();
    allCards.push(...data.data);
    hasMore = data.data.length === 250;
    page++;
  }

  const gen1Cards = allCards.filter(
    (card) =>
      Array.isArray(card.nationalPokedexNumbers) &&
      card.nationalPokedexNumbers[0] <= 151
  );

  const seen = new Set<number>();
  const unique = gen1Cards.filter((card) => {
    const dex = card.nationalPokedexNumbers[0];
    if (seen.has(dex)) return false;
    seen.add(dex);
    return true;
  });

  const sorted = unique.sort(
    (a, b) => a.nationalPokedexNumbers[0] - b.nationalPokedexNumbers[0]
  );

  return sorted.map((card) => ({
    id: card.id,
    pokedex: card.nationalPokedexNumbers[0],
    name: card.name,
    image: card.images?.large ?? null,
    number: card.number,
    type: Array.isArray(card.types) ? card.types[0] : null, // Get first type only
  }));
}

async function seed() {
  const cards = await fetchPokemonCards();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const card of cards) {
      await client.query(
        `
        INSERT INTO pokemon_cards (id, pokedex, name, image, number, type)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
        `,
        [card.id, card.pokedex, card.name, card.image, card.number, card.type]
      );
    }

    await client.query("COMMIT");
    console.log(`✅ Seeded ${cards.length} cards`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error during seeding:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
