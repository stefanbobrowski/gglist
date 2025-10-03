import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";

export default function About() {
  return (
    <>
      <Header />
      <main className="page">
        <h2>About GGList</h2>

        <p>
          <strong>ggList - Pokémon</strong> is a community-driven app where fans of the original 150
          Pokémon cards can cast their favorites and watch the global leaderboard evolve in real
          time.
        </p>
        <ul>
          <li>
            <strong>Global Leaderboard</strong> - Top 10 most favorited cards across all users.
          </li>
          <li>
            <strong>Charts & Stats</strong> - Visual breakdowns of the most popular Pokémon and
            energy types.
          </li>
          <li>
            <strong>Personal Favorites</strong> - Sign in with Google to save your own list of
            favorites.
          </li>
          <li>
            <strong>Binder-Style Collection</strong> - Browse the full Gen 1 card set in a nostalgic
            gallery.
          </li>
        </ul>

        <h2 style={{ marginTop: "2rem" }}>Developer Summary</h2>
        <p>
          ggList is built as a <strong>full-stack web application</strong> hosted on{" "}
          <strong>Google Cloud Platform</strong>, designed for scalability and clean architecture:
        </p>
        <ul>
          <li>
            <strong>Frontend:</strong> React (Vite + TypeScript), styled with custom CSS and chart
            visualizations for real-time stats.
          </li>
          <li>
            <strong>Authentication:</strong> Google Sign-In (OAuth 2.0).
          </li>
          <li>
            <strong>Backend:</strong> Node.js + Express, serving REST APIs for favorites and
            leaderboard data.
          </li>
          <li>
            <strong>Database:</strong> PostgreSQL on Cloud SQL, tracking user favorites and Pokémon
            stats.
          </li>
          <li>
            <strong>Hosting:</strong> Cloud Run with Docker + GitHub Actions CI/CD for continuous
            deployment.
          </li>
          <li>
            <strong>Security:</strong> reCAPTCHA v3, CORS, rate limiting, and IAM-controlled APIs.
          </li>
        </ul>
        <p>
          The goal of ggList is not only to create a fun Pokémon voting experience, but also to
          demonstrate a modern <strong>GCP full-stack template</strong> with production-ready
          infrastructure.
        </p>
      </main>
      <Footer />
    </>
  );
}
