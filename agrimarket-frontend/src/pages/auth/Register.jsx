import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { register } from "../../api/auth";
import { BarChart2 } from "lucide-react";

const CITIES = ["N'Djamena", "Moundou", "Sarh", "Abéché", "Doba"];

export default function Register() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "FARMER",
    city: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await register(form);
      const { token, ...userData } = res.data.data;
      loginUser(userData, token);

      if (userData.role === "ADMIN") navigate("/admin");
      else if (userData.role === "REPORTER") navigate("/reporter");
      else navigate("/farmer");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary-700 text-white p-3 rounded-full mb-3">
            <BarChart2 size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">AgriMarket</h1>
          <p className="text-gray-500 text-sm mt-1">
            Market Price Intelligence for Chad
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Create your account
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600
                            text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="Moussa Deby"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-primary-500 focus:border-transparent"
              >
                <option value="FARMER">Farmer / Trader</option>
                <option value="REPORTER">Community Reporter</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select your city</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white
                         font-medium py-2.5 rounded-lg transition-colors
                         disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login"
              className="text-primary-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}