import React from 'react';
import { HelpCircle, Info, Zap } from 'lucide-react';
import './PageHelpWidget.css';

interface PageHelpWidgetProps {
  page: string;
  section?: string;
  quickTips?: string[];
  onOpenHelp?: () => void;
  showQuickTips?: boolean;
}

const PageHelpWidget: React.FC<PageHelpWidgetProps> = ({
  page,
  section,
  quickTips = [],
  onOpenHelp,
  showQuickTips = true
}) => {
  const getPageSpecificTips = () => {
    const tips: Record<string, string[]> = {
      assessment: [
        'Include lesion size, location, and recent changes',
        'Upload images for better AI analysis',
        'More detail = higher accuracy',
        'Use the chat assistant for follow-up questions'
      ],
      dashboard: [
        'Check system alerts daily',
        'Monitor volume trends for capacity planning',
        'Review performance metrics regularly',
        'Use charts to identify patterns'
      ],
      'post-triaging': [
        'Select appropriate letter templates',
        'Double-check patient details',
        'Track communication status',
        'Export letters for records'
      ],
      'bulk-upload': [
        'Download CSV template first',
        'Validate NHS numbers before upload',
        'Process in batches of 100-500',
        'Review error reports carefully'
      ]
    };

    return quickTips.length > 0 ? quickTips : (tips[page] || []);
  };

  const tips = getPageSpecificTips();

  return (
    <div className="page-help-widget">
      <div className="help-widget-header">
        <div className="help-widget-title">
          <HelpCircle size={16} />
          <span>Quick Help</span>
        </div>
        {onOpenHelp && (
          <button 
            className="help-widget-full-button"
            onClick={onOpenHelp}
            title="Open full help guide"
          >
            <Info size={14} />
          </button>
        )}
      </div>

      {showQuickTips && tips.length > 0 && (
        <div className="help-widget-tips">
          <div className="tips-header">
            <Zap size={14} />
            <span>Quick Tips</span>
          </div>
          <ul className="tips-list">
            {tips.slice(0, 3).map((tip, index) => (
              <li key={index} className="tip-item">
                {tip}
              </li>
            ))}
          </ul>
          {tips.length > 3 && (
            <button 
              className="view-more-tips"
              onClick={onOpenHelp}
            >
              View {tips.length - 3} more tips...
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PageHelpWidget;
