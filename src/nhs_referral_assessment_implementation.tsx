import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { AlertCircle, Clock, Brain, Camera, FileText, Send, Save, RotateCcw, CheckCircle, AlertTriangle, Info, MessageSquare } from 'lucide-react';
import './NewReferralAssessment.css';
import ChatAssistant from './components/ChatAssistant';
import { categorizeClinicalCase, ClinicalCaseCategory } from './services/openaiService';

// Define TypeScript interfaces for our data structures
interface FormDataType {
  patientName: string;
  nhsNumber: string;
  patientAge: string;
  dateOfBirth: string;
  gpPractice: string;
  referringGP: string;
  lesionType: string;
  lesionLocation: string;
  lesionSize: string;
  lesionDuration: string;
  growthRate: string;
  symptoms: string[];
  familyHistory: string;
  previousBiopsies: string;
  currentMedications: string;
  biopsyResult: string;
  urgencyLevel: string;
  additionalNotes: string;
  photo: File | null;
}

interface ValidationErrors {
  [key: string]: string;
}

interface TriageResult {
  urgencyScore: number;
  recommendedTimeframe: string;
  recommendedSpecialty: string;
  recommendationReason: string;
  categorization?: {
    category: ClinicalCaseCategory;
    confidence: number;
    rationale: string;
  };
}

