import React, { useState } from 'react';
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
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  
  const total = data.urgent + data.routine + data.nonPriority;
  const radius = 90;
  const innerRadius = 60;
  const centerX = 120;
  const centerY = 120;
  
  // Calculate percentages
  const urgentPercent = (data.urgent / total) * 100;
  const routinePercent = (data.routine / total) * 100;
  const nonPriorityPercent = (data.nonPriority / total) * 100;
  
  // Calculate angles for each segment
  const urgentAngle = (urgentPercent / 100) * 360;
  const routineAngle = (routinePercent / 100) * 360;
  
  // Function to create arc path
  const createArcPath = (
    startAngle: number,
    endAngle: number,
    outerRadius: number,
    innerRadius: number
  ) => {
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + outerRadius * Math.cos(startAngleRad);
    const y1 = centerY + outerRadius * Math.sin(startAngleRad);
    const x2 = centerX + outerRadius * Math.cos(endAngleRad);
    const y2 = centerY + outerRadius * Math.sin(endAngleRad);
    
    const x3 = centerX + innerRadius * Math.cos(endAngleRad);
    const y3 = centerY + innerRadius * Math.sin(endAngleRad);
    const x4 = centerX + innerRadius * Math.cos(startAngleRad);
    const y4 = centerY + innerRadius * Math.sin(startAngleRad);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    return [
      "M", x1, y1,
      "A", outerRadius, outerRadius, 0, largeArcFlag, 1, x2, y2,
      "L", x3, y3,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 0, x4, y4,
      "Z"
    ].join(" ");
  };
  
  // Calculate segment paths
  const urgentPath = createArcPath(0, urgentAngle, radius, innerRadius);
  const routinePath = createArcPath(urgentAngle, urgentAngle + routineAngle, radius, innerRadius);
  const nonPriorityPath = createArcPath(urgentAngle + routineAngle, 360, radius, innerRadius);
  
  const segments = [
    {
      id: 'urgent',
      path: urgentPath,
      color: '#ef4444',
      hoverColor: '#dc2626',
      label: 'Urgent',
      value: data.urgent,
      percent: urgentPercent
    },
    {
      id: 'routine',
      path: routinePath,
      color: '#22c55e',
      hoverColor: '#16a34a',
      label: 'Routine',
      value: data.routine,
      percent: routinePercent
    },
    {
      id: 'nonPriority',
      path: nonPriorityPath,
      color: '#64748b',
      hoverColor: '#475569',
      label: 'Non-Priority',
      value: data.nonPriority,
      percent: nonPriorityPercent
    }
  ];

  return (
    <div className="priority-distribution-chart">
      <div className="chart-container">
        <svg width="240" height="240" className="donut-chart">
          {/* Gradient definitions */}
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.1)"/>
            </filter>
            
            {/* Gradients for each segment */}
            <radialGradient id="urgentGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fecaca" />
              <stop offset="100%" stopColor="#ef4444" />
            </radialGradient>
            
            <radialGradient id="routineGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#bbf7d0" />
              <stop offset="100%" stopColor="#22c55e" />
            </radialGradient>
            
            <radialGradient id="nonPriorityGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#64748b" />
            </radialGradient>
          </defs>
          
          {/* Background circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="2"
          />
          
          {/* Segments */}
          {segments.map((segment) => (
            <path
              key={segment.id}
              d={segment.path}
              fill={`url(#${segment.id}Gradient)`}
              stroke="white"
              strokeWidth="2"
              filter="url(#shadow)"
              className={`segment ${segment.id} ${hoveredSegment === segment.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredSegment(segment.id)}
              onMouseLeave={() => setHoveredSegment(null)}
            />
          ))}
          
          {/* Center content */}
          <circle
            cx={centerX}
            cy={centerY}
            r={innerRadius - 2}
            fill="white"
            filter="url(#shadow)"
          />
          
          <text 
            x={centerX} 
            y={centerY - 10} 
            textAnchor="middle" 
            fontSize="14" 
            fontWeight="500" 
            fill="#6b7280"
            className="center-label"
          >
            Total
          </text>
          <text 
            x={centerX} 
            y={centerY + 15} 
            textAnchor="middle" 
            fontSize="28" 
            fontWeight="700" 
            fill="#1f2937"
            className="center-value"
          >
            {total.toLocaleString()}
          </text>
        </svg>
      </div>
      
      {/* Enhanced Legend */}
      <div className="chart-legend">
        {segments.map((segment) => (
          <div 
            key={segment.id}
            className={`legend-item ${hoveredSegment === segment.id ? 'highlighted' : ''}`}
            onMouseEnter={() => setHoveredSegment(segment.id)}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div 
              className={`legend-indicator ${segment.id}`}
              style={{ backgroundColor: segment.color }}
            ></div>
            <div className="legend-content">
              <div className="legend-header">
                <span className="legend-label">{segment.label}</span>
                <span className="legend-percentage">({segment.percent.toFixed(0)}%)</span>
              </div>
              <div className="legend-value">{segment.value.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityDistributionChart;
