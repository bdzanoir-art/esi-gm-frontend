import { useState } from "react";
import { Wrench } from "lucide-react";

export default function AddMaintenanceModal({ onClose, onSubmit, materials }) {
  const [form, setForm] = useState({
    material: "", issue: "", priority: "Low", quantity: 1
  });

  const selectedMaterial = materials.find(m => m.name === form.material);

  const handleSubmit = () => {
    if (!form.material || !form.issue || !form.quantity) return;
    onSubmit(form);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[var(--muted)] dark:bg-gray-900 rounded-2xl p-6 w-[370px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-base font-bold text-title-custom">Add to Maintenance</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
        </div>

        <div className="border-t border-[var(--br)] my-3" />

        {/* Material */}
        <div className="mb-3">
          <label className="text-xs font-medium text-small-custom mb-1 block">Material <span className="text-red-500">*</span></label>
          <select
            value={form.material}
            onChange={(e) => setForm({ ...form, material: e.target.value })}
            className="w-full border-1 border-[var(--br)] rounded-xl px-3 py-2 text-sm bg-[var(--btn-signin-bg)] text-title-custom focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a material...</option>
            {materials.map((m) => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Issue */}
        <div className="mb-3">
          <label className="text-xs font-medium text-small-custom mb-1 block">Issue <span className="text-red-500">*</span></label>
          <textarea
            placeholder="Describe the issue with the material"
            value={form.issue}
            onChange={(e) => setForm({ ...form, issue: e.target.value })}
            rows={3}
            className="w-full border-1 border-[var(--br)] rounded-xl px-3 py-2 text-sm bg-[var(--btn-signin-bg)] text-title-custom focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>

        {/* Priority */}
        <div className="mb-3">
          <label className="text-xs font-medium text-small-custom mb-1 block">Priority <span className="text-red-500">*</span></label>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="w-full border-1 border-[var(--br)] rounded-xl px-3 py-2 text-sm bg-[var(--btn-signin-bg)] text-title-custom focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Quantity */}
        <div className="mb-5">
          <label className="text-xs font-medium text-small-custom mb-1 block">Quantity to Maintenance <span className="text-red-500">*</span></label>
          <input
            type="number"
            min="1"
            max={selectedMaterial?.qty || 100}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
            className="w-full border-1 border-[var(--br)] rounded-xl px-3 py-2 text-sm bg-[var(--btn-signin-bg)] text-title-custom focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {selectedMaterial && (
            <p className="text-[10px] text-gray-500 mt-1">Available in stock: {selectedMaterial.available || selectedMaterial.qty}</p>
          )}
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
            className="flex items-center gap-2 bg-[#6366F1] hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm transition-all"
          >
            + Add to Maintenance
          </button>
        </div>
      </div>
    </div>
  );
}