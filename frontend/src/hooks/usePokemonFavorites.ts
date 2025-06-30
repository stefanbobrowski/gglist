import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";

export type Pokemon = {
  id: string;
  name: string;
  pokedex: number;
  number: number;
};

export function usePokemonFavorites() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const pokemonMap = useMemo(() => {
    return pokemon.reduce(
      (acc, p) => {
        acc[p.id] = p;
        return acc;
      },
      {} as Record<string, Pokemon>
    );
  }, [pokemon]);

  useEffect(() => {
    fetch(`${API_BASE}/api/pokemon`)
      .then((res) => res.json())
      .then(setPokemon)
      .catch((err) => console.error("Failed to fetch Pokémon:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch(`${API_BASE}/api/favorites`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setFavorites(data.favorites || []))
      .catch((err) => console.error("Error loading favorites:", err));
  }, [user]);

  const toggleFavorite = async (id: string) => {
    const isFavorited = favorites.includes(id);
    const updated = isFavorited
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];
    setFavorites(updated);

    if (!user) return;

    const url = isFavorited
      ? `${API_BASE}/api/favorites?cardId=${encodeURIComponent(id)}`
      : `${API_BASE}/api/favorites`;

    try {
      const res = await fetch(url, {
        method: isFavorited ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: isFavorited ? undefined : JSON.stringify({ cardId: id }),
      });
      if (!res.ok) throw new Error("Failed to update favorites");
      const data = await res.json();
      setFavorites(data.favorites);
    } catch (err) {
      console.error("Failed to update favorite:", err);
    }
  };

  return {
    pokemon,
    favorites,
    loading,
    pokemonMap,
    toggleFavorite,
    user,
  };
}
