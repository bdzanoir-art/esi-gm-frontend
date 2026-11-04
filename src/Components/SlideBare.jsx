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
  ArrowRightLeft,
} from 'lucide-react';

import logo from '../Pages/logo.jpg';

export default function SlideBare({ activeLabel = 'Dashboard' }) {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/admin' },
    { label: 'Inventory', icon: Package, path: '/inventory' },
    { label: 'QR Scanner', icon: QrCode, path: '/qr-scanner' },
    { label: 'Users', icon: Users, path: '/admin/users' },
    { label: 'Requests', icon: ClipboardList, path: '/requests' },
    { label: 'Transfers', icon: ArrowRightLeft, path: '/transfers' },
    { label: 'Material Outputs', icon: Package, path: '/material-outputs' },
    { label: 'Maintenance', icon: Wrench, path: '/maintenance' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0A1128] border-r dark:border-[#1E293B] h-screen flex flex-col sticky top-0 shadow-sm transition-colors duration-300">
      {/* Header with Logo */}
      <div className="p-6 border-b dark:border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full rounded-full object-cover border-2 border-indigo-500/20 shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">ESI-GM</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Lab Equipment Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeLabel === item.label;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 border-t dark:border-[#1E293B] bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-indigo-500/10">
            AD
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-white truncate">Lab Admin</span>
            <span className="text-[10px] text-slate-500 truncate">admin@esi-sba.dz</span>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-red-500 font-bold text-xs hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} />
          <span>SIGN OUT</span>
        </button>
      </div>
    </aside>
  );
}
