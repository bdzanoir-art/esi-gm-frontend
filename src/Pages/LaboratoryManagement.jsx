import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import {
  Building2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Plus,
  MapPin,
  Users,
  Box,
  Layers,
  Edit2,
  X,
  Zap
} from 'lucide-react';

import { useTheme } from '../Context/ThemeContext';
import { getLaboratories, createLaboratory, updateLaboratory } from '../Api/LabsMana.api.js';
import { getUsers } from '../Api/superAdmin.api.js';

const LaboratoryManagementPage = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('All');
  const [laboratories, setLaboratories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLabId, setEditingLabId] = useState(null);
  
  // New Lab State
  const [newLab, setNewLab] = useState({
    name: '',
    code: '',
    location: '',
    status: 'Active',
    admin: '' 
  });

  const fetchLabs = async () => {
    try {
      setLoading(true);
      const [labsData, usersData] = await Promise.all([
        getLaboratories(),
        getUsers()
      ]);
      setLaboratories(labsData);
      setUsers(usersData.filter(u => u.role === 'Lab Admin' || u.role === 'Admin'));
    } catch (error) {
      console.error("Fetch labs/users error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  const handleEditClick = (lab) => {
     setNewLab({
        name: lab.name,
        code: lab.code,
        location: lab.location,
        status: lab.status || 'Active',
        admin: lab.admin_id || '' 
     });
     setEditingLabId(lab.id);
     setShowAddModal(true);
  };

  const handleApplyAction = async (e) => {
    e.preventDefault();
    try {
      if (editingLabId) {
        await updateLaboratory(editingLabId, newLab);
      } else {
        await createLaboratory(newLab);
      }
      setShowAddModal(false);
      setEditingLabId(null);
      setNewLab({ name: '', code: '', location: '', status: 'Active', admin: '' });
      fetchLabs();
    } catch (err) {
      alert("Action failed. Check console.");
    }
  };

  const stats = useMemo(() => {
    const total = laboratories.length;
    const active = laboratories.filter((lab) => lab.status === 'Active').length;
    const maintenance = laboratories.filter((lab) => lab.status === 'Maintenance').length;
    const inactive = laboratories.filter((lab) => lab.status === 'Inactive').length;
    return { total, active, maintenance, inactive };
  }, [laboratories]);

  const filteredLabs = useMemo(() => {
    if (statusFilter === 'All') return laboratories;
    return laboratories.filter((lab) => lab.status === statusFilter);
  }, [laboratories, statusFilter]);

  const buildingGroups = useMemo(() => {
    const grouped = {};
    laboratories.forEach((lab) => {
      const bName = lab.location ? (lab.location.includes('Building') ? lab.location.split(',')[1]?.trim() || lab.location : lab.location) : 'Unknown';
      if (!grouped[bName]) grouped[bName] = [];
      grouped[bName].push(lab);
    });
    return grouped;
  }, [laboratories]);

  const statusBadge = (status) => {
    if (status === 'Active') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 border bg-[linear-gradient(135deg,rgba(0,201,80,0.10)_0%,rgba(0,166,62,0.05)_100%)] border-[rgba(0,201,80,0.20)]">
          <CheckCircle size={14} />
          Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-rose-600 border bg-rose-50 border-rose-100">
        <XCircle size={14} />
        {status || 'Inactive'}
      </span>
    );
  };

  const statCardStyle = {
    Total: 'bg-[linear-gradient(135deg,rgba(43,127,255,0.10)_0%,rgba(21,93,252,0.05)_100%)] border-[rgba(43,127,255,0.20)]',
    Active: 'bg-[linear-gradient(135deg,rgba(0,201,80,0.10)_0%,rgba(0,166,62,0.05)_100%)] border-[rgba(0,201,80,0.20)]',
    Maintenance: 'bg-[linear-gradient(135deg,rgba(240,177,0,0.10)_0%,rgba(208,135,0,0.05)_100%)] border-[rgba(240,177,0,0.20)]',
    Inactive: 'bg-[linear-gradient(135deg,rgba(251,44,54,0.10)_0%,rgba(231,0,11,0.05)_100%)] border-[rgba(251,44,54,0.20)]',
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} flex`}>
        <Sidebar />

        <main className="flex-1 overflow-x-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Laboratory Management</h2>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
                  Configure laboratory locations and assign administrators
                </p>
              </div>

              <button 
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow-sm transition h-12"
              >
                <Plus size={18} />
                Add Laboratory
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {Object.entries(stats).map(([label, count]) => {
                const key = label.charAt(0).toUpperCase() + label.slice(1);
                const config = {
                   Total: { icon: Building2, color: 'text-[#51A2FF]' },
                   Active: { icon: CheckCircle, color: 'text-[#05DF72]' },
                   Maintenance: { icon: AlertCircle, color: 'text-[#FDC700]' },
                   Inactive: { icon: XCircle, color: 'text-[#FF6467]' },
                };
                const Icon = config[key]?.icon || Building2;
                return (
                  <div key={label} className={`${statCardStyle[key] || statCardStyle.Total} rounded-2xl border p-5 shadow-sm`}>
                    <div className="flex flex-col gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-slate-900/60' : 'bg-white/40'}`}>
                        <Icon size={22} className={config[key]?.color} />
                      </div>
                      <div>
                        <div className="text-3xl font-bold leading-none">{count}</div>
                        <div className="text-sm opacity-70 mt-1">{key} Laboratories</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 mb-6">
              {['All', 'Active', 'Maintenance'].map(f => (
                 <button
                   key={f}
                   onClick={() => setStatusFilter(f)}
                   className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
                     statusFilter === f
                       ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                       : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                   }`}
                 >
                   {f}
                 </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredLabs.map((lab) => (
                <div key={lab.id} className={`${darkMode ? 'bg-slate-900 border-slate-800 shadow-xl shadow-black/20' : 'bg-white border-slate-200 shadow-sm'} border rounded-2xl p-5 hover:translate-y-[-2px] transition-all`}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-indigo-950/40' : 'bg-indigo-50'}`}>
                        <Building2 size={20} className="text-indigo-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{lab.name}</h3>
                        <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">{lab.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       {statusBadge(lab.status)}
                       <button 
                         onClick={() => handleEditClick(lab)}
                         className="p-2 text-slate-400 hover:text-indigo-600 bg-transparent transition"
                       >
                         <Edit2 size={16} />
                       </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm opacity-80">
                      <MapPin size={16} className="text-indigo-500" />
                      <span>{lab.location || 'No location set'}</span>
                    </div>

                    <div className={`border-t ${darkMode ? 'border-slate-800' : 'border-slate-100'} pt-4`}>
                      <div className="flex items-center gap-2 text-sm">
                        <Users size={16} className="text-slate-400" />
                        <div>
                          <p className="font-medium opacity-90">Admin: {lab.admin_name || 'N/A'}</p>
                          <p className="text-xs opacity-50">{lab.admin_email || 'No email'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                          <Box size={15} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="font-bold text-lg leading-none">{lab.materials_count || 0}</p>
                          <p className="text-[10px] opacity-60 uppercase tracking-tighter">Materials</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                          <Zap size={15} className="text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-bold text-lg leading-none">50</p>
                          <p className="text-[10px] opacity-60 uppercase tracking-tighter">Units</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Building Analysis */}
            {!loading && Object.keys(buildingGroups).length > 0 && (
              <div className={`${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border rounded-2xl p-6 shadow-sm`}>
                <div className="flex items-center gap-3 mb-6">
                  <Layers size={20} className="text-indigo-500" />
                  <h3 className="text-lg font-bold">Facility Infrastructure</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {Object.entries(buildingGroups).map(([building, labs]) => (
                    <div key={building} className="space-y-3">
                      <div className="flex items-center gap-2 font-bold opacity-80 uppercase text-xs tracking-widest text-indigo-500">
                        <Building2 size={14} />
                        {building}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {labs.map(l => (
                          <span key={l.id} className={`px-2 py-1 rounded-lg text-[11px] font-medium ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                            {l.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Laboratory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`${darkMode ? 'bg-slate-900 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'} border w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200`}>
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-2xl font-bold tracking-tight">{editingLabId ? 'Edit Laboratory' : 'New Laboratory'}</h3>
               <button onClick={() => {setShowAddModal(false); setEditingLabId(null); setNewLab({ name: '', code: '', location: '', status: 'Active', admin: '' }); }} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                 <X size={20} />
               </button>
             </div>

             <form onSubmit={handleApplyAction} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold opacity-60 mb-2 uppercase tracking-tighter">Lab Name</label>
                  <input
                    required
                    className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500'} transition`}
                    placeholder="e.g. Robotics Center"
                    value={newLab.name}
                    onChange={e => setNewLab({...newLab, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold opacity-60 mb-2 uppercase tracking-tighter">Code</label>
                    <input
                      required
                      className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500'}`}
                      placeholder="e.g. RL-01"
                      value={newLab.code}
                      onChange={e => setNewLab({...newLab, code: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold opacity-60 mb-2 uppercase tracking-tighter">Status</label>
                    <select
                      className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 outline-none' : 'bg-slate-50 border-slate-200'}`}
                      value={newLab.status}
                      onChange={e => setNewLab({...newLab, status: e.target.value})}
                    >
                      <option value="Active">Active</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold opacity-60 mb-2 uppercase tracking-tighter">Location</label>
                  <input
                    required
                    className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500'}`}
                    placeholder="e.g. Building A, Floor 2"
                    value={newLab.location}
                    onChange={e => setNewLab({...newLab, location: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold opacity-60 mb-2 uppercase tracking-tighter">Administrator (Lab Admin)</label>
                  <select
                    required
                    className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500' : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500'}`}
                    value={newLab.admin}
                    onChange={e => setNewLab({...newLab, admin: e.target.value})}
                  >
                    <option value="">Select an administrator</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.full_name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => {setShowAddModal(false); setNewLab({ name: '', code: '', location: '', status: 'Active', admin: '' }); }} className={`flex-1 px-4 py-3 rounded-xl font-bold ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'} transition`}>
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold transition shadow-lg shadow-indigo-500/20">
                    {editingLabId ? 'Update Lab' : 'Create Lab'}
                  </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaboratoryManagementPage;
