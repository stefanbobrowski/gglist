import { useAuth } from "./context/AuthContext";
import PokeDex from "./components/PokeDex/PokeDex";
import "./App.css";
import { GoogleLogin } from "@react-oauth/google";

function App() {
  const { user, setUser, logout } = useAuth();

  return (
    <>
      <header>
        <h1>ggList</h1>
        {user ? (
          <>
            <img
              src={user.picture}
              alt={user.name}
              style={{ height: 32, borderRadius: "50%", marginLeft: 8 }}
            />
            <span style={{ margin: "0 8px" }}>{user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              fetch("/api/google-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  credential: credentialResponse.credential,
                }),
              })
                .then((res) => res.json())
                .then(({ token, user }) => {
                  localStorage.setItem("token", token);
                  setUser(user); // 🔥 Actually update the context here
                })
                .catch((err) => {
                  console.error("Login error:", err);
                });
            }}
            onError={() => {
              console.error("Login Failed");
            }}
          />
        )}
      </header>

      <h1>Top 10 Pokemon (Original 150)</h1>
      <p>(Login to select favorites)</p>
      <PokeDex />
    </>
  );
}

export default App;
