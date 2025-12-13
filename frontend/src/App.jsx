import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { add } from "./redux/userInfoAction";
import axios from "axios";
import Home from "./component/Home";
import Login from "./component/Login";
import Register from "./component/Register";
import Profile from "./component/Profile";
import NotFound404 from "./component/NotFound404";

function App() {
  const user = useSelector((state) => state.userInfo.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const u = await axios.get("http://localhost:3000/api/users/me", {
          withCredentials: true,
        });
        dispatch(add(u.data));
      } catch (err) {
        console.log(err);
      }
    };
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Routes>
      {user ? (
        <>
          <Route index element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </>
      ) : (
        <>
          <Route index element={<Login />} />
          <Route path="/register" element={<Register />} />
        </>
      )}
      <Route path="*" element={<NotFound404 />} />
    </Routes>
  );
}

export default App;
