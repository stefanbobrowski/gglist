import React, { useEffect, useState } from "react";
import "./PokeDex.css";

type Pokemon = {
  id: string;
  name: string;
  pokedex: number;
  number: number;
};

const PokeDex: React.FC = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch("/api/pokemon");
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setPokemon(data);
      } catch (err) {
        console.error("Failed to fetch Pokémon:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  if (loading) return <p>Loading Pokémon...</p>;

  return (
    <section className="pokedex">
      <div className="favorites">
        Favorites:&nbsp;
        {favorites.length > 0 ? (
          favorites.map((id) => {
            const p = pokemon.find((p) => p.id === id);
            return p ? (
              <span key={id} className="favorite-name">
                {p.name}
              </span>
            ) : null;
          })
        ) : (
          <span>No favorites selected</span>
        )}
      </div>

      <div className="pokedex-deck">
        {pokemon.map((p) => (
          <div
            key={p.id}
            onClick={() => toggleFavorite(p.id)}
            className={`pokedex-card ${
              favorites.includes(p.id) ? "favorited" : ""
            }`}
          >
            <img
              src={`https://images.pokemontcg.io/${p.id.split("-")[0]}/${p.number}.png`}
              alt={p.name}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PokeDex;
