import React, { useState } from 'react';
import { Search, Eye, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import './ReferralTrackingPage.css';

const ReferralTrackingPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [dateFilter, setDateFilter] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');

  const sampleReferrals = [
    {
      id: 'REF-001',
      patient: 'John Smith',
      patientId: '123 456 7890',
      condition: 'Suspicious pigmented lesion with recent changes',
      priority: 'urgent',
      status: 'urgent',
      submitted: '2025-07-20',
      lastUpdate: '2 hours ago',
      aiConfidence: 89
    },
    {
      id: 'REF-002',
      patient: 'Mary Johnson',
      patientId: '098 765 4321',
      condition: 'Basal cell carcinoma excision request',
      priority: 'routine',
      status: 'submitted',
      submitted: '2025-07-19',
      lastUpdate: '1 day ago',
      aiConfidence: 76
    },
    {
      id: 'REF-003',
      patient: 'David Wilson',
      patientId: '555 123 9876',
      condition: 'Seborrheic keratosis assessment',
      priority: 'non-priority',
      status: 'reviewed',
      submitted: '2025-07-18',
      lastUpdate: '2 days ago',
      aiConfidence: 91
    },
    {
      id: 'REF-004',
      patient: 'Sarah Thompson',
      patientId: '777 888 9999',
      condition: 'Mole changes - ABCDE criteria positive',
      priority: 'urgent',
      status: 'draft',
      submitted: '2025-07-17',
      lastUpdate: '3 days ago',
      aiConfidence: 95
    }
  ];

  const filterReferrals = () => {
    return sampleReferrals.filter(referral => {
      const matchesStatus = !selectedStatus || referral.status === selectedStatus;
      const matchesPriority = !selectedPriority || referral.priority === selectedPriority;
      const matchesSearch = !searchTerm || 
        referral.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.patientId.includes(searchTerm);
      
      return matchesStatus && matchesPriority && matchesSearch;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'urgent':
        return <AlertTriangle size={16} className="status-icon urgent" />;
      case 'submitted':
        return <Clock size={16} className="status-icon submitted" />;
      case 'reviewed':
        return <CheckCircle size={16} className="status-icon reviewed" />;
      case 'draft':
        return <Eye size={16} className="status-icon draft" />;
      default:
        return <Clock size={16} className="status-icon pending" />;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'priority-urgent';
      case 'routine':
        return 'priority-routine';
      default:
        return 'priority-non-priority';
    }
  };

  return (
    <div className="referral-tracking-page">
      <div className="page-header">
        <h1>Referral Tracking Dashboard</h1>
        <p>Monitor the status and progress of all referrals</p>
      </div>

      {/* Quick stats */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">24</div>
          <div className="metric-label">Total Referrals</div>
          <div className="metric-change positive">+3 this week</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">5</div>
          <div className="metric-label">Urgent Cases</div>
          <div className="metric-change negative">2 overdue</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">1.2</div>
          <div className="metric-label">Avg Days to Review</div>
          <div className="metric-change positive">-0.3 from last month</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">94%</div>
          <div className="metric-label">Quality Rate</div>
          <div className="metric-change positive">+2% this month</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-card">
        <div className="card-header">
          <h3>
            <Search size={20} />
            Filter Referrals
          </h3>
        </div>
        <div className="filter-row">
          <div className="filter-group">
            <label>Status</label>
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="reviewed">Under Review</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Priority</label>
            <select 
              value={selectedPriority} 
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="routine">Routine</option>
              <option value="non-priority">Non-Priority</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Date Range</label>
            <select 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Search</label>
            <input 
              type="text" 
              placeholder="Patient name or Patient ID" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Referrals list */}
      <div className="referrals-card">
        <div className="card-header">
          <h3>
            📋 Recent Referrals
          </h3>
          <button className="btn primary">
            ➕ New Referral
          </button>
        </div>
        <div className="referrals-list">
          {filterReferrals().map((referral) => (
            <div key={referral.id} className="referral-item">
              <div className="referral-main">
                <div className="referral-id">{referral.id}</div>
                <div className="referral-patient">
                  <strong>{referral.patient}</strong>
                  <span className="patient-id">Patient ID: {referral.patientId}</span>
                </div>
                <div className="referral-condition">{referral.condition}</div>
              </div>
              <div className="referral-meta">
                <span className={`priority-badge ${getPriorityClass(referral.priority)}`}>
                  {referral.priority.toUpperCase()}
                </span>
                <div className="status-cell">
                  {getStatusIcon(referral.status)}
                  <span>{referral.status.toUpperCase()}</span>
                </div>
                <div className="ai-confidence">
                  AI: {referral.aiConfidence}%
                </div>
                <div className="referral-dates">
                  <div>Submitted: {referral.submitted}</div>
                  <div>Updated: {referral.lastUpdate}</div>
                </div>
              </div>
              <div className="referral-actions">
                <button className="btn secondary small">
                  <Eye size={14} />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferralTrackingPage;
