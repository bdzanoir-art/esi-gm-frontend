import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import { useTheme } from '../Context/ThemeContext';
import {
  CircleCheck,
  CircleAlert,
  Users,
  Building2,
  Box,
  GitPullRequest,
  GraduationCap,
  Shield,
  Activity,
  FlaskConical
} from 'lucide-react';
import { getDashboardStats, getRoles, getLabsSummary } from '../Api/superAdmin.api.js';

const SuperAdminDashboard = () => {
  const { darkMode: dark } = useTheme();
  const [stats, setStats] = useState([]);
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolesData, setRolesData] = useState([]);
  const navigate = useNavigate();

  const getStatConfig = (label = '') => {
    const l = (label || '').toLowerCase();
    if (l.includes('user')) {
      return { icon: Users, color: 'text-blue-600', bg: 'bg-blue-50/50' };
    }
    if (l.includes('lab')) {
      return { icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50/50' };
    }
    if (l.includes('material') || l.includes('item')) {
      return { icon: Box, color: 'text-green-600', bg: 'bg-green-50/50' };
    }
    if (l.includes('request')) {
      return { icon: GitPullRequest, color: 'text-orange-600', bg: 'bg-orange-50/50' };
    }
    return { icon: Activity, color: 'text-gray-600', bg: 'bg-gray-50/50' };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, labsSummary, rData] = await Promise.all([
          getDashboardStats(),
          getLabsSummary(),
          getRoles()
        ]);
        setStats(statsData);
        setLabs(labsSummary);
        setRolesData(rData);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const iconMap = {
    'Lab Admins': Users,
    'Warehouse Managers': Shield,
    'Students': GraduationCap,
  };

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${dark ? 'bg-[#020817] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}
    >
      <Sidebar />

      <main className={`flex-1 p-4 sm:p-6 md:p-8 ${dark ? 'bg-[#020817]' : 'bg-[#F8FAFC]'}`}>
        {loading ? (
          <div className="h-full flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (<>

        <div className="mb-7">
          <h2 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h2>
          <p className={`${dark ? 'text-[#94A3B8]' : 'text-gray-500'} text-sm`}>
            System-wide overview and management
          </p>
        </div>

        {/* 1. Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          {stats.map((s) => {
            const config = getStatConfig(s.label);
            const Icon = config.icon;
            return (
              <div 
                key={s.id} 
                onClick={() => s.path && navigate(s.path)}
                className={`rounded-2xl border-[0.667px] p-4 ml-2 transition-all hover:scale-[1.02] cursor-pointer ${s.style}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-1 rounded-2xl ${s.color} ${s.bg}`}>
                    <Icon size={22} />
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full mt-2 uppercase tracking-tighter ${s.status} ${s.color}`}
                  >
                    {s.tagValue || ''} {s.tagText || ''}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-4xl font-bold pb-2 pl-1">{s.value}</p>
                  <h2
                    className={`${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} pl-1 text-[11px] font-medium leading-[20px] uppercase tracking-wider`}
                  >
                    {s.label}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Roles Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {rolesData.map((role) => (
            <RoleCard
              key={role.id}
              icon={iconMap[role.label]}
              count={role.count}
              label={role.label}
              color={role.color}
              dark={dark}
              details={role.details}
              onClick={() => navigate('/admin/users')}
            />
          ))}
        </div>

        {/* 3. Labs Overview */}
        <section
          className={`mb-10 transition-all hover:translate-y-[-2px] rounded-2xl border-[0.667px] ${dark ? 'bg-[#0A1128] border-[#1E293B]' : 'bg-[#F8FAFC] border-[#E2E8F0]'} p-6`}
        >
          <h3
            className={`text-sm font-bold flex items-center gap-2 mb-6 uppercase tracking-wider ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
          >
            <span className="text-indigo-600">
              <Building2 size={18} />
            </span>{' '}
            Laboratories Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {labs.map((lab) => (
              <div
                key={lab.id}
                className={`p-6 border rounded-[12px] border-[0.667px] relative ${dark ? 'bg-[#0A1128] border-[#1E293B]' : 'border-[#E2E8F0] bg-[rgba(241,245,249,0.05)]'}`}
              >
                <div className="absolute top-6 right-6 w-2.5 h-2.5 rounded-full">
                  <CircleCheck className="text-[#05DF72]" />
                </div>
                <h4
                  className={`text-lg font-bold mb-1 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
                >
                  {lab.name}
                </h4>
                <p
                  className={`${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} text-[11px] font-medium mb-2`}
                >
                  {lab.location || 'N/A'}
                </p>
                <div className="flex justify-between items-end">
                  <div className="flex">
                    <p
                      className={`text-[11px] ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} font-medium`}
                    >
                      Materials :{' '}
                    </p>
                    <p
                      className={`text-[11px] font-medium ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
                    >
                      {lab.materials_count}
                    </p>
                  </div>
                  <p
                    className={`text-[11px] ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} font-medium`}
                  >
                    Admin:{' '}
                    <span className={`font-semibold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}>
                      {lab.admin_name || 'N/A'}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/admin/laboratories')}
            className="text-sm bg-transparent text-[#6366F1] font-medium w-full flex pl-1 items-start group pt-4"
          >
            Manage All Laboratories →
          </button>
        </section>

        {/* 4. The Two Management Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-transparent">
          <ManagementBtn
            onClick={() => navigate('/admin/users')}
            icon={Users}
            label="User Management"
            sub="Add admins, manage permissions and roles"
            color="bg-[rgba(43,127,255,0.09)] text-blue-600"
            dark={dark}
            className="bg-[rgba(43,127,255,0.05)]"
          />
          <ManagementBtn
            onClick={() => navigate('/admin/laboratories')}
            icon={FlaskConical}
            label="Laboratory Management"
            sub="Configure locations, assign admins"
            color="bg-[rgba(173,70,255,0.09)] text-purple-600"
            dark={dark}
            className="bg-[rgba(173,70,255,0.04)]"
          />
        </div>
        </>)}
      </main>
    </div>
  );
};

const RoleCard = ({ icon: Icon, count, label, color, dark, details, className = '', onClick }) => {
  const IconComponent = Icon || Users;
  return (
    <div
      onClick={onClick}
      className={`p-5 pb-5 pl-4 rounded-2xl border-[0.667px] transition-all hover:translate-y-[-2px] hover:shadow-md cursor-pointer flex flex-col gap-3 ${dark ? 'bg-[#0A1128] border-[#1E293B]' : 'border-[#E2E8F0] bg-[#F8FAFC]'} ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-xl ${color || 'bg-blue-500/10 text-blue-500'}`}>
          <IconComponent size={26} />
        </div>
        <div className="flex flex-col">
          <p className="text-2xl font-bold leading-none">{count}</p>
          <p className={`text-xs ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} font-medium mt-1`}>
            {label}
          </p>
        </div>{' '}
      </div>
      <button className="text-xs text-[#6366F1] bg-transparent font-medium w-full flex pl-1 pt-2 items-start group">
        {details || 'View Details →'}
      </button>
    </div>
  );
};

const ManagementBtn = ({ icon: Icon, label, sub, color, dark, className = '', onClick }) => (
  <div
    onClick={onClick}
    className={`p-5 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all hover:translate-y-[-2px] ${dark ? 'bg-[#0A1128] border-[#1E293B]' : 'bg-[#F8FAFC] border-[#E2E8F0]'} ${className}`}
  >
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <h2 className="text-sm font-semibold">{label}</h2>
      <p className={`text-xs ${dark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>{sub}</p>
    </div>
  </div>
);

export default SuperAdminDashboard;
