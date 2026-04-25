import { useEffect, useState } from "react";
import {
  getAllCommodities,
  createCommodity,
  deactivateCommodity,
} from "../../api/commodities";
import { Plus, Trash2 } from "lucide-react";

const CATEGORIES = ["GRAIN", "VEGETABLE", "FRUIT", "LIVESTOCK", "DAIRY", "OTHER"];

export default function ManageCommodities() {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", category: "GRAIN", unit: "", description: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchCommodities = async () => {
    const res = await getAllCommodities();
    setCommodities(res.data.data);
    setLoading(false);
  };

  useEffect(() => { fetchCommodities(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createCommodity(form);
      setForm({ name: "", category: "GRAIN", unit: "", description: "" });
      setShowForm(false);
      fetchCommodities();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create commodity");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id) => {
    if (!confirm("Deactivate this commodity?")) return;
    await deactivateCommodity(id);
    fetchCommodities();
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
          <h1 className="text-2xl font-bold text-gray-800">Commodities</h1>
          <p className="text-gray-500 text-sm">Manage tradeable goods</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700
                     text-white px-4 py-2 rounded-lg text-sm font-medium
                     transition-colors"
        >
          <Plus size={16} />
          Add Commodity
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-4">New Commodity</h2>
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
                Name
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
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2
                           text-sm focus:outline-none focus:ring-2
                           focus:ring-primary-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                required
                placeholder="kg, sack, litre"
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Name</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Category</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Unit</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {commodities.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-800">{c.name}</td>
                <td className="px-5 py-3 text-gray-500">{c.category}</td>
                <td className="px-5 py-3 text-gray-500">{c.unit}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${c.active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"}`}>
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => handleDeactivate(c.id)}
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