import React, { useEffect, useState, useMemo } from "react";
import "./PokeDex.css";
import { useAuth } from "../../context/AuthContext";
import { API_BASE } from "../../constants";

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
  const { user } = useAuth();

  console.log("API_BASE:", API_BASE);

  const [fullscreenCard, setFullscreenCard] = useState<Pokemon | null>(null);

  const openFullScreen = (card: Pokemon) => {
    setFullscreenCard(card);
    document.body.style.overflow = "hidden";
  };

  const closeFullScreen = () => {
    setFullscreenCard(null);
    document.body.style.overflow = "";
  };

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
    const fetchPokemon = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/pokemon`);
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

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const res = await fetch(`${API_BASE}/api/favorites`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch favorites`);
        const data = await res.json();
        setFavorites(data.favorites || []);
      } catch (err) {
        console.error("Error loading favorites:", err);
      }
    };

    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (id: string) => {
    const isFavorited = favorites.includes(id);

    const updated = isFavorited
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];

    setFavorites(updated);

    if (user) {
      try {
        const url = isFavorited
          ? `${API_BASE}/api/favorites?cardId=${encodeURIComponent(id)}`
          : `${API_BASE}/api/favorites`;

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
    }
  };

  const handleFavoriteClick = (id: string) => {
    if (!user) return;

    const isFavorited = favorites.includes(id);
    if (!isFavorited && favorites.length >= 10) {
      alert("You can only have 10 favorites.");
      return;
    }

    toggleFavorite(id);
  };

  if (loading) return <p>Loading Pokémon...</p>;

  return (
    <section className="pokedex">
      <h2>Your Favorites</h2>

      {!user ? (
        <>
          <span className="login-hint">Log in to favorite</span>
          <div className="empty-card-slots">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </>
      ) : (
        <>
          <p style={{ color: "green" }}>
            {favorites.length}/10 favorites selected
          </p>
          <div className="favorites">
            {favorites.length === 0 ? (
              <span style={{ color: "red" }}>No favorites selected</span>
            ) : (
              favorites.map((id) => {
                const p = pokemonMap[id];
                return p ? (
                  <div key={id} className="favorite-preview">
                    <img
                      src={`https://images.pokemontcg.io/${p.id.split("-")[0]}/${p.number}.png`}
                      alt={p.name}
                      title={p.name}
                      className="favorite-thumb"
                    />
                    <div className="card-toolbar">
                      <button
                        onClick={() => handleFavoriteClick(p.id)}
                        title="Remove from favorites"
                      >
                        ❌
                      </button>
                      <button
                        onClick={() => openFullScreen(p)}
                        title="View full size"
                      >
                        🔍
                      </button>
                    </div>
                  </div>
                ) : null;
              })
            )}
          </div>
        </>
      )}
      <h2>Card Collection</h2>
      <div className="pokedex-deck">
        {pokemon.map((card) => (
          <div
            key={card.id}
            className={`pokedex-card ${favorites.includes(card.id) ? "favorited" : ""}`}
            onClick={() => handleFavoriteClick(card.id)}
            title={card.name}
          >
            <img
              src={`https://images.pokemontcg.io/${card.id.split("-")[0]}/${card.number}.png`}
              alt={card.name}
              loading="lazy"
            />
            <button
              type="button"
              disabled={!user}
              onClick={(e) => {
                e.stopPropagation();
                handleFavoriteClick(card.id);
              }}
              className={!user ? "disabled-heart" : "active-heart"}
              title={
                !user
                  ? "Log in to favorite cards"
                  : favorites.length >= 10 && !favorites.includes(card.id)
                    ? "Favorite limit reached"
                    : "Favorite this card"
              }
            >
              {favorites.includes(card.id) ? "❤️" : "💟"}
            </button>
          </div>
        ))}
      </div>

      {fullscreenCard && (
        <div className="fullscreen-overlay" onClick={closeFullScreen}>
          <div
            className="fullscreen-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={`https://images.pokemontcg.io/${fullscreenCard.id.split("-")[0]}/${fullscreenCard.number}.png`}
              alt={fullscreenCard.name}
            />
            <h2>{fullscreenCard.name}</h2>
            <button onClick={closeFullScreen}>Close ❌</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PokeDex;
