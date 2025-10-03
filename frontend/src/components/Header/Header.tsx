import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../context/AuthContext";
import { API_BASE } from "../../constants";
import { Link } from "react-router-dom";
import "./Header.css";

export function Header() {
  const { user, setUser, logout } = useAuth();

  return (
    <header>
      <h1>
        <Link to="/">ggList Pokemon</Link>
      </h1>
      <Link to="/about" className="nav-link">
        About
      </Link>
      {user ? (
        <div className="user-info-container">
          <div className="user-info">
            <img
              src={user.picture}
              alt={user.name}
              style={{ height: 32, borderRadius: "50%", marginLeft: 8 }}
            />
            <span style={{ margin: "0 8px" }}>{user.name}</span>
          </div>

          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            fetch(`${API_BASE}/api/google-login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                credential: credentialResponse.credential,
              }),
            })
              .then(async (res) => {
                if (!res.ok) {
                  const text = await res.text();
                  throw new Error(`Login failed: ${text}`);
                }
                return res.json();
              })
              .then(({ token, user }) => {
                localStorage.setItem("token", token);
                setUser({ ...user, token });
              })
              .catch((err) => {
                console.error("❌ Login error:", err);
              });
          }}
          onError={() => {
            console.error("Login Failed");
          }}
        />
      )}
    </header>
  );
}
