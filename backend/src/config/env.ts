import dotenv from "dotenv";

dotenv.config();

export const POKEMON_API_KEY = process.env.POKEMON_API_KEY;

if (!POKEMON_API_KEY) {
  throw new Error("Missing POKEMON_API_KEY in .env");
}
