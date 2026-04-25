import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users").then((res) => {
      setUsers(res.data.data);
    }).finally(() => setLoading(false));
  }, []);

  const roleColors = {
    ADMIN: "bg-purple-100 text-purple-700",
    REPORTER: "bg-blue-100 text-blue-700",
    FARMER: "bg-primary-100 text-primary-700",
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400">
      Loading...
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Users</h1>
      <p className="text-gray-500 text-sm mb-6">All registered users</p>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Name</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Email</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Role</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">City</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-800">{u.fullName}</td>
                <td className="px-5 py-3 text-gray-500">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                                   ${roleColors[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">{u.city || "—"}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${u.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"}`}>
                    {u.enabled ? "Active" : "Disabled"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}