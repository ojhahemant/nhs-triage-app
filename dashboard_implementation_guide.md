# Dashboard Implementation Guide for AI Coding Agent

## 🎯 CRITICAL MISSION
Replace the current placeholder dashboard with a comprehensive, functional dashboard that matches EXACT stakeholder requirements. This is the #1 priority feature that users see first.

---

## 📊 EXACT DASHBOARD LAYOUT SPECIFICATION

### Master Dashboard Grid Layout
```jsx
// EXACT layout structure - DO NOT DEVIATE
<div className="dashboard-page">
  <div className="dashboard-container">
    
    {/* TOP ROW: Key Performance Metrics Cards */}
    <div className="metrics-row">
      <MetricCard 
        title="Total Assessments" 
        value={dashboardData.totalAssessments} 
        trend="+12% this month"
        icon={<FileText />}
      />
      <MetricCard 
        title="Avg Processing Time" 
        value={`${dashboardData.avgProcessingTime}s`} 
        trend="-23% improvement"
        icon={<Clock />}
      />
      <MetricCard 
        title="User Satisfaction" 
        value={`${dashboardData.userSatisfaction}/5`} 
        displayValue={renderStarRating(dashboardData.userSatisfaction)}
        trend="+0.3 this quarter"
        icon={<Star />}
      />
    </div>

    {/* MIDDLE ROW: Charts */}
    <div className="charts-row">
      <div className="chart-container volume-chart">
        <h3>Assessment Volume Trends</h3>
        <AssessmentVolumeChart data={dashboardData.volumeData} />
      </div>
      <div className="chart-container priority-chart">
        <h3>Priority Distribution</h3>
        <PriorityDistributionChart data={dashboardData.priorityDistribution} />
      </div>
    </div>

    {/* BOTTOM ROW: Activity Feed & Alerts */}
    <div className="activity-alerts-row">
      <div className="activity-feed-container">
        <h3>Recent System Activity</h3>
        <SystemActivityFeed activities={dashboardData.recentActivity} />
      </div>
      <div className="alerts-container">
        <h3>System Alerts</h3>
        <SystemAlertsPanel alerts={dashboardData.systemAlerts} />
      </div>
    </div>

  </div>
</div>
```

---

## 🎯 COMPONENT 1: MetricCard.tsx

### Exact Implementation Required
```typescript
// File: src/components/dashboard/MetricCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';
import './MetricCard.css';

interface MetricCardProps {
  title: string;
  value: string | number;
  displayValue?: React.ReactNode; // For custom displays like star ratings
  trend?: string;
  icon: React.ReactNode;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  displayValue, 
  trend, 
  icon, 
  className = '' 
}) => {
  return (
    <div className={`metric-card ${className}`}>
      <div className="metric-card-header">
        <div className="metric-icon">{icon}</div>
        <h4 className="metric-title">{title}</h4>
      </div>
      
      <div className="metric-value">
        {displayValue || value}
      </div>
      
      {trend && (
        <div className="metric-trend">
          <span className={`trend ${trend.includes('+') ? 'positive' : trend.includes('-') ? 'negative' : 'neutral'}`}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
```

### Required CSS for MetricCard
```css
/* File: src/components/dashboard/MetricCard.css */
.metric-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.metric-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.metric-icon {
  color: var(--nhs-blue);
  padding: 0.5rem;
  background: var(--nhs-blue-light);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.metric-trend {
  font-size: 0.875rem;
}

.trend.positive {
  color: #059669;
}

.trend.negative {
  color: #dc2626;
}

.trend.neutral {
  color: #6b7280;
}
```

---

## 📈 COMPONENT 2: AssessmentVolumeChart.tsx

### Chart Type: LINE CHART
Use a simple line chart showing assessment volume over time.

