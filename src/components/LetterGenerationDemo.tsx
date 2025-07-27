import React, { useState } from 'react';
import { LetterGenerationService } from '../services/letterGenerationService';
import './LetterGenerationDemo.css';

const LetterGenerationDemo: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('urgent-appointment');
  const [generatedLetter, setGeneratedLetter] = useState('');

  const generatePreview = () => {
    const preview = LetterGenerationService.generateLetterPreview(
      selectedTemplate,
      selectedTemplate.includes('urgent') ? 'urgent' : 'routine'
    );
    setGeneratedLetter(preview);
  };

  const downloadLetter = () => {
    if (generatedLetter) {
      LetterGenerationService.downloadLetter(
        generatedLetter, 
        `NHS_Letter_Demo_${Date.now()}`
      );
    }
  };

  return (
    <div className="letter-demo-container">
      <h2>NHS Letter Generation Demo</h2>
      
      <div className="demo-controls">
        <label>
          Select Template:
          <select 
            value={selectedTemplate} 
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            <option value="urgent-appointment">Urgent Skin Lesion Assessment</option>
            <option value="routine-appointment">Routine Appointment Notification</option>
            <option value="information-request">Additional Information Required</option>
          </select>
        </label>
        
        <button onClick={generatePreview}>Generate Preview</button>
        {generatedLetter && (
          <button onClick={downloadLetter}>Download Letter</button>
        )}
      </div>

      {generatedLetter && (
        <div className="letter-preview-demo">
          <h3>Generated Letter Preview:</h3>
          <pre>{generatedLetter}</pre>
        </div>
      )}
    </div>
  );
};

export default LetterGenerationDemo;
