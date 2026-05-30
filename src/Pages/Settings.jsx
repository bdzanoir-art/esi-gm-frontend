import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Bell, 
  Palette, 
  Info,
  CheckCircle,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';
import ThemeToggel from '../Components/ThemToggel';
import Sidebar from '../Components/Sidebar';
import { 
  getCategories, 
  createCategory, 
  deleteCategory, 
  getSystemSettings, 
  updateSystemSettings,
  getPlatformInfo
} from '../Api/Settings.api.js';

export default function Settings() {
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [settings, setSettings] = useState({
    platform_version: 'ESI-GM v1.0.0',
    low_stock_alerts: true,
    maintenance_reminders: true,
    request_notifications: true,
    primary_color: '#6366f1',
    accent_colors: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6']
  });
  const [platformInfo, setPlatformInfo] = useState({
    platform_version: 'ESI-GM v1.0.0',
    db_status: 'Connected',
    storage_used: '2.4 GB',
    storage_total: '10 GB'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [serverOnline, setServerOnline] = useState(null); // null=checking, true/false

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cats, sets, info] = await Promise.allSettled([
        getCategories(),
        getSystemSettings(),
        getPlatformInfo()
      ]);

      const anySuccess = [cats, sets, info].some(r => r.status === 'fulfilled');
      setServerOnline(anySuccess);

      if (cats.status === 'fulfilled') setCategories(cats.value);
      if (sets.status === 'fulfilled') setSettings(sets.value);
      if (info.status === 'fulfilled') setPlatformInfo(info.value);

      if (!anySuccess) {
        setError("Unable to connect to backend. Make sure the Django server is running on port 8000.");
      }
    } catch (err) {
      console.error("Fetch Settings Error:", err);
      setServerOnline(false);
      setError("A critical error occurred while fetching system data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const resp = await createCategory({ name: newCatName });
      setCategories([...categories, resp]);
      setNewCatName('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSettings = async (updates) => {
    try {
      setSaving(true);
      setSettings(prev => ({ ...prev, ...updates }));
      await updateSystemSettings(updates);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex dynamic-bg transition-colors duration-300 min-h-screen" style={{ fontFamily: 'Inter' }}>
      <Sidebar />
      <main className="flex-1 relative overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="absolute top-6 right-8 z-60">
          <ThemeToggel />
        </div>

        <div className="w-full mt-[45px] border-t border-solid border-[var(--card-border)] pb-6 flex justify-between items-end">
          <div>
            <h2 className="text-title-custom text-[30px] font-bold">Settings</h2>
            <p className="text-small-custom text-sm -mt-1 opacity-70">
              Configure system settings and categories
            </p>
          </div>
          {error && (
            <button 
              onClick={fetchData}
              className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition shadow-lg shadow-rose-500/20"
            >
              Retry Connection
            </button>
          )}
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-4 text-rose-500">
            <div className="p-2 rounded-xl bg-rose-500/20"><AlertCircle size={20} /></div>
            <div className="flex-1">
              <p className="text-sm font-bold">Connection Failure</p>
              <p className="text-[11px] opacity-70">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Material Categories */}
          <section className="rounded-2xl border border-[rgba(30,64,175,0.15)] bg-[var(--card)] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500"><Database size={20} /></div>
              <div>
                <h3 className="text-lg font-bold text-title-custom">Material Categories</h3>
                <p className="text-[10px] opacity-50 uppercase font-black">{categories.length} categories defined</p>
              </div>
            </div>
            
            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="New category name..."
                className="flex-1 bg-[var(--butt-filter)] px-4 py-2 rounded-xl text-sm outline-none border-0 text-title-custom"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
              <button 
                onClick={handleAddCategory}
                className="p-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition shadow-lg shadow-indigo-500/20"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {categories.map(cat => (
                <div key={cat.id} className="group flex items-center justify-between p-3 rounded-xl bg-[var(--butt-filter)] border border-transparent hover:border-indigo-500/30 transition shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-title-custom">{cat.name}</span>
                    <span className="text-[10px] opacity-40">({cat.materials_count})</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {categories.length === 0 && !loading && (
                <div className="col-span-2 text-center py-10 opacity-30 italic text-sm">No categories found in database.</div>
              )}
            </div>
          </section>

          {/* Color Theme */}
          <section className="rounded-2xl border border-[rgba(30,64,175,0.15)] bg-[var(--card)] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500"><Palette size={20} /></div>
              <h3 className="text-lg font-bold text-title-custom">Color Theme</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold opacity-50 mb-3">PRIMARY COLOR</label>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl shadow-inner border-2 border-white/20 relative cursor-pointer"
                    style={{ background: settings.primary_color }}
                  >
                    <input 
                      type="color" 
                      value={settings.primary_color}
                      onChange={(e) => handleUpdateSettings({ primary_color: e.target.value })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-mono text-title-custom uppercase font-bold">{settings.primary_color}</span>
                    <p className="text-[10px] opacity-40 uppercase">Click box to change</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold opacity-50 mb-3">ACCENT PALETTE</label>
                <div className="flex flex-wrap gap-2">
                  {settings.accent_colors.map((color, idx) => (
                    <div 
                      key={idx} 
                      className="w-8 h-8 rounded-full border-2 border-white/20 shadow-sm cursor-pointer hover:scale-110 transition"
                      style={{ background: color }}
                    ></div>
                  ))}
                  <button className="w-8 h-8 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center opacity-40 hover:opacity-100 transition">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* System Info */}
          <section className="rounded-2xl border border-[rgba(30,64,175,0.15)] bg-[var(--card)] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500"><Info size={20} /></div>
              <h3 className="text-lg font-bold text-title-custom">System Information</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-black opacity-40 uppercase">Platform Version</p>
                <p className="text-sm font-bold text-title-custom">{platformInfo.platform_version}</p>
              </div>
              <div>
                <p className="text-[10px] font-black opacity-40 uppercase">Backend Server</p>
                {serverOnline === null ? (
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-sm font-bold">Checking...</span>
                  </div>
                ) : serverOnline ? (
                  <div className="flex items-center gap-1.5 text-emerald-500">
                    <CheckCircle size={14} />
                    <span className="text-sm font-bold">Running</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-rose-500">
                    <span className="inline-block w-2 h-2 rounded-full bg-rose-500" />
                    <span className="text-sm font-bold">Not Running</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] font-black opacity-40 uppercase">Server System</p>
                <p className="text-sm font-medium opacity-70 uppercase">{platformInfo.os || 'Windows'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black opacity-40 uppercase">Storage Used</p>
                <p className="text-sm font-bold text-title-custom">{platformInfo.storage_used} / {platformInfo.storage_total || '10 GB'}</p>
              </div>
            </div>
          </section>


          {/* Notifications */}
          <section className="rounded-2xl border border-[rgba(30,64,175,0.15)] bg-[var(--card)] p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500"><Bell size={20} /></div>
              <h3 className="text-lg font-bold text-title-custom">Notification Preferences</h3>
            </div>

            <div className="space-y-4">
              {[
                { key: 'low_stock_alerts', label: 'Low Stock Alerts', desc: 'Notify when material quantity drops below threshold' },
                { key: 'maintenance_reminders', label: 'Maintenance Reminders', desc: 'Send reminders for upcoming maintenance schedules' },
                { key: 'request_notifications', label: 'Request Notifications', desc: 'Notify about new material requests' }
              ].map(pref => (
                <div key={pref.key} className="flex items-center justify-between py-2 group">
                  <div className="max-w-[70%]">
                    <p className="text-sm font-bold text-title-custom">{pref.label}</p>
                    <p className="text-[10px] opacity-50">{pref.desc}</p>
                  </div>
                  <div 
                    className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${settings[pref.key] ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-gray-300 dark:bg-gray-700'}`}
                    onClick={() => handleUpdateSettings({ [pref.key]: !settings[pref.key] })}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 transform ${settings[pref.key] ? 'translate-x-5' : ''}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {saving && (
          <div className="fixed bottom-8 right-8 bg-indigo-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-pulse border-2 border-white/20">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span className="text-xs font-bold uppercase tracking-wider">Syncing...</span>
          </div>
        )}
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.4);
        }
      `}} />
    </div>
  );
}
