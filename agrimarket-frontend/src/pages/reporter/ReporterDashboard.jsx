import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyReports } from "../../api/prices";
import { useAuth } from "../../context/AuthContext";
import { PlusCircle, FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function ReporterDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyReports().then((res) => {
      setReports(res.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const approved = reports.filter((r) => r.status === "APPROVED").length;
  const pending = reports.filter((r) => r.status === "PENDING").length;
  const flagged = reports.filter((r) => r.status === "FLAGGED").length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Welcome, {user.fullName}
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        Your reporting activity at a glance
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5
                        flex items-center gap-4">
          <div className="bg-green-50 p-3 rounded-full">
            <CheckCircle size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-2xl font-bold text-gray-800">{approved}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5
                        flex items-center gap-4">
          <div className="bg-yellow-50 p-3 rounded-full">
            <Clock size={20} className="text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-gray-800">{pending}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5
                        flex items-center gap-4">
          <div className="bg-red-50 p-3 rounded-full">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Flagged</p>
            <p className="text-2xl font-bold text-gray-800">{flagged}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/reporter/submit"
          className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl
                     p-6 flex items-center gap-4 transition-colors">
          <PlusCircle size={28} />
          <div>
            <p className="font-semibold text-lg">Submit Price</p>
            <p className="text-primary-100 text-sm">
              Log a new market price report
            </p>
          </div>
        </Link>
        <Link to="/reporter/reports"
          className="bg-white hover:bg-gray-50 border border-gray-100 rounded-xl
                     p-6 flex items-center gap-4 transition-colors shadow-sm">
          <FileText size={28} className="text-gray-500" />
          <div>
            <p className="font-semibold text-lg text-gray-800">My Reports</p>
            <p className="text-gray-400 text-sm">
              View all your submitted reports
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}