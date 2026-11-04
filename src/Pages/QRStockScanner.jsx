import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import ThemeToggle from '../Components/ThemeToggle.jsx';
import { storekeeperAPI } from '../Api/api.service';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera,
  QrCode,
  CheckCircle2,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  X,
  Printer,
} from 'lucide-react';

export default function QRStockScanner() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const scannerRegionId = 'qr-reader-region';

  const [transactionType, setTransactionType] = useState('input');
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('Ready to scan');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastScannedCode, setLastScannedCode] = useState('');
  const [recentTransactions, setRecentTransactions] = useState([]);

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch {
      //
    } finally {
      setIsScanning(false);
    }
  };

  const [scannedResult, setScannedResult] = useState(null);
  const [loadDetail, setLoadDetail] = useState(false);

  const handleScanSuccess = async (decodedText) => {
    setLastScannedCode(decodedText);
    setScanMessage('QR code scanned! verifying...');
    setErrorMessage('');
    setScannedResult(null);
    setLoadDetail(true);

    try {
      let reqId = decodedText;
      let reqNum = null;

      setScanMessage('Code detected. Parsing...');
      // Try to parse if it's JSON (like our validation slips)
      try {
        const parsed = JSON.parse(decodedText);
        if (parsed.req) {
           reqNum = parsed.req;
           // Extract clean ID just in case
           reqId = parsed.req.replace('REQ-', '').replace('ESI-', '').replace('PASS', '').replace('VAL', '');
        }
      } catch (e) {
        reqNum = decodedText;
      }

      setScanMessage(`Verifying order ${reqNum || reqId}...`);
      let response = null;
      
      // Method 1: Try searching by request_number (Best for validation slips)
      try {
        const searchRes = await storekeeperAPI.getRequests({ 
           request_number: reqNum || reqId 
        });
        const results = searchRes.data.results || searchRes.data || [];
        if (results.length > 0) {
           response = { data: results[0] };
        }
      } catch (e) { console.warn("Search by number failed", e); }

      // Method 2: Try direct ID lookup if Method 1 failed
      if (!response) {
        try {
          if (!isNaN(reqId) && Number.isInteger(Number(reqId))) {
             response = await storekeeperAPI.getRequest(reqId);
          }
        } catch (e) { console.warn("Direct ID lookup failed", e); }
      }

      if (response && response.data) {
        const data = response.data;
        setScannedResult(data);
        setScanMessage('Order Verified Successfully!');

        const newTransaction = {
          id: Date.now(),
          code: data.request_number || reqId,
          type: transactionType,
          title: data.project_name || data.title || "Request",
          status: data.status,
          date: new Date().toLocaleString(),
          outcome: 'Verified',
        };
        setRecentTransactions((prev) => [newTransaction, ...prev].slice(0, 10));
      } else {
        throw new Error("No matching record found for this code.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Verification failed. Order not found.');
      setScanMessage('Scan Failed');
    } finally {
      setLoadDetail(false);
      await stopScanner();
    }
  };

  const startScanner = async () => {
    setErrorMessage('');
    setScannedResult(null);
    setScanMessage('Initializing camera...');

    try {
      if (scannerRef.current) {
        await stopScanner();
      }

      const devices = await Html5Qrcode.getCameras();

      if (!devices || devices.length === 0) {
        setErrorMessage('No camera found');
        return;
      }

      const cameraId = devices[0].id;
      const scanner = new Html5Qrcode(scannerRegionId);
      scannerRef.current = scanner;

      await scanner.start(
        cameraId,
        {
          fps: 15,
          qrbox: { width: 300, height: 300 },
          aspectRatio: 1.0,
        },
        handleScanSuccess,
        () => {},
      );

      setIsScanning(true);
      setScanMessage('Scanning in progress...');
    } catch (error) {
      console.error(error);
      setErrorMessage('Unable to start camera scanner. Check camera permission.');
      setScanMessage('Ready to scan');
      setIsScanning(false);

      if (scannerRef.current) {
        try {
          await scannerRef.current.clear();
        } catch {
          //
        }
        scannerRef.current = null;
      }
    }
  };

  const handleStop = async () => {
    await stopScanner();
    setScanMessage('Scanner stopped');
    setErrorMessage('');
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="app-main">
        <div className="page-shell">
          <div className="page-topbar">
            <div>
              <h1 className="page-title">QR Stock Scanner</h1>
              <p className="page-subtitle">Scan QR codes to manage inventory input and output</p>
            </div>
            <ThemeToggle />
          </div>

          <section className="scanner-section">
            <h3 className="scanner-section-title">Select Transaction Type</h3>

            <div className="scanner-type-grid">
              <button
                type="button"
                className={`scanner-type-card ${transactionType === 'input' ? 'active input' : ''}`}
                onClick={() => setTransactionType('input')}
              >
                <ArrowDownToLine size={20} />
                <div>
                  <strong>INPUT</strong>
                  <span>Add to Stock</span>
                </div>
              </button>

              <button
                type="button"
                className={`scanner-type-card ${
                  transactionType === 'output' ? 'active output' : ''
                }`}
                onClick={() => setTransactionType('output')}
              >
                <ArrowUpFromLine size={20} />
                <div>
                  <strong>OUTPUT</strong>
                  <span>Remove from Stock</span>
                </div>
              </button>
            </div>
          </section>

          <section className="scanner-section">
            <h3 className="scanner-section-title">Scan QR Code</h3>

            <div className="scanner-box">
              {!isScanning && (
                <div className="scanner-placeholder">
                  <div className="scanner-camera-icon">
                    <Camera size={42} />
                  </div>

                  <p className="scanner-status-text">{scanMessage}</p>

                  {loadDetail && (
                    <div className="flex flex-col items-center gap-2 py-4">
                       <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                       <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Database Lookup...</span>
                    </div>
                  )}

                  {scannedResult && (
                    <div className="w-full mt-4 p-5 bg-green-500/10 border border-green-500/20 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex items-center gap-2 mb-3 text-green-700 dark:text-green-400 font-bold uppercase text-[10px] tracking-widest">
                        <CheckCircle2 size={14} /> Verified Request
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                           <span className="text-xs text-slate-400">Student:</span>
                           <span className="font-bold text-slate-900 dark:text-white">{scannedResult.student_name || scannedResult.requester_name || scannedResult.student}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-xs text-slate-400">Project:</span>
                           <span className="font-bold text-slate-900 dark:text-white">{scannedResult.project_name || scannedResult.title}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-xs text-slate-400">Status:</span>
                           <span className="px-2 py-0.5 bg-indigo-500 text-white text-[9px] font-black uppercase rounded-md tracking-tighter">
                             {scannedResult.status}
                           </span>
                        </div>
                        
                        {/* Materials List Section */}
                        <div className="mt-4 pt-4 border-t border-green-500/10">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Items to Issue</p>
                           <div className="space-y-1.5">
                              {scannedResult.items && scannedResult.items.length > 0 ? (
                                 scannedResult.items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                                       <span className="font-bold text-slate-800 dark:text-slate-200">
                                          {item.material_name || item.name || item.material?.name || "Material Item"}
                                       </span>
                                       <span className="font-mono text-indigo-600 dark:text-indigo-400 font-black">
                                          x{item.quantity || item.qty || 1}
                                       </span>
                                    </div>
                                 ))
                              ) : (
                                 <p className="text-xs italic text-slate-400">No specific items listed.</p>
                              )}
                           </div>
                        </div>

                        {/* Action Link */}
                        <div className="mt-6">
                           <button 
                             onClick={() => navigate(`/validation/${scannedResult.id}`)}
                             className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                           >
                             <Printer size={14} /> View Full Validation Slip
                           </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <button type="button" className="scanner-start-btn" onClick={startScanner}>
                    <QrCode size={16} />
                    <span>Start Scanning</span>
                  </button>

                  {errorMessage && (
                    <div className="scanner-error-badge flex items-center gap-2 mt-4 p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold text-xs">
                      <X size={14} /> {errorMessage}
                    </div>
                  )}
                </div>
              )}

              <div
                id={scannerRegionId}
                className={`scanner-reader ${isScanning ? 'active' : ''}`}
              />

              {isScanning && (
                <div className="scanner-stop-wrap">
                  <button type="button" className="scanner-stop-btn" onClick={handleStop}>
                    <X size={16} />
                    <span>Stop</span>
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="scanner-section">
            <div className="scanner-history-header">
              <h3 className="scanner-section-title">
                <History size={16} />
                <span>Recent Transactions</span>
              </h3>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="scanner-empty-history">No transactions yet</div>
            ) : (
              <div className="scanner-history-list">
                {recentTransactions.map((item) => (
                  <div key={item.id} className="scanner-history-card">
                    <div className="scanner-history-top">
                      <div className="flex flex-col">
                        <strong className="text-sm">REQ-{item.code}</strong>
                        <span className="text-[10px] text-slate-400">{item.title || "Unknown Project"}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className={`scanner-history-type ${item.type === 'input' ? 'input' : 'output'}`}>
                          {item.type.toUpperCase()}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
                           {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="scanner-history-meta">
                      <span>{item.date}</span>
                      <span>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
