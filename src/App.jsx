import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Home from "./component/Home";
import Login from "./component/Login";

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
      <Route
        path="/*"
        element={<Login setToken={setToken} setUser={setUser} />}
      />
    </Routes>
  );
}

export default App;
