import { useEffect, useState } from "react";
import { getMyReports } from "../../api/prices";

const statusStyles = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  FLAGGED: "bg-red-100 text-red-600",
};

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyReports().then((res) => {
      setReports(res.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading...
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">My Reports</h1>
      <p className="text-gray-500 text-sm mb-6">
        All price reports you have submitted
      </p>

      {reports.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12
                        text-center text-gray-400">
          No reports yet. Submit your first price report.
        </div>
      ) : (
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
                  Price
                </th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">
                  Date
                </th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {r.commodityName}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {r.marketName} · {r.marketCity}
                  </td>
                  <td className="px-5 py-3 text-gray-700 font-medium">
                    {r.price} XAF/{r.commodityUnit}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{r.reportDate}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                     ${statusStyles[r.status]}`}>
                      {r.status}
                    </span>
                    {r.flagReason && (
                      <p className="text-xs text-red-400 mt-0.5">{r.flagReason}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}