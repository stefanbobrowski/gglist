import { createContext, useContext, useEffect, useState } from "react";
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

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setFavorites([]);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then(({ user }) => {
        setUser({ ...user, token });
      })
      .catch((err) => {
        console.warn("⚠️ Session invalid:", err);
        logout();
      });
  }, []);

  useEffect(() => {
    if (!user?.token) return;

    console.log("📦 Fetching favorites for user:", user.email);

    fetch(`${API_BASE}/api/favorites`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          console.warn("⚠️ Unauthorized — token likely expired");
          logout();
          throw new Error("Unauthorized");
        }
        const data = await res.json();
        setFavorites(data.favorites || []);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch favorites:", err);
      });
  }, [user?.token]);

  return (
    <AuthContext.Provider value={{ user, setUser, favorites, setFavorites, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
