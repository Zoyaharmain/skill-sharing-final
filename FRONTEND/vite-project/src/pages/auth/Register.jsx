import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import LocationAutocomplete from "../../components/LocationAutocomplete";

function Register() {
  const navigate = useNavigate();

  const [coordinates, setCoordinates] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    location: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Use current GPS location
  const handleUseLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const coords = [lng, lat];

        setCoordinates(coords);

        setForm((prev) => ({
          ...prev,
          location: "Current Location",
        }));
      },
      (err) => {
        console.log(err);
        alert("Unable to fetch location");
      }
    );
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    if (!coordinates && !form.location) {
      alert("Please select a location");
      return;
    }

    try {
      const response = await API.post("/auth/register", {
        ...form,
        coordinates: coordinates
          ? {
              type: "Point",
              coordinates: coordinates,
            }
          : undefined,
      });

      console.log(response.data);

      alert("Registered Successfully");

      navigate("/login");
    } catch (err) {
      console.error(
        "REGISTER ERROR:",
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-black">
          Create Account
        </h2>

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Full Name"
          value={form.username}
          onChange={handleChange}
          className="w-full p-3 mb-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 outline-none"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 mb-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 outline-none"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mb-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 outline-none"
        />

        {/* Location Autocomplete */}
        <LocationAutocomplete
          value={form.location}
          onSelect={(loc, coords) => {
            setForm({
              ...form,
              location: loc,
            });

            setCoordinates(coords);
          }}
        />

        {/* Use GPS */}
        <button
          type="button"
          onClick={handleUseLocation}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
        >
          Use My Location 📍
        </button>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full py-3 mt-4 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold hover:opacity-90"
        >
          Register
        </button>

        <p className="text-sm mt-4 text-center text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;