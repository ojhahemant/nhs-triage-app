import React from 'react';
import { Upload } from 'lucide-react';
import './PlaceholderPage.css';

const BulkUploadPage: React.FC = () => {
  return (
    <div className="placeholder-page">
      <div className="page-header">
        <h1>Bulk Upload</h1>
        <p>Upload multiple referrals from CSV or Excel files for batch processing</p>
      </div>

      <div className="coming-soon-section">
        <div className="coming-soon-card">
          <Upload size={48} className="coming-soon-icon" />
          <h3>Bulk Upload System Coming Soon</h3>
          <p>
            Streamline your workflow by uploading multiple referrals at once from spreadsheets,
            with automatic validation and error reporting.
          </p>
          <div className="planned-features">
            <h4>Planned Features:</h4>
            <ul>
              <li>CSV and Excel file support</li>
              <li>Live data validation</li>
              <li>Automatic duplicate detection</li>
              <li>Bulk processing status tracking</li>
              <li>Error reporting and correction tools</li>
              <li>Template download functionality</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadPage;
