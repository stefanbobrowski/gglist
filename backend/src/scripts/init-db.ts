import { pool } from "../utils/db";

const sql = `
CREATE TABLE IF NOT EXISTS pokemon_cards (
  id TEXT PRIMARY KEY,
  pokedex INTEGER NOT NULL,
  name TEXT NOT NULL,
  image TEXT,
  number TEXT,
  type TEXT
);
`;

async function run() {
  await pool.query("DROP TABLE IF EXISTS pokemon_cards");
  await pool.query(sql);
  console.log("✅ Table created in Cloud SQL");
  pool.end();
}

run();
