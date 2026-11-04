import { useState, useEffect } from "react";
import { storekeeperAPI } from "../Api/api.service";

export default function AddMaterialModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "", category: "", desc: "", qty: 0, loc: "", lab: ""
  });
  const [labs, setLabs] = useState([]);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const res = await storekeeperAPI.getLaboratories();
        const rawLabs = res.data?.results || res.data || [];
        setLabs(rawLabs);
      } catch (err) {
        console.error("Failed to fetch labs:", err);
      }
    };
    fetchLabs();
  }, []);

  const handleSubmit = () => {
    if (!form.name || !form.category) return;
    onAdd({ ...form, id: Date.now(), status: "Available" });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[var(--muted)] dark:bg-gray-900 rounded-2xl p-6 w-[460px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="text-2xl font-bold text-title-custom">Add Material to Stock</h3>
            <p className="text-xs text-small-custom">Fill material information</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
        </div>

        <div className="border-t border-[var(--br)] my-3" />

        {/* Name + Category */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs font-medium text-small-custom mb-1 block">Material Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="e.g., Arduino Uno R3"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border-1 border-[var(--br)] rounded-xl px-3 py-2 text-sm bg-[var(--btn-signin-bg)] text-title-custom focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-small-custom mb-1 block">Category <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="e.g., Microcontrollers"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border-1 border-[var(--br)] rounded-xl px-3 py-2 text-sm bg-[var(--btn-signin-bg)] text-title-custom focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="text-xs font-medium text-small-custom mb-1 block">Description</label>
          <textarea
            placeholder="Brief description of the material..."
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            rows={2}
            className="w-full border-1 border-[var(--br)] rounded-xl px-3 py-2 text-sm bg-[var(--btn-signin-bg)] text-title-custom focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Qty + Location */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs font-medium text-small-custom mb-1 block">Quantity <span className="text-red-500">*</span></label>
            <input
              type="number"
              placeholder="0"
              value={form.qty}
              onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
              className="w-full border-1 border-[var(--br)] rounded-xl px-3 py-2 text-sm bg-[var(--btn-signin-bg)] text-title-custom focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-small-custom mb-1 block">Location</label>
            <input
              type="text"
              placeholder="e.g., Shelf A3"
              value={form.loc}
              onChange={(e) => setForm({ ...form, loc: e.target.value })}
              className="w-full border-1 border-[var(--br)] rounded-xl px-3 py-2 text-sm bg-[var(--btn-signin-bg)] text-title-custom focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Laboratory */}
        <div className="mb-5">
          <label className="text-xs font-medium text-small-custom mb-1 block">Laboratory <span className="text-red-500">*</span></label>
          <select
            value={form.lab}
            onChange={(e) => setForm({ ...form, lab: e.target.value })}
            className="w-full border-1 border-[var(--br)] rounded-xl px-3 py-2 text-sm bg-[var(--btn-signin-bg)] text-title-custom focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="">Select a laboratory</option>
            {labs.map((lab) => (
              <option key={lab.id} value={lab.name}>{lab.name}</option>
            ))}
            {labs.length === 0 && (
              <>
                <option value="Electronics Lab">Electronics Lab</option>
                <option value="Robotics Lab">Robotics Lab</option>
                <option value="Physics Lab">Physics Lab</option>
                <option value="General Lab">General Lab</option>
              </>
            )}
          </select>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border-1 border-[var(--br)] text-sm text-small-custom hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-[#6366F1] hover:bg-indigo-700 text-white px-8 py-2 rounded-xl text-sm font-semibold transition-all shadow-md"
          >
            Add Material
          </button>
        </div>
      </div>
    </div>
  );
}