```typescript
// File: src/components/dashboard/AssessmentVolumeChart.tsx
import React from 'react';
import './AssessmentVolumeChart.css';

interface VolumeDataPoint {
  date: string;
  assessments: number;
}

interface AssessmentVolumeChartProps {
  data: VolumeDataPoint[];
}

const AssessmentVolumeChart: React.FC<AssessmentVolumeChartProps> = ({ data }) => {
  // Simple SVG line chart implementation
  const maxValue = Math.max(...data.map(d => d.assessments));
  const chartWidth = 400;
  const chartHeight = 200;
  const padding = 40;
  
  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * (chartWidth - 2 * padding);
    const y = chartHeight - padding - (point.assessments / maxValue) * (chartHeight - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="volume-chart">
      <svg width={chartWidth} height={chartHeight} className="chart-svg">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1={padding}
            y1={padding + (i * (chartHeight - 2 * padding) / 4)}
            x2={chartWidth - padding}
            y2={padding + (i * (chartHeight - 2 * padding) / 4)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* Main line */}
        <polyline
          points={points}
          fill="none"
          stroke="var(--nhs-blue)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {data.map((point, index) => {
          const x = padding + (index / (data.length - 1)) * (chartWidth - 2 * padding);
          const y = chartHeight - padding - (point.assessments / maxValue) * (chartHeight - 2 * padding);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="var(--nhs-blue)"
              className="data-point"
            />
          );
        })}
        
        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map(i => {
          const value = Math.round((maxValue * (4 - i)) / 4);
          const y = padding + (i * (chartHeight - 2 * padding) / 4);
          return (
            <text
              key={i}
              x={padding - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              {value}
            </text>
          );
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="x-axis-labels">
        {data.map((point, index) => (
          <span key={index} className="x-label">
            {point.date}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AssessmentVolumeChart;
```

### Required CSS for Volume Chart
```css
/* File: src/components/dashboard/AssessmentVolumeChart.css */
.volume-chart {
  width: 100%;
  position: relative;
}

.chart-svg {
  width: 100%;
  height: auto;
}

.data-point {
  transition: r 0.2s ease;
}

.data-point:hover {
  r: 6;
  cursor: pointer;
}

.x-axis-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 40px;
  margin-top: 0.5rem;
}

.x-label {
  font-size: 0.75rem;
  color: #6b7280;
}
```

---

## 🥧 COMPONENT 3: PriorityDistributionChart.tsx

### Chart Type: DONUT CHART
Display the exact distribution: Urgent (20%), Routine (60%), Non-Priority (20%)

```typescript
// File: src/components/dashboard/PriorityDistributionChart.tsx
import React from 'react';
import './PriorityDistributionChart.css';

interface PriorityDistribution {
  urgent: number;
  routine: number;
  nonPriority: number;
}

interface PriorityDistributionChartProps {
  data: PriorityDistribution;
}

const PriorityDistributionChart: React.FC<PriorityDistributionChartProps> = ({ data }) => {
  const total = data.urgent + data.routine + data.nonPriority;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate percentages
  const urgentPercent = (data.urgent / total) * 100;
  const routinePercent = (data.routine / total) * 100;
  const nonPriorityPercent = (data.nonPriority / total) * 100;
  
  // Calculate stroke dash arrays for donut segments
  const urgentStroke = (urgentPercent / 100) * circumference;
  const routineStroke = (routinePercent / 100) * circumference;
  const nonPriorityStroke = (nonPriorityPercent / 100) * circumference;
  
  return (
    <div className="priority-distribution-chart">
      <div className="chart-container">
        <svg width="200" height="200" className="donut-chart">
          {/* Urgent segment */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#dc2626"
            strokeWidth="20"
            strokeDasharray={`${urgentStroke} ${circumference}`}
            strokeDashoffset="0"
            transform="rotate(-90 100 100)"
            className="segment urgent"
          />
          
          {/* Routine segment */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#16a34a"
            strokeWidth="20"
            strokeDasharray={`${routineStroke} ${circumference}`}
            strokeDashoffset={-urgentStroke}
            transform="rotate(-90 100 100)"
            className="segment routine"
          />
          
          {/* Non-Priority segment */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#6b7280"
            strokeWidth="20"
            strokeDasharray={`${nonPriorityStroke} ${circumference}`}
            strokeDashoffset={-(urgentStroke + routineStroke)}
            transform="rotate(-90 100 100)"
            className="segment non-priority"
          />
          
          {/* Center text */}
          <text x="100" y="95" textAnchor="middle" fontSize="16" fontWeight="600" fill="#111827">
            Total
          </text>
          <text x="100" y="115" textAnchor="middle" fontSize="24" fontWeight="700" fill="#111827">
            {total}
          </text>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color urgent"></div>
          <span className="legend-label">Urgent ({urgentPercent.toFixed(0)}%)</span>
          <span className="legend-value">{data.urgent}</span>
        </div>
        <div className="legend-item">
          <div className="legend-color routine"></div>
          <span className="legend-label">Routine ({routinePercent.toFixed(0)}%)</span>
          <span className="legend-value">{data.routine}</span>
        </div>
        <div className="legend-item">
          <div className="legend-color non-priority"></div>
          <span className="legend-label">Non-Priority ({nonPriorityPercent.toFixed(0)}%)</span>
          <span className="legend-value">{data.nonPriority}</span>
        </div>
      </div>
    </div>
  );
};

export default PriorityDistributionChart;
```

