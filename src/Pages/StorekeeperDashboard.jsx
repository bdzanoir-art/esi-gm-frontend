import { useState, useEffect } from 'react';
import { Icon } from '../Components/Icon';
import ThemeToggel from '../Components/ThemToggel';
import Sidebar from '../Components/Sidebar';
import {
  ArrowRight,
  Search,
  LayoutGrid,
  QrCode,
  Pencil,
  Settings,
  Package,
  TrendingUp,
  AlertTriangle,
  Eye,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import AddMaterialModal from './AddMaterialModal';
import AddMaintenanceModal from './AddMaintenanceModal';
import { useNavigate } from 'react-router-dom';
import { storekeeperAPI } from '../Api/api.service';

const statusStyles = {
  Available: 'bg-green-100 text-green-600',
  Reserved: 'bg-blue-100 text-blue-600',
  'In Use': 'bg-purple-100 text-purple-600',
  'Under Maintenance': 'bg-orange-100 text-orange-600',
  Damaged: 'bg-red-100 text-red-600',
  Lost: 'bg-gray-200 text-gray-500',
};

export default function StorekeeperDashboard({ onAddMaintenance }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [qrItem, setQrItem] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showAddMaintenance, setShowAddMaintenance] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    category: '',
    desc: '',
    qty: 0,
    loc: '',
    lab: '',
  });
  const [maintenanceForm, setMaintenanceForm] = useState({
    material: '',
    issue: '',
    priority: 'Low',
  });

  const itemsPerPage = 6;

  // Stats state with real data
  const [stats, setStats] = useState([
    { label: 'Total Materials', value: 0, icon: Icon.browse, iconColor: '#6366F1', iconBg: 'rgba(99,102,241,0.15)' },
    { label: 'Available Items', value: 0, icon: Icon.itrending, iconColor: '#05DF72', iconBg: 'rgba(99,102,241,0.15)' },
    { label: 'Low Stock Alerts', value: 0, icon: Icon.overdue, iconColor: '#FDC700', iconBg: 'rgba(99,102,241,0.15)' },
    { label: 'Needs Maintenance', value: 0, icon: Icon.maintenance, iconColor: '#FF6467', iconBg: 'rgba(99,102,241,0.15)' },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all data in parallel
      const [statsRes, materialsRes, outputsRes, alertsRes] = await Promise.all([
        storekeeperAPI.getStats(),
        storekeeperAPI.getMaterials(),
        storekeeperAPI.getOutputs(),
        storekeeperAPI.getAlerts(),
      ]);

      const dashboardStats = statsRes.data || {};
      const materialsData = materialsRes.data?.results || materialsRes.data || [];
      const outputsData = outputsRes.data?.results || outputsRes.data || [];
      const alertsData = alertsRes.data?.results || alertsRes.data || [];

      // Update stats
      setStats([
        { 
          label: 'Total Materials', 
          value: dashboardStats.total_materials ?? materialsRes.data?.count ?? (Array.isArray(materialsData) ? materialsData.length : 0), 
          icon: Icon.browse, 
          iconColor: '#6366F1', 
          iconBg: 'rgba(99,102,241,0.15)' 
        },
        { 
          label: 'Available Items', 
          value: dashboardStats.available_items ?? (Array.isArray(materialsData) ? materialsData.filter(m => m.status === 'Available').length : 0), 
          icon: Icon.itrending, 
          iconColor: '#05DF72', 
          iconBg: 'rgba(99,102,241,0.15)' 
        },
        { 
          label: 'Low Stock Alerts', 
          value: dashboardStats.low_stock ?? (Array.isArray(materialsData) ? materialsData.filter(m => (m.quantity || 0) < 10).length : 0), 
          icon: Icon.overdue, 
          iconColor: '#FDC700', 
          iconBg: 'rgba(99,102,241,0.15)' 
        },
        { 
          label: 'Needs Maintenance', 
          value: dashboardStats.active_alerts ?? (alertsData.length || 0), 
          icon: Icon.maintenance, 
          iconColor: '#FF6467', 
          iconBg: 'rgba(99,102,241,0.15)' 
        },
      ]);

      // Format materials for display
      if (Array.isArray(materialsData)) {
        const formattedMaterials = materialsData.map(m => ({
          id: m.id,
          name: m.name || m.title || 'Unknown',
          category: m.category_name || m.category || 'Uncategorized',
          desc: m.description || m.desc || 'No description',
          qty: m.quantity ?? m.qty ?? 0,
          available: m.quantity_available ?? m.quantity ?? m.qty ?? 0,
          loc: m.location || m.loc || 'Unknown',
          lab: m.lab_name || m.laboratory || m.lab || 'Unknown Lab',
          status: m.status || 'Available',
        }));
        setMaterials(formattedMaterials);
      }

    } catch (err) {
      console.error('Failed to fetch storekeeper dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(materials.length / itemsPerPage);
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaterials = materials.slice(indexOfFirstItem, indexOfLastItem);

  const handleStatusChange = async (id, newStatus) => {
    // Optimistically update UI
    setMaterials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)),
    );
    
    // TODO: API call to update status when endpoint is available
    // try {
    //   await storekeeperAPI.updateMaterialStatus(id, newStatus);
    // } catch (err) {
    //   console.error('Failed to update status:', err);
    //   // Revert on error
    //   fetchDashboardData();
    // }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex dynamic-bg transition-colors duration-300" style={{ fontFamily: 'Inter' }}>
      <Sidebar />
      <main className="flex-1 relative overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="absolute top-6 right-8 z-60">
          <ThemeToggel />
        </div>

        {/* Page header */}
        <div className="w-full mt-[45px] border-t border-solid border-[var(--card-border)]"></div>
        <div className="w-full mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3">
            <div className="whitespace-nowrap">
              <h2 className="text-title-custom text-[30px] mt-3">Storekeeper Dashboard</h2>
              <p className="text-small-custom text-sm mt-[-9px]">
                Manage laboratory inventory and materials
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddMaintenance(true)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-xl text-sm transition-all"
              >
                {(() => {
                  const MaintenanceIcon = Icon.maintenance;
                  return MaintenanceIcon ? <MaintenanceIcon size={16} /> : null;
                })()} Add to Maintenance
              </button>
              <button
                onClick={() => setShowAddMaterial(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-xl text-sm transition-all"
              >
                + Add Material
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 glass-card border-1 border-[#1E40AF4D] w-[190px] h-[110px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-small-custom whitespace-nowrap">{s.label}</p>
                  <div
                    className="p-1.5 rounded-lg mt-[-11px]"
                    style={{ background: s.iconBg, color: s.iconColor }}
                  >
                    {(() => {
                      const StatIcon = s.icon;
                      return StatIcon ? <StatIcon size={16} /> : null;
                    })()}
                  </div>
                </div>
                <p className="text-3xl font-bold mt-[-20px]" style={{ color: s.iconColor }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Inventory Table */}
          <div className="card-bg rounded-3xl border-1 border-[var(--br)] p-6 mb-8 bg-[var(--card)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-title-custom">Inventory Management</h3>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-small-custom"
                  size={18}
                />
                <input
                  type="text"
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search materials..."
                  className="bg-[var(--btn-signin-bg)] border-1 border-[var(--br)] rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-small-custom"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[650px]">
                <thead>
                  <tr className="text-small-custom text-[11px] uppercase border-b border-[var(--br)]">
                    <th className="pb-3 font-semibold">Material Name</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Quantity</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Location</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-title-custom">
                  {currentMaterials.length > 0 ? currentMaterials.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[var(--card-border)] last:border-0"
                    >
                      <td className="py-4">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-xs text-small-custom">
                          {item.desc?.substring(0, 30) || 'No description'}
                        </p>
                      </td>
                      <td className="py-4 text-small-custom">{item.category}</td>
                      <td
                        className="py-4 font-medium cursor-pointer hover:text-indigo-500"
                        onClick={() => setQrItem(item)}
                      >
                        {item.available} / {item.qty}
                      </td>
                      <td className="py-4">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-none outline-none cursor-pointer ${statusStyles[item.status] || 'bg-gray-100 text-gray-600'}`}
                        >
                          <option value="Available">Available</option>
                          <option value="Reserved">Reserved</option>
                          <option value="In Use">In Use</option>
                          <option value="Under Maintenance">Under Maintenance</option>
                          <option value="Damaged">Damaged</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>
                      <td className="py-4 text-small-custom">{item.loc}</td>
                      <td className="py-4">
                        <div className="flex gap-2 text-gray-400">
                          <Pencil
                            onClick={() => {
                              console.log('Edit material:', item);
                            }}
                            size={16}
                            className="cursor-pointer hover:text-indigo-500"
                          />
                          <ArrowRight
                            onClick={() => {
                              console.log('Transfer material:', item);
                            }}
                            size={16}
                            className="cursor-pointer hover:text-indigo-500"
                          />
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-small-custom">
                        No materials found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Materials Catalog */}
          <div className="card-bg rounded-3xl border-1 border-[var(--br)] mt-8 mb-6">
            <div className="bg-[linear-gradient(90deg,rgba(30,64,175,0.2)_0%,rgba(173,70,255,0.2)_100%)] rounded-3xl py-2 px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex flex-col gap-1 px-6">
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg">
                    <span>
                      {(() => {
                        const RequestsIcon = Icon.requests;
                        return RequestsIcon ? <RequestsIcon size={20} /> : null;
                      })()}
                    </span>
                    <span className="text-2xl text-title-custom">Materials Catalog</span>
                  </div>
                  <p className="text-xs text-small-custom ml-7">Showing 1-6 of 47 materials</p>
                </div>
                <button
                  onClick={() => navigate('/inventory')}
                  className="mr-5 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-[10px] text-xs font-semibold transition-all mt-3"
                >
                  View Inventory <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMaterials.length > 0 ? currentMaterials.map((item) => (
                <div
                  key={item.name}
                  className="card-bg rounded-2xl p-3 border-1 border-[var(--br)] bg-[var(--card)] shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800 transition-all flex flex-col h-full mt-2"
                >
                  <div className="mb-1">
                    <h4 className="font-bold text-title-custom text-base truncate">{item.name}</h4>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 px-2.5 py-1 rounded-full font-bold uppercase">
                      🎛️ Microcontrollers
                    </span>
                  </div>
                  <p className="text-[15px] text-small-custom leading-relaxed flex-grow">
                    {item.desc}
                  </p>
                  <div className="space-y-2 border-t border-dashed border-[var(--br)]">
                    <div className="flex items-center gap-1.5 text-small-custom text-xs">
                      <span className="font-medium">Specifications</span>
                    </div>
                    <div className="gap-x-4 gap-y-2 text-xs">
                      <div className="flex justify-between items-center bg-[var(--gradient-mid)] p-2 rounded-lg">
                        <span className="text-small-custom">Quantity:</span>
                        <span
                          className={`font-bold ${item.qty > 20 ? 'text-green-500' : 'text-orange-500'}`}
                        >
                          {item.qty}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-[var(--gradient-mid)] p-2 rounded-lg">
                        <span className="text-small-custom">Location:</span>
                        <span className="text-title-custom font-medium">{item.loc}</span>
                      </div>
                      <div className="col-span-2 flex justify-between items-center bg-[var(--gradient-mid)] p-2 rounded-lg">
                        <span className="text-small-custom">Laboratory:</span>
                        <span className="text-title-custom font-medium truncate ml-2">
                          {item.lab}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-3 text-center py-8 text-small-custom">
                  No materials in catalog
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--card-border)]">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-1.5 bg-[var(--gradient-mid)] hover:bg-gray-200 dark:hover:bg-gray-700 text-title-custom px-3.5 py-1.5 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-[-9px]"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <div className="text-sm text-small-custom">
                Page <span className="font-bold text-title-custom">{page}</span> of{' '}
                <span className="font-medium text-title-custom">{totalPages || 1}</span>
              </div>
              <button
                onClick={() => page < totalPages && setPage(page + 1)}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-sm transition-all mt-[-9px]"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>


        {showAddMaterial && (
          <AddMaterialModal
            onClose={() => setShowAddMaterial(false)}
            onAdd={async (item) => {
              try {
                // Call real API
                await storekeeperAPI.createMaterial({
                  name: item.name,
                  category_name: item.category, // Assuming serializer handles category name or we need to map id
                  description: item.desc,
                  quantity: item.qty,
                  location: item.loc,
                  laboratory_name: item.lab
                });
                fetchDashboardData(); // Refresh list
              } catch (err) {
                console.error("Failed to add material:", err);
                // Fallback for demo if API fails
                setMaterials((prev) => [...prev, item]);
              }
            }}
          />
        )}

        {showAddMaintenance && (
          <AddMaintenanceModal
            onClose={() => setShowAddMaintenance(false)}
            materials={materials}
            onSubmit={async (form) => {
              try {
                const item = materials.find((m) => m.name === form.material);
                if (item) {
                  // 1. Create alert in backend
                  await storekeeperAPI.createAlert({
                    material: item.id,
                    title: `Maintenance: ${item.name}`,
                    message: form.issue,
                    priority: form.priority?.toLowerCase() || 'medium',
                    quantity: form.quantity || 1
                  });
                  
                  // 2. Update material available count and status
                  const newAvailable = Math.max(0, (item.available || item.qty || 0) - (form.quantity || 1));
                  const newStatus = newAvailable === 0 ? 'Under Maintenance' : item.status;
                  
                  await storekeeperAPI.updateMaterial(item.id, {
                    quantity_available: newAvailable,
                    status: newStatus
                  }); 
                  
                  // 3. Refresh data
                  fetchDashboardData();
                  alert("Material added to maintenance successfully!");
                } else {
                  alert("Could not find the selected material.");
                }
                setShowAddMaintenance(false);
              } catch (err) {
                console.error("Failed to create maintenance alert:", err);
                alert("Failed to create maintenance record. Please check your connection.");
                setShowAddMaintenance(false);
              }
            }}
          />
        )}
      </main>
    </div>
  );
}
