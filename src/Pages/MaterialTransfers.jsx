import React, { useMemo, useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import ThemeToggle from "../Components/ThemeToggle";
import {
  ArrowRightLeft,
  Clock3,
  Truck,
  CheckCircle2,
  Package,
  Filter,
  ChevronDown,
  Plus,
  X,
} from "lucide-react";
import { studentAPI, browseAPI, transfersAPI } from "../Api/api.service";

const initialTransfers = [];

function TransferForm({ onCancel, onSubmit }) {
  const [fromLab, setFromLab] = useState("");
  const [toLab, setToLab] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [reason, setReason] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [qty, setQty] = useState("");
  const [materials, setMaterials] = useState([]);

  const [allLabs, setAllLabs] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [labsRes, matsRes] = await Promise.all([
          studentAPI.getLaboratories(),
          browseAPI.getMaterials()
        ]);
        let labs = labsRes.data || labsRes;
        let mats = matsRes.data?.results || matsRes.data || matsRes;
        
        if (!Array.isArray(mats) || mats.length === 0) {
          // Try studentAPI as fallback if browseAPI is empty
          const studentMatsRes = await studentAPI.getMaterials();
          mats = studentMatsRes.data || studentMatsRes;
        }

        setAllLabs(Array.isArray(labs) ? labs : []);
        setAllMaterials(Array.isArray(mats) ? mats : []);
      } catch (err) {
        console.error("Error fetching form data:", err);
        // Fallback or keep empty
      }
    };
    fetchData();
  }, []);

  const addMaterial = () => {
    if (!materialName || !qty || Number(qty) <= 0) return;

    // Find the material name if materialName is an ID or keep it if it's already the name
    const selectedMat = allMaterials.find(m => String(m.id) === String(materialName) || m.name === materialName);
    const nameToDisplay = selectedMat ? selectedMat.name : materialName;

    const newMaterial = {
      id: Date.now(),
      name: nameToDisplay,
      quantity: Number(qty),
    };

    setMaterials((prev) => [...prev, newMaterial]);
    setMaterialName("");
    setQty("");
  };

  const removeMaterial = (id) => {
    setMaterials((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fromLab || !toLab || !reason || materials.length === 0) return;

    const totalUnits = materials.reduce((sum, item) => sum + item.quantity, 0);

    onSubmit({
      title: `Transfer #${Date.now().toString().slice(-4)}`,
      status: "pending",
      fromLab,
      toLab,
      priority,
      reason,
      materials: materials.map(({ name, quantity }) => ({ name, quantity })),
    });
  };

  return (
    <div className="tf-modal-overlay">
      <div className="tf-modal-card">
        <div className="tf-modal-header">
          <h2>Create Material Transfer</h2>
        </div>

        <form onSubmit={handleSubmit} className="tf-form">
          <div className="tf-form-grid">
            <div className="tf-field">
              <label>From Lab *</label>
              <select value={fromLab} onChange={(e) => setFromLab(e.target.value)}>
                <option value="">Select laboratory</option>
                {allLabs.length > 0 ? allLabs.map(lab => (
                  <option key={lab.id} value={lab.name}>{lab.name}</option>
                )) : (
                  <option disabled>No laboratories found</option>
                )}
              </select>
            </div>

            <div className="tf-field">
              <label>To Lab *</label>
              <select value={toLab} onChange={(e) => setToLab(e.target.value)}>
                <option value="">Select laboratory</option>
                {allLabs.length > 0 ? allLabs.map(lab => (
                  <option key={lab.id} value={lab.name}>{lab.name}</option>
                )) : (
                  <option disabled>No laboratories found</option>
                )}
              </select>
            </div>
          </div>

          <div className="tf-field">
            <label>Priority</label>
            <div className="tf-priority-row">
              {["Low", "Medium", "High", "Urgent"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`tf-priority-btn ${priority === item ? "active" : ""}`}
                  onClick={() => setPriority(item)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="tf-field">
            <label>Reason *</label>
            <textarea
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this transfer is needed..."
            />
          </div>

          <div className="tf-field">
            <label>Materials to Transfer *</label>

            <div className="tf-material-entry">
              <select
                value={materialName}
                onChange={(e) => setMaterialName(e.target.value)}
              >
                <option value="">Select material</option>
                {allMaterials.length > 0 ? allMaterials.map(mat => (
                  <option key={mat.id} value={mat.title || mat.name || "Unnamed Item"}>
                    {mat.title || mat.name || `Item ${mat.id}`}
                  </option>
                )) : (
                  <option disabled>No materials found</option>
                )}
              </select>
              <input
                placeholder="Qty"
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
              <button type="button" className="tf-add-material-btn" onClick={addMaterial}>
                <Plus size={16} />
                <span>Add Material</span>
              </button>
            </div>

            <div className="tf-material-list">
              {materials.map((item) => (
                <div key={item.id} className="tf-material-item">
                  <span>{item.name}</span>
                  <div className="tf-material-item-right">
                    <strong>{item.quantity}</strong>
                    <button type="button" onClick={() => removeMaterial(item.id)}>
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="tf-form-actions">
            <button type="button" className="tf-cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="tf-submit-btn">
              Create Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
    );
}

export default function MaterialTransfers() {
  const [transfers, setTransfers] = useState(initialTransfers);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [openId, setOpenId] = useState(null);

  const stats = useMemo(() => {
    const safeTransfers = Array.isArray(transfers) ? transfers : [];
    return {
      pending: safeTransfers.filter((item) => item.status === "pending").length,
      inTransit: safeTransfers.filter((item) => item.status === "in-transit").length,
      delivered: safeTransfers.filter((item) => item.status === "delivered").length,
      total: safeTransfers.length,
    };
  }, [transfers]);

  const filteredTransfers = useMemo(() => {
    const safeTransfers = Array.isArray(transfers) ? transfers : [];
    if (activeFilter === "all") return safeTransfers;
    return safeTransfers.filter((item) => item.status === activeFilter);
  }, [activeFilter, transfers]);

  const handleCreateTransfer = async (transferData) => {
    try {
      const res = await transfersAPI.createTransfer(transferData);
      setTransfers((prev) => [res.data, ...prev]);
      setShowCreateForm(false);
    } catch (err) {
      console.error("Error creating transfer:", err);
      alert("Failed to save transfer to database. Please check your connection.");
      setShowCreateForm(false);
    }
  };

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const res = await transfersAPI.getTransfers();
        const data = res.data?.results || res.data || res;
        setTransfers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching transfers:", err);
        setTransfers([]);
      }
    };
    fetchTransfers();
  }, []);

  const toggleOpen = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="app-layout">
        <Sidebar />

      <main className="app-main">
        <div className="page-shell">
          <div className="page-topbar">
            <div>
              <h1 className="page-title">Material Transfers</h1>
              <p className="page-subtitle">Transfer materials between laboratories</p>
            </div>

            <div className="tf-top-actions">
              <button
                type="button"
                className="tf-new-btn"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus size={16} />
                <span>New Transfer</span>
              </button>
              <ThemeToggle />
            </div>
          </div>

          <div className="tf-stats-grid">
            <div className="tf-stat-card">
              <div className="tf-stat-icon yellow">
                <Clock3 size={18} />
              </div>
              <div className="tf-stat-content">
                <span>Pending</span>
                <strong>{stats.pending}</strong>
              </div>
            </div>

            <div className="tf-stat-card">
              <div className="tf-stat-icon blue">
                <Truck size={18} />
              </div>
              <div className="tf-stat-content">
                <span>In Transit</span>
                <strong>{stats.inTransit}</strong>
              </div>
            </div>

            <div className="tf-stat-card">
              <div className="tf-stat-icon green">
                <CheckCircle2 size={18} />
              </div>
              <div className="tf-stat-content">
                <span>Delivered</span>
                <strong>{stats.delivered}</strong>
              </div>
            </div>

            <div className="tf-stat-card">
              <div className="tf-stat-icon purple">
                <Package size={18} />
              </div>
              <div className="tf-stat-content">
                <span>Total Transfers</span>
                <strong>{stats.total}</strong>
              </div>
            </div>
          </div>

          <div className="tf-filter-row">
            <Filter size={16} className="tf-filter-icon" />

            {[
              ["all", "All"],
              ["pending", "Pending"],
              ["approved", "Approved"],
              ["in-transit", "In Transit"],
              ["delivered", "Delivered"],
              ["rejected", "Rejected"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={`tf-filter-btn ${activeFilter === key ? "active" : ""}`}
                onClick={() => setActiveFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="tf-list-wrap">
            {filteredTransfers.length === 0 ? (
              <div className="tf-empty-state">
                No transfers yet. Create your first transfer.
              </div>
            ) : (
              filteredTransfers.map((transfer) => {
                const isOpen = openId === transfer.id;

                return (
                  <div key={transfer.id} className="tf-transfer-card">
                    <div className="tf-transfer-main">
                      <div className="tf-transfer-left">
                        <div className="tf-transfer-icon">
                          <ArrowRightLeft size={18} />
                        </div>

                        <div className="tf-transfer-details">
                          <div className="tf-transfer-header">
                            <strong>{transfer.title}</strong>
                            <span className={`tf-badge ${transfer.status}`}>
                              {transfer.status}
                            </span>
                          </div>

                           <div className="tf-transfer-meta">
                            <span>{transfer.fromLab}</span>
                            <span>•</span>
                            <span>{transfer.toLab}</span>
                            <span>•</span>
                            <span>{transfer.date || "No date"}</span>
                            <span>•</span>
                            <span>{transfer.requestedBy || "Admin"}</span>
                          </div>

                          <div className="tf-transfer-footer">
                            <span>{transfer.itemsCount} item(s)</span>
                            <span>•</span>
                            <span>{transfer.totalUnits} total units</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`tf-card-more ${isOpen ? "open" : ""}`}
                        onClick={() => toggleOpen(transfer.id)}
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>

                    {isOpen && (
                      <div className="tf-transfer-expanded">
                        <div className="tf-expanded-grid">
                          <div className="tf-expanded-item">
                            <span className="tf-expanded-label">From Lab</span>
                            <strong>{transfer.fromLab}</strong>
                          </div>

                          <div className="tf-expanded-item">
                            <span className="tf-expanded-label">To Lab</span>
                            <strong>{transfer.toLab}</strong>
                          </div>

                          <div className="tf-expanded-item">
                            <span className="tf-expanded-label">Priority</span>
                            <strong>{transfer.priority}</strong>
                          </div>

                          <div className="tf-expanded-item">
                            <span className="tf-expanded-label">Status</span>
                            <strong className={`tf-expanded-status ${transfer.status}`}>
                              {transfer.status}
                            </strong>
                          </div>
                        </div>

                        <div className="tf-expanded-block">
                          <span className="tf-expanded-label">Reason</span>
                          <p>{transfer.reason}</p>
                        </div>

                        <div className="tf-expanded-block">
                          <span className="tf-expanded-label">Materials</span>

                          <div className="tf-materials-list">
                            {Array.isArray(transfer.materials) && transfer.materials.map((item) => (
                              <div key={item.id} className="tf-materials-item">
                                <span>{item.name}</span>
                                <strong>{item.quantity || item.qty}</strong>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {showCreateForm && (
        <TransferForm
          onCancel={() => setShowCreateForm(false)}
          onSubmit={handleCreateTransfer}
        />
      )}
    </div>
  );
}