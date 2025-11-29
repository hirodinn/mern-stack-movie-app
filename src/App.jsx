import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./component/Home";
import Login from "./component/Login";
import Register from "./component/Register";
import Profile from "./component/Profile";
import NotFound404 from "./component/NotFound404";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const u = await axios.get("http://localhost:3000/api/users/me", {
          withCredentials: true,
        });
        setUser(u.data);
      } catch (err) {
        console.log(err);
      }
    };
    loadUser();
  }, []);
  return (
    <Routes>
      {user ? (
        <>
          <Route index element={<Home user={user} setUser={setUser} />} />
          <Route path="/profile" element={<Profile user={user} />} />
        </>
      ) : (
        <>
          <Route index element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
        </>
      )}
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
}

export default App;
