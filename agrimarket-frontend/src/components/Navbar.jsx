import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, BarChart2 } from "lucide-react";

const roleLinks = {
  ADMIN: [
    { label: "Dashboard", to: "/admin" },
    { label: "Moderation", to: "/admin/moderation" },
    { label: "Commodities", to: "/admin/commodities" },
    { label: "Markets", to: "/admin/markets" },
    { label: "Users", to: "/admin/users" },
  ],
  REPORTER: [
    { label: "Dashboard", to: "/reporter" },
    { label: "Submit Price", to: "/reporter/submit" },
    { label: "My Reports", to: "/reporter/reports" },
  ],
  FARMER: [
    { label: "Dashboard", to: "/farmer" },
    { label: "Search Prices", to: "/farmer/search" },
    { label: "Trends", to: "/farmer/trends" },
  ],
};

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const links = user ? roleLinks[user.role] || [] : [];

  return (
    <nav className="bg-primary-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 size={22} />
          <span className="font-bold text-lg">AgriMarket</span>
        </div>

        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm hover:text-primary-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-primary-100">
              {user.fullName} · {user.role}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm bg-primary-800
                         px-3 py-1 rounded hover:bg-primary-600 transition-colors"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}