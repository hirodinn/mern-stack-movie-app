import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Header() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  function search(e) {
    e.preventDefault();
    if (inputValue.length) navigate(`/home?query=${inputValue}`);
    else navigate("/home");
    setInputValue("");
  }
  return (
    <header className="h-20 flex items-center border-b-2 border-cyan-950 fixed top-0 left-0 right-0 z-10 bg-my-black">
      <form
        className="w-[90%] max-w-4xl mx-auto h-[60%] flex text-[19px]"
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
        <button className="ml-3 border-2 border-gray-600 px-5 rounded-3xl cursor-pointer bg-my-black-hover hover:bg-my-black">
          search
        </button>
      </form>
    </header>
  );
}
