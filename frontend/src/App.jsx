import { Route, Routes } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { add } from "./redux/userInfoAction";
import axios from "axios";
import Loading from "./component/Loading";

const Home = lazy(() => import("./component/Home"));
const Login = lazy(() => import("./component/Login"));
const Register = lazy(() => import("./component/Register"));
const Profile = lazy(() => import("./component/Profile"));
const NotFound404 = lazy(() => import("./component/NotFound404"));

function App() {
  const user = useSelector((state) => state.userInfo.user);
  const darkMode = useSelector((state) => state.userInfo.darkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const u = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/me`,
          {
            withCredentials: true,
          }
        );
        dispatch(add(u.data));
      } catch (err) {
        console.error(err);
      }
    };
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={darkMode ? "dark" : ""}>
      <Suspense fallback={<Loading />}>
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
      </Suspense>
    </div>
  );
}

export default App;