### Required CSS for Priority Chart
```css
/* File: src/components/dashboard/PriorityDistributionChart.css */
.priority-distribution-chart {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.chart-container {
  flex-shrink: 0;
}

.donut-chart {
  transform: rotate(0deg);
}

.segment {
  transition: opacity 0.2s ease;
}

.segment:hover {
  opacity: 0.8;
  cursor: pointer;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.urgent {
  background-color: #dc2626;
}

.legend-color.routine {
  background-color: #16a34a;
}

.legend-color.non-priority {
  background-color: #6b7280;
}

.legend-label {
  font-size: 0.875rem;
  color: #374151;
  flex: 1;
}

.legend-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}
```

---

## 📋 COMPONENT 4: SystemActivityFeed.tsx

### EXACT Activity Examples Required
Must show these specific examples from stakeholder requirements:

```typescript
// File: src/components/dashboard/SystemActivityFeed.tsx
import React from 'react';
import { FileText, Send, Database, Eye, Clock } from 'lucide-react';
import './SystemActivityFeed.css';

interface SystemActivity {
  id: string;
  type: 'assessment_completed' | 'referral_submitted' | 'system_update' | 'data_access';
  description: string;
  user: string;
  timestamp: Date;
  patientId?: string;
}

interface SystemActivityFeedProps {
  activities: SystemActivity[];
}

const SystemActivityFeed: React.FC<SystemActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assessment_completed':
        return <FileText size={16} className="activity-icon assessment" />;
      case 'referral_submitted':
        return <Send size={16} className="activity-icon referral" />;
      case 'system_update':
        return <Database size={16} className="activity-icon system" />;
      case 'data_access':
        return <Eye size={16} className="activity-icon access" />;
      default:
        return <Clock size={16} className="activity-icon default" />;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="system-activity-feed">
      <div className="activity-header">
        <h4>Recent System Activity</h4>
        <span className="activity-count">{activities.length} updates in last hour</span>
      </div>
      
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-content">
              <div className="activity-main">
                {getActivityIcon(activity.type)}
                <div className="activity-text">
                  <span className="activity-description">{activity.description}</span>
                  {activity.patientId && (
                    <span className="patient-id">Patient ID {activity.patientId}</span>
                  )}
                </div>
              </div>
              <div className="activity-meta">
                <span className="activity-user">{activity.user}</span>
                <span className="activity-separator">•</span>
                <span className="activity-time">{formatTimeAgo(activity.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemActivityFeed;
```

### Required CSS for Activity Feed
```css
/* File: src/components/dashboard/SystemActivityFeed.css */
.system-activity-feed {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.activity-header {
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.activity-header h4 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.activity-count {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.activity-list {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.activity-main {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.activity-icon {
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.activity-icon.assessment {
  color: #059669;
}

.activity-icon.referral {
  color: #0284c7;
}

.activity-icon.system {
  color: #7c3aed;
}

.activity-icon.access {
  color: #dc2626;
}

.activity-icon.default {
  color: #6b7280;
}

.activity-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.activity-description {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 500;
}

.patient-id {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: monospace;
}

.activity-meta {
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 2rem;
}

.activity-user {
  font-weight: 500;
  color: var(--nhs-blue);
}

.activity-separator {
  color: #d1d5db;
}
```

