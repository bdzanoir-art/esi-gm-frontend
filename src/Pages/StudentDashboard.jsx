import { useState, useEffect } from 'react';
import { Icon } from '../Components/Icon';
import ThemeToggel from '../Components/ThemToggel';
import { ArrowRight } from 'lucide-react';

import Sidebar from '../Components/Sidebar';
import { useNavigate } from 'react-router-dom';
import '../hook/StudentDash.css';
import { studentAPI, myRequestAPI } from '../Api/api.service';

const STATUS_STYLE = {
  pending:   'bg-yellow-500/20 text-yellow-400 border-1 border-yellow-500/40',  // lowercase from backend
  Pending:   'bg-yellow-500/20 text-yellow-400 border-1 border-yellow-500/40',
  approved:  'bg-green-500/20  text-green-400  border-1 border-green-500/40',
  Approved:  'bg-green-500/20  text-green-400  border-1 border-green-500/40',
  completed: 'bg-blue-500/20   text-blue-400   border-1 border-blue-500/40', 
  Completed: 'bg-blue-500/20   text-blue-400   border-1 border-blue-500/40',
  rejected:  'bg-red-500/20 text-red-400 border-1 border-red-500/40',
  Rejected:  'bg-red-500/20 text-red-400 border-1 border-red-500/40',
};

