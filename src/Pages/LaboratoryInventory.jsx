import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Moon,
  Sun,
  Search,
  ChevronDown,
  Cpu,
  Filter,
  Settings,
  X
} from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import { adminAPI } from '../Api/api.service';
import { useNavigate } from 'react-router-dom';


const mockApi = {
  categories: [
    { id: 1, name: 'Microcontrollers', count: 6, icon: '🎛️' },
    { id: 2, name: 'Single Board Computers', count: 3, icon: '💻' },
    { id: 3, name: 'Sensors', count: 11, icon: '📡' },
    { id: 4, name: 'Actuators & Motors', count: 6, icon: '⚙️' },
    { id: 5, name: 'Motor Drivers', count: 3, icon: '🔌' },
    { id: 6, name: 'Test Equipment', count: 4, icon: '🔬' },
    { id: 7, name: 'Networking Equipment', count: 3, icon: '🌐' },
    { id: 8, name: 'Cables & Connectors', count: 6, icon: '🔗' },
    { id: 9, name: 'Communication Modules', count: 5, icon: '📶' },
  ],
  items: [
    {
      id: 1,
      name: 'Arduino Uno R3',
      category: 'Microcontrollers',
      status: 'Available',
      desc: 'ATmega328P-based microcontroller board with 14 digital I/O pins',
      qty: 25,
      location: 'Shelf A1',
      lab: 'Electronics Lab',
    },
    {
      id: 2,
      name: 'Arduino Mega 2560',
      category: 'Microcontrollers',
      status: 'Available',
      desc: 'ATmega2560-based board with 54 digital I/O pins, ideal for complex projects',
      qty: 15,
      location: 'Shelf A1',
      lab: 'Electronics Lab',
    },
    {
      id: 3,
      name: 'Arduino Nano',
      category: 'Microcontrollers',
      status: 'Available',
      desc: 'Compact ATmega328P board, breadboard-friendly',
      qty: 30,
      location: 'Shelf A2',
      lab: 'Electronics Lab',
    },
    {
      id: 4,
      name: 'ESP32 DevKit',
      category: 'Microcontrollers',
      status: 'Available',
      desc: 'Dual-core microcontroller with Wi-Fi and Bluetooth, perfect for IoT',
      qty: 40,
      location: 'Shelf A3',
      lab: 'Embedded Systems Lab',
    },
    {
      id: 5,
      name: 'HC-SR04 Ultrasonic Sensor',
      category: 'Sensors',
      status: 'In Use',
      desc: 'Distance measurement sensor for robotics and automation projects',
      qty: 12,
      location: 'Shelf C1',
      lab: 'Robotics Lab',
    },
    {
      id: 6,
      name: 'L298N Motor Driver',
      category: 'Motor Drivers',
      status: 'Under Maintenance',
      desc: 'Dual H-bridge motor driver module for DC motors and steppers',
      qty: 8,
      location: 'Shelf D2',
      lab: 'Electronics Lab',
    },
  ],
};

import { useTheme } from '../Context/ThemeContext';

