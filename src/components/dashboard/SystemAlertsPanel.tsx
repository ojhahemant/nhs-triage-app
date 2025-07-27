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
