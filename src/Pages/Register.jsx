import { useState } from 'react';
import axios from 'axios';
import { Sun, Moon, User, Mail, Lock, UserCircle, ChevronDown } from 'lucide-react';
import logoEsi from './logo.jpg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    account_type: 'Student',
  });

  const [errors, setErrors] = useState({
    full_name: '',
    email: '',
    password: '',
    account_type: '',
  });
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /^[a-zA-Z]\.[a-zA-Z]{3,}@esi-sba\.dz$/.test(email);
  const validatePassword = (password) => /^(?=.*[0-9]).{6,}$/.test(password);

  const validateForm = () => {
    let valid = true;
    let newErrors = { full_name: '', email: '', password: '', account_type: '' };

    if (!formData.full_name) {
      newErrors.full_name = 'Full name is required';
      valid = false;
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
      valid = false;
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters and contain a number';
      valid = false;
    }
    if (!formData.account_type) {
      newErrors.account_type = 'Please select account type';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        setSuccess('Account created successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard/student');
        }, 1200);
      } else {
        setSuccess('');
        setErrors({ ...errors, general: result.error || 'Registration failed' });
      }
    } catch (err) {
      setSuccess('');
      setErrors({ ...errors, general: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const errorStyle = {
    color: 'red',
    marginTop: '2px',
    fontSize: '13px',
  };
  const themeColors = {
    bg: isDarkMode
      ? {
          background: 'linear-gradient(180deg,#020817 0%,#1E293B 50%,#020817 100%)',
        }
      : {
          background: 'linear-gradient(180deg,#F8FAFC 0%,#F1F5F9 50%,#F8FAFC 100%)',
        },
    textMain: isDarkMode ? 'text-[#E8EAF0]' : 'text-[#0F172A]',
    textSecondary: isDarkMode ? 'text-[#94A3B8]' : 'text-[#64748B]',
    cardBg: isDarkMode ? 'bg-[#0A1128]' : 'bg-white',
    cardBorder: isDarkMode ? 'border border-[#2B4C9F]' : 'border border-[#E2E8F0]',
    buttonTheme: isDarkMode
      ? 'bg-[#0A1128] text-[#2B4C9F] border-[#2B4C9F] '
      : 'bg-[#FFF] text-[#2B4C9F] border-[#64748B]',
    inputBg: isDarkMode ? 'bg-[#020817]' : 'bg-[#F8FAFC]',
    inputBorder: isDarkMode ? 'border-[#0F1629]' : 'border-[#F8FAFC]',
    inputText: isDarkMode ? 'text-white' : 'text-black',
    borderTop: isDarkMode ? 'border-[#2B4C9F]' : 'border-[#E2E8F0]',
    textColor: isDarkMode ? 'text-white ' : 'text-black',
    divideColor: isDarkMode ? 'divide-[#94A3B8]' : 'divide-[#64748B]',
    hoverList: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200',
  };
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      style={themeColors.bg}
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
    >
      <button
        className={`absolute top-6 right-6 w-10 h-10 rounded-xl border flex items-center justify-center transition-all box-border focus:outline-none focus:ring-0 ${themeColors.buttonTheme} ${themeColors.cardBorder}`}
        onClick={toggleTheme}
      >
        <div>
          {isDarkMode ? (
            <Moon size={20} className="w-5 h-5" />
          ) : (
            <Sun size={20} className="w-5 h-5" />
          )}
        </div>
      </button>

      <div className="flex flex-col items-center gap-4 w-full max-w-[450px] max-h-full py-4">
        <div className="w-full max-w-[448px]">
          <div className="flex flex-col items-center text-center gap-2">
            {/* Theme toggle */}

            <img src={logoEsi} className="w-16 h-16 rounded-full object-cover shadow-sm" />

            <h2 className={`text-xl font-bold ${themeColors.textMain}`}>ESI-GM</h2>

            <span
              className={`text-[10px] font-normal font-['Inter']  uppercase tracking-wider ${themeColors.textSecondary}`}
            >
              <span>École Supérieure d'Informatique Sidi Bel Abbès</span>
              <br />
              <span>8 Mai 1945</span>
            </span>
          </div>

          <h1 className={`text-2xl font-black mt-4 text-center w-full ${themeColors.textMain}`}>Create Account</h1>

          <p
            className={`font-inter font-normal text-sm leading-[30px] text-center ${themeColors.textSecondary}`}
          >
            Join ESI-GM to get started
          </p>
        </div>

        <div
          className={`

flex flex-col items-start w-full p-6 rounded-2xl shadow-2xl
max-w-[450px]
shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] 

${themeColors.cardBg} border ${themeColors.cardBorder}`}
        >
          <form onSubmit={handleSubmit} className="flex flex-col items-start self-stretch gap-4">
            {/* Full Name */}

            <div className="flex flex-col gap-1 w-full">
              <label className="flex text-sm items-center self-stretch">
                <p
                  className={`font-inter text-[14px] font-medium leading-[20px] ${themeColors.textMain}`}
                >
                  Full Name
                </p>
              </label>

              <div
                className={`flex items-center w-full h-11 px-4  border  rounded-xl ${themeColors.inputBg} ${themeColors.inputBorder}`}
              >
                <User className="text-gray-400" size={20} />

                <input
                  className={`flex-1 tranparent ml-2 outline-none ${themeColors.textColor} border-none text-sm ${themeColors.inputBg}`}
                  type="text"
                  name="full_name"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>

              {errors.full_name && <p style={{ ...errorStyle }}>{errors.full_name}</p>}
            </div>

            {/* Email */}

            <div className="flex flex-col gap-1 w-full">
              {' '}
              <label className="flex items-center self-stretch text-sm">
                {' '}
                <p className={`font-inter text-sm font-medium leading-5 ${themeColors.textMain}`}>
                  {' '}
                  Email Adress{' '}
                </p>{' '}
              </label>{' '}
              <div
                className={`flex items-center w-full h-11 px-4  border  rounded-xl ${themeColors.inputBg} ${themeColors.inputBorder}`}
              >
                {' '}
                <Mail className="text-gray-400" size={20} />{' '}
                <input
                  autoComplete="off"
                  className={`flex-1 ml-2 bg-transparent text-sm outline-none ${themeColors.textColor} border-none ${themeColors.inputBg}`}
                  type="email"
                  name="email"
                  placeholder="a.student@esi-sba.dz"
                  value={formData.email}
                  onChange={handleChange}
                />{' '}
              </div>{' '}
              <p className="text-[#64748B] font-inter text-xs font-normal leading-4 text-left">
                {' '}
                Use your ESI email: x.xxxx@esi-sba.dz{' '}
              </p>{' '}
              {errors.email && <p style={{ ...errorStyle }}>{errors.email}</p>}
            </div>

            {/* Password */}

            <div className="flex flex-col gap-1 w-full">
              <label className="flex items-center self-stretch text-sm">
                <p className={` font-inter text-sm font-medium leading-5 ${themeColors.textMain}`}>
                  Password
                </p>
              </label>

              <div
                className={`flex items-center w-full h-11 px-4 text-sm border rounded-xl ${themeColors.inputBg} ${themeColors.inputBorder}`}
              >
                <Lock className="text-gray-400" size={20} />

                <input
                  className={`flex-1 ml-2 bg-transparent outline-none ${themeColors.textColor} text-sm border-none ${themeColors.inputBg}`}
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {errors.password && <p style={{ ...errorStyle }}>{errors.password}</p>}
            </div>

            {/* Account Type */}

            <div className="flex flex-col gap-1 w-full">
              <label className="flex items-center self-stretch text-sm">
                <p
                  className={`text-[#0F172A] font-inter text-sm font-medium leading-5 ${themeColors.textMain}`}
                >
                  Account Type
                </p>
              </label>

              <div
                className={`relative flex items-center w-full h-11 px-4 text-sm border rounded-xl ${themeColors.inputBg} ${themeColors.inputBorder}`}
              >
                <UserCircle className="text-gray-400" size={20} />

                {/* 1. Had l-botton houwa li y-replaci l-select */}
                <div
                  onClick={() => setIsOpen(!isOpen)} // Lazem t-creayi [isOpen, setIsOpen] f l-foug ta3 l-component
                  className={`flex-1 ml-2 cursor-pointer ${themeColors.textMain} flex items-center pr-1 bg-transparent outline-none justify-start text-left text-sm`}
                >
                  {formData.account_type || 'Student'}
                </div>
                <div
                  className="cursor-pointer flex items-center pr-1"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <ChevronDown
                    className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    size={18}
                  />
                </div>
                {/* 2. La liste (ul) lazem t-hatha hna daxel l-div wrapper bach tji m-rigla */}
                {isOpen && (
                  <ul
                    className={`absolute left-0 top-12 z-50 w-full py-0 overflow-hidden border rounded-xl shadow-xl ${themeColors.inputBg} ${themeColors.inputBorder} divide-y ${themeColors.divideColor}`}
                  >
                    {['Student'].map((item) => (
                      <li
                        key={item}
                        onClick={() => {
                          setFormData({ ...formData, account_type: item });
                          setIsOpen(false);
                        }}
                        className={`px-4 py-2 ${themeColors.hoverList} cursor-pointer text-sm justify-start text-left ${themeColors.textMain} hover:bg-gray-500/20`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex h-4 items-start flex-shrink-0 self-stretch">
                <p className=" text-[#64748B] font-inter text-xs font-normal leading-4">
                  Admin accounts are created by existing administrators
                </p>
              </div>

              {errors.account_type && <p style={{ ...errorStyle }}>{errors.account_type}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex justify-center items-center w-full py-[10px] rounded-xl hover:opacity-90 bg-[#2B4C9F]"
            >
              <span
                className={`text-white text-center font-inter text-base font-medium leading-6 ${themeColors.textMain}`}
              >
                {loading ? 'Creating...' : 'Create Account'}
              </span>
            </button>
          </form>

          <div className="flex justify-center items-center self-stretch mt-4">
            <p className="text-[#64748B] text-center font-inter text-sm font-normal leading-5">
              Already have an account?{' '}
            </p>

            <button
              onClick={() => navigate('/login')}
              className="text-[#2B4C9F] font-inter text-sm font-normal leading-5 cursor-pointer bg-transparent"
            >
              {' '}
              Sign in
            </button>
          </div>

          <div
            className={`flex flex-col items-start pt-6 mt-4 self-stretch border-t ${themeColors.borderTop}`}
          >
            <a className="flex justify-center items-center self-stretch">
              {' '}
              <button
                className="text-[#64748B] text-center font-inter bg-transparent text-sm font-normal leading-5"
                onClick={() => navigate('/')}
              >
                ← Back to Home
              </button>
            </a>
          </div>

          {/* General errors or success */}

          {errors.general && <p style={{ color: 'red', marginTop: '10px' }}>{errors.general}</p>}

          {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
        </div>
      </div>
    </div>
  );
}

export default Register;
