import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { Icon } from "../Components/Icon";
import { adminAPI } from "../Api/api.service";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Real data states
  const [stats, setStats] = useState([
    { title: "Total Materials", value: 0, note: "Loading...", iconKey: "inventory", iconColor: "#6ea8ff" },
    { title: "Available Items", value: 0, note: "Loading...", iconKey: "package", iconColor: "#20c997" },
    { title: "Pending Requests", value: 0, note: "Loading...", iconKey: "requests", iconColor: "#e8ab2f" },
    { title: "Maintenance Alerts", value: 0, note: "Loading...", iconKey: "maintenance", iconColor: "#ff6b81" },
  ]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState({ admins: 0, storekeepers: 0, students: 0 });
  const [categoryData, setCategoryData] = useState({ labels: [], counts: [] });
  const [statusData, setStatusData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    // 1. Fetch Stats & Category Chart
    try {
      const statsRes = await adminAPI.getStats();
      const dashboardStats = statsRes.data || {};
      
      // Map the "stats" array from backend to the top cards
      if (dashboardStats.stats) {
        setStats(prev => prev.map(card => {
          const match = dashboardStats.stats.find(s => s.title === card.title);
          return match ? { ...card, value: match.value, note: match.note } : card;
        }));
      } else {
        // Backup: Use direct keys if "stats" array is missing
        setStats(prev => prev.map(card => {
          if (card.title === "Total Materials") return { ...card, value: dashboardStats.total_materials || 0, note: "Updated" };
          if (card.title === "Available Items") return { ...card, value: dashboardStats.available_items || 0, note: "Updated" };
          if (card.title === "Pending Requests") return { ...card, value: dashboardStats.pending_requests || 0, note: "Updated" };
          return card;
        }));
      }
      
      // Update charts
      if (dashboardStats.charts) {
        if (dashboardStats.charts.by_category) {
          setCategoryData(dashboardStats.charts.by_category);
        }
        if (dashboardStats.charts.by_status) {
          setStatusData(dashboardStats.charts.by_status);
        }
      }
    } catch (err) {
      console.warn('Dashboard stats fetch failed:', err);
    }

    // 2. Fetch Requests
    try {
      const requestsRes = await adminAPI.getRequests();
      const requestsData = requestsRes.data.results || requestsRes.data || [];
      const formattedRequests = (Array.isArray(requestsData) ? requestsData : []).slice(0, 5).map(req => ({
        title: req.project_name || req.project || "Unknown Project",
        user: req.requested_by || req.user || "Unknown User",
        meta: `${req.items_count || req.items || 0} item(s) • ${req.created_at ? new Date(req.created_at).toLocaleDateString() : 'N/A'}`,
        status: req.status || "Pending",
      }));
      setRequests(formattedRequests);
    } catch (err) {
      console.warn('Dashboard requests fetch failed:', err);
      setRequests([]);
    }

    // 3. Fetch Users for Overview
    try {
      const usersRes = await adminAPI.getUsers();
      const usersData = usersRes.data.results || usersRes.data || [];
      const userCounts = { admins: 0, storekeepers: 0, students: 0 };
      if (Array.isArray(usersData)) {
        usersData.forEach(user => {
          const role = (user.role || '').toLowerCase();
          if (role === 'admin' || role === 'superadmin' || role === 'lab admin') userCounts.admins++;
          else if (role === 'storekeeper') userCounts.storekeepers++;
          else userCounts.students++;
        });
      }
      setUsers(userCounts);
    } catch (err) {
      console.warn('Dashboard users fetch failed:', err);
    }

    // 4. Fetch Alerts
    try {
      const alertsRes = await adminAPI.getAlerts();
      const alertsData = alertsRes.data.results || alertsRes.data || [];
      // Update the Maintenance Card from Stats
      setAlerts(alertsData);
      setStats(prev => prev.map(card => {
        if (card.title === "Maintenance Alerts") {
          return { ...card, value: alertsData.length, note: alertsData.length > 0 ? `${alertsData.length} active` : "No active alerts" };
        }
        return card;
      }));
    } catch (err) {
      console.warn('Dashboard alerts fetch failed:', err);
    }

    setLoading(false);
  };

function StatCard({ item }) {
  const IconComponent = Icon[item.iconKey] || Icon.package;

  return (
    <div className="card stat-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <div>
          <p className="small muted">{item.title}</p>
          <h3>{item.value}</h3>
          <p
            className="success-text"
            style={{ visibility: item.note ? "visible" : "hidden" }}
          >
            {item.note || "."}
          </p>
        </div>

        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "10px",
            border: "1px solid var(--border)",
            display: "grid",
            placeItems: "center",
            color: item.iconColor,
            background: "var(--card-2)",
          }}
        >
          <IconComponent size={18} />
        </div>
      </div>
    </div>
  );
}

