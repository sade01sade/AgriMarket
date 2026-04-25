import { useEffect, useState } from "react";
import { getAllCommodities } from "../../api/commodities";
import { getAllMarkets } from "../../api/markets";
import { submitPrice } from "../../api/prices";
import { CheckCircle } from "lucide-react";

export default function SubmitPrice() {
  const [commodities, setCommodities] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [form, setForm] = useState({
    commodityId: "",
    marketId: "",
    price: "",
    reportDate: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAllCommodities(), getAllMarkets()]).then(([c, m]) => {
      setCommodities(c.data.data);
      setMarkets(m.data.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(null);
    setLoading(true);
    try {
      const res = await submitPrice({
        ...form,
        commodityId: Number(form.commodityId),
        marketId: Number(form.marketId),
        price: parseFloat(form.price),
      });
      setSuccess(res.data.data);
      setForm({
        commodityId: "",
        marketId: "",
        price: "",
        reportDate: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Submit Price</h1>
      <p className="text-gray-500 text-sm mb-6">
        Log a current market price for a commodity
      </p>

      {success && (
        <div className={`rounded-xl border p-4 mb-6 flex items-start gap-3
          ${success.status === "FLAGGED"
            ? "bg-yellow-50 border-yellow-200"
            : "bg-green-50 border-green-200"}`}>
          <CheckCircle size={18} className={
            success.status === "FLAGGED" ? "text-yellow-600" : "text-green-600"
          } />
          <div>
            <p className={`text-sm font-medium
              ${success.status === "FLAGGED"
                ? "text-yellow-700" : "text-green-700"}`}>
              {success.status === "FLAGGED"
                ? "Report submitted but flagged for review"
                : "Report submitted successfully"}
            </p>
            {success.flagReason && (
              <p className="text-xs text-yellow-600 mt-1">{success.flagReason}</p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm
                        rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commodity
            </label>
            <select
              value={form.commodityId}
              onChange={(e) => setForm({ ...form, commodityId: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5
                         text-sm focus:outline-none focus:ring-2
                         focus:ring-primary-500"
            >
              <option value="">Select commodity</option>
              {commodities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.unit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Market
            </label>
            <select
              value={form.marketId}
              onChange={(e) => setForm({ ...form, marketId: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5
                         text-sm focus:outline-none focus:ring-2
                         focus:ring-primary-500"
            >
              <option value="">Select market</option>
              {markets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (XAF)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              min="0.01"
              step="0.01"
              placeholder="450.00"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5
                         text-sm focus:outline-none focus:ring-2
                         focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Date
            </label>
            <input
              type="date"
              value={form.reportDate}
              onChange={(e) => setForm({ ...form, reportDate: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5
                         text-sm focus:outline-none focus:ring-2
                         focus:ring-primary-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white
                       font-medium py-2.5 rounded-lg transition-colors
                       disabled:opacity-50 text-sm"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}