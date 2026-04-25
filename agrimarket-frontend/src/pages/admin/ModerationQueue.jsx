import { useEffect, useState } from "react";
import { getModerationQueue, moderateReport } from "../../api/prices";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-700",
  FLAGGED: "bg-red-100 text-red-700",
  APPROVED: "bg-green-100 text-green-700",
};

export default function ModerationQueue() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchQueue = async () => {
    try {
      const res = await getModerationQueue();
      setReports(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQueue(); }, []);

  const handleModerate = async (id, status) => {
    const flagReason = status === "FLAGGED"
      ? prompt("Enter reason for flagging:")
      : null;

    if (status === "FLAGGED" && !flagReason) return;

    setActionLoading(id);
    try {
      await moderateReport(id, { status, flagReason });
      setReports((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading...
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Moderation Queue
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Review and approve or flag submitted price reports
      </p>

      {reports.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12
                        text-center text-gray-400">
          <CheckCircle size={40} className="mx-auto mb-3 text-primary-400" />
          <p>All caught up — no reports pending review</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id}
              className="bg-white rounded-xl border border-gray-100
                         shadow-sm p-5 flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">
                    {report.commodityName}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                   ${statusColors[report.status]}`}>
                    {report.status}
                  </span>
                  {report.status === "FLAGGED" && (
                    <AlertTriangle size={14} className="text-red-500" />
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {report.marketName} · {report.marketCity} ·{" "}
                  <span className="font-medium text-gray-700">
                    {report.price} XAF/{report.commodityUnit}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Reported by {report.reporterName} on {report.reportDate}
                </p>
                {report.flagReason && (
                  <p className="text-xs text-red-500 mt-1">
                    ⚠ {report.flagReason}
                  </p>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleModerate(report.id, "APPROVED")}
                  disabled={actionLoading === report.id}
                  className="flex items-center gap-1 bg-primary-50 text-primary-700
                             hover:bg-primary-100 px-3 py-1.5 rounded-lg text-sm
                             font-medium transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={14} />
                  Approve
                </button>
                <button
                  onClick={() => handleModerate(report.id, "FLAGGED")}
                  disabled={actionLoading === report.id}
                  className="flex items-center gap-1 bg-red-50 text-red-600
                             hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm
                             font-medium transition-colors disabled:opacity-50"
                >
                  <XCircle size={14} />
                  Flag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}