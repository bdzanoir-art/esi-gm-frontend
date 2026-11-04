import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  QrCode,
  Users,
  ClipboardList,
  Settings,
  LogOut,
  Wrench,
  X,
} from 'lucide-react';
import logo from '../Pages/logo.jpg';

const NavButton = ({ label, icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-[#6366F1] text-white'
        : 'text-[var(--text-small)] hover:bg-gray-100 dark:hover:bg-gray-800'
    }`}
  >
    <Icon size={18} />
    {label}
  </button>
);

export default function Sidebare2({ activeLabel }) {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/admin' },
    { label: 'Inventory', icon: Package, path: '/inventory' },
    { label: 'QR Scanner', icon: QrCode, path: '/qr-scanner' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Requests', icon: ClipboardList, path: '/requests' },
    { label: 'Material Outputs', icon: Package, path: '/material-outputs' },
    { label: 'Maintenance', icon: Wrench, path: '/maintenance' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside
      className="w-[256px] h-screen flex flex-col sticky top-0"
      style={{ background: 'var(--card)', borderRight: '1px solid var(--card-border)' }}
    >
      {/* Logo Section */}
      <div
        className="px-4 py-4 flex items-center"
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
            <span className="text-xs text-small-custom">Lab Equipment</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 mt-1">
        {navItems.map((item) => (
          <NavButton
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
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-indigo-500">
            <Users size={16} />
          </div>
          <div>
            <div className="text-sm font-semibold text-title-custom leading-tight">Admin User</div>
            <div className="text-xs text-small-custom">admin</div>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          className="w-full flex items-center gap-2 text-xs text-small-custom hover:text-red-400 transition-all"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>

        <div className="flex justify-center mt-4 pt-3 border-t border-[var(--card-border)]">
          <button
            onClick={() => navigate('/dashboard/admin')}
            className="text-small-custom hover:text-red-400 transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