const NewReferralAssessment = () => {
  const [formData, setFormData] = useState<FormDataType>({
    patientName: '',
    nhsNumber: '',
    patientAge: '',
    dateOfBirth: '',
    gpPractice: '',
    referringGP: '',
    lesionType: '',
    lesionLocation: '',
    lesionSize: '',
    lesionDuration: '',
    growthRate: '',
    symptoms: [],
    familyHistory: '',
    previousBiopsies: '',
    currentMedications: '',
    biopsyResult: '',
    urgencyLevel: '',
    additionalNotes: '',
    photo: null
  });

  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isDraftSaved, setIsDraftSaved] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  
  // Handle form field changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle checkbox changes for symptoms
  const handleSymptomChange = (symptom: string) => {
    setFormData(prev => {
      const symptoms = [...prev.symptoms];
      if (symptoms.includes(symptom)) {
        return { ...prev, symptoms: symptoms.filter(s => s !== symptom) };
      } else {
        return { ...prev, symptoms: [...symptoms, symptom] };
      }
    });
  };
  
  // Handle photo upload
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const errors: ValidationErrors = {};
    
    // Only require lesion type (clinical description)
    if (!formData.lesionType.trim()) {
      errors.lesionType = 'Clinical Description is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Submit form for triage
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsCalculating(true);
    
    try {
      // First, calculate the basic triage result
      const calculatedResult = calculateTriageResult(formData);
      
      // Then use Ollama to categorize the case
      const clinicalDescription = formData.lesionType;
      const additionalContext = {
        patientAge: formData.patientAge,
        symptoms: formData.symptoms,
        otherNotes: formData.additionalNotes
      };
      
      try {
        console.log('Starting clinical case categorization...');
        const categorization = await categorizeClinicalCase(
          clinicalDescription,
          additionalContext
        );
        console.log('Categorization completed:', categorization);
        
        // Add categorization to the triage result
        calculatedResult.categorization = categorization;
      } catch (error) {
        console.error('Error during case categorization:', error);
        // Continue without categorization if it fails
      }
      
      setTriageResult(calculatedResult);
    } catch (error) {
      console.error('Error during triage calculation:', error);
      // Handle errors appropriately
    } finally {
      setIsCalculating(false);
    }
  };

  // Calculate triage result based on form data
  const calculateTriageResult = (data: FormDataType): TriageResult => {
    // This is a simplified algorithm for demonstration purposes
    // In a real application, this would be much more complex and likely on the server
    
    let urgencyScore = 0;
    let recommendedTimeframe = '';
    let recommendedSpecialty = 'Dermatology';
    let recommendationReason = '';
    
    // Age factor - higher age increases urgency for potential skin cancers
    if (parseInt(data.patientAge) > 60) {
      urgencyScore += 2;
    }
    
    // Growth rate factor
    if (data.growthRate === 'rapid') {
      urgencyScore += 3;
      recommendationReason += '- Rapid growth rate indicates potential aggressive behavior\n';
    }
    
    // Symptoms factor
    const highRiskSymptoms = ['Bleeding', 'Ulceration', 'Color changes', 'Irregular borders'];
    const presentHighRiskSymptoms = data.symptoms.filter((s: string) => highRiskSymptoms.includes(s));
    
    if (presentHighRiskSymptoms.length >= 2) {
      urgencyScore += 3;
      recommendationReason += `- Multiple concerning symptoms present (${presentHighRiskSymptoms.join(', ')})\n`;
    } else if (presentHighRiskSymptoms.length === 1) {
      urgencyScore += 1;
      recommendationReason += `- Concerning symptom present (${presentHighRiskSymptoms[0]})\n`;
    }
    
    // Family history factor
    if (data.familyHistory.toLowerCase().includes('melanoma') || 
        data.familyHistory.toLowerCase().includes('cancer')) {
      urgencyScore += 2;
      recommendationReason += '- Family history of skin cancer increases risk\n';
    }
    
    // Lesion type factor
    if (data.lesionType.toLowerCase().includes('melanoma') || 
        data.lesionType.toLowerCase().includes('irregular') ||
        data.lesionType.toLowerCase().includes('changing')) {
      urgencyScore += 3;
      recommendationReason += '- Clinical description suggests potentially concerning features\n';
    }
    
    // Lesion location factor - certain areas are higher risk
    const highRiskLocations = ['scalp', 'face', 'ear', 'neck', 'hand', 'sole', 'foot'];
    if (highRiskLocations.some(location => data.lesionLocation.toLowerCase().includes(location))) {
      urgencyScore += 1;
      recommendationReason += '- Lesion located in high-risk anatomical site\n';
    }
    
    // GP assessment factor
    if (data.urgencyLevel.toLowerCase().includes('urgent') || 
        data.urgencyLevel.toLowerCase().includes('concern') ||
        data.urgencyLevel.toLowerCase().includes('malignancy')) {
      urgencyScore += 3;
      recommendationReason += '- Referring GP has expressed specific concerns\n';
    }
    
    // Set recommended timeframe based on urgency score
    if (urgencyScore >= 8) {
      recommendedTimeframe = '2 weeks (urgent)';
    } else if (urgencyScore >= 5) {
      recommendedTimeframe = '4 weeks (soon)';
    } else if (urgencyScore >= 3) {
      recommendedTimeframe = '6 weeks (routine)';
    } else {
      recommendedTimeframe = '12 weeks (non-urgent)';
    }
    
    // Specialty referral logic
    if (data.lesionLocation.toLowerCase().includes('face') || 
        data.lesionLocation.toLowerCase().includes('head') ||
        data.lesionLocation.toLowerCase().includes('neck')) {
      if (data.lesionType.toLowerCase().includes('scar') ||
          data.lesionType.toLowerCase().includes('cosmetic') ||
          data.additionalNotes.toLowerCase().includes('cosmetic')) {
        recommendedSpecialty = 'Plastic Surgery';
      }
    }
    
    if (data.lesionType.toLowerCase().includes('psych') || 
        data.additionalNotes.toLowerCase().includes('psych') ||
        data.additionalNotes.toLowerCase().includes('distress') ||
        data.additionalNotes.toLowerCase().includes('anxiety')) {
      recommendedSpecialty = 'Dermatology with Psychology support';
    }
    
    if (recommendationReason === '') {
      recommendationReason = '- Standard assessment based on clinical presentation';
    }
    
    return {
      urgencyScore,
      recommendedTimeframe,
      recommendedSpecialty,
      recommendationReason
    };
  };

  // Save draft
  const saveDraft = () => {
    // In a real app, this would save to database or local storage
    localStorage.setItem('referralDraft', JSON.stringify(formData));
    setIsDraftSaved(true);
    
    // Reset saved status after 3 seconds
    setTimeout(() => {
      setIsDraftSaved(false);
    }, 3000);
  };

  // Reset form
  const resetForm = () => {
    if (window.confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
      setFormData({
        patientName: '',
        nhsNumber: '',
        patientAge: '',
        dateOfBirth: '',
        gpPractice: '',
        referringGP: '',
        lesionType: '',
        lesionLocation: '',
        lesionSize: '',
        lesionDuration: '',
        growthRate: '',
        symptoms: [],
        familyHistory: '',
        previousBiopsies: '',
        currentMedications: '',
        biopsyResult: '',
        urgencyLevel: '',
        additionalNotes: '',
        photo: null
      });
      setTriageResult(null);
      setValidationErrors({});
    }
  };

  // Calculate age from DOB
  useEffect(() => {
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      
      setFormData(prev => ({ ...prev, patientAge: age.toString() }));
    }
  }, [formData.dateOfBirth]);

  return (
    <div className="referral-assessment-container">
      {/* Header */}
      <div className="assessment-header">
        <h2>
          <FileText className="icon" />
          New Dermatology Referral Assessment
        </h2>
        <div className="header-actions">
          <button className="btn secondary" onClick={resetForm} title="Reset form">
            <RotateCcw className="icon" /> Reset
          </button>
          
          <button className="btn secondary" onClick={saveDraft} title="Save draft">
            <Save className="icon" /> Save Draft
          </button>
          
          {isDraftSaved && (
            <span className="save-confirmation">
              <CheckCircle className="icon success" /> Draft saved
            </span>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          {/* Patient Information Section */}
          <div className="form-section">
            <h3>Patient Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="patientName">
                  Patient Name
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="nhsNumber">
                  NHS Number
                </label>
                <input
                  type="text"
                  id="nhsNumber"
                  name="nhsNumber"
                  placeholder="123 456 7890"
                  value={formData.nhsNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateOfBirth">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="patientAge">Age</label>
                <input
                  type="text"
                  id="patientAge"
                  name="patientAge"
                  value={formData.patientAge}
                  readOnly
                  className="readonly"
                />
                <small>Calculated from date of birth</small>
              </div>
            </div>
          </div>
          
          {/* Referrer Information Section */}
          <div className="form-section">
            <h3>Referrer Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gpPractice">
                  GP Practice
                </label>
                <input
                  type="text"
                  id="gpPractice"
                  name="gpPractice"
                  value={formData.gpPractice}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="referringGP">
                  Referring GP
                </label>
                <input
                  type="text"
                  id="referringGP"
                  name="referringGP"
                  value={formData.referringGP}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          {/* Lesion Details Section */}
          <div className="form-section">
            <h3>Lesion Details</h3>
            <div className="form-group">
              <label htmlFor="lesionType">
                Clinical Description <span className="required">*</span>
              </label>
              <textarea
                id="lesionType"
                name="lesionType"
                value={formData.lesionType}
                onChange={handleChange}
                placeholder="Describe the lesion appearance, color, texture, etc."
                rows={3}
                className={validationErrors.lesionType ? 'error' : ''}
              />
              {validationErrors.lesionType && (
                <span className="error-message">{validationErrors.lesionType}</span>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="lesionLocation">Location</label>
                <input
                  type="text"
                  id="lesionLocation"
                  name="lesionLocation"
                  value={formData.lesionLocation}
                  onChange={handleChange}
                  placeholder="e.g. Left forearm, dorsal surface"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lesionSize">Size</label>
                <input
                  type="text"
                  id="lesionSize"
                  name="lesionSize"
                  value={formData.lesionSize}
                  onChange={handleChange}
                  placeholder="e.g. 5mm x 8mm"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="lesionDuration">Duration</label>
                <input
                  type="text"
                  id="lesionDuration"
                  name="lesionDuration"
                  value={formData.lesionDuration}
                  onChange={handleChange}
                  placeholder="How long has the lesion been present?"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="growthRate">Growth Rate</label>
                <select
                  id="growthRate"
                  name="growthRate"
                  value={formData.growthRate}
                  onChange={handleChange}
                >
                  <option value="">Select growth rate</option>
                  <option value="stable">Stable - No change</option>
                  <option value="slow">Slow - Gradual change</option>
                  <option value="moderate">Moderate - Noticeable change</option>
                  <option value="rapid">Rapid - Significant change</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Symptoms (select all that apply)</label>
              <div className="checkbox-group">
                {['Asymptomatic', 'Itching', 'Pain', 'Bleeding', 'Ulceration', 'Color changes', 'Irregular borders', 'Fast-growing'].map(symptom => (
                  <label key={symptom} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.symptoms.includes(symptom)}
                      onChange={() => handleSymptomChange(symptom)}
                    />
                    {symptom}
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="photo">Clinical Photograph</label>
              <div className="file-upload">
                <label className="file-upload-label">
                  <Camera className="icon" />
                  {formData.photo ? formData.photo.name : 'Upload image'}
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="file-input"
                  />
                </label>
              </div>
              <small>Upload clinical photo if available (JPEG or PNG, max 5MB)</small>
            </div>
          </div>
          
          {/* Medical History Section */}
          <div className="form-section">
            <h3>Relevant Medical History</h3>
            
            <div className="form-group">
              <label htmlFor="familyHistory">Family History</label>
              <textarea
                id="familyHistory"
                name="familyHistory"
                value={formData.familyHistory}
                onChange={handleChange}
                placeholder="Any family history of skin cancer or similar conditions?"
                rows={2}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="previousBiopsies">Previous Biopsies</label>
              <textarea
                id="previousBiopsies"
                name="previousBiopsies"
                value={formData.previousBiopsies}
                onChange={handleChange}
                placeholder="Details of any previous skin biopsies or excisions"
                rows={2}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="currentMedications">Current Medications</label>
              <textarea
                id="currentMedications"
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleChange}
                placeholder="List current medications"
                rows={2}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="biopsyResult">Recent Biopsy Results (if applicable)</label>
              <textarea
                id="biopsyResult"
                name="biopsyResult"
                value={formData.biopsyResult}
                onChange={handleChange}
                placeholder="Results of any recent biopsies"
                rows={2}
              />
            </div>
          </div>
          
          {/* Referral Details Section */}
          <div className="form-section">
            <h3>Referral Details</h3>
            
            <div className="form-group">
              <label htmlFor="urgencyLevel">GP Assessment of Urgency</label>
              <select
                id="urgencyLevel"
                name="urgencyLevel"
                value={formData.urgencyLevel}
                onChange={handleChange}
              >
                <option value="">Select urgency level</option>
                <option value="Routine">Routine</option>
                <option value="Soon">Soon - Within 4-6 weeks</option>
                <option value="Urgent">Urgent - Within 2 weeks</option>
                <option value="GP concerned about malignancy">GP concerned about malignancy</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="additionalNotes">Additional Notes</label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Any other relevant information"
                rows={3}
              />
            </div>
          </div>
        </div>
        
        {/* Submit button */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn primary" 
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <Brain className="icon spin" /> Calculating Triage...
              </>
            ) : (
              <>
                <Send className="icon" /> Calculate Referral Priority
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Results Section */}
      {triageResult && !isCalculating && (
        <div className={`nhsuk-care-card ${triageResult.urgencyScore >= 8 ? 'nhsuk-care-card--immediate' : triageResult.urgencyScore >= 5 ? 'nhsuk-care-card--urgent' : 'nhsuk-care-card--non-urgent'}`}>
          <h3 className="nhsuk-care-card__heading">
            <AlertCircle className="icon" />
            Triage Assessment Result
          </h3>
          
          <div className="nhsuk-care-card__content">
            <div className="result-grid">
              <div className="result-item">
                <div className="result-label">Urgency Level:</div>
                <div className={`result-value urgency-${
                  triageResult.urgencyScore >= 8 ? 'high' : 
                  triageResult.urgencyScore >= 5 ? 'medium' : 'low'
                }`}>
                  {triageResult.urgencyScore >= 8 ? (
                    <AlertTriangle className="icon" />
                  ) : triageResult.urgencyScore >= 5 ? (
                    <Clock className="icon" />
                  ) : (
                    <Info className="icon" />
                  )}
                  {triageResult.recommendedTimeframe}
                </div>
              </div>
              
              <div className="result-item">
                <div className="result-label">Recommended Specialty:</div>
                <div className="result-value">{triageResult.recommendedSpecialty}</div>
              </div>
              
              {triageResult.categorization && (
                <div className="result-item">
                  <div className="result-label">AI-Suggested Category:</div>
                  <div className={`result-value category-${triageResult.categorization.category.toLowerCase().replace(/[- ]/g, '-')}`}>
                    {triageResult.categorization.category === ClinicalCaseCategory.URGENT ? (
                      <AlertTriangle className="icon" />
                    ) : triageResult.categorization.category === ClinicalCaseCategory.ROUTINE ? (
                      <Clock className="icon" />
                    ) : triageResult.categorization.category === ClinicalCaseCategory.NON_PRIORITY ? (
                      <Info className="icon" />
                    ) : (
                      <Brain className="icon" />
                    )}
                    {triageResult.categorization.category}
                    <div className="confidence-indicator">
                      <small>Confidence: {Math.round(triageResult.categorization.confidence * 100)}%</small>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="result-item full-width">
                <div className="result-label">Recommendation Rationale:</div>
                <div className="result-value reason">
                  <pre>{triageResult.recommendationReason}</pre>
                </div>
              </div>
              
              {triageResult.categorization && (
                <div className="result-item full-width">
                  <div className="result-label">AI Categorization Rationale:</div>
                  <div className="result-value reason">
                    <pre>{triageResult.categorization.rationale}</pre>
                  </div>
                </div>
              )}
            </div>
            
            <div className="result-disclaimer">
              <small>
                Note: This triage assessment is an automated recommendation. Final clinical prioritization 
                should be determined by the receiving clinical team based on full case review.
              </small>
            </div>
            
            <div className="chat-button-container">
              <button 
                className="btn primary chat-button"
                onClick={() => setIsChatOpen(true)}
              >
                <MessageSquare className="icon" /> Ask AI Assistant about this triage
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Assistant Component */}
      {triageResult && (
        <ChatAssistant 
          triageData={{
            patientInfo: {
              age: formData.patientAge,
              symptoms: formData.symptoms || []
            },
            assessment: {
              urgencyScore: triageResult.urgencyScore,
              recommendedTimeframe: triageResult.recommendedTimeframe,
              recommendedSpecialty: triageResult.recommendedSpecialty,
              recommendationReason: triageResult.recommendationReason,
              categorization: triageResult.categorization
            }
          }} 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </div>
  );
};

export default NewReferralAssessment;
