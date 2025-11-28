import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setToken }) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function validateUser(e) {
    e.preventDefault();
    try {
      const user = await axios.post("http://localhost:3000/api/users/login", {
        email,
        password,
      });
      if (user.data) {
        setTimeout(() => {
          setToken(user.data.token);
        }, 400);
        localStorage.setItem("token", JSON.stringify(user.data.token));
        setSuccess(user.data.message);
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
        setTimeout(() => {
          setError(null);
        }, 1000);
      } else {
        setError("Network error");
      }
    }
  }

  return (
    <div className="box-border w-full h-screen overflow-hidden bg-my-black flex items-center justify-center  flex-col gap-5">
      <h1 className="text-center font-bold text-5xl text-pink-100">Login</h1>
      <form
        className="bg-pink-100 flex flex-col p-10 pb-5 text-xl w-[90%] max-w-2xl gap-3 rounded-2xl"
        onSubmit={validateUser}
      >
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          id="email"
          placeholder="Enter your Email..."
          className="border-b-2 border-cyan-600 focus:outline-none "
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
        <div className="flex mt-3 items-center">
          {error && <p className="text-red-600 text-[15px]">{error}</p>}
          {success && <p className="text-green-600 text-[15px]">{success}</p>}

          <div className="ml-auto">
            <button
              type="button"
              className="bg-blue-200 w-fit py-1 px-6 rounded-xl cursor-pointer mr-2.5"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
            <button
              type="submit"
              className="bg-blue-200 w-fit py-1 px-6 rounded-xl cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