const LaboratoryInventory = () => {
  const navigate = useNavigate();
  const { darkMode: dark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch real materials from backend
        const [materialsRes, categoriesRes] = await Promise.all([
          adminAPI.getMaterials(),
          adminAPI.getCategories(),
        ]);

        const rawMaterials = materialsRes.data?.results || materialsRes.data || [];
        const rawCategories = categoriesRes.data?.results || categoriesRes.data || [];

        // Map backend fields to UI fields
        const mappedItems = rawMaterials.map((m) => ({
          id: m.id,
          name: m.name || m.title || 'Unknown',
          category: m.category_name || m.category || 'Uncategorized',
          status: m.status || 'Available',
          desc: m.description || m.desc || '',
          qty: m.quantity ?? m.qty ?? 0,
          available: m.quantity_available ?? m.quantity ?? m.qty ?? 0,
          location: m.location || m.loc || 'N/A',
          lab: m.lab_name || m.laboratory || m.lab || 'General Lab',
          reference: m.reference || '',
          unit: m.unit || 'pcs',
        }));
        setItems(mappedItems);

        // Build categories from real backend data with counts
        const catIcons = ['🎛️','💻','📡','⚙️','🔌','🔬','🌐','🔗','📶','🔧','🖥️','📦'];
        const mappedCats = rawCategories.map((c, i) => ({
          id: c.id,
          name: c.name,
          count: c.materials_count ?? mappedItems.filter(m => m.category === c.name).length,
          icon: catIcons[i % catIcons.length],
        }));
        setCategories(mappedCats);
      } catch (err) {
        console.error('Failed to load inventory data:', err);
        setError('Failed to load inventory. Please check your connection.');
        setItems([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);


  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const search = searchTerm.toLowerCase();
      const matchSearch =
        (item.name || '').toLowerCase().includes(search) ||
        (item.desc || '').toLowerCase().includes(search) ||
        (item.reference || '').toLowerCase().includes(search);

      const matchCategory = categoryFilter === 'All Categories' || item.category === categoryFilter;
      const matchStatus = statusFilter === 'All Status' || item.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [items, searchTerm, categoryFilter, statusFilter]);


  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        dark ? 'bg-[#0A0D17] text-[#FFF]' : 'bg-[#FFF] text-[#0A0E1A]'
      }`}
    >
      <Sidebar />

      <main className="flex-1 p-8">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold">Laboratory Inventory</h2>
            <p className={`${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} text-sm`}>
              Browse and search all available materials
            </p>
          </div>
        </header>

        <div
          className={`p-4 rounded-2xl border mb-6 ${
            dark
              ? 'bg-[#0f172a] border-[#2B4C9F]'
              : 'bg-white border-gray-100 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10)]'
          }`}
        >
          <div className="flex gap-4 items-center">
            <div
              className={`flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl border ${
                dark ? 'bg-[#161b26] border-[#1E293B]' : 'bg-gray-50 border-[#E2E8F0]'
              }`}
            >
              <Search size={18} className={`${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
              <input
                type="text"
                placeholder="Search materials by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            <div className="flex gap-2">
              <FilterDropdown
                label={categoryFilter}
                dark={dark}
                items={['All Categories', ...categories.map((c) => c.name)]}
                onSelect={setCategoryFilter}
              />
              <FilterDropdown
                label={statusFilter}
                dark={dark}
                items={[
                  'All Status',
                  'Available',
                  'Reserved',
                  'In Use',
                  'Under Maintenance',
                  'Damaged',
                  'Lost',
                ]}
                onSelect={setStatusFilter}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Filter size={14} /> Showing {filteredItems.length} of {items.length} materials
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setCategoryFilter(cat.name)}
              className={`p-4 rounded-2xl border text-center transition-all hover:scale-[1.02] cursor-pointer ${
                categoryFilter === cat.name ? 'border-indigo-500 scale-[1.03] ring-1 ring-indigo-500' : ''
              } ${
                dark ? 'bg-[#121825] border-[#1E293B]' : 'bg-[#F8FAFC] border-[#E2E8F0] shadow-sm'
              }`}
            >
              <div className="flex items-start gap-2">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-xl ${
                    dark ? 'bg-slate-800 text-blue-400' : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {cat.icon}
                </div>
                <p
                  className={`flex items-start pt-3 text-lg ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} text-sm leading-none`}
                >
                  {cat.count}
                </p>
              </div>
              <p
                className={`text-[12px] font-semibold mt-1 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'} tracking-tighter`}
              >
                {cat.name}
              </p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-sm text-slate-500">Loading inventory from database...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 font-semibold">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Retry</button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-sm">No materials found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              // Dynamic status badge color
              const isPartiallyUsed = item.available < item.qty && item.available > 0;
              const displayStatus = isPartiallyUsed ? 'Partially Used' : item.status;

              const statusColor = {
                'Available':         'border-green-400/30 bg-green-400/10 text-green-600',
                'Partially Used':    'border-blue-400/30  bg-blue-400/10  text-blue-600',
                'In Use':            'border-red-400/30   bg-red-400/10   text-red-600',
                'Maintenance':       'border-orange-400/30 bg-orange-400/10 text-orange-600',
                'Under Maintenance': 'border-orange-400/30 bg-orange-400/10 text-orange-600',
                'Unavailable':       'border-red-400/30   bg-red-400/10   text-red-600',
              }[displayStatus] || 'border-gray-400/30 bg-gray-400/10 text-gray-600';

              return (
                <div
                  key={item.id}
                  className={`rounded-3xl border overflow-hidden transition-all hover:shadow-lg ${
                    dark
                      ? 'bg-[#0f172a] border-[#2B4C9F]'
                      : 'bg-[rgba(241,245,249,0.30)] border-[#E2E8F0] shadow-sm'
                  }`}
                >
                  <div className={`p-5 border-b ${dark ? 'border-[rgba(30,41,59,0.50)]' : 'border-gray-100/10'}`}>
                    <div className={`border-b ${dark ? 'border-[rgba(30,41,59,0.50)]' : 'border-gray-100/10'} pb-3`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-base pb-1">{item.name}</h4>
                        <span className={`text-[10px] border font-bold px-2 py-1 rounded-full ${statusColor}`}>
                          {displayStatus}
                        </span>
                      </div>
                      <span className="flex items-start text-[10px] font-bold border border-[rgba(173,70,255,0.50)] px-2 py-1 rounded-lg bg-[rgba(173,70,255,0.20)] text-purple-600 w-fit items-center gap-1">
                        <Cpu size={12} /> {item.category}
                      </span>
                    </div>
                    <p className={`text-xs mt-4 leading-relaxed ${dark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                      {item.desc || <span className="italic opacity-50">No description</span>}
                    </p>
                  </div>

                  <div className={`p-5 border m-4 rounded-xl ${
                    dark
                      ? 'bg-[rgba(18,24,37,0.50)] border-[rgba(30,41,59,0.50)]'
                      : 'bg-[rgba(248,250,252,0.50)] border-[rgba(226,232,240,0.50)]'
                  } space-y-3`}>
                    <div className="flex justify-between text-xs">
                      <span className={`font-medium flex items-center gap-1 ${dark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>
                        <Settings size={14} /> Specifications
                      </span>
                      {item.reference && (
                        <span className="text-[10px] opacity-50">Ref: {item.reference}</span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={`${dark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>Available :</span>
                      <span className="font-bold text-green-500 bg-[rgba(0,201,80,0.20)] px-2 rounded">
                        {item.available} / {item.qty} {item.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={`${dark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>Location :</span>
                      <span className="font-semibold">{item.location}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active, dark, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
      active
        ? 'bg-[#2B4C9F] text-white shadow-md'
        : dark
          ? 'text-[#E8EAF0] hover:bg-gray-800'
          : 'text-[#0F172A] hover:bg-gray-100'
    }`}
  >
    <Icon size={20} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const FilterDropdown = ({ label, dark, items = [], onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-8 px-4 py-2.5 rounded-xl border cursor-pointer bg-[#2B4C9F] border-[#2B4C9F] text-white"
      >
        <span className="text-sm font-medium">{label}</span>
        <ChevronDown size={16} />
      </div>

      {open && (
        <div
          className={`absolute mt-2 w-52 rounded-xl border shadow-lg z-50 ${
            dark ? 'bg-[#020817] border-[#2B4C9F]' : 'bg-white border-gray-200'
          }`}
        >
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                onSelect(item);
                setOpen(false);
              }}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                dark ? 'hover:bg-gray-800' : ''
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LaboratoryInventory;
