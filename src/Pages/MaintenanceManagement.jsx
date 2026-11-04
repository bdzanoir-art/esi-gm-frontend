import React from 'react';
import Sidebar from '../Components/Sidebar';
import ThemeToggle from '../Components/ThemeToggle.jsx';
import { AlertCircle, Calendar, Wrench } from 'lucide-react';

function SummaryCard({ icon, title, value, subtitle, variant }) {
  return (
    <div className={`mm-summary-card ${variant}`}>
      <div className="mm-summary-top">
        <div className={`mm-summary-icon ${variant}`}>{icon}</div>
        <div>
          <p className="mm-summary-title">{title}</p>
          <h3 className="mm-summary-value">{value}</h3>
        </div>
      </div>
      <p className="mm-summary-subtitle">{subtitle}</p>
    </div>
  );
}

export default function MaintenanceManagement() {
  return (
    <div className="mm-layout">
      <Sidebar />

      <main className="mm-main">
        <div className="mm-topbar">
          <div>
            <h1>Maintenance Management</h1>
            <p>Monitor equipment condition and track maintenance schedules</p>
          </div>
          <ThemeToggle />
        </div>

        <section className="mm-alert-grid">
          <SummaryCard
            icon={<AlertCircle size={24} />}
            title="Needs Attention"
            value="0"
            subtitle="Materials currently under maintenance or damaged"
            variant="danger"
          />
          <SummaryCard
            icon={<Calendar size={24} />}
            title="Upcoming (30 days)"
            value="0"
            subtitle="Scheduled maintenance in the next 30 days"
            variant="warning"
          />
        </section>

        <section className="mm-history-card">
          <div className="mm-card-header">
            <Wrench size={20} />
            <h3>Maintenance History</h3>
          </div>
          <div className="mm-table-wrapper">
            <table className="mm-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Category</th>
                  <th>Last Maintenance</th>
                  <th>Next Maintenance</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody />
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
