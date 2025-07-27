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
  // Responsive SVG line chart implementation
  const maxValue = Math.max(...data.map(d => d.assessments));
  const minValue = Math.min(...data.map(d => d.assessments));
  const chartWidth = 500;
  const chartHeight = 240;
  const padding = { top: 20, right: 30, bottom: 50, left: 60 };
  
  // Calculate chart area
  const chartAreaWidth = chartWidth - padding.left - padding.right;
  const chartAreaHeight = chartHeight - padding.top - padding.bottom;
  
  // Generate points for the line
  const points = data.map((point, index) => {
    const x = padding.left + (index / (data.length - 1)) * chartAreaWidth;
    const y = padding.top + ((maxValue - point.assessments) / (maxValue - minValue)) * chartAreaHeight;
    return `${x},${y}`;
  }).join(' ');

  // Generate grid lines - 5 horizontal lines
  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const value = minValue + ((maxValue - minValue) * (4 - i)) / 4;
    const y = padding.top + (i / 4) * chartAreaHeight;
    return { y, value: Math.round(value) };
  });

  return (
    <div className="volume-chart">
      <svg width={chartWidth} height={chartHeight} className="chart-svg" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        {/* Grid lines */}
        {gridLines.map((line, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={line.y}
              x2={chartWidth - padding.right}
              y2={line.y}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
            {/* Y-axis labels */}
            <text
              x={padding.left - 15}
              y={line.y + 4}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
              className="y-label"
            >
              {line.value}
            </text>
          </g>
        ))}
        
        {/* Chart area background */}
        <rect
          x={padding.left}
          y={padding.top}
          width={chartAreaWidth}
          height={chartAreaHeight}
          fill="rgba(0, 48, 135, 0.02)"
          stroke="none"
        />
        
        {/* Main line with gradient */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--nhs-blue)" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="var(--nhs-blue)" stopOpacity="1"/>
          </linearGradient>
          <filter id="dropshadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0, 48, 135, 0.2)"/>
          </filter>
        </defs>
        
        <polyline
          points={points}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#dropshadow)"
          className="main-line"
        />
        
        {/* Data points */}
        {data.map((point, index) => {
          const x = padding.left + (index / (data.length - 1)) * chartAreaWidth;
          const y = padding.top + ((maxValue - point.assessments) / (maxValue - minValue)) * chartAreaHeight;
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r="5"
                fill="white"
                stroke="var(--nhs-blue)"
                strokeWidth="3"
                className="data-point"
              />
              <circle
                cx={x}
                cy={y}
                r="2"
                fill="var(--nhs-blue)"
                className="data-point-inner"
              />
              {/* Value labels on hover */}
              <text
                x={x}
                y={y - 15}
                textAnchor="middle"
                fontSize="11"
                fill="var(--nhs-blue)"
                fontWeight="600"
                className="value-label"
                opacity="0"
              >
                {point.assessments}
              </text>
            </g>
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
