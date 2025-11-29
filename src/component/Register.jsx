import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ setToken }) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.includes("@")) newErrors.email = "Valid email is required";
    if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const user = await axios.post("http://localhost:3000/api/users", {
        email: form.email,
        password: form.password,
        name: form.name,
      });
      if (user.data) {
        localStorage.setItem("token", JSON.stringify(user.data.token));
        setSuccess(user.data.message);
        setTimeout(() => {
          setToken(user.data.token);
          navigate("/");
        }, 400);
      }
    } catch (err) {
      if (err.response) {
        setError("This Email already Exists ....");
        setTimeout(() => setError(null), 1000);
      } else {
        setError("Network error");
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-5">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col gap-6 border border-white/20">
        <h2 className="text-center font-extrabold text-5xl text-white drop-shadow-lg">
          Register
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="text-white font-semibold mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-white/20 border border-white/40 focus:ring-2 focus:ring-pink-400 text-white placeholder-white/70 outline-none transition"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-white/20 border border-white/40 focus:ring-2 focus:ring-pink-400 text-white placeholder-white/70 outline-none transition"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-white/20 border border-white/40 focus:ring-2 focus:ring-pink-400 text-white placeholder-white/70 outline-none transition"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="px-4 py-2 rounded-xl bg-white/20 border border-white/40 focus:ring-2 focus:ring-pink-400 text-white placeholder-white/70 outline-none transition"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <div className="flex flex-col mt-3 gap-3 text-center text-[17px] font-medium">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-400">{success}</p>}
          </div>
          <div className="flex mt-4 justify-between">
            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 transition text-white font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-lg"
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-pink-500 hover:bg-pink-600 transition text-white font-semibold px-6 py-2 rounded-xl shadow-md hover:shadow-lg"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
