import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getModerationQueue } from "../../api/prices";
import { getAllCommodities } from "../../api/commodities";
import { getAllMarkets } from "../../api/markets";
import { ShieldCheck, Package, MapPin, ClipboardList } from "lucide-react";

function StatCard({ icon, label, value, to, color }) {
  return (
    <Link to={to}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-6
                 hover:shadow-md transition-shadow flex items-center gap-4">
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [queueCount, setQueueCount] = useState(0);
  const [commodityCount, setCommodityCount] = useState(0);
  const [marketCount, setMarketCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getModerationQueue(),
      getAllCommodities(),
      getAllMarkets(),
    ]).then(([queue, commodities, markets]) => {
      setQueueCount(queue.data.data.length);
      setCommodityCount(commodities.data.data.length);
      setMarketCount(markets.data.data.length);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading...
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">
        System overview and quick actions
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<ClipboardList size={20} className="text-orange-600" />}
          label="Pending Moderation"
          value={queueCount}
          to="/admin/moderation"
          color="bg-orange-50"
        />
        <StatCard
          icon={<Package size={20} className="text-blue-600" />}
          label="Commodities"
          value={commodityCount}
          to="/admin/commodities"
          color="bg-blue-50"
        />
        <StatCard
          icon={<MapPin size={20} className="text-primary-600" />}
          label="Markets"
          value={marketCount}
          to="/admin/markets"
          color="bg-primary-50"
        />
      </div>
    </div>
  );
}