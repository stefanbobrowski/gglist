import fs from "fs";
import path from "path";

const CACHE_FILE = path.join(__dirname, "..", "..", "cache", "pokemon.json");
const EXPIRATION_MS = 1000 * 60 * 60 * 24; // 24 hours

export const getCachedPokemon = (): any[] | null => {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;

    const data = fs.readFileSync(CACHE_FILE, "utf-8");
    const { timestamp, pokemon } = JSON.parse(data);

    const isExpired = Date.now() - timestamp > EXPIRATION_MS;
    if (isExpired) return null;

    return pokemon;
  } catch (err) {
    console.error("Error reading cache:", err);
    return null;
  }
};

export const setCachedPokemon = (pokemon: any[]) => {
  try {
    // Ensure cache directory exists
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });

    const data = {
      timestamp: Date.now(),
      pokemon,
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing cache:", err);
  }
};
