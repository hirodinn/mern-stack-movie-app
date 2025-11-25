import { useState } from "react";
import axios from "axios";

export default function Login({ setIsLogged }) {
  return (
    <div className="box-border w-full h-screen overflow-hidden bg-my-black flex items-center justify-center text-white flex-col gap-5">
      <h1 className="text-center font-bold text-5xl">Login</h1>
      <form className="bg-my-black-hover flex flex-col p-10 text-[20px] w-[90%] max-w-3xl gap-3 rounded-3xl">
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your Email..."
          className="border-b-2 border-cyan-600 focus:outline-none"
        />
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="password"
          placeholder="Enter your Password..."
          className="border-b-2 border-cyan-600 focus:outline-none"
        />
      </form>
    </div>
  );
}
