// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { API_BASE } from "../constants";

type User = {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  iat?: number;
  exp?: number;
  token?: string;
};

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  favorites: string[];
  setFavorites: (favs: string[]) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  favorites: [],
  setFavorites: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded: User = jwtDecode(token);
      setUser({ ...decoded, token });
    } catch (err) {
      console.warn("❌ Invalid token:", err);
      localStorage.removeItem("token");
    }
  }, []);

  // Now fetch favorites only *after* user is set
  useEffect(() => {
    if (!user?.token) return;

    console.log("📦 Fetching favorites for user:", user.email);

    fetch(`${API_BASE}/api/favorites`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type") || "";
        if (!res.ok || !contentType.includes("application/json")) {
          const text = await res.text();
          console.warn("⚠️ Invalid favorites response:", text.slice(0, 100));
          throw new Error("Invalid favorites response");
        }
        return res.json();
      })
      .then((data) => setFavorites(data.favorites || []))
      .catch((err) => {
        console.error("❌ Failed to fetch favorites:", err);
      });
  }, [user?.token]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setFavorites([]);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, favorites, setFavorites, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
