import { useState } from "react";
export default function Header() {
  const [inputValue, setInputValue] = useState("");
  return (
    <header className="h-15 flex items-center">
      <form className="w-[90%] max-w-4xl mx-auto h-[70%] flex text-[19px]">
        <input
          type="text"
          required
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
