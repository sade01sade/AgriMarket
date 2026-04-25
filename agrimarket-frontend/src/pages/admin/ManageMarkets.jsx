import { useEffect, useState } from "react";
import { getAllMarkets, createMarket, deactivateMarket } from "../../api/markets";
import { Plus, Trash2 } from "lucide-react";

const CITIES = ["N'Djamena", "Moundou", "Sarh", "Abéché", "Doba"];

export default function ManageMarkets() {
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", city: "", region: "", description: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchMarkets = async () => {
    const res = await getAllMarkets();
    setMarkets(res.data.data);
    setLoading(false);
  };

  useEffect(() => { fetchMarkets(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createMarket(form);
      setForm({ name: "", city: "", region: "", description: "" });
      setShowForm(false);
      fetchMarkets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create market");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!confirm("Deactivate this market?")) return;
    await deactivateMarket(id);
    fetchMarkets();
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading...
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Markets</h1>
          <p className="text-gray-500 text-sm">Manage market locations</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700
                     text-white px-4 py-2 rounded-lg text-sm font-medium
                     transition-colors"
        >
          <Plus size={16} />
          Add Market
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">New Market</h2>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4
                            py-3 mb-4 border border-red-200">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Market Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-primary-500"
              >
                <option value="">Select city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <input
                type="text"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-primary-500"
              />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary-600 hover:bg-primary-700 text-white px-5
                           py-2 rounded-lg text-sm font-medium transition-colors
                           disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5
                           py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Name</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">City</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Region</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {markets.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-800">{m.name}</td>
                <td className="px-5 py-3 text-gray-500">{m.city}</td>
                <td className="px-5 py-3 text-gray-500">{m.region || "—"}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${m.active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"}`}>
                    {m.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => handleDeactivate(m.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}