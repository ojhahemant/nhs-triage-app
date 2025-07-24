import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  Activity,
  Download,
  RefreshCw
} from 'lucide-react';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <div className="dashboard-page">
      {/* Header with controls */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>
            <BarChart3 className="page-icon" />
            Triage Analytics Dashboard
          </h1>
          <p>Comprehensive metrics and performance insights</p>
        </div>
        <div className="header-actions">
          <select 
            value={selectedTimeframe} 
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="timeframe-select"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <button className="btn secondary" onClick={handleRefresh}>
            <RefreshCw size={16} className={refreshing ? 'spin' : ''} />
            Refresh
          </button>
          <button className="btn primary">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card urgent">
          <div className="metric-icon">
            <Activity size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">247</div>
            <div className="metric-label">Total Assessments</div>
            <div className="metric-change positive">+23% vs last month</div>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">
            <CheckCircle size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">94.2%</div>
            <div className="metric-label">AI Accuracy Rate</div>
            <div className="metric-change positive">+1.2% improvement</div>
          </div>
        </div>

        <div className="metric-card routine">
          <div className="metric-icon">
            <Clock size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">1.8 hrs</div>
            <div className="metric-label">Avg Processing Time</div>
            <div className="metric-change positive">-0.3 hrs faster</div>
          </div>
        </div>

        <div className="metric-card info">
          <div className="metric-icon">
            <Users size={24} />
          </div>
          <div className="metric-content">
            <div className="metric-value">4.7/5.0</div>
            <div className="metric-label">User Satisfaction</div>
            <div className="metric-change positive">+0.2 rating</div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="analytics-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Assessment Volume Trends</h3>
            <select>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="chart-container">
            <div className="volume-chart">
              <div className="chart-y-axis">
                <div className="y-label">60</div>
                <div className="y-label">45</div>
                <div className="y-label">30</div>
                <div className="y-label">15</div>
                <div className="y-label">0</div>
              </div>
              <div className="chart-area">
                <div className="chart-grid">
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                  <div className="grid-line"></div>
                </div>
                <div className="chart-bars">
                  <div className="bar-group">
                    <div className="bar urgent" style={{height: '40%'}} title="Urgent: 12 assessments"></div>
                    <div className="bar routine" style={{height: '65%'}} title="Routine: 19 assessments"></div>
                    <div className="bar non-priority" style={{height: '25%'}} title="Non-priority: 7 assessments"></div>
                    <div className="bar-label">Jul 18</div>
                  </div>
                  <div className="bar-group">
                    <div className="bar urgent" style={{height: '35%'}} title="Urgent: 10 assessments"></div>
                    <div className="bar routine" style={{height: '70%'}} title="Routine: 21 assessments"></div>
                    <div className="bar non-priority" style={{height: '30%'}} title="Non-priority: 9 assessments"></div>
                    <div className="bar-label">Jul 19</div>
                  </div>
                  <div className="bar-group">
                    <div className="bar urgent" style={{height: '50%'}} title="Urgent: 15 assessments"></div>
                    <div className="bar routine" style={{height: '80%'}} title="Routine: 24 assessments"></div>
                    <div className="bar non-priority" style={{height: '20%'}} title="Non-priority: 6 assessments"></div>
                    <div className="bar-label">Jul 20</div>
                  </div>
                  <div className="bar-group">
                    <div className="bar urgent" style={{height: '30%'}} title="Urgent: 9 assessments"></div>
                    <div className="bar routine" style={{height: '60%'}} title="Routine: 18 assessments"></div>
                    <div className="bar non-priority" style={{height: '35%'}} title="Non-priority: 10 assessments"></div>
                    <div className="bar-label">Jul 21</div>
                  </div>
                  <div className="bar-group">
                    <div className="bar urgent" style={{height: '45%'}} title="Urgent: 13 assessments"></div>
                    <div className="bar routine" style={{height: '85%'}} title="Routine: 25 assessments"></div>
                    <div className="bar non-priority" style={{height: '40%'}} title="Non-priority: 12 assessments"></div>
                    <div className="bar-label">Jul 22</div>
                  </div>
                  <div className="bar-group">
                    <div className="bar urgent" style={{height: '55%'}} title="Urgent: 16 assessments"></div>
                    <div className="bar routine" style={{height: '75%'}} title="Routine: 22 assessments"></div>
                    <div className="bar non-priority" style={{height: '28%'}} title="Non-priority: 8 assessments"></div>
                    <div className="bar-label">Jul 23</div>
                  </div>
                  <div className="bar-group active">
                    <div className="bar urgent" style={{height: '60%'}} title="Urgent: 18 assessments"></div>
                    <div className="bar routine" style={{height: '90%'}} title="Routine: 27 assessments"></div>
                    <div className="bar non-priority" style={{height: '45%'}} title="Non-priority: 13 assessments"></div>
                    <div className="bar-label">Today</div>
                  </div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color urgent"></div>
                    <span>Urgent Priority</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color routine"></div>
                    <span>Routine Priority</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color non-priority"></div>
                    <span>Non-Priority</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Priority Distribution</h3>
          </div>
          <div className="chart-container">
            <div className="priority-chart">
              <div className="priority-pie">
                <div className="pie-center">247</div>
              </div>
              <div className="priority-legend">
                <div className="legend-item">
                  <div className="legend-color urgent"></div>
                  <span>Urgent (20%)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color routine"></div>
                  <span>Routine (60%)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color non-priority"></div>
                  <span>Non-Priority (20%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Performance Metrics */}
      <div className="ai-performance-card">
        <div className="card-header">
          <h3>AI Model Performance</h3>
        </div>
        <div className="ai-metrics-grid">
          <div className="ai-metric">
            <div className="ai-metric-value success">94.2%</div>
            <div className="ai-metric-label">Accuracy</div>
          </div>
          <div className="ai-metric">
            <div className="ai-metric-value primary">87.5%</div>
            <div className="ai-metric-label">Sensitivity</div>
          </div>
          <div className="ai-metric">
            <div className="ai-metric-value warning">92.1%</div>
            <div className="ai-metric-label">Specificity</div>
          </div>
          <div className="ai-metric">
            <div className="ai-metric-value success">89.8%</div>
            <div className="ai-metric-label">F1 Score</div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Alerts */}
      <div className="activity-grid">
        <div className="activity-card">
          <div className="activity-header">
            <h3>Recent System Activity</h3>
            <span className="activity-count">12 updates in last hour</span>
          </div>
          <div className="activity-list">
            <div className="activity-item urgent">
              <div className="activity-icon">
                <AlertTriangle size={16} />
              </div>
              <div className="activity-content">
                <div className="activity-text">Assessment completed for patient ID 123456789</div>
                <div className="activity-time">Dr. Sarah Chen • 2 hours ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <CheckCircle size={16} />
              </div>
              <div className="activity-content">
                <div className="activity-text">Referral submitted to Plastic Surgery</div>
                <div className="activity-time">Dr. Sarah Chen • 3 hours ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <Users size={16} />
              </div>
              <div className="activity-content">
                <div className="activity-text">Patient record updated with Healthcare system data</div>
                <div className="activity-time">System • 4 hours ago</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <Calendar size={16} />
              </div>
              <div className="activity-content">
                <div className="activity-text">Patient data accessed for assessment</div>
                <div className="activity-time">Dr. James Wilson • 1 day ago</div>
              </div>
            </div>
          </div>
        </div>

        <div className="alerts-card">
          <div className="alerts-header">
            <h3>System Alerts</h3>
            <button className="btn secondary small">View All</button>
          </div>
          <div className="alerts-list">
            <div className="alert-item warning">
              <div className="alert-content">
                <div className="alert-title">5 urgent referrals requiring review</div>
                <div className="alert-description">Priority cases need attention within 24 hours</div>
              </div>
              <button className="btn primary small">Review</button>
            </div>
            <div className="alert-item info">
              <div className="alert-content">
                <div className="alert-title">AI accuracy rate improved</div>
                <div className="alert-description">+1.2% improvement in clinical agreement</div>
              </div>
              <button className="btn secondary small">Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
