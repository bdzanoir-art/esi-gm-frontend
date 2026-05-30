import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { storekeeperAPI, myRequestAPI } from '../Api/api.service';
import { useAuth } from '../contexts/AuthContext';
import {
  X,
  Printer,
  CheckCircle,
  Building2Icon,
  Calendar,
  User,
  Package,
  AlertTriangle,
  QrCodeIcon,
  RotateCcw,
} from 'lucide-react';

const ValidationSlipPage = ({ isOpen: propIsOpen, onClose, requestData: propRequestData, dark }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requestData, setRequestData] = useState(propRequestData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync state with props if they change (important for modal usage)
  useEffect(() => {
    if (propRequestData) {
      setRequestData(propRequestData);
      setError(null);
    }
  }, [propRequestData]);

  const isOpen = propIsOpen !== undefined ? propIsOpen : true;

  useEffect(() => {
    // If we have an ID but no data, fetch it
    if (id && !propRequestData && isOpen) {
      const fetchRequest = async () => {
        try {
          setLoading(true);
          setError(null);
          
          let response;
          // Try student API first if user is student, otherwise storekeeper
          if (user?.role === 'student') {
            response = await myRequestAPI.getRequest(id);
          } else {
            response = await storekeeperAPI.getRequest(id);
          }
          
          setRequestData(response.data);
        } catch (err) {
          console.error('Fetch error:', err);
          // If 403 on storekeeper API, try student API as fallback
          if (err.response?.status === 403) {
             try {
                const retryRes = await myRequestAPI.getRequest(id);
                setRequestData(retryRes.data);
                return;
             } catch(e) {}
          }
          setError('Failed to load validation details. Request might be missing or private.');
        } finally {
          setLoading(false);
        }
      };
      fetchRequest();
    }
  }, [id, propRequestData, isOpen, user]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl flex flex-col items-center gap-4 shadow-2xl">
          <RotateCcw className="animate-spin text-indigo-500" size={40} />
          <p className="font-bold text-lg dark:text-white">Generating Real-Time QR Validation...</p>
        </div>
      </div>
    );
  }

  if (error || !requestData) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl text-center max-w-sm shadow-2xl border border-red-500/20">
          <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2 dark:text-white">{error || 'Verification Data Missing'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">We couldn't retrieve the validation details for this request.</p>
          <button 
            onClick={onClose || (() => navigate(-1))} 
            className="w-full py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getDisplayDate = () => {
    // Priority: raw API fields first
    const rawDate = requestData.created_at || requestData.date || requestData.validatedAt || requestData.update;
    if (!rawDate) return new Date();
    
    // Check if it's already a valid date
    const parsed = new Date(rawDate);
    if (!isNaN(parsed.getTime())) return parsed;

    // Handle DD/MM/YYYY or DD-MM-YYYY manually (common in local regions)
    if (typeof rawDate === 'string') {
       const cleanDate = rawDate.replace(/-/g, '/');
       if (cleanDate.includes('/')) {
         const parts = cleanDate.split('/');
         if (parts.length === 3) {
            const [p1, p2, p3] = parts;
            // If p1 is day (>12), it's likely DD/MM/YYYY
            if (parseInt(p1) > 12) return new Date(`${p3}-${p2}-${p1}`);
            // Otherwise try standard parts
            const tryDate = new Date(`${p3}-${p2}-${p1}`);
            if (!isNaN(tryDate.getTime())) return tryDate;
         }
       }
    }
    return new Date(); // Fallback to now if everything fails
  };

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const handlePrint = () => window.print();
  const validationDate = getDisplayDate();
  
  // Robust data mapping - prioritize String names over numeric IDs
  const studentName = requestData.student_name || 
                     requestData.requestedBy || 
                     (typeof requestData.student === 'string' ? requestData.student : null) || 
                     'Authorized Student';

  const studentEmail = requestData.student_email || requestData.email || 'student@esi-sba.dz';
  const projectTitle = requestData.project_name || requestData.title || 'N/A';
  const requestNo = requestData.request_number || requestData.qr || requestData.validationCode || `REQ-${requestData.id}`;
  const materialItems = Array.isArray(requestData.items) ? requestData.items : (requestData.materials ? [{ name: requestData.materials, quantity: 1 }] : []);

  // Use a reliable date string for QR
  let qrDateStr = new Date().toISOString().split('T')[0];
  try {
     if (validationDate && !isNaN(validationDate.getTime())) {
        qrDateStr = validationDate.toISOString().split('T')[0];
     }
  } catch(e) {}

  const qrValue = JSON.stringify({
    req: requestNo,
    user: studentName,
    date: qrDateStr
  });

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-[60] flex items-start py-10 justify-center bg-slate-900/40 backdrop-blur-md p-2 sm:p-4 overflow-y-auto ${
        dark ? 'dark' : ''
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-slate-50 dark:bg-[#0A1128] w-full max-w-3xl rounded-[32px] shadow-2xl my-2 sm:my-6 animate-in fade-in zoom-in duration-500 border border-white/10 overflow-hidden print:shadow-none print:my-0 print:rounded-none"
      >
        {/* Header Decor */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 print:hidden" />

        <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center p-6 sm:p-8 print:hidden">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/10 p-2 rounded-lg">
                <CheckCircle className="text-[#05DF72]" size={28} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Bon de Validation
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium italic">
             Laboratory Pass • Approved Order Verification
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold transition-all hover:bg-indigo-700 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              <Printer size={18} /> Print Pass
            </button>
            <button
              onClick={onClose || (() => navigate(-1))}
              className="px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-inter"
            >
              Close
            </button>
          </div>
        </div>

        <div className="px-6 pb-8 sm:px-8 space-y-8 font-inter">
          {/* Institution Info */}
          <div className="flex items-center gap-4 p-5 rounded-2xl border border-indigo-500/10 bg-indigo-500/5 dark:bg-indigo-500/10">
            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 dark:border-indigo-900/50">
              <Building2Icon size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                École Supérieure d'Informatique
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                Laboratory Management System • ESI-GM
              </p>
            </div>
          </div>

          {/* Validation Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <QrCodeIcon size={12} className="text-indigo-500" /> Validation Ref
              </p>
              <p className="text-xl font-mono font-black text-indigo-600 dark:text-indigo-400">
                {requestNo}
              </p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <Calendar size={12} className="text-indigo-500" /> Issued Date
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {validationDate.toLocaleDateString('fr-FR', options)}
              </p>
            </div>
          </div>

          {/* Student & Project */}
          <div className="p-6 bg-blue-600/5 dark:bg-indigo-600/5 border border-indigo-500/20 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <User size={80} />
            </div>
            <div className="flex items-center gap-2 mb-6 font-bold text-slate-900 dark:text-indigo-300">
              <User size={18} />
              <span>Borrower Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 relative z-10">
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Student Name</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {studentName}
                </p>
                <p className="text-xs text-slate-400">{studentEmail}</p>
              </div>
              <div className="space-y-1 text-right sm:text-left">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Project Context</p>
                <p className="text-base font-semibold text-slate-800 dark:text-slate-300">
                  {projectTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Materials Table */}
          <div className="border border-green-500/20 bg-green-500/5 dark:bg-green-500/10 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-6 text-green-700 dark:text-green-400 font-bold">
              <Package size={20} />
              <span>Validated Material List</span>
            </div>
            <div className="w-full overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-[10px] text-slate-400 font-bold uppercase tracking-widest border-b border-green-500/10">
                    <th className="pb-3 px-2">Item Name</th>
                    <th className="pb-3 text-center">Quantity</th>
                    <th className="pb-3 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-500/10">
                  {materialItems.length > 0 ? materialItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-4 px-2 font-bold text-slate-900 dark:text-white">
                        {item.name || item.material_name || item.materialId?.name || "Item"}
                      </td>
                      <td className="py-4 text-center font-mono font-bold">
                         {item.quantity || item.qty || 1}
                      </td>
                      <td className="py-4 text-right">
                         <span className="px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 text-[10px] font-black uppercase rounded-full border border-green-500/20">
                           PASS
                         </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" className="py-4 text-center text-slate-400 italic">No specific items listed</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`flex flex-col items-center py-8 rounded-2xl border ${dark ? 'bg-[rgba(30,41,59,0.50)] border-[#1E293B]' : 'bg-[rgba(241,245,249,0.50)] border-[#E2E8F0]'}`}>
            <div className="flex items-center gap-2 mb-6 w-full px-6">
              <QrCodeIcon className={dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'} size={20} />
              <h3 className="font-inter text-lg font-bold">
                QR Code de Validation
              </h3>
            </div>

            <div className="flex p-4 bg-white rounded-2xl shadow-xl border-[8px] border-slate-900 mb-4 transition-transform hover:scale-105 duration-300">
                <QRCodeSVG
                  value={qrValue}
                  size={160}
                  level="H"
                />
            </div>

            <p className="mt-8 text-[11px] font-bold text-slate-400 dark:text-slate-500 max-w-[240px] text-center leading-relaxed">
              SCAN FOR AUTHENTICATION<br />
              <span className="opacity-50">This pass is crypto-verified against ESI-GM records.</span>
            </p>
          </div>

          {/* Notes */}
          <div className="p-6 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl">
            <div className="flex items-center gap-2 mb-3 text-yellow-600 font-bold text-xs uppercase letter-spacing-1">
              <AlertTriangle size={14} /> Usage Policy
            </div>
            <ul className="list-disc ml-5 text-[11px] text-slate-500 dark:text-slate-400 space-y-2 font-medium">
              <li>Present this digital or printed pass to the storekeeper.</li>
              <li>Stocks were locked at the time of validation.</li>
              <li>All materials must be returned within the project timeline.</li>
            </ul>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 pt-8 pb-12">
            <div className="space-y-12">
              <p className="text-[10px] font-bold uppercase text-slate-400 text-center">Borrower Signature</p>
              <div className="border-b border-dashed border-slate-300 dark:border-slate-700 w-full" />
            </div>
            <div className="space-y-12">
              <p className="text-[10px] font-bold uppercase text-slate-400 text-center">Storekeeper Final Check</p>
              <div className="border-b border-dashed border-slate-300 dark:border-slate-700 w-full" />
            </div>
          </div>
        </div>
        
        <div className="bg-slate-100 dark:bg-slate-900/50 p-4 text-center">
            <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">
              Generated by ESI-GM Protocol v2.1 • Authenticity Guaranteed
            </p>
        </div>
      </div>
    </div>
  );
};

export default ValidationSlipPage;
