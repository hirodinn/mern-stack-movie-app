import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Home from "./component/Home";
import Login from "./component/Login";

function App() {
  const [isLogged, setIsLogged] = useState(true);
  const [user, setUser] = useState();
  return (
    <Routes>
      {isLogged && <Route path="/home" element={<Home />} user={user} />}
      <Route
        path="/*"
        element={<Login setIsLogged={setIsLogged} setUser={setUser} />}
      />
    </Routes>
  );
}

export default App;