---

## 🚨 COMPONENT 5: SystemAlertsPanel.tsx

### EXACT Alert Examples Required
Must show these specific examples from stakeholder requirements:

```typescript
// File: src/components/dashboard/SystemAlertsPanel.tsx
import React from 'react';
import { AlertTriangle, TrendingUp, Info, ChevronRight } from 'lucide-react';
import './SystemAlertsPanel.css';

interface SystemAlert {
  id: string;
  type: 'priority' | 'performance' | 'system';
  title: string;
  description: string;
  actionRequired: boolean;
  severity: 'low' | 'medium' | 'high';
  actionLabel?: string;
  detailsLabel?: string;
}

interface SystemAlertsPanelProps {
  alerts: SystemAlert[];
}

const SystemAlertsPanel: React.FC<SystemAlertsPanelProps> = ({ alerts }) => {
  const getAlertIcon = (type: string, severity: string) => {
    switch (type) {
      case 'priority':
        return <AlertTriangle size={16} className={`alert-icon priority ${severity}`} />;
      case 'performance':
        return <TrendingUp size={16} className={`alert-icon performance ${severity}`} />;
      case 'system':
        return <Info size={16} className={`alert-icon system ${severity}`} />;
      default:
        return <Info size={16} className={`alert-icon default ${severity}`} />;
    }
  };

  const handleAction = (alertId: string, action: string) => {
    console.log(`Action triggered: ${action} for alert ${alertId}`);
    // Implement action logic here
  };

  return (
    <div className="system-alerts-panel">
      <div className="alerts-header">
        <h4>System Alerts</h4>
        <button className="view-all-btn">
          View All
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="alerts-list">
        {alerts.map((alert) => (
          <div key={alert.id} className={`alert-item ${alert.severity}`}>
            <div className="alert-content">
              <div className="alert-main">
                {getAlertIcon(alert.type, alert.severity)}
                <div className="alert-text">
                  <h5 className="alert-title">{alert.title}</h5>
                  <p className="alert-description">{alert.description}</p>
                </div>
              </div>
              
              {(alert.actionRequired || alert.detailsLabel) && (
                <div className="alert-actions">
                  {alert.actionRequired && alert.actionLabel && (
                    <button 
                      className="alert-action-btn primary"
                      onClick={() => handleAction(alert.id, 'action')}
                    >
                      {alert.actionLabel}
                    </button>
                  )}
                  {alert.detailsLabel && (
                    <button 
                      className="alert-action-btn secondary"
                      onClick={() => handleAction(alert.id, 'details')}
                    >
                      {alert.detailsLabel}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemAlertsPanel;
```

### Required CSS for Alerts Panel
```css
/* File: src/components/dashboard/SystemAlertsPanel.css */
.system-alerts-panel {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.alerts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.alerts-header h4 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  color: var(--nhs-blue);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.view-all-btn:hover {
  background-color: #f3f4f6;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item {
  border-radius: 6px;
  padding: 1rem;
  border-left: 4px solid;
}

.alert-item.high {
  background-color: #fef2f2;
  border-left-color: #dc2626;
}

.alert-item.medium {
  background-color: #fffbeb;
  border-left-color: #f59e0b;
}

.alert-item.low {
  background-color: #f0f9ff;
  border-left-color: #0284c7;
}

.alert-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-main {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.alert-icon {
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.alert-icon.priority.high {
  color: #dc2626;
}

.alert-icon.performance.low {
  color: #059669;
}

.alert-icon.system.medium {
  color: #f59e0b;
}

.alert-text {
  flex: 1;
}

.alert-title {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.alert-description {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
}

.alert-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.alert-action-btn {
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
}

.alert-action-btn.primary {
  background-color: var(--nhs-blue);
  color: white;
  border-color: var(--nhs-blue);
}

.alert-action-btn.primary:hover {
  background-color: var(--nhs-blue-dark);
}

.alert-action-btn.secondary {
  background-color: white;
  color: var(--nhs-blue);
  border-color: var(--nhs-blue);
}

.alert-action-btn.secondary:hover {
  background-color: #f0f9ff;
}
```

