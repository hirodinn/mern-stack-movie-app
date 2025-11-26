import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setToken, setUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function validateUser(e) {
    e.preventDefault();
    const user = await axios.post("http://localhost:3000/api/users/login", {
      email,
      password,
    });
    if (user.data) {
      setToken(user.data);
      const u = await axios.get("http://localhost:3000/api/users/me", {
        headers: {
          "x-auth-token": user.data,
        },
      });
      setUser(u.data);
      setTimeout(() => {
        navigate("/home");
      }, 100);
    }
    console.log(user);
  }

  return (
    <div className="box-border w-full h-screen overflow-hidden bg-my-black flex items-center justify-center text-white flex-col gap-5">
      <h1 className="text-center font-bold text-5xl">Login</h1>
      <form
        className="bg-my-black-hover flex flex-col p-10 text-[20px] w-[90%] max-w-3xl gap-3 rounded-3xl"
        onSubmit={validateUser}
      >
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your Email..."
          className="border-b-2 border-cyan-600 focus:outline-none"
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        />
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="password"
          placeholder="Enter your Password..."
          className="border-b-2 border-cyan-600 focus:outline-none"
          required
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
        />
        <button
          type="submit"
          className="bg-my-black w-fit ml-auto py-1 px-6 rounded-xl cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  );
}
