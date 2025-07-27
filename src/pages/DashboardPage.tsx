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
            trend="+85% volume increase"
            icon={<FileText />}
          />
          <MetricCard 
            title="Avg Processing Time" 
            value={`${dashboardData.avgProcessingTime}s`} 
            trend="60% faster processing"
            icon={<Clock />}
          />
          <MetricCard 
            title="User Satisfaction" 
            value={`${dashboardData.userSatisfaction}/5`}
            displayValue={<StarRating rating={dashboardData.userSatisfaction} />}
            trend="+15% satisfaction boost"
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
