import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      // Store token
      localStorage.setItem(
        "token",
        res.data.data.accessToken
      );

      // Store user
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.data.user)
      );

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      console.error(
        "LOGIN ERROR:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-black">
          Login
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Enter your details to continue
        </p>

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* Login Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
        >
          Login
        </button>

        {/* Register Link */}
        <p className="text-sm mt-4 text-center text-gray-700">
          New user?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold"
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;