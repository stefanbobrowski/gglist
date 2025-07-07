// src/pages/Home.tsx
import PokeDex from "../components/PokeDex/PokeDex";
import { Header } from "../components/Header/Header";
import { TopFavorites } from "../components/TopFavorites/TopFavorites";
import { Footer } from "../components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <h1 className="header-title">
        Your Top 10 Favorite Pokemon Cards? (Original 150)
      </h1>
      <TopFavorites />
      <hr />
      <PokeDex />
      <Footer />
    </>
  );
}
