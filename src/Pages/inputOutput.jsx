import React, { useState, useEffect } from 'react';
import {
  Filter,
  Search,
  ChevronDown,
  Download,
  Package,
  CheckCircle,
  AlertCircle,
  XCircle,
  Trash2,
  Settings
} from 'lucide-react';
import ThemeToggel from '../Components/ThemToggel';
import Sidebar from '../Components/Sidebar';
import { getMaterialOutputs, getMaterialOutputStats } from '../Api/MaterialOutput.api.js';
import { getLaboratories } from '../Api/LabsMana.api.js';

export default function InputOutput() {
  const [labFilter, setLabFilter] = useState('');
  const [labNameFilter, setLabNameFilter] = useState('All Laboratories');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [outputs, setOutputs] = useState([]);
  const [stats, setStats] = useState(null);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [outData, statData, labsData] = await Promise.all([
        getMaterialOutputs({
           laboratory: labFilter,
           status: statusFilter,
           search: search
        }),
        getMaterialOutputStats(),
        getLaboratories()
      ]);
      setOutputs(outData);
      setStats(statData);
      setLabs(labsData);
    } catch (err) {
      console.error("Fetch Data Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [labFilter, statusFilter, search]);

  const exportToCSV = () => {
    if (outputs.length === 0) return alert("No data to export");

    const headers = ["Material", "Quantity", "Laboratory", "Student/Project", "Issued Date", "Return Date", "Condition", "Status"];
    const rows = outputs.map(row => [
      row.material_name,
      row.quantity,
      row.laboratory_name,
      row.student_name || row.project_name || "N/A",
      row.issued_date,
      row.actual_return_date || row.expected_return_date,
      row.condition,
      row.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `material_outputs_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const conditionColors = {
    Excellent: { color: '#05DF72', bg: 'rgba(5,223,114,0.12)' },
    Good: { color: '#6366F1', bg: 'rgba(99,102,241,0.12)' },
    Poor: { color: '#FF6467', bg: 'rgba(255,100,103,0.12)' },
    Damaged: { color: '#FF6467', bg: 'rgba(255,100,103,0.15)' },
  };

  const statusColors = {
    borrowed: { color: '#6366F1', bg: 'rgba(99,102,241,0.12)' },
    returned: { color: '#05DF72', bg: 'rgba(5,223,114,0.12)' },
    overdue: { color: '#FF6467', bg: 'rgba(255,100,103,0.12)' },
    transferred: { color: '#C27AFF', bg: 'rgba(194,122,255,0.12)' },
  };

  const statCards = [
    { label: 'Total Outputs', value: stats?.total_outputs || 0, iconColor: '#6366F1', iconBg: 'rgba(99,102,241,0.15)' },
    { label: 'Borrowed', value: stats?.borrowed || 0, iconColor: '#6366F1', iconBg: 'rgba(99,102,241,0.15)' },
    { label: 'Returned', value: stats?.returned || 0, iconColor: '#05DF72', iconBg: 'rgba(99,102,241,0.15)' },
    { label: 'Overdue', value: stats?.overdue || 0, iconColor: '#FF6467', iconBg: 'rgba(255,100,103,0.15)' },
    { label: 'Transferred', value: stats?.transferred || 0, iconColor: '#C27AFF', iconBg: 'rgba(194,122,255,0.15)' },
  ];

  function Badge({ label, map }) {
    const displayLabel = label ? label.charAt(0).toUpperCase() + label.slice(1) : 'Unknown';
    const s = map[label?.toLowerCase()] || map[displayLabel] || { color: '#aaa', bg: 'rgba(170,170,170,0.12)' };
    return (
      <span
        className="inline-flex text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap gap-1 items-center"
        style={{ color: s.color, background: s.bg }}
      >
        {displayLabel}
      </span>
    );
  }

  return (
    <div className="flex dynamic-bg transition-colors duration-300" style={{ fontFamily: 'Inter' }}>
      <Sidebar />
      <main className="flex-1 relative overflow-y-auto p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="absolute top-6 right-8 z-60">
          <ThemeToggel />
        </div>

        <div className="w-full mt-[45px] border-t border-solid border-[var(--card-border)] pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3">
            <div className="whitespace-nowrap">
              <h2 className="text-title-custom text-[30px] font-bold">Material Outputs</h2>
              <p className="text-small-custom text-sm -mt-1 opacity-70">
                Track all materials leaving and entering laboratories
              </p>
            </div>
            <div className="">
              <button
                onClick={exportToCSV}
                className="flex items-center text-white bg-[#6366F1] hover:bg-[#5558e3] rounded-xl gap-2 px-4 py-2 text-sm transition-all whitespace-nowrap font-semibold shadow-lg shadow-indigo-500/20"
              >
                <Download size={18} /> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {statCards.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-4 glass-card border border-[rgba(30,64,175,0.15)] shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wider opacity-60">{s.label}</p>
                <div
                  className="p-1.5 rounded-lg"
                  style={{ background: s.iconBg, color: s.iconColor }}
                >
                  <Package size={16} />
                </div>
              </div>
              <p className="text-3xl font-black tracking-tighter" style={{ color: s.iconColor }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-[rgba(30,64,175,0.15)] bg-[var(--card)] p-5 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Filter size={18} className="text-indigo-500" />
            <h2 className="text-lg font-bold text-title-custom">Dynamic Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Lab Filter */}
            <div className="relative">
              <label className="block text-[10px] uppercase font-bold opacity-50 mb-1.5 ml-1">Laboratory</label>
              <div
                className="flex items-center justify-between px-4 py-2.5 rounded-xl border-0 bg-[var(--butt-filter)] text-sm cursor-pointer hover:opacity-80 transition"
                onClick={() => setOpenDropdown(openDropdown === 'lab' ? null : 'lab')}
              >
                <span className="text-title-custom font-medium truncate">{labNameFilter}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'lab' ? 'rotate-180' : ''}`} />
              </div>
              {openDropdown === 'lab' && (
                <div className="absolute z-[100] mt-2 w-full rounded-2xl border border-[rgba(30,64,175,0.15)] bg-[var(--card)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 text-xs font-bold opacity-40 uppercase bg-slate-50 dark:bg-slate-900/50">Select Lab</div>
                  <div className="max-h-[250px] overflow-y-auto">
                    <div className="px-4 py-2.5 text-sm hover:bg-indigo-500 hover:text-white cursor-pointer transition" 
                         onClick={() => { setLabFilter(''); setLabNameFilter('All Laboratories'); setOpenDropdown(null); }}>
                      All Laboratories
                    </div>
                    {labs.map(l => (
                      <div key={l.id} className="px-4 py-2.5 text-sm hover:bg-indigo-500 hover:text-white cursor-pointer transition border-t border-[rgba(30,64,175,0.05)]" 
                           onClick={() => { setLabFilter(l.id); setLabNameFilter(l.name); setOpenDropdown(null); }}>
                        {l.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <label className="block text-[10px] uppercase font-bold opacity-50 mb-1.5 ml-1">Status</label>
              <div
                className="flex items-center justify-between px-4 py-2.5 rounded-xl border-0 bg-[var(--butt-filter)] text-sm cursor-pointer hover:opacity-80 transition"
                onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
              >
                <span className="text-title-custom font-medium">{statusFilter || 'All Statuses'}</span>
                <ChevronDown size={16} className={`transition-transform duration-200 ${openDropdown === 'status' ? 'rotate-180' : ''}`} />
              </div>
              {openDropdown === 'status' && (
                <div className="absolute z-[100] mt-2 w-full rounded-2xl border border-[rgba(30,64,175,0.15)] bg-[var(--card)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2.5 text-sm hover:bg-indigo-500 hover:text-white cursor-pointer transition" onClick={() => { setStatusFilter(''); setOpenDropdown(null); }}>All Statuses</div>
                  {['Borrowed', 'Returned', 'Overdue', 'Transferred'].map(st => (
                    <div key={st} className="px-4 py-2.5 text-sm hover:bg-indigo-500 hover:text-white cursor-pointer transition border-t border-[rgba(30,64,175,0.05)]" 
                         onClick={() => { setStatusFilter(st.toLowerCase()); setOpenDropdown(null); }}>
                      {st}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <div>
              <label className="block text-[10px] uppercase font-bold opacity-50 mb-1.5 ml-1">Quick Search</label>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-0 bg-[var(--butt-filter)]">
                <Search size={16} className="opacity-40" />
                <input
                  className="bg-transparent text-sm outline-none w-full text-title-custom placeholder:text-small-custom"
                  placeholder="Material, Student, Project..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && <Trash2 size={14} className="cursor-pointer hover:text-rose-500" onClick={() => setSearch('')}/>}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-[rgba(30,64,175,0.15)] overflow-hidden bg-[var(--card)] shadow-sm">
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-[var(--butt-filter)]">
                  {['Material', 'Laboratory', 'Recipient', 'Issued', 'Return', 'Condition', 'Status'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-[10px] font-black text-title-custom uppercase tracking-widest opacity-50">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   <tr><td colSpan={7} className="py-20 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div></td></tr>
                ) : outputs.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-20 text-center text-sm opacity-50 italic">No output records found with the current filters.</td></tr>
                ) : (
                  outputs.map((row, i) => (
                    <tr key={row.id} className="border-b border-[rgba(30,64,175,0.05)] last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500"><Package size={14} /></div>
                           <div>
                             <div className="font-bold text-sm text-title-custom leading-tight">{row.material_name}</div>
                             <div className="text-[10px] opacity-50">Qty: {row.quantity} units</div>
                           </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-xs tracking-tight">{row.laboratory_name}</td>
                      <td className="px-5 py-4">
                        <div className="text-[11px] font-bold leading-tight">{row.student_name || row.project_name || "Guest"}</div>
                        <div className="text-[9px] opacity-50">{row.student_name ? "Student User" : "Project Entity"}</div>
                      </td>
                      <td className="px-5 py-4 text-[11px] font-medium opacity-80 whitespace-nowrap">{row.issued_date}</td>
                      <td className="px-5 py-4 text-[11px] font-medium opacity-80 whitespace-nowrap">{row.actual_return_date || row.expected_return_date || "Pending"}</td>
                      <td className="px-5 py-4"><Badge label={row.condition} map={conditionColors} /></td>
                      <td className="px-5 py-4"><Badge label={row.status} map={statusColors} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