export default function StudentDashboard() {
  const [active, setActive] = useState('Dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Real data states
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
  });

  const navigate = useNavigate();

  // Fetch data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    // Fetch projects (independent)
    let projectsData = [];
    try {
      const projectsRes = await studentAPI.getProjects();
      projectsData = projectsRes.data?.results || projectsRes.data || [];
      if (!Array.isArray(projectsData)) projectsData = [];
      setProjects(projectsData);
    } catch (err) {
      console.warn('Projects fetch failed:', err?.response?.status, err.message);
      setProjects([]);
    }

    // Fetch dashboard stats (independent) — /api/my-request/dashboard/
    try {
      const statsRes = await myRequestAPI.getDashboardStats();
      const dashStats = statsRes.data || {};
      setStats({
        // Use active_projects from the stats endpoint if available, else fall back to project list length
        totalProjects:    dashStats.active_projects ?? projectsData.length,
        totalRequests:    dashStats.total_requests   ?? 0,
        approvedRequests: dashStats.approved_requests ?? 0,
        pendingRequests:  dashStats.pending_requests  ?? 0,
      });
      setRequests(dashStats.recent_requests || []);
    } catch (err) {
      console.warn('Dashboard stats fetch failed:', err?.response?.status, err.message);
      setStats({
        totalProjects: projectsData.length,
        totalRequests: 0,
        approvedRequests: 0,
        pendingRequests: 0,
      });
      setRequests([]);
    }

    setLoading(false);
  };

  const statCards = [
    {
      label: 'My Projects',
      value: stats.totalProjects,
      icon: Icon.projects,
      iconColor: '#6366F1',
      iconBg: 'rgba(99,102,241,0.15)',
    },
    {
      label: 'Total Requests',
      value: stats.totalRequests,
      icon: Icon.requests,
      iconColor: '#A855F7',
      iconBg: 'rgba(168,85,247,0.15)',
    },
    {
      label: 'Approved',
      value: stats.approvedRequests,
      icon: Icon.check,
      iconColor: '#22C55E',
      iconBg: 'rgba(34,197,94,0.15)',
    },
    {
      label: 'Pending',
      value: stats.pendingRequests,
      icon: Icon.clock,
      iconColor: '#EAB308',
      iconBg: 'rgba(234,179,8,0.15)',
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen dynamic-bg transition-colors duration-300"
      style={{ fontFamily: 'Inter' }}
    >
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-7">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-title-custom">Student Dashboard</h1>
            <p className="text-sm text-small-custom">Manage your projects and material requests</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
              <button 
                onClick={fetchDashboardData}
                className="ml-2 text-red-700 underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {statCards.map((s) => {
              const StatIcon = s.icon;
              return (
                <div
                  key={s.label}
                  className="rounded-2xl p-4 glass-card border-1 border-[#1E40AF4D] min-h-[109px]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-title-custom">{s.label}</p>
                    <div className="p-1.5 rounded-lg" style={{ color: s.iconColor }}>
                      {StatIcon ? <StatIcon size={20} /> : null}
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-title-custom mt-[-20px]">{s.value}</p>
                </div>
              );
            })}
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div
              className="rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, transparent 100%)',
                border: '1px solid #2B7FFF33',
              }}
            >
              <div
                onClick={() => navigate('/projects')}
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-indigo-500/10 text-[#51A2FF]"
              >
                <div>
                  {(() => {
                    const ProjectsIcon = Icon.projects;
                    return ProjectsIcon ? <ProjectsIcon size={24} /> : null;
                  })()}
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-title-custom">Manage Projects</h3>
              <p className="text-sm text-small-custom mb-4">
                Create new projects, add team members, and organize your work.
              </p>
              <span className="text-sm font-inter text-[#51A2FF] flex items-center gap-2">
                View Projects <ArrowRight size={20} />
              </span>
            </div>

            <div
              onClick={() => navigate('/materials/browse')}
              className="rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.01] font-inter"
              style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, transparent 100%)',
                border: '1px solid #AD46FF33',
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-purple-500/10 text-purple-500">
                <div>
                  {(() => {
                    const RequestsIcon = Icon.requests;
                    return RequestsIcon ? <RequestsIcon size={24} /> : null;
                  })()}
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-title-custom">Request Materials</h3>
              <p className="text-sm text-small-custom mb-4">
                Browse available materials and submit requests for your projects.
              </p>
              <span
                onClick={() => navigate('/materials/browse')}
                className="text-sm font-inter text-purple-500"
              >
                Browse Materials →
              </span>
            </div>
          </div>

          {/* My Projects */}
          <div className="rounded-2xl p-6 mb-8 bg-[var(--card)] border-1 border-[var(--card-border)] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-title-custom font-inter font-bold text-lg">
                {(() => {
                  const ProjectsIcon = Icon.projects;
                  return ProjectsIcon ? <ProjectsIcon size={20} className="inline mr-2" /> : null;
                })()} My Projects
              </div>
              <button
                onClick={() => navigate('/projects')}
                className="text-sm font-inter font-bord text-[var(--primary)] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.length > 0 ? projects.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl border-1 border-[var(--card-border)] hover:bg-black/5 transition-all cursor-pointer flex flex-col min-h-[100px]"
                >
                  <div className="flex-1 text-left">
                    <h4 className="font-inter text-[15px] text-title-custom mb-1">{p.name || p.title}</h4>
                    <p className="text-[11px] text-small-custom leading-snug opacity-80 line-clamp-2">
                      {p.description || p.desc || 'No description'}
                    </p>
                  </div>
                  <div className="mt-0 pt-0 flex items-center justify-between">
                    <span className="text-[9px] text-small-custom font-inter uppercase tracking-tight">
                      {p.members_count || p.members || 0} team member(s)
                    </span>
                    <span className="text-[10px] text-small-custom opacity-50">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString() : p.createdAt || 'N/A'}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 text-center py-8 text-small-custom">
                  No projects yet. <button onClick={() => navigate('/projects')} className="text-[var(--primary)] underline">Create your first project</button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Requests */}
          <div
            className="rounded-2xl overflow-hidden py-3"
            style={{ background: 'var(--card)', border: '1px solid var(--card-border)' }}
          >
            <div className="flex items-center justify-between px-6 py-3.5">
              <div className="flex items-center gap-2 text-title-custom font-inter font-bold text-lg">
                {(() => {
                  const RequestsIcon = Icon.requests;
                  return RequestsIcon ? <RequestsIcon size={20} className="inline mr-2" /> : null;
                })()} Recent Requests
              </div>
              <button
                onClick={() => navigate('/my-requests')}
                className="text-sm font-inter font-bord text-[var(--primary)] hover:underline"
              >
                View All
              </button>
            </div>
            <div className="flex flex-col gap-4 mx-auto max-w-[95%]">
              {requests.length > 0 ? requests.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-4 px-6 py-3 rounded-xl border-1 border-[var(--card-border)] last:border-0 hover:bg-black/5 transition-all cursor-pointer"
                >
                    <div className="min-w-0">
                      <p className="font-inter text-sm text-title-custom truncate">{r?.project_name || r?.project || 'Unnamed Project'}</p>
                      <p className="text-xs text-small-custom mt-1">
                        {(typeof r?.items_count === 'number') 
                          ? r.items_count 
                          : (Array.isArray(r?.items) ? r.items.length : 0)} item(s) • Updated: {r?.updated_at ? new Date(r.updated_at).toLocaleDateString() : (r?.updatedAt || 'N/A')}
                      </p>
                    </div>
                    <span
                      className={`text-xs capitalize tracking-wider font-bold px-3 py-1 rounded-full flex-shrink-0 ${STATUS_STYLE[r?.status] || STATUS_STYLE['Pending']}`}
                    >
                      {r?.status || 'Pending'}
                    </span>
                </div>
              )) : (
                <div className="text-center py-8 text-small-custom">
                  No requests yet. <button onClick={() => navigate('/my-requests')} className="text-[var(--primary)] underline">Make a request</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
