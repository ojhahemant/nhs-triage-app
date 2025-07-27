import React from 'react';
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
