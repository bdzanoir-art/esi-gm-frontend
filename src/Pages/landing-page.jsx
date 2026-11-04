import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Wrench, Shield, Cpu } from 'lucide-react';
import {
  QrCode,
  Box,
  ClipboardList,
  Settings,
  ShieldCheck,
  BarChart3,
  ChevronRight,
  Circle,
} from 'lucide-react';
import ThemeToggle from '../Components/ThemToggel';
import { useNavigate } from 'react-router-dom';

import '../App.css';
import { Link } from 'react-router-dom';
export default function LandingPage() {
  const title = 'Ready to Streamline Your Laboratory?';
  const desc = 'Join ESI-GM today and transform how you manage laboratory equipment.';
  const navigate = useNavigate();
  const getStarted = () => {};
  return (
    <div className="  dynamic-bg text-foreground transition-colors duration-300 text-white font-sans selection:bg-blue-500/30 w-full ">
      {/* --- NAVBAR --- */}
      <nav className=" border-b border-[var(--card-border)] bg-background px-4 py-3">
        <div className="container-fluid  mx-auto px-[40px] w-full flex items-center justify-between  ">
          {/* Logo + Title */}
          <div className="flex items-center gap-2 ">
            <div
              className="rounded d-flex align-items-center justify-content-center"
              style={{ width: '48px', height: '48px' }}
            >
              <img
                src="/logo.png"
                alt="logo"
                style={{ width: '40px', height: '40px' }}
                className="rounded-[16px] w-auto "
              />
            </div>

            <div className="flex flex-col items-start" style={{ frontFamily: 'inter' }}>
              <span className=" text-title-custom ">ESI-GM</span>
              <small
                className="text-secondary text-small-custom"
                style={{ fontSize: '10px', width: '200px' }}
              >
                École Supérieure d'Informatique <br />
                Sidi Bel Abbès 8 Mai 1945
              </small>
            </div>
          </div>

          {/* Toggle button (mobile) */}
          <button
            className="navbar-toggler card-custom  "
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Links + Buttons */}
          <div className="hidden lg:flex items-center justify-between w-full" id="navbarContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0"></ul>
            <div className="flex items-center gap-2 ">
              <ThemeToggle />
              <button
                className="w-[90px] h-10 px-0 py-2 text-title-custom "
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                className="w-[107px] h-[40px] px-[24px] py-[8px] btn-register opacity-1 flex items-center justify-center text-white font-normal text-[14px]  transition-all active:scale-95 rounded-[12px] "
                style={{ fontFamily: 'Inter, sans-serif' }}
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      <header className=" w-full mx-auto px-6 md:px-16 py-16 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h1 className="text-[32px] md:text-[40px]  font-inter leading-[1.1] tracking-tight text-title-custom">
            Manage Your Laboratory Equipment{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-600 to-blue-800">
              Effortlessly
            </span>
          </h1>
          <p
            className="font-normal text-[15px] md:text-[16px] max-w-[520px] leading-[24px] tracking-normal mt-3 text-small-custom"
            style={{ fontFamily: 'inter,sans-serif' }}
          >
            ESI-GM is a comprehensive platform for laboratory equipment management. Track materials,
            manage inventory, handle maintenance, and process borrowing requests—all with QR code
            technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              className="w-[174px] h-[58px] btn-get-started shadow-xl shadow-blue-900/40 transition-all hover:scale-105 active:scale-95 rounded-[12px] px-[32px] py-[16px] gap-[8px] flex items-center justify-center font-normal text-[14.9px] leading-[24px] "
              style={{ fontFamily: 'inter,sans-serif' }}
              onClick={() => {
                navigate('/login');
              }}
            >
              Get Started <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-[116px] h-[58px] rounded-[12px] border-[1px] border-[#1E40AF4D] px-[32px] py-[16px] btn-signin flex items-center justify-center font-normal text-[14.9px] leading-[24px] hover:bg-slate-800 transition-all active:scale-95 "
            >
              Sign In
            </button>
          </div>
        </div>
        <div className="relative ">
          <div className="absolute -inset-10 bg-gradient-to-tr from-blue-900/10 to-purple-600/20 rounded-[3rem] blur-3xl"></div>
          <div className="relative overflow-hidden rounded-2xl shadow-2xl ">
            <img
              src="/photo1.png"
              alt="Lab Dashboard Preview"
              className="w-full h-auto object-cover transform hover:scale-105 transition duration-700"
            />
          </div>
        </div>
      </header>

      <section className="w-full mx-auto px-6 md:px-16 py-1">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <h3
            className="text-4xl font-bold  text-title-custom "
            style={{ fontSize: '28px', fontFamily: 'inter,sans-serif' }}
          >
            Powerful Features
          </h3>
          <p className="text-small-custom text-lg " style={{ fontSize: '15.2px' }}>
            Everything you need to manage your laboratory efficiently .
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<QrCode className="text-blue-400" size={20} />}
            title="QR Code Tracking"
            desc="Instantly scan and track materials with unique QR codes for seamless check-in and check-out."
          />
          <FeatureCard
            icon={<Box className="text-purple-400" size={20} />}
            title="Inventory Management"
            desc="Complete control over your laboratory materials with real-time stock monitoring and updates."
          />
          <FeatureCard
            icon={<ClipboardList className="text-emerald-400" size={22} />}
            title="Request System"
            desc="Students can request materials for projects with automatic stock verification and approval workflow."
          />
          <FeatureCard
            icon={<Wrench size={20} className="text-yellow-500" />}
            title="Maintenance Tracking"
            desc="Monitor equipment condition, schedule maintenance, and receive alerts for upcoming service."
          />
          <FeatureCard
            icon={<Shield size={20} className="text-red-500" />}
            title="Role-Based Access"
            desc="Secure platform with distinct roles for admins, storekeepers, and students with appropriate permissions."
          />
          <FeatureCard
            icon={<Cpu size={20} className="text-cyan-400" />}
            title="Real-Time Analytics"
            desc="Comprehensive dashboards with statistics, charts, and insights for better decision making.       "
          />
        </div>
      </section>

      <section className=" py-24  max-w-[1280px] mx-auto mb-[-30px] ">
        <div className="max-w-[1232px] mx-auto px-6 md:px-16">
          <div className="text-center mb-16 ">
            <h3 className="text-3xl font-bold text-title-custom mb-3">How It Works</h3>
            <p className="text-small-custom font-inter font-normal text-[18.6px] leading-[28px] text-center align-middle opacity-100 ">
              Simple workflow for all user types{' '}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <StepCard
              number="1"
              role="For Students"
              color="blue"
              steps={[
                'Create a project',
                'Add team members',
                'Select required materials',
                'Submit request',
                'Get approval notification',
                'Collect materials from lab',
              ]}
            />
            <StepCard
              number="2"
              role="For Storekeeper"
              color="indigo"
              steps={[
                'Add materials to inventory',
                'Generate QR codes',
                'Scan for input/output',
                'Update material status',
                'Manage maintenance',
                'Approve requests',
              ]}
            />
            <StepCard
              number="3"
              role="For Admins"
              color="purple"
              steps={[
                'Monitor all operations',
                'View analytics dashboard',
                'Manage user permissions',
                'Oversee stock levels',
                'Track maintenance alerts',
                'Generate reports',
              ]}
            />
          </div>
        </div>
      </section>
      <section
        id="more"
        className="mx-auto my-20 rounded-[16px] bg-[linear-gradient(90deg,rgba(30,64,175,0.2)_0%,rgba(173,70,255,0.2)_100%)] py-[43px] px-5 md:px-12 w-[90%] max-w-[1232px] text-center flex flex-col items-center justify-center relative overflow-hidden shadow-2xl"
      >
        <div className="flex flex-col items-center justify-center text-center gap-6 ">
          <h2 className="text-title-custom text-3xl md:text-[33px] font-bold mb-[-2px]">{title}</h2>

          <p className="text-small-custom text-lg md:text-[18px] max-w-2xl">{desc}</p>

          <button
            onClick={() => navigate('/login')}
            className="group flex items-center gap-3 btn-register transition-all duration-300 py-3.5 px-9 rounded-xl text-[#FFFFFF] font-inter shadow-lg"
          >
            Get Started new
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      <footer className="w-full max-w-[1440px] mx-auto px-6 md:px-[80px] py-[10px] border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="logo" className="w-8 h-8 rounded-full opacity-80" />
          <div className="flex flex-col justify-center items-start leading-tight mt-3">
            <span className="font-inter text-title-custom font-semibold text-[14px]">ESI-GM</span>
            <p className="font-inter text-small-custom text-[10px] opacity-80">ESI 8 Mai 1945</p>
          </div>
        </div>

        <p className="opacity-70 text-[12px] text-small-custom">
          © 2024 ESI-GM. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

// --- HELPER COMPONENTS ---
const FeatureCard = ({ icon, title, desc }) => (
  <div className="w-full max-w-[450px] h-[195px] p-3 border-[1px] card-custom border-border rounded-[16px] group transition-all duration-300  hover:bg-card/60 hover:border-[#1E40AF] hover:-translate-y-1 backdrop-blur-sm flex flex-col justify-start ">
    <div className="w-10 h-10  rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className=" font-bold mb-0 text-title-custom font-inter w-[339.33px] text-[17px] leading-[40px]">
      {title}
    </h3>
    <p
      className="text-small-custom  text-[14.9px]"
      style={{
        fontFamily: 'Inter,sans-serif',
        lineHeight: '20px',
        width: '289px',
        fontSize: '12.7px',
      }}
    >
      {desc}
    </p>
  </div>
);
const StepCard = ({ number, role, steps, color }) => (
  <div className="w-[310px] h-[254px]  pt-[20px] pr-[24px]  pl-[20px]  border-1  rounded-[16px] relative group transition-all duration-300   flex flex-col card-custom ">
    <div className="absolute -top-3 -left-3 w-[41px]  h-[41px] btn-register rounded-full flex items-center justify-center text-[#E8EAF0] font-bold text-[17px] z-20 border-[1px] border-background card-custom">
      {number}
    </div>
    <div className="flex flex-col items-start gap-3 mb-[24px] ">
      <h3 className="font-bold text-title-custom  bg-btn-register font-inter  font-bold text-[17px] leading-[28px] w-[310px] h-[28px] flex items-center mt-1 mb-[-10px] text-left">
        {role}
      </h3>
    </div>
    <ul className=" flex flex-col gap-[6px] relative z-10 items-start pl-0  text-small-custom ">
      {steps.map((step, idx) => (
        <li
          key={idx}
          className="flex items-start text-small-custom gap-[10px] text-[13px] leading-[22px]"
        >
          <div className="w-[6px] h-[6px] text-small-custom rounded-[33554400px] mt-2 shrink:0 btn-register"></div>
          <span className="opacity-90 ">{step}</span>
        </li>
      ))}
    </ul>
  </div>
);
