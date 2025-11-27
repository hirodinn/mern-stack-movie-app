import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./component/Home";
import Login from "./component/Login";
import Register from "./component/Register";
import Profile from "./component/Profile";

function App() {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("token")) || ""
  );
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const u = await axios.get("http://localhost:3000/api/users/me", {
        headers: {
          "x-auth-token": token,
        },
      });
      setUser(u.data);
    };
    loadUser();
  }, [token]);
  return (
    <Routes>
      {token.length && (
        <Route
          path="/home"
          element={<Home user={user} token={token} setUser={setUser} />}
        />
      )}
      {user && <Route path="/profile" element={<Profile user={user} />} />}
      <Route index element={<Login setToken={setToken} setUser={setUser} />} />
      <Route path="/register" element={<Register setToken={setToken} />} />
    </Routes>
  );
}

export default App;
