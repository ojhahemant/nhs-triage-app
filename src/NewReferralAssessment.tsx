import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Clock, Brain, FileText, Send, Save, RotateCcw, CheckCircle, AlertTriangle, Info, MessageSquare, Download, Server, FileCheck, Loader, Image as ImageIcon } from 'lucide-react';
import './NewReferralAssessment.css';
import ChatAssistant from './components/ChatAssistant';
import { categorizeClinicalCase, ClinicalCaseCategory, fetchAvailableModels, OpenAIModel } from './services/openaiService';
import { usePDF } from 'react-to-pdf';
import { extractTextFromDocument, VisionModel } from './utils/documentParser';

// Define TypeScript interfaces for our data structures
interface FormDataType {
  lesionType: string;
  document: File | null;
  extractedText: string;
  imageDescription: string;
  selectedVisionModel: VisionModel;
  includeImageDescription: boolean;
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

const NewReferralAssessment = () => {  const [formData, setFormData] = useState<FormDataType>({
    lesionType: '',
    document: null,
    extractedText: '',
    imageDescription: '',
    selectedVisionModel: VisionModel.GPT_4O,
    includeImageDescription: false
  });
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isDraftSaved, setIsDraftSaved] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(false);
  const [availableModels, setAvailableModels] = useState<OpenAIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(''); // Will be set to default in useEffect
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);
  // Track which model was used for the last categorization
  const [lastUsedModel, setLastUsedModel] = useState<string>('');
  // Reference for the results section to generate PDF
  const { toPDF, targetRef } = usePDF({
    filename: 'nhs-referral-assessment.pdf',
    page: { margin: 20 }
  });
    // Fetch available models on component mount
  useEffect(() => {
    const getModels = async () => {
      setIsLoadingModels(true);
      try {
        const models = await fetchAvailableModels();
        
        if (models.length > 0) {
          setAvailableModels(models);
          
          // Set default model (either from environment or first available)
          const defaultModel = process.env.REACT_APP_OPENAI_MODEL || models[0].name;
          setSelectedModel(defaultModel);
        } else {
          // If no models are returned, add default models
          const defaultModels = [
            { name: 'gpt-4o', size: 0, modified_at: '', digest: '' },
            { name: 'gpt-4o-mini', size: 0, modified_at: '', digest: '' },
            { name: 'gpt-4-turbo', size: 0, modified_at: '', digest: '' }
          ];
          setAvailableModels(defaultModels);
          setSelectedModel(process.env.REACT_APP_OPENAI_MODEL || 'gpt-4o');
        }
      } catch (error) {
        console.error('Error fetching models:', error);
        // If the API call fails, set some default models
        const defaultModels = [
          { name: 'gpt-4o', size: 0, modified_at: '', digest: '' },
          { name: 'gpt-4o-mini', size: 0, modified_at: '', digest: '' },
          { name: 'gpt-4-turbo', size: 0, modified_at: '', digest: '' }
        ];
        setAvailableModels(defaultModels);
        setSelectedModel(process.env.REACT_APP_OPENAI_MODEL || 'gpt-4o');
      } finally {
        setIsLoadingModels(false);
      }
    };
    
    getModels();
  }, []);

  // Load saved draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('nhsReferralDraft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        // Ask user if they want to load the saved draft
        if (window.confirm('Found saved progress from a previous session. Would you like to continue where you left off?')) {
          setFormData(draftData);
        }
      } catch (error) {
        console.error('Error loading saved draft:', error);
      }
    }
  }, []);
  
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

  // Handle document upload and text extraction
  const [isExtractingText, setIsExtractingText] = useState<boolean>(false);
  const [usingOcr, setUsingOcr] = useState<boolean>(false);
  
  const handleDocumentUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, document: file }));
      
      // Extract text from document
      setIsExtractingText(true);
      setUsingOcr(false);
      
      try {
        // Check if it's an image or potentially a scanned document
        if (file.type.startsWith('image/') || 
            ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].some(ext => file.name.toLowerCase().endsWith(ext))) {
          setUsingOcr(true);
        }
        
        const result = await extractTextFromDocument(
          file, 
          formData.selectedVisionModel,
          formData.includeImageDescription
        );
        
        // If we weren't initially using OCR but the result indicates OCR was used
        if (!usingOcr && typeof result.extractedText === 'string' && 
            result.extractedText.includes('OCR with')) {
          setUsingOcr(true);
        }
        
        setFormData(prev => ({ 
          ...prev, 
          extractedText: result.extractedText,
          imageDescription: result.imageDescription || ''
        }));
      } catch (error) {
        console.error('Error extracting text from document:', error);
        // Show error to user
        alert(`Failed to extract text from document: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsExtractingText(false);
      }
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const errors: ValidationErrors = {};
    
    // Only require clinical description - the most essential field
    if (!formData.lesionType.trim()) {
      errors.lesionType = 'Please describe the clinical condition - this helps the AI provide better assessment';
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
      // Create an empty result structure that will only contain AI categorization
      const result: TriageResult = {
        urgencyScore: 0,
        recommendedTimeframe: '',
        recommendedSpecialty: '',
        recommendationReason: ''      };      // Use OpenAI to categorize the case
      const additionalContext = {
        extractedDocumentText: formData.extractedText || '',
        imageDescription: formData.imageDescription || ''
      };
      
      try {        console.log('Starting clinical case categorization...');
          // Use default model if no model is selected, ensure no trailing whitespace
        const modelToUse = (selectedModel || process.env.REACT_APP_OPENAI_MODEL || 'gpt-4o').trim();
        console.log('Using model:', modelToUse);
        
        // Save the model used for display in results
        setLastUsedModel(modelToUse);
        
        const categorization = await categorizeClinicalCase(
          formData.lesionType,
          additionalContext,
          modelToUse,
          0.2 // Lower temperature for more deterministic responses
        );
        console.log('Categorization completed:', categorization);
        
        // Add categorization to the result
        result.categorization = categorization;
        
        // Set urgency score based on AI category for UI display
        if (categorization.category === ClinicalCaseCategory.URGENT) {
          result.urgencyScore = 9; // High urgency
        } else if (categorization.category === ClinicalCaseCategory.ROUTINE) {
          result.urgencyScore = 5; // Medium urgency
        } else {
          result.urgencyScore = 2; // Low urgency
        }
      } catch (error) {
        console.error('Error during case categorization:', error);
        // Show an error message if categorization fails
        result.recommendationReason = 'Error connecting to AI service. Please try again later.';
      }
      
      setTriageResult(result);
    } catch (error) {
      console.error('Error during triage calculation:', error);
      // Handle errors appropriately
    } finally {
      setIsCalculating(false);
    }
  };

  // Save draft
  const saveDraft = () => {
    // Save to browser storage for user convenience
    localStorage.setItem('nhsReferralDraft', JSON.stringify(formData));
    setIsDraftSaved(true);
    
    // Reset saved status after 3 seconds
    setTimeout(() => {
      setIsDraftSaved(false);
    }, 3000);
  };  // Reset form
  const resetForm = () => {
    if (window.confirm('Are you sure you want to clear all form data? Your progress will be lost unless you save first.')) {
      setFormData({
        lesionType: '',
        document: null,
        extractedText: '',
        imageDescription: '',
        selectedVisionModel: VisionModel.GPT_4O,
        includeImageDescription: false
      });
      setTriageResult(null);
      setValidationErrors({});
    }
  };

  // Handle model selection
  const handleModelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  // For cleaning up object URLs
  const [imageObjectURL, setImageObjectURL] = useState<string | null>(null);

  // Create and cleanup image object URLs
  useEffect(() => {
    if (formData.document && formData.document.type.startsWith('image/')) {
      // Create the object URL
      const objectUrl = URL.createObjectURL(formData.document);
      setImageObjectURL(objectUrl);
      
      // Cleanup function to revoke the object URL when no longer needed
      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      };
    }
  }, [formData.document]);

  return (
    <div className="referral-assessment-container">
      {/* Header */}      <div className="assessment-header">
        <h2>
          <FileText className="icon" />
          Quick Clinical Assessment
        </h2>
        <div className="header-actions">
          <button className="btn secondary" onClick={resetForm} title="Clear all fields and start over">
            <RotateCcw className="icon" /> Clear Form
          </button>
          
          <button className="btn secondary" onClick={saveDraft} title="Save your progress">
            <Save className="icon" /> Save Progress
          </button>
          
          {isDraftSaved && (
            <span className="save-confirmation">
              <CheckCircle className="icon success" /> Progress saved
            </span>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-container">
          {/* Clinical Condition Details Section */}
          <div className="form-section">
            <h3>Clinical Condition Details</h3>
            <div className="form-group">
              <label htmlFor="lesionType">
                Describe the Clinical Condition <span className="required">*</span>
              </label>
              <textarea
                id="lesionType"
                name="lesionType"
                value={formData.lesionType}
                onChange={handleChange}
                placeholder="Describe what you observe: appearance, color, texture, size, changes over time, patient concerns..."
                rows={4}
                className={validationErrors.lesionType ? 'error' : ''}
              />
              {validationErrors.lesionType && (
                <span className="error-message">
                  <AlertTriangle className="icon" size={16} /> {validationErrors.lesionType}
                </span>
              )}
            </div>
            
            {/* Document Upload Section */}
            <div className="form-group">
              <label htmlFor="document">Upload Supporting Documents (Optional)</label>
              <div className="file-upload">
                <label className="file-upload-label">
                  <FileText className="icon" />
                  {formData.document ? formData.document.name : 'Choose files to upload'}
                  <input
                    type="file"
                    id="document"
                    name="document"
                    accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
                    onChange={handleDocumentUpload}
                    className="file-input"
                  />
                </label>
              </div>
              <small>Upload letters, reports, or photos. We can read text from scanned documents (max 10MB)</small>
              
              {/* Vision model selection and options */}
              <div className="document-processing-options">
                <div className="vision-model-selector">
                  <label htmlFor="visionModel">
                    <Server className="icon small" /> AI Reading Model:
                  </label>
                  <select 
                    id="visionModel" 
                    value={formData.selectedVisionModel} 
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      selectedVisionModel: e.target.value as VisionModel 
                    }))}
                    className="vision-model-select"
                  >
                    <option value={VisionModel.GPT_4O}>GPT-4o (Best quality)</option>
                    <option value={VisionModel.GPT_4O_MINI}>GPT-4o Mini (Faster)</option>
                  </select>
                </div>
                
                <div className="image-description-toggle">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.includeImageDescription}
                      onChange={() => setFormData(prev => ({ 
                        ...prev, 
                        includeImageDescription: !prev.includeImageDescription 
                      }))}
                    />
                    Describe images in detail (helpful for photos)
                  </label>
                </div>
              </div>              
              {/* Text extraction status and preview */}
              {isExtractingText && (
                <div className={`extraction-status ${usingOcr ? 'ocr' : ''}`}>
                  <Loader className="icon spin" /> 
                  {usingOcr 
                    ? `Reading document with ${formData.selectedVisionModel}${formData.includeImageDescription ? ' and creating description' : ''}...` 
                    : 'Reading text from document...'}
                </div>
              )}                
              
              {formData.extractedText && !isExtractingText && (
                <div className={`extracted-text-preview ${usingOcr ? 'ocr' : ''}`}>
                  <div className="preview-header">
                    <FileCheck className="icon" /> 
                    {usingOcr
                      ? 'AI read this text:' 
                      : 'Text found in document:'}
                    <span className="character-count">
                      ({formData.extractedText.length} characters)
                    </span>
                  </div>
                  <div className="preview-content">
                    {formData.extractedText.slice(0, 300)}
                    {formData.extractedText.length > 300 && '...'}
                  </div>
                </div>
              )}
              
              {/* Image description preview */}
              {formData.imageDescription && !isExtractingText && formData.document && (
                <div className="image-with-description-preview">
                  <div className="image-with-description-title">
                    <ImageIcon className="icon" /> 
                    AI Image Analysis
                    <span className="image-model-tag">
                      <Server className="icon" /> {formData.selectedVisionModel}
                    </span>
                  </div>
                  
                  <div className="image-preview-container">
                    {/* Display image thumbnail if it's an image file */}
                    {formData.document && formData.document.type.startsWith('image/') && imageObjectURL && (
                      <img 
                        src={imageObjectURL}
                        alt="Uploaded document" 
                        className="image-thumbnail"
                        onError={(e) => {
                          // Handle image loading errors
                          console.error("Error loading image thumbnail");
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    
                    {/* Show document icon for non-image files */}
                    {formData.document && !formData.document.type.startsWith('image/') && (
                      <div className="file-icon-container">
                        <FileText size={64} className="file-icon" />
                        <div className="file-extension">
                          {formData.document.name.split('.').pop()?.toUpperCase()}
                        </div>
                      </div>
                    )}
                    
                    <div className="image-description-content">
                      <strong>AI Description: </strong>
                      {formData.imageDescription}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Submit button */}
        <div className="form-actions">
          {/* LLM Model Selection */}
          <div className="model-selector">
            <label htmlFor="llmModel">
              <Server className="icon small" /> AI Analysis Model:
            </label>
            <select 
              id="llmModel" 
              value={selectedModel} 
              onChange={handleModelChange}
              disabled={isCalculating || isLoadingModels}
              className="model-select"
            >
              {isLoadingModels ? (
                <option value="">Loading models...</option>
              ) : availableModels.length === 0 ? (
                <option value="">No models available</option>
              ) : (
                availableModels.map(model => (
                  <option key={model.name} value={model.name}>
                    {model.name}
                  </option>
                ))
              )}
            </select>
          </div>

          
          <button 
            type="submit" 
            className="btn primary" 
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <Brain className="icon spin" /> Analyzing with AI...
              </>
            ) : (
              <>
                <Send className="icon" /> Get AI Assessment
              </>
            )}
          </button>
        </div>
      </form>
        {/* Results Section */}
      {triageResult && !isCalculating && (
        <div 
          ref={targetRef}
          className={`nhsuk-care-card ${triageResult.urgencyScore >= 8 ? 'nhsuk-care-card--immediate' : triageResult.urgencyScore >= 5 ? 'nhsuk-care-card--urgent' : 'nhsuk-care-card--non-urgent'}`}
        >
          <h3 className="nhsuk-care-card__heading">
            <Brain className="icon" />
            AI Assessment Results
          </h3>
          <div className="nhsuk-care-card__content">
            <div className="result-grid">
              {triageResult.categorization ? (
                <>
                  <div className="result-item">
                    <div className="result-label">Recommended Priority Level:</div>
                    <div className={`result-value category-${triageResult.categorization.category.toLowerCase().replace(/[- ]/g, '-')}`}>
                      {triageResult.categorization.category === ClinicalCaseCategory.URGENT ? (
                        <AlertTriangle className="icon" />
                      ) : triageResult.categorization.category === ClinicalCaseCategory.ROUTINE ? (
                        <Clock className="icon" />
                      ) : triageResult.categorization.category === ClinicalCaseCategory.NON_PRIORITY ? (
                        <Info className="icon" />
                      ) : (
                        <Brain className="icon" />
                      )}                      {triageResult.categorization.category}
                      <div className="confidence-indicator">
                        <div className="confidence-gauge-container">
                          <div 
                            className={`confidence-gauge ${
                              triageResult.categorization.confidence >= 0.8 ? 'high-confidence' : 
                              triageResult.categorization.confidence >= 0.5 ? 'medium-confidence' : 
                              'low-confidence'
                            }`}
                            style={{ width: `${Math.round(triageResult.categorization.confidence * 100)}%` }}
                          ></div>
                        </div>
                        <small>AI Confidence: {Math.round(triageResult.categorization.confidence * 100)}%</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="result-item full-width">
                    <div className="result-label">AI Reasoning:</div>
                    <div className="result-value reason">
                      <pre>{triageResult.categorization.rationale}</pre>
                    </div>
                  </div>
                </>
              ) : (
                <div className="result-item full-width">
                  <div className="result-label">Error:</div>
                  <div className="result-value reason">
                    <pre>Unable to obtain AI assessment. Please try again.</pre>
                  </div>
                </div>
              )}
            </div>              <div className="result-disclaimer">
              <small>
                <strong>Important:</strong> This AI assessment from <strong>{lastUsedModel}</strong> is a recommendation only. 
                The final clinical priority should be determined by the receiving specialist team based on full case review.
              </small>
            </div>
            
            <div className="action-buttons-container">
              <button 
                className="btn primary chat-button"
                onClick={() => setIsChatOpen(true)}
              >
                <MessageSquare className="icon" /> Ask AI Questions
              </button>
                <button 
                className="btn secondary pdf-button"
                onClick={() => {
                  setIsPdfGenerating(true);
                  // Handle PDF generation
                  setTimeout(() => {
                    toPDF();
                    setIsPdfGenerating(false);
                  }, 100);
                }}
                disabled={isPdfGenerating}
              >
                <Download className="icon" /> 
                {isPdfGenerating ? 'Creating Report...' : 'Download Report'}
              </button>
            </div>
          </div>
        </div>
      )}
        {/* Chat Assistant Component */}
      {triageResult && triageResult.categorization && (
        <ChatAssistant          triageData={{
            patientInfo: {
              age: "Unknown",
              symptoms: []
            },
            assessment: {
              urgencyScore: triageResult.urgencyScore,
              recommendedTimeframe: '',
              recommendedSpecialty: '',
              recommendationReason: '',
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
