import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import { storekeeperAPI } from '../Api/api.service';
import { useNavigate } from 'react-router-dom';
import {
  RotateCcw,
  PlayCircle,
  PackageCheck,
  CheckCircle,
  BookOpen,
  QrCode,
  User,
  Users,
  MapPin,
  Calendar,
  Package,
  Timer,
  Moon,
  Sun,
  Timer as TimerIcon
} from 'lucide-react';

const statusColors = {
  Completed: 'bg-[rgba(0,201,80,0.20)] text-[#05DF72] border-[rgba(0,201,80,0.50)]',
  'In Use': 'bg-[rgba(97,95,255,0.20)] text-[#7C86FF] border-[rgba(97,95,255,0.50)]',
  Ready: 'bg-[rgba(0,184,219,0.20)] text-[#00D3F3] border-[rgba(0,184,219,0.50)]',
  Approved: 'bg-[rgba(43,127,255,0.20)] text-[#51A2FF] border-[rgba(43,127,255,0.50)]',
};

import { useTheme } from '../Context/ThemeContext';

export default function MaterialRequests() {
  const { darkMode: dark } = useTheme();
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();
  const [requestsData, setRequestsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        setLoading(true);
        const res = await storekeeperAPI.getRequests();
        const data = res.data.results || res.data || [];
        setRequestsData(data);
      } catch (err) {
        console.error('Workflow load error:', err);
        setError('Could not load data from server');
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, []);

  const filtered =
    filter === 'All' ? requestsData : requestsData.filter((r) => r.status === filter);

  const handleAction = async (id, action) => {
    try {
      await storekeeperAPI.updateRequestStatus(id, action);
      const res = await storekeeperAPI.getRequests();
      setRequestsData(res.data.results || res.data || []);
    } catch (err) {
      console.error('Action failed:', err);
      alert('Failed to perform action: ' + action);
    }
  };

  return (
    <div className={`${dark ? 'dark' : ''}`}>
      <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#121825] text-gray-800 dark:text-gray-100 transition-colors">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Material Requests</h1>
              <p className="text-[#64748B] dark:text-[#94A3B8] text-sm pt-1">
                Manage and track all material requests
              </p>
            </div>
          </div>

          {/* Filter */}
          <div className="bg-[#F8FAFC] dark:bg-[#121825] p-4 rounded-xl border dark:border-[#1E293B] border-[#E2E8F0] shadow-sm flex items-center gap-4">
            <label className="text-sm font-medium dark:text-[#E8EAF0] text-#0F172A">
              Filter by Status:
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-[#E2E8F0] dark:border-[#1E293B] rounded-lg bg-transparent outline-none focus:ring-2"
            >
              <option className="dark:bg-[#121825] dark:text-[#E8EAF0]" value="All">
                All
              </option>
              <option className="dark:bg-[#121825] dark:text-[#E8EAF0]" value="Completed">
                Completed
              </option>
              <option className="dark:bg-[#121825] dark:text-[#E8EAF0]" value="In Use">
                In Use
              </option>
              <option className="dark:bg-[#121825] dark:text-[#E8EAF0]" value="Ready">
                Ready
              </option>
              <option className="dark:bg-[#121825] dark:text-[#E8EAF0]" value="Approved">
                Approved
              </option>
            </select>
          </div>

          {/* Banner 1 */}
          <div className="bg-[rgba(0,201,80,0.10)] border border-[rgba(0,201,80,0.20)] p-4 rounded-2xl flex items-center gap-4">
            <div className="">
              <div className="flex items-start">
                <CheckCircle className="text-[#05DF72] text-base" />
                <h4 className="text-base pb-1 dark:text-[#E8EAF0] font-bold text-emerald-950 flex items-center gap-2">
                  ✨ Automatic Approval & Rejection
                </h4>
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] opacity-90 leading-relaxed">
                The system <strong>automatically approves or rejects</strong> requests based on
                stock availability. When a student submits a request, it instantly checks if all
                materials are in stock. If yes → Auto-Approved ✓ | If no → Auto-Rejected ✗
              </p>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="bg-[linear-gradient(90deg,rgba(99,102,241,0.10)_0%,rgba(43,127,255,0.10)_100%)] border border-[rgba(99,102,241,0.30)] p-6 rounded-3xl flex flex-col gap-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-transparent rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-transparent shrink-0">
                <BookOpen size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold dark:text-[#E8EAF0] text-indigo-950">
                  Need help with action buttons?
                </h4>
                <p className="text-gray-500 font-medium leading-relaxed text-sm">
                  Learn what each button does (Mark Ready, Confirm Pickup, Confirm Return, Complete)
                  and when to use them.
                </p>
              </div>
            </div>
            <div>
              <button
                onClick={() => navigate('/requests/guide')}
                className="bg-[#6366F1] hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg flex items-center gap-3"
              >
                <BookOpen size={20} /> View Complete Button Guide
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <div className="animate-spin text-indigo-500 mb-4">
                  <RotateCcw size={32} />
                </div>
                <p className="text-gray-500">Fetching requests from server...</p>
              </div>
            ) : filtered.length > 0 ? (
              filtered.map((req, i) => (
                <div
                  key={i}
                  className="bg-[#F8FAFC] dark:bg-[#121825] rounded-xl border dark:border-gray-700 p-6 space-y-4 hover:shadow-md transition shadow-sm"
                >
                  <div className="flex items-start">
                    <h2 className="font-bold text-lg mr-3">{req.title}</h2>
                    <span
                      className={`px-4 mt-1 py-1 border rounded-full text-sm font-medium ${statusColors[req.status]}`}
                    >
                      {req.status === 'Completed' ? (
                        <CheckCircle className="mb-1" size={14} />
                      ) : (
                        <Timer className="mb-1" size={14} />
                      )}
                      {req.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#64748B] dark:text-[#94A3B8] font-medium">
                    <span className="flex items-center gap-2">
                      <User size={18} /> {req.student}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin size={18} /> {req.lab}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar size={18} /> {req.date}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                    <div className="bg-[rgba(241,245,249,0.50)] dark:bg-[#1E293B] rounded-xl p-3">
                      <p className="text-[10px] text-[#64748B] font-semibold dark:text-[#94A3B8] uppercase">
                        Materials
                      </p>
                      <p className="font-medium">{req.materials}</p>
                    </div>
                    <div className="bg-[rgba(241,245,249,0.50)] dark:bg-[#1E293B] rounded-xl p-3">
                      <p className="text-[10px] text-[#64748B] font-semibold uppercase dark:text-[#94A3B8]">
                        QR Code
                      </p>
                      <p className="font-medium">{req.qr}</p>
                    </div>
                    <div className="bg-[rgba(241,245,249,0.50)] dark:bg-[#1E293B] rounded-xl p-3">
                      <p className="text-[10px] text-[#64748B] font-semibold uppercase dark:text-[#94A3B8]">
                        Expected Return
                      </p>
                      <p className="font-medium">{req.returnDate}</p>
                    </div>
                    <div className="bg-[rgba(241,245,249,0.50)] dark:bg-[#1E293B] rounded-xl p-3">
                      <p className="text-[10px] text-[#64748B] font-semibold uppercase dark:text-[#94A3B8]">
                        Issued By
                      </p>
                      <p className="font-medium">{req.issuedBy}</p>
                    </div>
                  </div>

                  {/* --- HNA ZEDT L'LOGIC TA3 LES ICONS SGHAR --- */}
                  {req.actions.length > 0 && (
                    <div className="flex flex-col gap-3 pt-2 mt-3 border-t border-[#E2E8F0] dark:border-[#1E293B]">
                      <h3>Actions :</h3>
                      <div className="flex flex-wrap gap-3">
                        {req.actions.map((action, idx) => (
                          <button
                            onClick={() => {
                              if (action === 'View QR Code') {
                                navigate(`/validation/${req.id}`);
                              } else {
                                handleAction(req.id, action);
                              }
                            }}
                            key={idx}
                            className={`px-5 py-2.5 border rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
                              action === 'Confirm Return'
                                ? 'bg-[#FF6900] text-[#FFF] border-transparent'
                                : action === 'Confirm Pickup'
                                  ? 'bg-[#AD46FF] text-[#FFF] border-transparent'
                                  : action === 'Mark Ready'
                                    ? 'bg-[#00B8DB] text-[#FFF] border-transparent'
                                    : 'bg-[rgba(99,101,232,0.2)] text-[#6366F1] border-[rgba(99,102,241,0.50)]' // View QR Code yji Indigo
                            }`}
                          >
                            {/* Condition par icône */}
                            {action === 'Confirm Return' && <RotateCcw size={16} />}
                            {action === 'Confirm Pickup' && <PlayCircle size={16} />}
                            {action === 'Mark Ready' && <PackageCheck size={16} />}
                            {action === 'View QR Code' && <QrCode size={16} />}

                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No material requests found.</p>
                <p className="text-sm text-gray-400">Requests from students will appear here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