---

## 📊 COMPONENT 6: Star Rating Display

### Required Function for User Satisfaction
```typescript
// File: src/components/dashboard/StarRating.tsx
import React from 'react';
import { Star } from 'lucide-react';
import './StarRating.css';

interface StarRatingProps {
  rating: number; // e.g., 4.7
  maxStars?: number; // default 5
  showValue?: boolean; // show "4.7/5"
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxStars = 5, 
  showValue = true 
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating">
      <div className="stars">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={16} className="star filled" />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <div className="star-container">
            <Star size={16} className="star empty" />
            <Star size={16} className="star half-filled" />
          </div>
        )}
        
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={16} className="star empty" />
        ))}
      </div>
      
      {showValue && (
        <span className="rating-value">
          {rating.toFixed(1)}/{maxStars}
        </span>
      )}
    </div>
  );
};

export default StarRating;
```

---

## 📊 DASHBOARD DATA SERVICE

### Simulation Service Implementation
```typescript
// File: src/services/dashboardSimulation.ts
export interface DashboardData {
  totalAssessments: number;
  avgProcessingTime: number;
  userSatisfaction: number;
  priorityDistribution: {
    urgent: number;
    routine: number;
    nonPriority: number;
  };
  volumeData: Array<{
    date: string;
    assessments: number;
  }>;
  recentActivity: SystemActivity[];
  systemAlerts: SystemAlert[];
}

export const generateDashboardData = (): DashboardData => {
  return {
    totalAssessments: 1247,
    avgProcessingTime: 23, // seconds
    userSatisfaction: 4.7,
    priorityDistribution: {
      urgent: 249,    // 20%
      routine: 748,   // 60% 
      nonPriority: 250 // 20%
    },
    volumeData: [
      { date: 'Mon', assessments: 45 },
      { date: 'Tue', assessments: 52 },
      { date: 'Wed', assessments: 48 },
      { date: 'Thu', assessments: 61 },
      { date: 'Fri', assessments: 55 },
      { date: 'Sat', assessments: 23 },
      { date: 'Sun', assessments: 18 }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'assessment_completed',
        description: 'Assessment completed for patient ID 123456789',
        user: 'Dr. Sarah Chen',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        patientId: '123456789'
      },
      {
        id: '2', 
        type: 'referral_submitted',
        description: 'Referral submitted to Plastic Surgery',
        user: 'Dr. Sarah Chen',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
      {
        id: '3',
        type: 'system_update', 
        description: 'Patient record updated with Healthcare system data',
        user: 'System',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
      {
        id: '4',
        type: 'data_access',
        description: 'Patient data accessed for assessment',
        user: 'Dr. James Wilson',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      }
    ],
    systemAlerts: [
      {
        id: '1',
        type: 'priority',
        title: '5 urgent referrals requiring review',
        description: 'Priority cases need attention within 24 hours',
        actionRequired: true,
        severity: 'high',
        actionLabel: 'Review'
      },
      {
        id: '2', 
        type: 'performance',
        title: 'AI decision quality improved',
        description: '+1.2% improvement in clinical agreement',
        actionRequired: false,
        severity: 'low',
        detailsLabel: 'Details'
      }
    ]
  };
};

// Auto-refresh data every 30 seconds
export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>(generateDashboardData());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateDashboardData());
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return data;
};
```

---

## 📱 DASHBOARD PAGE IMPLEMENTATION

