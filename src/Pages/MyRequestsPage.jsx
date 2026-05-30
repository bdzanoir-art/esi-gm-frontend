import React, { useState, useEffect } from 'react';
import NewRequestModal from '../Components/NewRequestModal';
import Sidebar from '../Components/Sidebar';
import ValidationSlipPage from './ValidationSlipPage';
import { myRequestAPI } from '../Api/api.service';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  ClipboardList,
  Package,
  Plus,
  AlertTriangle,
  CheckCircle,
  Truck,
  Sun,
  Moon,
  Calendar
} from 'lucide-react';
import { useTheme } from '../Context/ThemeContext';

const MyRequestsPage = () => {
  const { darkMode: dark } = useTheme();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  const openSlip = (req) => {
    setSelectedRequest(req);
    setIsSlipOpen(true);
  };
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const MAX_REQUESTS = 5;

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const response = await myRequestAPI.getRequests();
        const requestList = response.data.results || response.data || [];
        const formattedData = requestList.map((req) => ({
          ...req,
          title: req.project_name || `Request #${req.request_number}`,
          requestedBy: req.student_name,
          date: new Date(req.created_at).toLocaleDateString(),
          update: new Date(req.updated_at).toLocaleDateString(),
          status: req.status_display || req.status,
          manualReview: req.status === 'pending',
          deliveryStatus: 'Processing...',
        }));
        setRequests(formattedData);
      } catch (error) {
        console.error('Failed to load real requests:', error);
      }
      setLoading(false);
    };
    loadRequests();
  }, []);

  // دالة تحديث القائمة بعد إضافة طلب جديد (تستعمل في الـ Modal)
  const refreshRequests = async () => {
    try {
      const response = await myRequestAPI.getRequests();
      const requestList = response.data.results || response.data || [];
      const formattedData = requestList.map((req) => ({
        ...req,
        title: req.project_name || `Request #${req.request_number}`,
        requestedBy: req.student_name,
        date: new Date(req.created_at).toLocaleDateString(),
        update: new Date(req.updated_at).toLocaleDateString(),
        status: req.status_display || req.status,
        manualReview: req.status === 'pending',
        deliveryStatus: 'Processing...',
      }));
      setRequests(formattedData);
    } catch (error) {
      console.error('Refresh fail:', error);
    }
  };

  const getStatusStyle = (status) => {
    const s = String(status).toLowerCase();
    if (s.includes('pending')) {
      return 'border border-yellow-300/20 bg-yellow-200/10 text-[#FDC700]';
    } else if (s.includes('approved')) {
      return 'border border-green-500/20 bg-green-400/10 text-[#05DF72]';
    } else if (s.includes('completed')) {
      return 'border border-blue-500/20 bg-blue-400/10 text-[#51A2FF]';
    }
    return 'bg-gray-100 text-gray-600';
  };
  const handleOpenSlip = (req) => {
    setSelectedRequest(req);

    setIsSlipOpen(true);
  };

  return (
    <div
      className={`flex min-h-screen flex-col md:flex-row transition-colors duration-500 ease-in-out
${dark ? 'bg-[#020817] text-[#E8EAF0]' : 'bg-[#F8FAFC] text-[#0F172A]'}`}
    >
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              {/* Left text */}
              <div className="flex flex-col items-start">
                <h1
                  className={`text-xl sm:text-2xl font-bold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'} font-bold`}
                >
                  My Requests
                </h1>
                <p className={`text-sm mt-1 ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                  Submit requests and receive automatic validation based on stock availability
                </p>
              </div>

              {/* Button */}
              <button
                onClick={() => setShowModal(true)}
                disabled={requests.length >= MAX_REQUESTS}
                className={`flex items-center font-base p-2 gap-2 px-4 py-2 rounded-lg transition-all duration-200
hover:scale-[1.03] active:scale-[0.95]
focus:outline-none focus:ring-2 focus:ring-[#2B4C9F] ${
                  requests.length >= MAX_REQUESTS
                    ? 'bg-gray-300 cursor-not-allowed'
                    : dark
                      ? 'bg-[#2B4C9F] hover:bg-[#3B5FCF] text-white'
                      : 'bg-[#2B4C9F] hover:bg-[#1E3A8A] text-white'
                }`}
              >
                <Plus size={18} />
                New Request
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className={`rounded-xl border shadow-sm overflow-hidden ${
                  dark ? 'bg-[#0A1128] border-[#2B4C9F]' : 'bg-[#FFF] border-[#E2E8F0]'
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <div className="break-words">
                      <h3
                        className={`flex items-start text-lg font-bold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
                      >
                        {req.title}
                      </h3>
                      <p
                        className={`flex items-center mt-2 text-sm ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} gap-1 whitespace-nowrap`}
                      >
                        Requested by: {req.requestedBy} •
                        <Calendar className="w-3 h-3" />{' '}
                        <span className={`${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
                          {' '}
                          {req.date}
                        </span>
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(req.status)}`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div
                    className={`rounded-lg p-3 sm:p-4 border ${
                      dark
                        ? 'bg-[rgba(30,41,59,0.05)] border-[#2B4C9F]'
                        : 'bg-[rgba(241,245,249,0.05)] border-[#E2E8F0]'
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 mb-3 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}  font-semibold text-sm`}
                    >
                      <Package size={16} /> Requested Items ({req.items.length})
                    </div>
                    <div className="space-y-2">
                      {req.items.map((item, idx) => (
                        <div
                          key={idx}
                          className={`flex justify-between text-xs sm:text-sm ${dark ? 'text-[#E8EAF0] bg-[#020817] bg-opacity-50' : 'text-[#0F172A] bg-[#F8FAFC] bg-opacity-50'} rounded-l p-1 pb-2 last:border-0`}
                        >
                          <span>{item.material_name || item.name}</span>
                          <span
                            className={`font-mono ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}
                          >
                            Qty: {item.quantity || item.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* messages*/}
                  {req.manualReview && (
                    <div className="mt-4 p-4 bg-orange-50 border border-yellow-400/20 bg-yellow-300/10 rounded-lg flex gap-3">
                      <AlertTriangle className="text-[#FDC700] shrink-0" size={20} />
                      <div>
                        <p className="flex items-start text-sm font-bold text-[#FDC700]">
                          Manual Review Required
                        </p>
                        <p className="text-xs text-[#FDC700]">
                          This request requires manual verification by the storekeeper. You will be
                          notified once the review is complete.
                        </p>
                      </div>
                    </div>
                  )}

                  {req.status === 'Approved' && (
                    <div className="mt-4 space-y-3">
                      <div
                        className={`${
                          dark ? 'border-t border-[#2B4C9F]' : 'border-t border-[#E2E8F0]'
                        } pt-4 pb-2`}
                      >
                        <button
                          onClick={() => handleOpenSlip(req)}
                          className={`flex items-center gap-2 text-green-600 px-4 py-2 p-2 rounded-lg bg-[rgba(0,201,80,0.10)] border border-[rgba(0,201,80,0.2)] text-sm font-medium hover:bg-green-100 transition-colors duration-200
hover:scale-[1.02] active:scale-[0.95]
focus:outline-none focus:ring-2 focus:ring-green-400 ${
                            dark
                              ? 'bg-green-900/20 border border-green-500/30 text-green-400 hover:bg-green-900/40'
                              : 'bg-green-100 border border-green-200 text-green-600 hover:bg-green-200'
                          } `}
                        >
                          <CheckCircle size={16} /> View Validation Slip
                        </button>
                      </div>
                      <div
                        className={`${
                          dark ? 'border-t border-[#2B4C9F]' : 'border-t border-[#E2E8F0]'
                        } p-4`}
                      >
                        <div className="p-4 border border-blue-500/20 bg-blue-400/10 rounded-lg">
                          <div className="flex items-center gap-2 text-[#51A2FF] text-sm font-semibold mb-1">
                            <Truck size={16} /> Delivery Status
                          </div>
                          <div className="text-xs text-orange-600 flex items-center gap-1">
                            <AlertTriangle className="text-[#FDC700]" size={12} />
                            <span className="text-[#51A2FF]">{req.deliveryStatus}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <p
                    className={`flex items-start pt-3 whitespace-nowrap ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} text-[11px] sm:text-[12px] font-normal leading-4 font-inter`}
                  >
                    Created : {req.date} • Updated : {req.update}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <NewRequestModal
          dark={dark}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAddRequest={refreshRequests}
        />
      </main>
      <ValidationSlipPage
        dark={dark}
        isOpen={isSlipOpen}
        onClose={() => setIsSlipOpen(false)}
        requestData={selectedRequest}
      />
    </div>
  );
};

const NavItem = ({ icon, label, active = false, className = '' }) => (
  <div
    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${className}`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default MyRequestsPage;
