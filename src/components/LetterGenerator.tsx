import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Eye, 
  Send,
  Calendar,
  User
} from 'lucide-react';
import { 
  LetterGenerationService, 
  letterTemplates, 
  PatientData, 
  AppointmentDetails 
} from '../services/letterGenerationService';
import './LetterGenerator.css';

interface LetterGeneratorProps {
  patientId?: string;
  patientName?: string;
  triageCategory?: 'urgent' | 'routine' | 'non-priority';
  onLetterGenerated?: (letterInfo: LetterInfo) => void;
  isVisible: boolean;
  onClose: () => void;
}

interface LetterInfo {
  id: string;
  patientId: string;
  templateId: string;
  generatedAt: Date;
  status: 'generated' | 'sent' | 'printed';
  content: string;
}

const LetterGenerator: React.FC<LetterGeneratorProps> = ({
  patientId = '',
  patientName = '',
  triageCategory = 'routine',
  onLetterGenerated,
  isVisible,
  onClose
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [patientData, setPatientData] = useState<PatientData>({
    fullName: patientName || 'John Michael Smith',
    title: 'Mr',
    surname: patientName?.split(' ').pop() || 'Smith',
    addressLine1: '123 Example Street',
    addressLine2: 'Example District',
    postcode: 'EH1 2AB',
    nhsNumber: '123 456 7890',
    dateOfBirth: '15/03/1975',
    gpPractice: 'Example Medical Centre'
  });
  const [appointmentData, setAppointmentData] = useState<AppointmentDetails>({
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
    time: triageCategory === 'urgent' ? '09:30 AM' : '2:30 PM',
    location: 'Royal Infirmary of Edinburgh, Plastic Surgery Unit, Level 3',
    clinicName: triageCategory === 'urgent' ? 'See and Treat Skin Lesion Clinic' : 'General Plastic Surgery Clinic',
    consultantName: 'Mr. James Richardson',
    department: 'Plastic Surgery',
    contactPhone: '0131 536 1000',
    contactEmail: 'plastic.surgery@nhslothian.scot.nhs.uk'
  });

  const relevantTemplates = letterTemplates.filter(template => 
    template.category === triageCategory || template.category === 'routine'
  );

  const handlePreviewLetter = () => {
    if (!selectedTemplate) {
      alert('Please select a letter template first');
      return;
    }

    try {
      const letter = LetterGenerationService.generateLetter(
        selectedTemplate,
        patientData,
        appointmentData
      );
      setGeneratedLetter(letter);
      setIsPreviewMode(true);
    } catch (error) {
      alert(`Error generating letter: ${error}`);
    }
  };

  const handleGenerateFinalLetter = () => {
    if (!generatedLetter) {
      handlePreviewLetter();
    }

    if (generatedLetter && onLetterGenerated) {
      const letterInfo: LetterInfo = {
        id: `LETTER-${Date.now()}`,
        patientId: patientId,
        templateId: selectedTemplate,
        generatedAt: new Date(),
        status: 'generated',
        content: generatedLetter
      };
      onLetterGenerated(letterInfo);
    }
  };

  const handleDownload = () => {
    if (!generatedLetter) return;
    const filename = `NHS_Letter_${patientData.surname}_${new Date().toISOString().split('T')[0]}`;
    LetterGenerationService.downloadLetter(generatedLetter, filename);
  };

  const handlePrint = () => {
    if (!generatedLetter) return;
    LetterGenerationService.printLetter(generatedLetter);
  };

  const handleSendLetter = () => {
    if (!generatedLetter) return;
    // Simulate sending letter (in real implementation, this would integrate with NHS mail system)
    alert('Letter queued for postal delivery via NHS mail system');
    
    if (onLetterGenerated) {
      const letterInfo: LetterInfo = {
        id: `LETTER-${Date.now()}`,
        patientId: patientId,
        templateId: selectedTemplate,
        generatedAt: new Date(),
        status: 'sent',
        content: generatedLetter
      };
      onLetterGenerated(letterInfo);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="letter-generator-overlay">
      <div className="letter-generator-modal">
        <div className="modal-header">
          <h2>
            <FileText size={24} />
            NHS Letter Generator
          </h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {!isPreviewMode ? (
            <>
              {/* Template Selection */}
              <div className="section">
                <h3>Select Letter Template</h3>
                <div className="template-grid">
                  {relevantTemplates.map(template => (
                    <div 
                      key={template.id}
                      className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="template-header">
                        <FileText size={20} />
                        <span className={`category-badge ${template.category}`}>
                          {template.category.toUpperCase()}
                        </span>
                      </div>
                      <h4>{template.name}</h4>
                      <p>Appropriate for {template.category} referrals</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient Information */}
              <div className="section">
                <h3>
                  <User size={20} />
                  Patient Information
                </h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Title</label>
                    <select 
                      value={patientData.title}
                      onChange={(e) => setPatientData({...patientData, title: e.target.value})}
                    >
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                      <option value="Professor">Professor</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text"
                      value={patientData.fullName}
                      onChange={(e) => setPatientData({...patientData, fullName: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Surname</label>
                    <input 
                      type="text"
                      value={patientData.surname}
                      onChange={(e) => setPatientData({...patientData, surname: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>NHS Number</label>
                    <input 
                      type="text"
                      value={patientData.nhsNumber}
                      onChange={(e) => setPatientData({...patientData, nhsNumber: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Address Line 1</label>
                    <input 
                      type="text"
                      value={patientData.addressLine1}
                      onChange={(e) => setPatientData({...patientData, addressLine1: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Address Line 2</label>
                    <input 
                      type="text"
                      value={patientData.addressLine2 || ''}
                      onChange={(e) => setPatientData({...patientData, addressLine2: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Postcode</label>
                    <input 
                      type="text"
                      value={patientData.postcode}
                      onChange={(e) => setPatientData({...patientData, postcode: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>GP Practice</label>
                    <input 
                      type="text"
                      value={patientData.gpPractice}
                      onChange={(e) => setPatientData({...patientData, gpPractice: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="section">
                <h3>
                  <Calendar size={20} />
                  Appointment Details
                </h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Date</label>
                    <input 
                      type="text"
                      value={appointmentData.date}
                      onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Time</label>
                    <input 
                      type="text"
                      value={appointmentData.time}
                      onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Consultant</label>
                    <input 
                      type="text"
                      value={appointmentData.consultantName}
                      onChange={(e) => setAppointmentData({...appointmentData, consultantName: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Phone</label>
                    <input 
                      type="text"
                      value={appointmentData.contactPhone}
                      onChange={(e) => setAppointmentData({...appointmentData, contactPhone: e.target.value})}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Location</label>
                    <input 
                      type="text"
                      value={appointmentData.location}
                      onChange={(e) => setAppointmentData({...appointmentData, location: e.target.value})}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Clinic Name</label>
                    <input 
                      type="text"
                      value={appointmentData.clinicName}
                      onChange={(e) => setAppointmentData({...appointmentData, clinicName: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  className="btn btn-secondary"
                  onClick={handlePreviewLetter}
                  disabled={!selectedTemplate}
                >
                  <Eye size={16} />
                  Preview Letter
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleGenerateFinalLetter}
                  disabled={!selectedTemplate}
                >
                  <FileText size={16} />
                  Generate Letter
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Letter Preview */}
              <div className="section">
                <h3>Letter Preview</h3>
                <div className="letter-preview">
                  <pre>{generatedLetter}</pre>
                </div>
              </div>

              {/* Preview Action Buttons */}
              <div className="action-buttons">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setIsPreviewMode(false)}
                >
                  ← Edit Letter
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleDownload}
                >
                  <Download size={16} />
                  Download
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handlePrint}
                >
                  <Printer size={16} />
                  Print
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleSendLetter}
                >
                  <Send size={16} />
                  Send Letter
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LetterGenerator;
