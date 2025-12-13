import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function validateUser(e) {
    e.preventDefault();
    try {
      const user = await axios.post(
        "http://localhost:3000/api/users/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      if (user.data) {
        setSuccess(user.data.message);
        const u = await axios.get("http://localhost:3000/api/users/me", {
          withCredentials: true,
        });
        setTimeout(() => {
          setUser(u.data);
        }, 300);
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
        setTimeout(() => {
          setError(null);
        }, 1500);
      } else {
        setError("Network error");
      }
    }
  }

  return (
    <div className="w-full h-screen bg-linear-to-br from-blue-400 via-blue-300 to-cyan-200 flex items-center justify-center p-5">
      <title>Login</title>

      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col gap-6 border border-white/20">
        <h1 className="text-center font-extrabold text-5xl text-white drop-shadow-lg">
          Login
        </h1>
        <form className="flex flex-col gap-4" onSubmit={validateUser}>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-white font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email..."
              className="px-4 py-2 rounded-xl bg-white/20 border border-white/40 focus:ring-2 focus:ring-blue-400 text-white placeholder-white/70 outline-none transition"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-white font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password..."
              className="px-4 py-2 rounded-xl bg-white/20 border border-white/40 focus:ring-2 focus:ring-blue-400 text-white placeholder-white/70 outline-none transition"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="flex flex-col mt-3 gap-3 text-center text-[17px] font-medium">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-400">{success}</p>}
          </div>
          <div className="flex mt-4 justify-between">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="bg-blue-500 hover:bg-blue-600 transition text-white font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-lg"
            >
              Register
            </button>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 transition text-white font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-lg"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
