import { useSelector, useDispatch } from "react-redux";
import { makeDark } from "../redux/userInfoAction";

export function Theme() {
  const darkMode = useSelector((state) => state.userInfo.darkMode);
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(makeDark(!darkMode));
  };

  return (
    <div
      onClick={handleToggle}
      className={`w-16 h-8 rounded-full p-1 flex items-center cursor-pointer transition-colors ${
        darkMode ? "bg-gray-700" : "bg-yellow-300"
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${
          darkMode
            ? "translate-x-8 bg-gray-900 text-white"
            : "translate-x-0 bg-white text-yellow-500"
        }`}
      >
        <i className={darkMode ? "fas fa-moon" : "fas fa-sun"}></i>
      </div>
    </div>
  );
}
