import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  QrCode, 
  Users, 
  ClipboardList, 
  LogOut, 
  Wrench, 
  ArrowRightLeft,
  FolderKanban,
  FileSearch,
  ArrowRight,
  User as UserIcon,
  Sun,
  Moon,
  Building2,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import logo from '../Pages/logo.jpg';

const NavItem = ({ label, icon: IconComponent, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 group ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 translate-x-1' 
        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
    }`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      <IconComponent size={20} />
    </div>
    <span className="flex-1 text-left">{label}</span>
    {active && <ArrowRight size={14} className="opacity-70" />}
  </button>
);

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const getNavItems = () => {
    const role = user?.role?.toLowerCase() || 'student';
    
    if (role === 'student') {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/student' },
        { label: 'My Projects', icon: FolderKanban, path: '/projects' },
        { label: 'My Requests', icon: ClipboardList, path: '/my-requests' },
        { label: 'Browse Materials', icon: FileSearch, path: '/materials/browse' },
      ];
    }
    
    // SuperAdmin ONLY wants Dashboard, Users, Laboratories
    if (role === 'superadmin') {
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/superadmin' },
        { label: 'Users', icon: Users, path: '/admin/users' },
        { label: 'Laboratories', icon: Building2, path: '/admin/laboratories' },
        { label: 'Settings', icon: SettingsIcon, path: '/settings' },
      ];
    }

    // Admin, Storekeeper Items
    const items = [
      { label: 'Dashboard', icon: LayoutDashboard, path: `/dashboard/${role}` },
      { label: 'Inventory', icon: Package, path: '/inventory' },
      { label: 'QR Scanner', icon: QrCode, path: '/qr-scanner' },
    ];

    if (role === 'admin') {
      items.push({ label: 'Users', icon: Users, path: '/admin/users' });
    }

    items.push(
      { label: 'Transfers', icon: ArrowRightLeft, path: '/transfers' },
      { label: 'Material Outputs', icon: Package, path: '/material-outputs' },
      { label: 'Maintenance', icon: Wrench, path: '/maintenance' },
      { label: 'Settings', icon: SettingsIcon, path: '/settings' }
    );

    return items;
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-[260px] h-screen bg-[#0A1128] border-r border-[#1E293B] flex flex-col sticky top-0 z-50">
      {/* Brand Section */}
      <div className="p-6 mb-2 border-b border-[#1E293B]/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-500/30 p-1 shadow-inner">
            <img src={logo} alt="ESI-GM" className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight leading-none">ESI-GM</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Lab Equipment</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </nav>

      {/* User & Logout Section */}
      <div className="p-4 border-t border-[#1E293B] bg-[#0E1731]/50 mt-auto">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
            <UserIcon size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate capitalize">{user?.full_name || user?.username || 'User'}</p>
            <p className="text-[11px] font-medium text-slate-500 truncate uppercase tracking-wider">{user?.role || 'Guest'}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
          
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800/50 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-all duration-300"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1E293B;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}} />
    </aside>
  );
}