function CategoryChart({ data }) {
  const counts = data.counts || [];
  const labels = data.labels || [];
  const max = Math.max(...(counts.length > 0 ? counts : [1]));

  return (
    <div className="card chart-card">
      <h4>Materials by Category</h4>

      <div className="bar-chart-container" style={{ overflowX: 'auto', paddingBottom: '10px' }}>
        <div className="bar-chart" style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '12px', minWidth: '400px' }}>
          {counts.map((value, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div
                className="bar"
                title={`${labels[index]}: ${value}`}
                style={{ 
                  height: `${(value / max) * 140}px`, 
                  width: '24px', 
                  background: 'var(--blue)', 
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  transition: 'all 0.3s ease'
                }}
              />
              {labels[index] && (
                 <span className="small muted" style={{ fontSize: '10px', whiteSpace: 'nowrap', maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>
                   {labels[index]}
                 </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  const colors = { 'Available': '#20c997', 'In Use': '#6ea8ff', 'Under Maintenance': '#ff6b81' };
  
  let currentPos = 0;
  const gradientParts = data.map((item, idx) => {
    const start = currentPos;
    const end = currentPos + (total > 0 ? (item.count / total) * 100 : 0);
    currentPos = end;
    return `${colors[item.status] || '#94a3b8'} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div className="card chart-card">
      <h4>Materials by Status</h4>

      <div className="pie-wrap" style={{ display: 'flex', alignItems: 'center', gap: '30px', marginTop: '10px' }}>
        <div className="status-legend" style={{ flex: 1 }}>
          {data.map((item, idx) => {
            const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;
            return (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                <span className="muted" style={{ fontWeight: '500' }}>{item.status}</span>
                <span style={{ color: colors[item.status] || '#94a3b8', fontWeight: 'bold' }}>{percent}%</span>
              </div>
            );
          })}
        </div>
        
        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
          <div 
            className="pie-circle" 
            style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '50%', 
              background: `conic-gradient(${gradientParts || '#94a3b8 0% 100%'})`,
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} 
          >
             {/* Donut Hole */}
             <div style={{
               position: 'absolute',
               width: '60%',
               height: '60%',
               backgroundColor: 'var(--card)',
               borderRadius: '50%',
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               boxShadow: 'inset 0 4px 6px -1px rgb(0 0 0 / 0.1)'
             }}>
               <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--title)' }}>{total}</span>
               <span style={{ fontSize: '8px', color: 'var(--small)', textTransform: 'uppercase' }}>Total</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentRequests({ requests }) {
  return (
    <div className="card list-card">
      <h4>Recent Requests</h4>

      <div className="request-list">
        {requests.length > 0 ? requests.map((item, index) => (
          <div className="request-item" key={index}>
            <div>
              <h5>{item.title}</h5>
              <p className="muted small">{item.user}</p>
              <p className="muted small">{item.meta}</p>
            </div>

            <span className={`badge ${item.status.toLowerCase()}`}>
              {item.status}
            </span>
          </div>
        )) : (
          <div className="empty-box">No recent requests</div>
        )}
      </div>
    </div>
  );
}

function MaintenanceAlerts({ alerts }) {
  return (
    <div className="card list-card">
      <h4>Maintenance Alerts</h4>
      <div className="request-list">
        {alerts.length > 0 ? (
          alerts.map((item, index) => (
            <div className="request-item" key={index}>
              <div>
                <h5>{item.material_name || item.material_title || "Unknown Material"}</h5>
                <p className="muted small">{item.message || "No description"}</p>
                <p className="muted small">Qty: {item.quantity || 1} • {new Date(item.created_at).toLocaleDateString()}</p>
              </div>

              <span className={`badge ${item.priority?.toLowerCase() || 'medium'}`}>
                {item.priority}
              </span>
            </div>
          ))
        ) : (
          <div className="empty-box">No active alerts</div>
        )}
      </div>
    </div>
  );
}

function UserOverview({ users }) {
  return (
    <div className="card overview-card">
      <h4>User Overview</h4>

      <div className="overview-grid">
        <div>
          <h3 className="blue">{users.admins}</h3>
          <p className="small muted">Lab Admins</p>
        </div>

        <div>
          <h3 className="purple">{users.storekeepers}</h3>
          <p className="small muted">Storekeepers</p>
        </div>

        <div>
          <h3 className="green">{users.students}</h3>
          <p className="small muted">Students</p>
        </div>
      </div>
    </div>
  );
}

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="main-content">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <div className="topbar">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="muted">
              Overview of laboratory operations and analytics
            </p>
          </div>
        </div>

        {error && (
          <div className="error-banner" style={{ 
            background: '#fee2e2', 
            color: '#dc2626', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '16px' 
          }}>
            {error}
            <button 
              onClick={fetchDashboardData}
              style={{ marginLeft: '12px', textDecoration: 'underline' }}
            >
              Retry
            </button>
          </div>
        )}

        <section className="stats-grid">
          {stats.map((item) => (
            <StatCard key={item.title} item={item} />
          ))}
        </section>

        <section className="grid-2">
          <CategoryChart data={categoryData} />
          <StatusChart data={statusData} />
        </section>

        <section className="grid-2">
          <RecentRequests requests={requests} />
          <MaintenanceAlerts alerts={alerts} />
        </section>

        <section>
          <UserOverview users={users} />
        </section>
      </main>
    </div>
  );
}