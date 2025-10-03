// src/pages/Home.tsx
import PokeDex from "../components/PokeDex/PokeDex";
import { Header } from "../components/Header/Header";
import { TopFavorites } from "../components/TopFavorites/TopFavorites";
import { Footer } from "../components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <h2 className="header-title">
        Global Leaderboard: Top 10 Favorite Pokemon Cards (Original 150)
      </h2>
      <TopFavorites />
      <hr />
      <PokeDex />
      <Footer />
    </>
  );
}
