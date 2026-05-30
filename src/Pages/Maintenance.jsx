import { useState, useEffect } from 'react';
import { AlertCircle, Calendar, Wrench, RefreshCcw } from 'lucide-react';
import ThemeToggel from '../Components/ThemToggel.jsx';
import Sidebar from '../Components/Sidebar';
import { storekeeperAPI } from '../Api/api.service.js';

export default function Maintenance() {
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await storekeeperAPI.getAlerts();
      const raw = res.data?.results || res.data || [];
      const mapped = raw.map(a => ({
        id: a.id,
        material: a.material_title || `Material #${a.material}`,
        issue: a.message || a.title || 'No details',
        date: new Date(a.created_at).toLocaleDateString(),
        priority: a.priority,
        is_resolved: a.is_resolved
      }));
      setMaintenanceList(mapped);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const stats = [
    {
      label: 'Needs Attention',
      value: maintenanceList.filter(a => !a.is_resolved).length,
      desc: 'Materials requiring maintenance or damaged',
      icon: <AlertCircle size={24} className="text-red-500" />,
    },
    {
      label: 'Resolved',
      value: maintenanceList.filter(a => a.is_resolved).length,
      desc: 'Maintenance completed successfully',
      icon: <RefreshCcw size={24} className="text-green-500" />,
    },
  ];

  return (
    <div className="flex dynamic-bg transition-colors duration-300" style={{ fontFamily: 'Inter' }}>
      <Sidebar />
      <main className="flex-1 relative overflow-y-auto p-8">
        <div className="absolute top-6 right-8 z-60">
          <ThemeToggel />
        </div>

        <div className="w-full mt-[45px] border-t border-solid border-[var(--card-border)]"></div>
        <div className="w-full mb-5">
          <div className="flex items-center justify-between w-full">
            <div className="whitespace-nowrap">
              <h2 className="text-title-custom text-[30px] mt-3">Maintenance Management</h2>
              <p className="text-small-custom text-sm mt-[-9px]">
                Monitor equipment condition and track maintenance schedules
              </p>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 border-1 border-[#1E40AF4D] bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg">{s.icon}</div>
                  <div className="flex flex-col">
                    <p className="text-xs text-small-custom mb-1">{s.label}</p>
                    <p className="text-3xl font-bold text-title-custom">{s.value}</p>
                  </div>
                </div>
                <div className="text-xs text-small-custom mt-2">{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Maintenance History */}
          <div className="rounded-xl border-1 border-[var(--br)] bg-[var(--card)]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E40AF4D]">
              <div className="flex items-center gap-2">
                <Wrench size={18} className="text-title-custom" />
                <h3 className="text-base font-semibold text-title-custom">Maintenance History</h3>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    {[
                      'Material',
                      'Category',
                      'Last Maintenance',
                      'Next Maintenance',
                      'Type',
                      'Status',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-medium text-small-custom uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-small-custom text-xs">
                        Loading maintenance records...
                      </td>
                    </tr>
                  ) : maintenanceList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-small-custom text-xs">
                        No maintenance records yet.
                      </td>
                    </tr>
                  ) : (
                    maintenanceList.map((row) => (
                      <tr key={row.id} className="border-t border-[#1E40AF4D] hover:bg-black/5">
                        <td className="px-4 py-3 text-title-custom text-sm font-medium">
                          {row.material}
                        </td>
                        <td className="px-4 py-3 text-small-custom text-sm">—</td>
                        <td className="px-4 py-3 text-small-custom text-sm">{row.date}</td>
                        <td className="px-4 py-3 text-small-custom text-sm">—</td>
                        <td className="px-4 py-3 text-small-custom text-sm">{row.issue}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              row.priority?.toLowerCase() === 'critical'
                                ? 'bg-red-100 text-red-600'
                                : row.priority?.toLowerCase() === 'high'
                                  ? 'bg-orange-100 text-orange-600'
                                  : row.priority?.toLowerCase() === 'medium'
                                    ? 'bg-yellow-100 text-yellow-600'
                                    : 'bg-green-100 text-green-600'
                            }`}
                          >
                            {row.priority}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
