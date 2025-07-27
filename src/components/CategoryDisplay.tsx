import React from 'react';
import { AlertTriangle, Clock, Info, CheckCircle } from 'lucide-react';
import { ClinicalCaseCategory } from '../services/openaiService';

interface CategoryDisplayProps {
  category: ClinicalCaseCategory;
  confidence: number;
  rationale: string;
  modelUsed?: string;
}

const CategoryDisplay: React.FC<CategoryDisplayProps> = ({ 
  category, 
  confidence, 
  rationale, 
  modelUsed 
}) => {
  const getCategoryIcon = () => {
    switch (category) {
      case ClinicalCaseCategory.URGENT:
        return <AlertTriangle className="icon" />;
      case ClinicalCaseCategory.ROUTINE:
        return <Clock className="icon" />;
      case ClinicalCaseCategory.NON_PRIORITY:
        return <Info className="icon" />;
      default:
        return <CheckCircle className="icon" />;
    }
  };

  const getCategoryColor = () => {
    switch (category) {
      case ClinicalCaseCategory.URGENT:
        return '#d5281b'; // NHS Red
      case ClinicalCaseCategory.ROUTINE:
        return '#ffb81c'; // NHS Yellow/Amber
      case ClinicalCaseCategory.NON_PRIORITY:
        return '#007f3b'; // NHS Green
      default:
        return '#4c6272'; // NHS Grey
    }
  };

  const getCategoryDescription = () => {
    switch (category) {
      case ClinicalCaseCategory.URGENT:
        return 'Within 2 weeks - High priority case requiring immediate attention';
      case ClinicalCaseCategory.ROUTINE:
        return 'Within 6 weeks - Standard case that can wait for routine scheduling';
      case ClinicalCaseCategory.NON_PRIORITY:
        return 'Routine scheduling - Low priority case with no urgent indicators';
      default:
        return 'Category not determined';
    }
  };

  const getConfidenceLevel = () => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.5) return 'Medium';
    return 'Low';
  };

  const getConfidenceColor = () => {
    if (confidence >= 0.8) return '#007f3b'; // Green
    if (confidence >= 0.5) return '#ffb81c'; // Amber
    return '#d5281b'; // Red
  };

  return (
    <div className="category-display">
      <div className="category-header">
        <div 
          className="category-badge"
          style={{ 
            color: getCategoryColor(),
            borderColor: getCategoryColor() 
          }}
        >
          {getCategoryIcon()}
          <span className="category-name">{category}</span>
        </div>
        
        <div className="confidence-display">
          <div 
            className="confidence-badge"
            style={{ 
              backgroundColor: getConfidenceColor(),
              color: 'white'
            }}
          >
            {getConfidenceLevel()} Confidence ({Math.round(confidence * 100)}%)
          </div>
        </div>
      </div>

      <div className="category-description">
        <p>{getCategoryDescription()}</p>
      </div>

      <div className="category-rationale">
        <h4>Clinical Rationale:</h4>
        <p>{rationale}</p>
      </div>

      {modelUsed && (
        <div className="model-info">
          <small>
            <strong>Analysis by:</strong> {modelUsed} following Plastic Surgery expert guidelines
          </small>
        </div>
      )}

      <div className="clinical-disclaimer">
        <small>
          <strong>Important:</strong> This AI assessment is a recommendation only. 
          Final clinical priority should be determined by the receiving specialist team.
        </small>
      </div>
    </div>
  );
};

export default CategoryDisplay;
