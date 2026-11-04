import React from 'react';
import { X, UserPlus, ShieldCheck, Wrench, GraduationCap, AlertCircle, Mail } from 'lucide-react';
import { useEffect } from 'react';

const AddUser = ({
  isOpen,
  onClose,
  formData,
  errors,
  selectedRole,
  onChange,
  onRoleSelect,
  onSubmit,
  isEditing = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Bloqui l-scroll f l-body
      document.body.style.overflow = 'hidden';
    } else {
      // Rajja3 l-scroll ki tenghlaq l-modal
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div
      onClick={onClose}
      className="fixed overflow-y-auto inset-0 z-[100] items-start py-10 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white my-auto dark:bg-slate-900 w-full max-w-2xl rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      >
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center border-b border-[#E2E8F0] dark:border-[#1E293B]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[rgba(99,102,241,0.10)] rounded-xl text-[#6366F1] dark:text-indigo-400">
              <UserPlus size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{isEditing ? 'Edit User Role' : 'Add New User'}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isEditing ? 'Update user role and permissions' : 'Create a new user account'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 bg-transparent rounded-xl text-slate-400 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={onChange}
                type="text"
                placeholder="e.g., Ahmed Benali"
                className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border rounded-2xl outline-none focus:ring-2 transition-all dark:text-white ${
                  errors.fullName
                    ? 'border-red-400 focus:ring-red-500/20'
                    : 'border-[#E2E8F0] dark:border-[#1E293B] focus:ring-indigo-500/20'
                } ${isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={isEditing}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 flex items-center gap-2 ml-1">
                  <AlertCircle size={16} />
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={onChange}
                type="email"
                placeholder="e.g., a.benali@esi-sba.dz"
                className={`w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border rounded-2xl outline-none focus:ring-2 transition-all dark:text-white ${
                  errors.email
                    ? 'border-red-400 focus:ring-red-500/20'
                    : 'border-[#E2E8F0] dark:border-[#1E293B] focus:ring-indigo-500/20'
                } ${isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={isEditing}
              />
              <p className="text-xs text-slate-400 ml-1">Use institutional email (@esi-sba.dz)</p>
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-2 ml-1">
                  <AlertCircle size={16} />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                Role <span className="text-red-500">*</span>
              </label>

              <div className="space-y-3">
                {[
                  {
                    label: 'Administrator',
                    value: 'Admin',
                    icon: <ShieldCheck size={22} className="text-red-500" />,
                    subtitle: 'Full access to laboratory management',
                  },
                  {
                    label: 'Storekeeper',
                    value: 'Storekeeper',
                    icon: <Wrench size={22} className="text-blue-500" />,
                    subtitle: 'Manage inventory and requests',
                  },
                  {
                    label: 'Student',
                    value: 'Student',
                    icon: <GraduationCap size={22} className="text-green-500" />,
                    subtitle: 'Create projects and submit requests',
                  },
                ].map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => onRoleSelect(role.value)}
                    className={`w-full text-left px-5 py-4 rounded-2xl border transition-all ${
                      selectedRole === role.value
                        ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center">
                        {role.icon}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{role.label}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {role.subtitle}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {errors.role && (
                <p className="text-sm text-red-500 flex items-center gap-2 ml-1">
                  <AlertCircle size={16} />
                  {errors.role}
                </p>
              )}
            </div>

            {!isEditing && (
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  📧 Default Password
                </p>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
                  The user will receive an email with a temporary password. They will be required to
                  change it on first login.
                </p>
              </div>
            )}
          </div>

          <div className="p-6 m-4 bg-slate-50/50 dark:bg-[#121825] flex gap-4 border-t border-[#E2E8F0] dark:border-[#1E293B]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border bg-transparent border-[#E2E8F0] dark:text-[#E8EAF0] dark:border-[#1E293B] px-6 py-4 rounded-xl font-semibold text-[#0F172A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 rounded-2xl font-semibold bg-[#6366F1] text-white hover:bg-indigo-700 transition-all active:scale-95"
            >
              {isEditing ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
