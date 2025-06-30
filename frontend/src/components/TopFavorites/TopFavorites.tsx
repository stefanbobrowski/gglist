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
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const typeColors: Record<string, string> = {
    Fire: "#F08030",
    Water: "#6890F0",
    Grass: "#1e7a14",
    Lightning: "#F8D030",
    Psychic: "#916eb4",
    Fighting: "#C03028",
    Colorless: "#b9b9b9",
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

  useEffect(() => {
    const fetchTopFavorites = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/top`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        const sorted = [...data].sort(
          (a, b) => parseInt(b.favorite_count) - parseInt(a.favorite_count)
        );
        console.log("TOP FAVOS SORTED", sorted);
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
        barThickness: 21, // <-- makes bars thicker
        maxBarThickness: 30,
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
        titleFont: { size: 16 }, // Tooltip title
        bodyFont: { size: 14 }, // Tooltip body
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 16, // Y-axis numbers
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 15, // Pokémon names
          },
        },
      },
    },
  };

  return (
    <div className="top-favorites">
      <section className="card-grid">
        {topFavorites.map((p) => (
          <div key={p.card_id} className="card-summary">
            <img src={p.image} alt={p.name} />
            <div className="card-label">
              <strong>{p.name}</strong>
              <span>{p.favorite_count} favorites</span>
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
          <Pie data={pieChartData} />
        </div>
      </section>
    </div>
  );
};
