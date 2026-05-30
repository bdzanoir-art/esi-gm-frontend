import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowLeft, Package, Tag, Layers, AlertCircle, RefreshCw } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import { browseAPI } from '../Api/api.service';
import '../hook/StudentDash.css';
import '../hook/BrowseMaterials.css';

// ─── Skeleton card shown while loading ───────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="browse-card browse-card--skeleton">
      <div className="skeleton skeleton--thumb" />
      <div className="browse-card__body">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--text skeleton--text-sm" />
        <div className="skeleton skeleton--badge" />
      </div>
    </div>
  );
}

// ─── Single material card ─────────────────────────────────────────────────────
function MaterialCard({ material, onClick }) {
  const available = material.quantity > 0;
  return (
    <div
      className="browse-card"
      onClick={() => onClick(material)}
      title={material.title}
    >
      {/* Thumbnail / icon */}
      <div className="browse-card__thumb">
        {material.image ? (
          <img src={material.image} alt={material.title} className="browse-card__img" />
        ) : (
          <Package size={36} className="browse-card__icon" />
        )}
      </div>

      <div className="browse-card__body">
        <h3 className="browse-card__title">{material.title}</h3>
        {material.description && (
          <p className="browse-card__desc">{material.description}</p>
        )}

        <div className="browse-card__meta">
          {material.category_name && (
            <span className="browse-badge browse-badge--cat">
              <Tag size={11} /> {material.category_name}
            </span>
          )}
          <span className={`browse-badge ${available ? 'browse-badge--ok' : 'browse-badge--out'}`}>
            {available ? `${material.quantity} available` : 'Out of stock'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Detail modal ─────────────────────────────────────────────────────────────
function MaterialDetailModal({ material, onClose }) {
  if (!material) return null;
  const available = material.quantity > 0;

  return (
    <div className="browse-modal-overlay" onClick={onClose}>
      <div className="browse-modal" onClick={(e) => e.stopPropagation()}>
        <button className="browse-modal__close" onClick={onClose}><X size={18} /></button>

        <div className="browse-modal__thumb">
          {material.image
            ? <img src={material.image} alt={material.title} />
            : <Package size={56} className="browse-card__icon" />}
        </div>

        <div className="browse-modal__body">
          <h2 className="browse-modal__title">{material.title}</h2>

          {material.description && (
            <p className="browse-modal__desc">{material.description}</p>
          )}

          <div className="browse-modal__row">
            <span className="browse-modal__label"><Tag size={13} /> Category</span>
            <span className="browse-modal__value">{material.category_name || '—'}</span>
          </div>
          <div className="browse-modal__row">
            <span className="browse-modal__label"><Layers size={13} /> Quantity</span>
            <span className={`browse-badge ${available ? 'browse-badge--ok' : 'browse-badge--out'}`}>
              {available ? `${material.quantity} in stock` : 'Out of stock'}
            </span>
          </div>
          {material.location && (
            <div className="browse-modal__row">
              <span className="browse-modal__label">Location</span>
              <span className="browse-modal__value">{material.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function BrowseMaterials() {
  const navigate = useNavigate();

  const [materials, setMaterials]     = useState([]);
  const [categories, setCategories]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [search, setSearch]           = useState('');
  const [activeCategory, setCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'instock', 'outstock'
  const [selected, setSelected]       = useState(null);   // detail modal

  // Debounced fetch whenever search or category changes
  const fetchMaterials = useCallback(async (searchVal, catVal, statusVal) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchVal) params.search = searchVal;
      if (catVal && catVal !== 'all') params.category = catVal;
      if (statusVal && statusVal !== 'all') params.status = statusVal;

      const res = await browseAPI.getMaterials(params);
      setMaterials(res.data || []);
    } catch (err) {
      console.error('Browse materials error:', err);
      setError('Failed to load materials. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load categories once on mount
  useEffect(() => {
    browseAPI.getCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  // Debounce search input (300 ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMaterials(search, activeCategory, statusFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, activeCategory, statusFilter, fetchMaterials]);

  const handleCategoryChange = (key) => {
    setCategory(key);
  };

  const clearSearch = () => setSearch('');

  return (
    <div className="flex h-screen dynamic-bg transition-colors duration-300" style={{ fontFamily: 'Inter' }}>
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-7">
        <div className="max-w-5xl mx-auto">

          {/* ── Header ── */}
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/student')}
              className="p-2 rounded-xl hover:bg-black/5 transition-colors text-small-custom"
              title="Back to dashboard"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-title-custom">Browse Materials</h1>
              <p className="text-sm text-small-custom">Search and explore available laboratory materials</p>
            </div>
          </div>

          {/* ── Search bar ── */}
          <div className="relative mb-5">
            <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-small-custom" />
            <input
              id="browse-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search materials by name or description…"
              className="browse-search-input"
            />
            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-small-custom hover:text-title-custom"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* ── Filter Controls ── */}
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-6">
            
            {/* Category pills */}
            <div className="flex-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-small-custom mb-3 opacity-70">Category</h3>
              <div className="browse-filters">
                <button
                  key="all"
                  className={`browse-filter-pill ${activeCategory === 'all' ? 'browse-filter-pill--active' : ''}`}
                  onClick={() => handleCategoryChange('all')}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.key || cat.id}
                    className={`browse-filter-pill ${activeCategory === (cat.key || cat.id) ? 'browse-filter-pill--active' : ''}`}
                    onClick={() => handleCategoryChange(cat.key || cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Status pills */}
            <div className="shrink-0">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-small-custom mb-3 opacity-70">Stock Status</h3>
              <div className="browse-filters">
                <button
                  className={`browse-filter-pill ${statusFilter === 'all' ? 'browse-filter-pill--active' : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </button>
                <button
                  className={`browse-filter-pill ${statusFilter === 'available' ? 'browse-filter-pill--active' : ''}`}
                  onClick={() => setStatusFilter('available')}
                >
                  Available
                </button>
                <button
                  className={`browse-filter-pill ${statusFilter === 'in use' ? 'browse-filter-pill--active' : ''}`}
                  onClick={() => setStatusFilter('in use')}
                >
                  In Use
                </button>
                <button
                  className={`browse-filter-pill ${statusFilter === 'maintenance' ? 'browse-filter-pill--active' : ''}`}
                  onClick={() => setStatusFilter('maintenance')}
                >
                  Maintenance
                </button>
                <button
                  className={`browse-filter-pill ${statusFilter === 'unavailable' ? 'browse-filter-pill--active' : ''}`}
                  onClick={() => setStatusFilter('unavailable')}
                >
                  Unavailable
                </button>
              </div>
            </div>
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              <AlertCircle size={18} />
              <span className="flex-1 text-sm">{error}</span>
              <button
                onClick={() => fetchMaterials(search, activeCategory, statusFilter)}
                className="flex items-center gap-1 text-sm underline hover:no-underline"
              >
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          )}

          {/* ── Grid ── */}
          <div className="browse-grid">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : materials.length > 0
                ? materials.map((m) => (
                    <MaterialCard key={m.id} material={m} onClick={setSelected} />
                  ))
                : (
                  <div className="col-span-full text-center py-16 text-small-custom">
                    <Package size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-base font-medium">No materials found</p>
                    <p className="text-sm mt-1">Try adjusting your search or category filter.</p>
                  </div>
                )
            }
          </div>

          {/* ── Results count ── */}
          {!loading && !error && materials.length > 0 && (
            <p className="text-xs text-small-custom text-center mt-6">
              Showing {materials.length} material{materials.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </main>

      {/* ── Detail Modal ── */}
      {selected && (
        <MaterialDetailModal material={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
