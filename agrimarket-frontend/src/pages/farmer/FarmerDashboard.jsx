import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Search, TrendingUp } from "lucide-react";

export default function FarmerDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Welcome, {user.fullName}
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Check current market prices and trends across Chad
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/farmer/search"
          className="bg-primary-600 hover:bg-primary-700 text-white
                     rounded-xl p-6 flex items-center gap-4 transition-colors">
          <Search size={28} />
          <div>
            <p className="font-semibold text-lg">Search Prices</p>
            <p className="text-primary-100 text-sm">
              Compare prices across markets and cities
            </p>
          </div>
        </Link>

        <Link to="/farmer/trends"
          className="bg-white hover:bg-gray-50 border border-gray-100
                     rounded-xl p-6 flex items-center gap-4 transition-colors
                     shadow-sm">
          <TrendingUp size={28} className="text-primary-600" />
          <div>
            <p className="font-semibold text-lg text-gray-800">Price Trends</p>
            <p className="text-gray-400 text-sm">
              View price movements over time
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}