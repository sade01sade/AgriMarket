import { useEffect, useState } from "react";
import { getAllCommodities } from "../../api/commodities";
import { getAllMarkets } from "../../api/markets";
import { getApprovedPrices } from "../../api/prices";
import { Search } from "lucide-react";

export default function SearchPrices() {
  const [commodities, setCommodities] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [filters, setFilters] = useState({ commodityId: "", marketId: "" });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([getAllCommodities(), getAllMarkets()]).then(([c, m]) => {
      setCommodities(c.data.data);
      setMarkets(m.data.data);
    });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const params = {};
      if (filters.commodityId) params.commodityId = filters.commodityId;
      if (filters.marketId) params.marketId = filters.marketId;
      const res = await getApprovedPrices(params);
      setResults(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Search Prices</h1>
      <p className="text-gray-500 text-sm mb-6">
        Find current approved prices by commodity or market
      </p>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <form onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3">
          <select
            value={filters.commodityId}
            onChange={(e) => setFilters({ ...filters, commodityId: e.target.value })}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5
                       text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All commodities</option>
            {commodities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.unit})
              </option>
            ))}
          </select>

          <select
            value={filters.marketId}
            onChange={(e) => setFilters({ ...filters, marketId: e.target.value })}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5
                       text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All markets</option>
            {markets.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — {m.city}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-primary-600
                       hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg
                       text-sm font-medium transition-colors"
          >
            <Search size={15} />
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center h-40 text-gray-400">
          Searching...
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12
                        text-center text-gray-400">
          No approved prices found for the selected filters.
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100
                        shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">
                  Commodity
                </th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">
                  Market
                </th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">
                  City
                </th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">
                  Price
                </th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {results.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {r.commodityName}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{r.marketName}</td>
                  <td className="px-5 py-3 text-gray-500">{r.marketCity}</td>
                  <td className="px-5 py-3 font-semibold text-primary-700">
                    {r.price} XAF/{r.commodityUnit}
                  </td>
                  <td className="px-5 py-3 text-gray-400">{r.reportDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}