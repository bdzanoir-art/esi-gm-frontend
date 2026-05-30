import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import ThemeToggle from './ThemToggel';
import logo from '../Pages/logo.jpg';
import { LogOut, X, User as UserLogo } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NavItem = ({ label, icon: IconComponent, active, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
    style={{
      background: active ? 'var(--btn-register)' : 'transparent',
      color: active ? '#fff' : 'var(--text-small)',
    }}
  >
    {IconComponent && <IconComponent size={18} />}
    {label}
  </button>
);

export default function Sidebar({ activeLabel }) {
  const navigate = useNavigate();
  const { user, logout: handleLogout } = useAuth();

  const navItems = [
    { label: 'Dashboard', icon: Icon.dashboard, path: '/dashboard/student' },
    { label: 'My Projects', icon: Icon.projects, path: '/projects' },
    { label: 'My Requests', icon: Icon.requests, path: '/my-requests' },
    { label: 'Browse Materials', icon: Icon.browse, path: '/materials/browse' },
  ];

  const handleUserLogout = async () => {
    await handleLogout();
    navigate('/login');
  };

  return (
    <aside
      className="w-[256px] h-screen flex-shrink-0 flex flex-col sticky top-0"
      style={{ background: 'var(--card)', borderRight: '1px solid var(--card-border)' }}
    >
      {/* Logo Section */}
      <div
        className="px-4 py-4 flex items-center "
        style={{ borderBottom: '1px solid var(--card-border)' }}
      >
        <div className="flex items-center gap-1">
          <div className="flex-shrink-0 w-[48px] h-[48px]">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full rounded-full bg-lightgray bg-center bg-cover bg-no-repeat"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-title-custom text-[18px] font-bold">ESI-GM</span>
            <span className="text-xs text-small-custom">ESI 8 Mai 1945</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 mt-1">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            active={activeLabel === item.label}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

      {/* User & Logout Section */}
      <div className="p-3" style={{ borderTop: '1px solid var(--card-border)' }}>
        <div className="flex items-center gap-2.5 mb-4 px-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-indigo-500 overflow-hidden">
            <UserLogo size={16} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-title-custom leading-tight truncate">
              {user?.full_name || user?.username || 'Student User'}
            </div>
            <div className="text-[10px] text-small-custom opacity-70 truncate capitalize">
              {user?.role || 'Student'}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 px-1">
          <ThemeToggle />
          <button
            onClick={handleUserLogout}
            className="flex items-center gap-2 text-xs text-small-custom hover:text-red-400 transition-all font-bold"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="flex justify-center mt-4 pt-3 border-t border-[var(--card-border)]">
          <button
            onClick={() => navigate('/dashboard/student')}
            className="text-small-custom hover:text-red-400 transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
