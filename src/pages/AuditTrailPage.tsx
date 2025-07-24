import React, { useState } from 'react';
import { Shield, Search, Download } from 'lucide-react';
import './AuditTrailPage.css';

const AuditTrailPage: React.FC = () => {
  const [userFilter, setUserFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('today');

  const auditEntries = [
    {
      id: 1,
      action: 'Assessment completed for patient NHS 123456789',
      user: 'Dr. Sarah Chen',
      time: '2 hours ago',
      details: 'IP: 192.168.1.100 • Priority: URGENT',
      type: 'assessment',
      icon: '✅',
      iconColor: '#007f3b'
    },
    {
      id: 2,
      action: 'Referral submitted to Plastic Surgery',
      user: 'Dr. Sarah Chen',
      time: '3 hours ago',
      details: 'Ref: PLT-2025-0847',
      type: 'referral',
      icon: '📤',
      iconColor: '#005EB8'
    },
    {
      id: 3,
      action: 'Patient record updated with NHS Spine data',
      user: 'System',
      time: '4 hours ago',
      details: 'Data source: PDS API',
      type: 'update',
      icon: '🔄',
      iconColor: '#ffb81c'
    },
    {
      id: 4,
      action: 'Patient data accessed for assessment',
      user: 'Dr. James Wilson',
      time: '1 day ago',
      details: 'NHS: 123456789',
      type: 'access',
      icon: '👁️',
      iconColor: '#005EB8'
    },
    {
      id: 5,
      action: 'Secure message sent to Plastic Surgery team',
      user: 'Dr. Sarah Chen',
      time: '1 day ago',
      details: 'Message ID: MSG-789',
      type: 'message',
      icon: '💬',
      iconColor: '#007f3b'
    }
  ];

  const filterEntries = () => {
    return auditEntries.filter(entry => {
      const matchesUser = !userFilter || entry.user === userFilter;
      const matchesAction = !actionFilter || entry.type === actionFilter;
      // For simplicity, not implementing date filtering logic here
      return matchesUser && matchesAction;
    });
  };

  return (
    <div className="audit-trail-page">
      <div className="page-header">
        <h1>
          <Shield className="page-icon" />
          Audit Trail
        </h1>
        <p>Complete audit log for governance and quality improvement</p>
      </div>

      {/* Audit Filters */}
      <div className="filters-card">
        <div className="card-header">
          <h3>
            <Search size={20} />
            Audit Filters
          </h3>
        </div>
        <div className="filter-row">
          <div className="filter-group">
            <label>User</label>
            <select 
              value={userFilter} 
              onChange={(e) => setUserFilter(e.target.value)}
            >
              <option value="">All Users</option>
              <option value="Dr. Sarah Chen">Dr. Sarah Chen</option>
              <option value="Dr. James Wilson">Dr. James Wilson</option>
              <option value="System">System</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Action Type</label>
            <select 
              value={actionFilter} 
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="">All Actions</option>
              <option value="assessment">Assessment Created</option>
              <option value="referral">Referral Submitted</option>
              <option value="update">Record Updated</option>
              <option value="access">Data Accessed</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Date Range</label>
            <select 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
          </div>
          <div className="filter-group">
            <label style={{ opacity: 0 }}>Actions</label>
            <button className="btn primary">
              <Search size={16} />
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="audit-log-card">
        <div className="card-header">
          <h3>
            📋 Audit Log Entries
          </h3>
          <button className="btn secondary">
            <Download size={16} />
            Export Log
          </button>
        </div>
        <div className="audit-entries">
          {filterEntries().map((entry) => (
            <div key={entry.id} className="audit-item">
              <div 
                className="audit-icon" 
                style={{ backgroundColor: entry.iconColor }}
              >
                {entry.icon}
              </div>
              <div className="audit-content">
                <div className="audit-action">{entry.action}</div>
                <div className="audit-meta">
                  {entry.user} • {entry.time} • {entry.details}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditTrailPage;
