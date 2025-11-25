import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Home from "./component/Home";
import Login from "./component/Login";

function App() {
  const [isLogged, setIsLogged] = useState(true);
  return (
    <Routes>
      <Route index element={<Login setIsLogged={setIsLogged} />} />
      {isLogged && <Route path="/home" element={<Home />} />}
    </Routes>
  );
}

export default App;
