import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser, createUser } from '../Api/userMana.api.js';
import Sidebar from '../Components/Sidebar';
import {
  Moon,
  Sun,
  Search,
  Filter,
  Plus,
  Trash2,
  Shield,
  Wrench,
  GraduationCap,
  Crown,
  Mail,
  SquarePen,
  Building2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import AddUser from './AddUser.jsx';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const { darkMode } = useTheme();
  const isAdminOnly = currentUser?.role === 'admin';
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Student');
  const [loading, setLoading] = useState(true);
  // 1. Rejja3na users dakhél state bach l-Delete tkhdem
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();
  // 2. State ta3 l-Search
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({ fullName: '', email: '', role: 'Student' });
  const [errors, setErrors] = useState({ fullName: '', email: '', role: '' });
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUserList(data);
      } catch (err) {
        console.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 3. Fonction Delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUserList(userList.filter((user) => user.id !== id));
      } catch (err) {
        alert('Error deleting user');
      }
    }
  };

  // 4. Logic Filter (Search)
  const filteredUsers = userList.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openAddUser = () => {
    setFormData({ fullName: '', email: '', role: 'Student' });
    setSelectedRole('Student');
    setErrors({ fullName: '', email: '', role: '' });
    setShowAddUser(true);
  };

  const closeAddUser = () => setShowAddUser(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData((prev) => ({ ...prev, role }));
    if (errors.role) setErrors((prev) => ({ ...prev, role: '' }));
  };

  const validateForm = () => {
    const newErrors = { fullName: '', email: '', role: '' };
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.role.trim()) newErrors.role = 'Please select a role';
    setErrors(newErrors);
    return !newErrors.fullName && !newErrors.email && !newErrors.role;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingUser) {
        import('../Api/userMana.api.js').then(async ({ updateUserRole }) => {
            const updatedUser = await updateUserRole(editingUser.id, formData.role);
            setUserList(userList.map(u => u.id === editingUser.id ? { ...u, role: formData.role } : u));
            setShowEditUser(false);
            setEditingUser(null);
        });
      } else {
        const newUser = await createUser(formData);
        setUserList([...userList, newUser]);
        closeAddUser();
      }
    } catch (err) {
      alert('Error saving user');
    }
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setFormData({ fullName: user.fullName || user.name || '', email: user.email, role: user.role });
    setSelectedRole(user.role);
    setErrors({ fullName: '', email: '', role: '' });
    setShowEditUser(true);
  };

  const closeEditUser = () => {
    setShowEditUser(false);
    setEditingUser(null);
  };
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="relative flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <Sidebar />

        <main className="flex-1 flex flex-col relative">
          <header className="h-16 flex items-center justify-end px-4 sm:px-6 md:px-10">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-white hover:shadow-sm transition-all shadow-sm active:scale-95"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </header>

          <div className="px-10 flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  User Management
                </h1>
                <p className="dark:text-[#94A3B8] text-[#64748B] text-sm mt-1">
                  Add administrators and manage user permissions
                </p>
              </div>

              {!isAdminOnly && (
                <button
                  onClick={openAddUser}
                  className="w-full sm:w-auto bg-[#6366F1] text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold"
                >
                  <Plus size={18} strokeWidth={3} /> Add User
                </button>
              )}
            </div>

            {/* Stats Cards - Design Kima Kont Dayrou Bedebt */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
              {[
                {
                  label: 'Super Admins',
                  count: userList.filter((u) => u.role === 'Super Admin').length,
                  color:
                    'bg-[linear-gradient(135deg,_rgba(173,70,255,0.10)_0%,_rgba(152,16,250,0.05)_100%)] border-[rgba(173,70,255,0.20)]',
                  icon: <Crown size={22} className="text-purple-500" />,
                },
                {
                  label: 'Lab Admins',
                  count: userList.filter((u) => u.role === 'Admin').length,
                  color:
                    'bg-[linear-gradient(135deg,_rgba(251,44,54,0.10)_0%,_rgba(231,0,11,0.05)_100%)] border-[rgba(251,44,54,0.20)]',
                  icon: <Shield size={22} className="text-red-500" />,
                },
                {
                  label: 'Storekeepers',
                  count: userList.filter((u) => u.role === 'Storekeeper').length,
                  color:
                    'bg-[linear-gradient(135deg,_rgba(43,127,255,0.10)_0%,_rgba(21,93,252,0.05)_100%)] border-[rgba(43,127,255,0.20)]',
                  icon: <Wrench size={22} className="text-blue-500" />,
                },
                {
                  label: 'Students',
                  count: userList.filter((u) => u.role === 'Student').length,
                  color:
                    'bg-[linear-gradient(135deg,_rgba(0,201,80,0.10)_0%,_rgba(0,166,62,0.05)_100%)] border-[rgba(0,201,80,0.20)]',
                  icon: <GraduationCap size={22} className="text-green-500" />,
                },
              ].map((stat, idx) => (
                <div key={idx} className={`${stat.color} p-4 sm:p-6 rounded-xl border`}>
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 mb-6 bg-transparent rounded-xl">{stat.icon}</div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white leading-none mb-1">
                        {stat.count}
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 tracking-tight">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-10">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-3 border-b border-slate-50 dark:border-slate-800 flex gap-4">
                <div className="relative flex-1 bg-[rgba(241,245,249,0.05)] border border-[#E2E8F0] rounded-xl focus:ring-2 dark:bg-[#1E293B] dark:border-[#1E293B] focus:ring-indigo-500/10">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full bg-tranparent mt-1 dark:text-white brder-none rounded-xl text-sm outline-none transition-all pl-10 pr-3 py-2 rounded-xl dark:bg-[#1E293B]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="p-3 bg-[rgba(241,245,249,0.05)] text-slate-400 rounded-xl border boeder-[#E2E8F0] hover:bg-slate-100 dark:border-[#1E293B] transition-colors">
                  <Filter size={20} />
                </button>
              </div>

              <div className="overflow-x-auto bg-[#F8FAFC] border rounded-xl m-3 border-[#E2E8F0] dark:border-[#1E293B] dark:bg-[#121825]">
                {loading ? (
                  <div className="flex flex-col items-center justify-center p-20 space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                      Fetching users...
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-950/50 text-[#64748B] dark:text-[#94A3B8] text-sm border-b border-[#E2E8F0] dark:border-[#1E293B]">
                      <tr>
                        <th className="px-8 py-4 font-medium">User</th>
                        <th className="px-8 py-4 font-medium">Email Address</th>
                        <th className="px-8 py-4 font-medium">Role</th>
                        <th className="px-8 py-4 font-medium">Laboratory</th>
                        {!isAdminOnly && <th className="px-8 py-4 text-right font-medium">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all"
                          >
                            <td className="pl-4 font-semibold">
                              <div className="flex items-center gap-2">
                                <span className="text-indigo-500 rounded-xl p-2 bg-[rgba(99,102,241,0.10)]">
                                  {user.role === 'Super Admin' && <Crown size={18} />}
                                  {user.role === 'Admin' && <Shield size={18} />}
                                  {user.role === 'Storekeeper' && <Wrench size={20} />}
                                  {user.role === 'Student' && <GraduationCap size={18} />}
                                </span>
                                <span className="font-semibold p-2 text-slate-800 dark:text-slate-200">
                                  {user.fullName}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-slate-500 dark:text-slate-400 font-medium">
                              <div className="flex items-center gap-2">
                                <Mail size={20} /> {user.email}
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span
                                className={`px-4 py-1 border rounded-lg text-[10px] font-medium uppercase ${
                                  user.role === 'Super Admin'
                                    ? 'bg-[rgba(173,70,255,0.10)] text-[#C27AFF] border-[rgba(173,70,255,0.20)]'
                                    : user.role === 'Admin'
                                      ? 'bg-[rgba(251,44,54,0.10)] text-[#FF6467] border-[rgba(251,44,54,0.20)]'
                                      : user.role === 'Student'
                                        ? 'bg-[rgba(0,201,80,0.10)] text-[#05DF72] border-[rgba(0,201,80,0.20)]'
                                        : 'bg-[rgba(43,127,255,0.10)] text-[#51A2FF] border-[rgba(43,127,255,0.20)]'
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-slate-500 dark:text-slate-400 font-medium">
                              <div className="flex items-center gap-2">
                                {user.lab !== 'N/A' && (
                                  <Building2 size={20} className="text-indigo-400" />
                                )}
                                {user.lab}
                              </div>
                            </td>
                            {!isAdminOnly && (
                              <td className="px-8 py-5 text-right">
                                {user.role !== 'Super Admin' ? (
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => openEditUser(user)}
                                      className="p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg"
                                    >
                                      <SquarePen size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(user.id)}
                                      className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="h-9"></div>
                                )}
                              </td>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-8 py-10 text-center text-slate-500">
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <AddUser
            isOpen={showAddUser || showEditUser}
            onClose={showEditUser ? closeEditUser : closeAddUser}
            formData={formData}
            errors={errors}
            selectedRole={selectedRole}
            onChange={handleChange}
            onRoleSelect={handleRoleSelect}
            onSubmit={handleSubmit}
            isEditing={!!editingUser}
          />
        </main>
      </div>
    </div>
  );
};

export default UserManagement;
