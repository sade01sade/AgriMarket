import { useEffect, useState } from "react";
import { getAllCommodities } from "../../api/commodities";
import { getAllMarkets } from "../../api/markets";
import { getTrend, compareCities } from "../../api/analytics";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from "recharts";

export default function PriceTrends() {
  const [commodities, setCommodities] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [filters, setFilters] = useState({
    commodityId: "", marketId: "", days: "30"
  });
  const [trend, setTrend] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([getAllCommodities(), getAllMarkets()]).then(([c, m]) => {
      setCommodities(c.data.data);
      setMarkets(m.data.data);
    });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!filters.commodityId) return;
    setLoading(true);
    setTrend(null);
    setComparison(null);

    try {
      const [trendRes, compareRes] = await Promise.all([
        filters.marketId
          ? getTrend(filters.commodityId, filters.marketId, filters.days)
          : Promise.resolve(null),
        compareCities(filters.commodityId),
      ]);

      if (trendRes) setTrend(trendRes.data.data);
      setComparison(compareRes.data.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Price Trends</h1>
      <p className="text-gray-500 text-sm mb-6">
        Visualize price movements and compare across cities
      </p>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <form onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3">
          <select
            value={filters.commodityId}
            onChange={(e) => setFilters({ ...filters, commodityId: e.target.value })}
            required
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5
                       text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select commodity *</option>
            {commodities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={filters.marketId}
            onChange={(e) => setFilters({ ...filters, marketId: e.target.value })}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5
                       text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All markets (comparison only)</option>
            {markets.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.city}
              </option>
            ))}
          </select>

          <select
            value={filters.days}
            onChange={(e) => setFilters({ ...filters, days: e.target.value })}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>

          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 text-white px-5
                       py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Analyze
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-40 text-gray-400">
          Loading charts...
        </div>
      )}

      {/* Trend Line Chart */}
      {trend && trend.points.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-1">
            {trend.commodityName} — {trend.marketName}, {trend.marketCity}
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Price per {trend.commodityUnit} in XAF
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trend.points}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="averagePrice"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
                name="Avg Price"
              />
              <Line
                type="monotone"
                dataKey="minPrice"
                stroke="#86efac"
                strokeWidth={1}
                strokeDasharray="4 4"
                dot={false}
                name="Min Price"
              />
              <Line
                type="monotone"
                dataKey="maxPrice"
                stroke="#166534"
                strokeWidth={1}
                strokeDasharray="4 4"
                dot={false}
                name="Max Price"
              />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* City Comparison Bar Chart */}
      {comparison && comparison.cities.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-700 mb-1">
            {comparison.commodityName} — City Comparison (Last 30 Days)
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Average price per {comparison.commodityUnit} in XAF
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={comparison.cities}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="city" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar
                dataKey="averagePrice30Days"
                fill="#16a34a"
                name="Avg Price (30d)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="latestPrice"
                fill="#86efac"
                name="Latest Price"
                radius={[4, 4, 0, 0]}
              />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}