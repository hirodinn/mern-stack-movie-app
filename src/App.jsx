import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Home from "./component/Home";
import Login from "./component/Login";
import Register from "./component/Register";

function App() {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("token")) || ""
  );
  const [user, setUser] = useState(null);
  return (
    <Routes>
      {token.length && (
        <Route
          path="/home"
          element={<Home user={user} token={token} setUser={setUser} />}
        />
      )}
      <Route index element={<Login setToken={setToken} setUser={setUser} />} />
      <Route path="/register" element={<Register setToken={setToken} />} />
    </Routes>
  );
}

export default App;
