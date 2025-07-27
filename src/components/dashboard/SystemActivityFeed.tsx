import React from 'react';
import { FileText, Send, Database, Eye, Clock, Mail } from 'lucide-react';
import './SystemActivityFeed.css';
import { SystemActivity } from '../../services/dashboardSimulation';

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
      case 'letter_generated':
        return <Mail size={16} className="activity-icon letter" />;
      case 'letter_sent':
        return <Send size={16} className="activity-icon letter-sent" />;
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
