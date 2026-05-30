import React, { useState, useEffect } from 'react';
import { X, Plus, CheckCircle2, Trash2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { submitNewRequest, validateStock } from '../Api/requests.api.js';
import { browseAPI, studentAPI, myRequestAPI } from '../Api/api.service';

const NewRequestModal = ({ isOpen, onClose, onAddRequest, dark }) => {
  //(Form State)
  const [formData, setFormData] = useState({
    project: '',
    purpose: '',
    startDate: '',
    endDate: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  // (Dynamic Materials State)
  const [materials, setMaterials] = useState([{ id: Date.now(), name: '', materialId: '', qty: 1 }]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // 3.(Validation Errors)
  const [errors, setErrors] = useState({});
  const [isValidated, setIsValidated] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        project: '',
        purpose: '',
        startDate: '',
        endDate: '',
      });
      setMaterials([{ id: Date.now(), name: '', materialId: '', qty: 1 }]);
      setIsValidated(false);
      document.body.style.overflow = 'hidden';

      // Fetch available materials from backend
      setLoadingMaterials(true);
      browseAPI.getMaterials()
        .then((res) => {
          setAvailableMaterials(res.data || []);
        })
        .catch((err) => {
          console.error('Failed to load materials:', err);
          setAvailableMaterials([]);
        })
        .finally(() => setLoadingMaterials(false));

      // Fetch student projects from backend
      setLoadingProjects(true);
      studentAPI.getProjects()
        .then((res) => {
          setProjects(res.data || []);
        })
        .catch((err) => {
          console.error('Failed to load projects:', err);
          setProjects([]);
        })
        .finally(() => setLoadingProjects(false));
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);
  if (!isOpen) return null;

  // ------
  const addMaterialField = () => {
    setMaterials([...materials, { id: Date.now(), name: '', materialId: '', qty: 1 }]);
  };

  const removeMaterialField = (id) => {
    if (materials.length > 1) {
      setMaterials(materials.filter((m) => m.id !== id));
    }
  };

  const validateForm = () => {
    let newErrors = {};

    // 1.
    if (!formData.project || !String(formData.project).trim()) newErrors.project = 'Project is required';
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date cannot be before start date';
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }

    // 2.(Materials)
    let materialHasErrors = false;
    const materialErrors = materials.map((m) => {
      let mErr = {};
      if (!m.name.trim()) {
        mErr.name = 'Name required';
        materialHasErrors = true;
      }
      if (m.qty <= 0) {
        mErr.qty = 'Qty > 0';
        materialHasErrors = true;
      }
      return mErr;
    });

    // 3. (Duplicates)
    const names = materials.map((m) => m.name.trim().toLowerCase()).filter((name) => name !== '');
    const hasDuplicates = new Set(names).size !== names.length;

    if (hasDuplicates) {
      newErrors.duplicate = 'Duplicate materials not allowed';
    }

    //State
    setErrors({ ...newErrors, materials: materialErrors });

    return Object.keys(newErrors).length === 0 && !materialHasErrors;
  };

  //  (validateForm)
  const updateMaterial = (id, field, value) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const finalValue = field === 'qty' ? parseInt(value) || 0 : value;
          return { ...m, [field]: finalValue };
        }
        return m;
      })
    );
  };

  // Update both materialId and name in a single state update
  const updateMaterialSelection = (id, materialId, name) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return { ...m, materialId, name };
        }
        return m;
      })
    );
  };

  // to Backend
  const handleSubmit = async (e) => {
    // رجعيها async
    e.preventDefault();

    if (validateForm()) {
      setSubmitting(true);
      setServerError(''); // فرغي المشاكل القديمة

      try {
        const finalSubmission = {
          project_id: parseInt(formData.project, 10),
          purpose: formData.purpose,
          start_date: formData.startDate,
          end_date: formData.endDate,
          items: materials.map((m) => ({ material_name: m.name, quantity: m.qty })),
        };

        const response = await myRequestAPI.createRequest(finalSubmission);

        // إذا نجحت العملية:
        if (onAddRequest) onAddRequest(response); // نحدثو القائمة في الصفحة الرئيسية

        alert('Request sent with success!');
        onClose(); // نغلقو المودال
      } catch (err) {
        // إذا صرا مشكل (مثلا السيرفر طافي)
        setServerError(err.message || 'Something went wrong while sending');
      } finally {
        setSubmitting(false);
      }
    }
  };
  const handleValidate = (e) => {
    if (e) e.preventDefault();
    if (validateForm()) {
      setIsValidated(true);
      setValidationMessage('✓ Quantities are in stock & dates are valid! Ready to submit.');
    } else {
      setIsValidated(false);
      setValidationMessage('Please fix the errors above before continuing.');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center bg-white/50 backdrop-blur-sm p-4 overflow-y-auto rounded-2xl ${
        dark ? 'bg-[#1E293B]/70 backdrop-blur-sm' : 'bg-[#F1F5F9]/70 backdrop-blur-sm'
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative rounded-2xl border ${dark ? 'bg-[#0A1128] border-[#2B4C9F]' : 'bg-[#FFF] border-[#E2E8F0]'} rounded-2xl w-full max-w-md sm:max-w-xl md:max-w-2xl shadow-2xl my-5 mx-auto`}
      >
        <div
          className={`${dark ? 'bg-[#0A1128]' : 'bg-white'} rounded-2xl z-10 flex justify-between items-center p-6`}
        >
          <h2 className={`text-xl font-bold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}>
            New Material Request
          </h2>
          <button
            onClick={onClose}
            className={`${dark ? 'text-[#94A3B8] bg-[#0A1128]' : 'text-[#64748B] bg-[#FFF]'} hover:text-gray-600`}
          >
            <X size={24} />
          </button>
        </div>

        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {/**/}
          <div>
            <label
              className={`flex items-start block text-sm font-semibold mb-1 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
            >
              Project *
            </label>
            <select
              className={`w-full px-4 py-3 ${dark ? 'bg-[#020817] text-[#E8EAF0]' : 'bg-[#F8FAFC] text-[#0F172A]'} rounded-xl outline-none border border-transparent focus:border-gray-200 ${
                errors.project ? 'border-red-500' : ''
              }`}
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            >
              <option value="">-- Select your project --</option>
              {loadingProjects ? (
                <option disabled>Loading projects...</option>
              ) : (
                projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name || p.title}</option>
                ))
              )}
            </select>
            {errors.project && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.project}
              </p>
            )}
          </div>

          {/**/}
          <div>
            <label
              className={`flex items-start block text-sm font-semibold mb-1 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
            >
              Purpose *
            </label>
            <textarea
              placeholder="Explain why you need these materials..."
              rows="3"
              className={`w-full resize-none px-4 py-3 px-4 py-3 ${dark ? 'bg-[#020817]' : 'bg-[#F8FAFC]'} border rounded-xl border-transparent outline-none focus:border-gray-200 ${errors.purpose ? 'border-red-500' : ''}`}
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            ></textarea>
            {errors.purpose && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.purpose}
              </p>
            )}
          </div>

          {/* dates*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="flex flex-col items-start">
              <label
                className={`block text-sm font-semibold mb-1 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
              >
                Start Date
              </label>
              <input
                type="date"
                className={`w-full px-4 py-3 ${dark ? 'bg-[#020817] text-[#94A3B8]' : 'bg-[#F8FAFC] text-[#64748B]'} border border-transparent rounded-xl`}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.startDate}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="flex flex-col items-start">
              <label
                className={`block text-sm font-semibold mb-1 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
              >
                End Date
              </label>
              <input
                type="date"
                className={`w-full px-4 py-3 ${dark ? 'bg-[#020817] text-[#94A3B8]' : 'bg-[#F8FAFC] text-[#64748B]'} border border-transparent rounded-xl`}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* materials*/}
          <div className="space-y-3">
            <label
              className={`flex items-start block text-sm font-semibold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}
            >
              Materials *
            </label>
            {materials.map((mat, index) => {
              // Find selected material to show stock info
              const selectedMat = availableMaterials.find(
                (m) => String(m.id) === String(mat.materialId)
              );
              const maxQty = selectedMat ? (selectedMat.quantity || selectedMat.quantity_available || 999) : 999;

              return (
              <div
                key={mat.id}
                className={`flex flex-col sm:flex-row border ${dark ? 'border-[#2B4C9F]' : 'border-[#E2E8F0]'} rounded-xl p-3 gap-2 animate-in slide-in-from-top-1 duration-200`}
              >
                <div className="flex-1 flex flex-col">
                  <select
                    value={mat.materialId}
                    onChange={(e) => {
                      const selId = e.target.value;
                      const selMat = availableMaterials.find((m) => String(m.id) === selId);
                      updateMaterialSelection(mat.id, selId, selMat ? (selMat.name || selMat.title) : '');
                    }}
                    className={`flex-1 w-full sm:w-auto px-4 py-3 ${dark ? 'bg-[#020817] text-[#E8EAF0]' : 'bg-[#F8FAFC] text-[#0F172A]'} rounded-xl outline-none border border-transparent transition-all`}
                  >
                    <option value="">-- Select a material --</option>
                    {loadingMaterials ? (
                      <option disabled>Loading materials...</option>
                    ) : (
                      availableMaterials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name || m.title} (Qty: {m.quantity ?? m.quantity_available ?? '?'})
                        </option>
                      ))
                    )}
                  </select>
                  {errors.materials && errors.materials[index]?.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.materials[index].name}
                    </p>
                  )}
                </div>
                <div className="flex flex-col w-24 sm:w-auto">
                  <input
                    type="number"
                    min="1"
                    max={maxQty}
                    value={mat.qty}
                    onChange={(e) => {
                      let value = parseInt(e.target.value) || 0;
                      if (value > maxQty) value = maxQty;
                      updateMaterial(mat.id, 'qty', value);
                    }}
                    className={`w-24 w-full sm:w-auto px-2 py-3 ${dark ? 'bg-[#020817] text-[#94A3B8]' : 'bg-[#F8FAFC] text-[#64748B]'} rounded-xl text-center border border-transparent outline-none`}
                  />
                  {selectedMat && (
                    <p className={`text-xs mt-1 ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Max: {maxQty}</p>
                  )}
                  {mat.qty <= 0 && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {'Qty must be > 0'}
                    </p>
                  )}
                </div>
                {mat.error && <p className="text-xs text-red-500 mt-1">{mat.error}</p>}
                {materials.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMaterialField(mat.id)}
                    className="p-2 text-gray-400 border border-transparent hover:border-gray-400 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
              );
            })}

            <button
              onClick={addMaterialField}
              className="mt-2 flex items-center bg-transparent focus:outline-none gap-2 text-[#2B4C9F] text-sm font-inter"
            >
              <Plus size={16} /> Add Another Material
            </button>
          </div>

          <div className="space-y-4 pt-4 border-t dark:border-[#2B4C9F] mt-4">
            <button
              type="button"
              onClick={handleValidate}
              className={`flex justify-center items-center gap-2 w-full px-6 py-3.5 font-bold rounded-xl border transition-all duration-200 shadow-sm
                ${dark 
                  ? 'bg-slate-800 border-[#2B4C9F] text-[#E8EAF0] hover:bg-slate-700' 
                  : 'bg-slate-50 border-[#E2E8F0] text-slate-900 hover:bg-slate-100'}`}
            >
              <CheckCircle2 size={18} />
              Validate Stock Availability
            </button>

            {validationMessage && (
              <div className={`p-3 rounded-xl text-xs font-semibold text-center animate-in fade-in slide-in-from-top-2
                ${isValidated ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {validationMessage}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={!isValidated || submitting}
                className={`flex-[2] py-3.5 rounded-xl font-bold transition-all duration-200 shadow-lg
                  ${isValidated 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20 hover:-translate-y-0.5' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'}`}
              >
                {submitting ? 'Creating Request...' : 'Submit Request'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-3.5 border rounded-xl font-bold transition-all
                  ${dark ? 'bg-transparent border-[#2B4C9F] text-[#E8EAF0] hover:bg-slate-800' : 'bg-white border-[#E2E8F0] text-slate-900 hover:bg-slate-50'}`}
              >
                Cancel
              </button>
            </div>
          </div>

          {serverError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {serverError}
            </div>
          )}
        </form>
        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}
      </div>
    </div>
  );
};

export default NewRequestModal;
