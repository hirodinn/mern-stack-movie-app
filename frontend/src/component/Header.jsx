import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Header({ setUser }) {
  const navigate = useNavigate();
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
      setUser(null);
      navigate("/");
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <header className="h-20 flex items-center border-b-2 border-cyan-950 fixed top-0 left-0 right-0 z-10 bg-linear-to-br from-blue-400 via-blue-300 to-cyan-200">
      <form
        className="flex-1 max-w-4xl mx-auto h-[60%] flex text-[19px]  px-7"
        onSubmit={search}
      >
        <input
          type="text"
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          value={inputValue}
          placeholder="Search for Films"
          className="flex-1 h-full border-2 border-gray-600 rounded-3xl focus:outline-none pl-5 "
        />
        <button className="ml-3 px-5 rounded-3xl cursor-pointer bg-linear-to-br from-blue-400 via-blue-300 to-cyan-200">
          search
        </button>
      </form>
      <div className="flex flex-col h-[95%] justify-around">
        <button
          className="bg-red-600 rounded cursor-pointer py-1 px-6 mr-2"
          onClick={logout}
        >
          Log out
        </button>
        <button
          className="bg-green-600 rounded cursor-pointer py-1 px-6 mr-2"
          onClick={() => {
            setTimeout(() => {
              navigate("/profile");
            }, 100);
          }}
        >
          Profile
        </button>
      </div>
    </header>
  );
}
