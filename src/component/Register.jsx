import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register({ setToken }) {
  const navigate = useNavigate();
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

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.includes("@")) {
      newErrors.email = "Valid email is required";
    }

    if (form.password.length < 8) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const user = await axios.post("http://localhost:3000/api/users", {
      email: form.email,
      password: form.password,
      name: form.name,
    });
    if (user.data) {
      setToken(user.data);
      localStorage.setItem("token", JSON.stringify(user.data));
      setTimeout(() => {
        navigate("/home");
      }, 100);
    }
  };
  return (
    <div className="bg-my-black box-border w-full h-screen flex justify-center items-center flex-col">
      <h2 className=" font-semibold mb-4 text-white text-5xl text-center">
        Register
      </h2>

      <form
        onSubmit={handleSubmit}
        className="text-[20px] bg-pink-100 p-8 w-[90%] max-w-2xl rounded-2xl flex flex-col gap-3"
      >
        <div>
          <label className="block">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border-b-2 border-cyan-600 rounded focus:outline-none"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border-b-2 border-cyan-600 rounded focus:outline-none"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border-b-2 border-cyan-600 rounded focus:outline-none"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        <div>
          <label className="block">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border-b-2 border-cyan-600 rounded focus:outline-none"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-200 rounded-lg py-1 px-6 cursor-pointer"
          >
            Register
          </button>
          <button
            type="button"
            className="bg-blue-200 w-fit py-1 px-6 rounded-xl cursor-pointer ml-2.5"
            onClick={() => navigate("/")}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
