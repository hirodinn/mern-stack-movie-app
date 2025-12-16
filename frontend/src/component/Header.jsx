import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { add } from "../redux/userInfoAction";
import { Theme } from "./Theme";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  function search(e) {
    e.preventDefault();
    if (inputValue.length) navigate(`/?query=${inputValue}`);
    else navigate("/");
    setInputValue("");
  }

  async function logout() {
    try {
      await axios.post(
        "http://localhost:3000/api/users/logout",
        {},
        {
          withCredentials: true,
        }
      );
      dispatch(add(null));
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <header className="h-20 flex items-center border-b-2 fixed top-0 left-0 right-0 z-10 bg-white/15 backdrop-blur-md border border-white/20">
      <Theme />
      <form
        className="flex-1 max-w-4xl mx-auto h-[60%] flex text-[19px] px-3 md:px-7"
        onSubmit={search}
      >
        <input
          type="text"
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          value={inputValue}
          placeholder="Search for Films"
          className="flex-1 h-full border-2 border-white/20 rounded-3xl focus:outline-none pl-5 "
        />
        <button className="ml-3 px-5 rounded-3xl cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 ">
          search
        </button>
      </form>
      <div className="flex flex-col gap-2">
        <button
          onClick={logout}
          className="
      inline-flex items-center gap-2
      px-3 py-1.5 rounded-lg
      text-xs font-semibold
      border
      transition-all duration-200
      active:scale-95

      bg-[var(--btn-bg)]
      text-[var(--btn-danger-text)]
      border-[var(--btn-danger-border)]
      hover:bg-[color-mix(in_oklab,var(--btn-danger-border)_15%,var(--btn-bg))]
    "
        >
          <i className="fa-solid fa-right-from-bracket text-xs" />
          <span>Log out</span>
        </button>

        <button
          onClick={() => {
            setTimeout(() => {
              navigate("/profile");
            }, 100);
          }}
          className="
      inline-flex items-center gap-2
      px-3 py-1.5 rounded-lg
      text-xs font-semibold
      border
      transition-all duration-200
      active:scale-95

      bg-[var(--btn-bg)]
      text-[var(--btn-success-text)]
      border-[var(--btn-success-border)]
      hover:bg-[color-mix(in_oklab,var(--btn-success-border)_15%,var(--btn-bg))]
    "
        >
          <i className="fa-solid fa-user text-xs" />
          <span>Profile</span>
        </button>
      </div>
    </header>
  );
}