### Complete DashboardPage.tsx Replacement
```typescript
// File: src/pages/DashboardPage.tsx - COMPLETE REPLACEMENT
import React from 'react';
import { FileText, Clock, Star } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import AssessmentVolumeChart from '../components/dashboard/AssessmentVolumeChart';
import PriorityDistributionChart from '../components/dashboard/PriorityDistributionChart';
import SystemActivityFeed from '../components/dashboard/SystemActivityFeed';
import SystemAlertsPanel from '../components/dashboard/SystemAlertsPanel';
import StarRating from '../components/dashboard/StarRating';
import { useDashboardData } from '../services/dashboardSimulation';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const dashboardData = useDashboardData();

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        {/* TOP ROW: Key Performance Metrics */}
        <div className="metrics-row">
          <MetricCard 
            title="Total Assessments" 
            value={dashboardData.totalAssessments} 
            trend="+12% this month"
            icon={<FileText />}
          />
          <MetricCard 
            title="Avg Processing Time" 
            value={`${dashboardData.avgProcessingTime}s`} 
            trend="-23% improvement"
            icon={<Clock />}
          />
          <MetricCard 
            title="User Satisfaction" 
            value={`${dashboardData.userSatisfaction}/5`}
            displayValue={<StarRating rating={dashboardData.userSatisfaction} />}
            trend="+0.3 this quarter"
            icon={<Star />}
          />
        </div>

        {/* MIDDLE ROW: Charts */}
        <div className="charts-row">
          <div className="chart-container volume-chart">
            <h3>Assessment Volume Trends</h3>
            <AssessmentVolumeChart data={dashboardData.volumeData} />
          </div>
          <div className="chart-container priority-chart">
            <h3>Priority Distribution</h3>
            <PriorityDistributionChart data={dashboardData.priorityDistribution} />
          </div>
        </div>

        {/* BOTTOM ROW: Activity Feed & Alerts */}
        <div className="activity-alerts-row">
          <div className="activity-feed-container">
            <SystemActivityFeed activities={dashboardData.recentActivity} />
          </div>
          <div className="alerts-container">
            <SystemAlertsPanel alerts={dashboardData.systemAlerts} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
```

### Required CSS for Dashboard Page
```css
/* File: src/pages/DashboardPage.css - COMPLETE REPLACEMENT */
.dashboard-page {
  padding: 1.5rem;
  background-color: #f9fafb;
  min-height: calc(100vh - var(--header-height));
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.charts-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.chart-container h3 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.activity-alerts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .charts-row {
    grid-template-columns: 1fr;
  }
  
  .activity-alerts-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-page {
    padding: 1rem;
  }
  
  .metrics-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .dashboard-container {
    gap: 1.5rem;
  }
}

@media (max-width: 640px) {
  .metrics-row {
    gap: 0.75rem;
  }
  
  .chart-container {
    padding: 1rem;
  }
}
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Files to Create (NEW)
- [ ] `src/components/dashboard/MetricCard.tsx`
- [ ] `src/components/dashboard/MetricCard.css`
- [ ] `src/components/dashboard/AssessmentVolumeChart.tsx`
- [ ] `src/components/dashboard/AssessmentVolumeChart.css`
- [ ] `src/components/dashboard/PriorityDistributionChart.tsx`
- [ ] `src/components/dashboard/PriorityDistributionChart.css`
- [ ] `src/components/dashboard/SystemActivityFeed.tsx`
- [ ] `src/components/dashboard/SystemActivityFeed.css`
- [ ] `src/components/dashboard/SystemAlertsPanel.tsx`
- [ ] `src/components/dashboard/SystemAlertsPanel.css`
- [ ] `src/components/dashboard/StarRating.tsx`
- [ ] `src/components/dashboard/StarRating.css`
- [ ] `src/services/dashboardSimulation.ts`

### Files to Replace (COMPLETE REPLACEMENT)
- [ ] `src/pages/DashboardPage.tsx` - Replace entirely
- [ ] `src/pages/DashboardPage.css` - Replace entirely

### Verification Requirements
- [ ] Dashboard loads without errors
- [ ] All 3 metric cards display correctly
- [ ] Volume chart shows line graph with 7 data points
- [ ] Priority chart shows donut chart with exact percentages (20%, 60%, 20%)
- [ ] Activity feed shows exact examples with proper timestamps
- [ ] Alerts panel shows exact examples with action buttons
- [ ] Star rating displays 4.7/5 correctly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Data updates every 30 seconds
- [ ] All interactions work (hover effects, button clicks)

This implementation guide provides the AI coding agent with exact specifications, complete code examples, and detailed requirements to create a fully functional dashboard that meets all stakeholder requirements.

