import { useEffect, useState } from "react";
import "./TopFavorites.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { API_BASE } from "../../constants";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

export const TopFavorites = () => {
  const [topFavorites, setTopFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullscreenCard, setFullscreenCard] = useState<any | null>(null);

  const openFullScreen = (card: any) => {
    setFullscreenCard(card);
    document.body.style.overflow = "hidden"; // prevent scroll behind overlay
  };

  const closeFullScreen = () => {
    setFullscreenCard(null);
    document.body.style.overflow = ""; // restore scroll
  };

  const typeColors: Record<string, string> = {
    Fire: "#D32F2F",
    Water: "#1976D2",
    Grass: "#388E3C",
    Lightning: "#FBC02D",
    Psychic: "#7B1FA2",
    Fighting: "#8D6E63",
    Colorless: "#B0BEC5",
  };

  const typeCounts = topFavorites.reduce(
    (acc, p) => {
      if (!p.type) return acc;
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const typeLabels = Object.keys(typeCounts);
  const typeData = Object.values(typeCounts);
  const typeColorsArray = typeLabels.map((type) => typeColors[type] || "#888");

  const pieChartData = {
    labels: typeLabels,
    datasets: [
      {
        data: typeData,
        backgroundColor: typeColorsArray,
        borderWidth: 1,
      },
    ],
  };

  const pieOptions: ChartOptions<"pie"> = {
    plugins: {
      legend: {
        labels: {
          color: "#eee",
          font: {
            size: 14,
          },
        },
      },
    },
  };

  useEffect(() => {
    const fetchTopFavorites = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/top`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        const sorted = [...data].sort(
          (a, b) => parseInt(b.favorite_count) - parseInt(a.favorite_count)
        );
        setTopFavorites(sorted);
      } catch (err) {
        console.error("Failed to fetch top favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopFavorites();
  }, [API_BASE]);

  if (loading) return <div>Loading...</div>;

  const chartData = {
    labels: topFavorites.map((p) => p.name),
    datasets: [
      {
        label: "Favorite Count",
        data: topFavorites.map((p) => parseInt(p.favorite_count)),
        backgroundColor: topFavorites.map((p) => typeColors[p.type] || "#888"),
        borderRadius: 1,
        barThickness: 16,
        maxBarThickness: 20,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex;
            const type = topFavorites[index]?.type ?? "Unknown";
            return `${context.raw} favorites (${type})`;
          },
        },
        titleFont: { size: 16 },
        bodyFont: { size: 14 },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "#eee",
          font: {
            size: 16,
          },
        },
      },
      y: {
        ticks: {
          color: "#eee",
          font: {
            size: 18, // Pokémon names
          },
        },
      },
    },
  };

  return (
    <div className="top-favorites">
      <section className="card-grid">
        {topFavorites.map((p, i) => (
          <div className="top-favorite-card" onClick={() => openFullScreen(p)}>
            <div key={p.card_id} className="card-summary">
              <img src={p.image} alt={p.name} />
              <div className="card-label">
                <strong>{p.name}</strong>
                <span>{p.favorite_count} favorites</span>
              </div>
            </div>
            <div className="card-rank">
              <span className="card-rank-text">#{i + 1}</span>
            </div>
          </div>
        ))}
      </section>
      <section className="chart-section">
        <div className="chart">
          <h3>Top Pokémon</h3>
          <Bar data={chartData} options={options} />
        </div>

        <div className="chart">
          <h3>Top Energy Types Pokémon</h3>
          <Pie data={pieChartData} options={pieOptions} />
        </div>
      </section>

      {fullscreenCard && (
        <div className="fullscreen-overlay" onClick={closeFullScreen}>
          <div
            className="fullscreen-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={fullscreenCard.image} alt={fullscreenCard.name} />
            <h2>{fullscreenCard.name}</h2>
            <p>{fullscreenCard.favorite_count} favorites</p>
            <button onClick={closeFullScreen}>Close ❌</button>
          </div>
        </div>
      )}
    </div>
  );
};
