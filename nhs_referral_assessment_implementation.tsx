import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, X, Brain, Camera, FileText, Send, Save, RotateCcw, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const NewReferralAssessment = () => {
  const [formData, setFormData] = useState({
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

  const [triageResult, setTriageResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showSyntheticData, setShowSyntheticData] = useState(false);

  // Synthetic test data sets
  const syntheticDataSets = [
    {
      name: "Urgent Melanoma Case",
      data: {
        patientName: "John Smith",
        nhsNumber: "123 456 7890",
        patientAge: "67",
        dateOfBirth: "1957-03-15",
        gpPractice: "Riverside Medical Centre",
        referringGP: "Dr. Sarah Johnson",
        lesionType: "Dark pigmented lesion on back, irregular borders, recent changes in color and size. Suspicious for melanoma. Patient reports lesion has doubled in size over past 3 months.",
        lesionLocation: "Upper back, left scapular region",
        lesionSize: "15mm x 12mm",
        lesionDuration: "Patient noticed 18 months ago, significant changes in last 3 months",
        growthRate: "rapid",
        symptoms: ["Fast-growing", "Irregular borders", "Color changes", "Bleeding"],
        familyHistory: "Father died of melanoma at age 72",
        previousBiopsies: "None",
        currentMedications: "Atorvastatin 20mg, Ramipril 5mg",
        biopsyResult: "",
        urgencyLevel: "GP concerned about malignancy",
        additionalNotes: "Patient is a retired builder with significant sun exposure history. Very anxious about changes in lesion appearance."
      }
    },
    {
      name: "Routine Benign Mole",
      data: {
        patientName: "Emma Wilson",
        nhsNumber: "987 654 3210",
        patientAge: "34",
        dateOfBirth: "1990-08-22",
        gpPractice: "Central Health Clinic",
        referringGP: "Dr. Michael Brown",
        lesionType: "Well-circumscribed brown mole on arm, stable appearance, patient concerned about cosmetic appearance",
        lesionLocation: "Left forearm",
        lesionSize: "8mm diameter",
        lesionDuration: "Present since childhood, no recent changes",
        growthRate: "stable",
        symptoms: [],
        familyHistory: "No family history of skin cancer",
        previousBiopsies: "None",
        currentMedications: "None",
        biopsyResult: "",
        urgencyLevel: "Routine",
        additionalNotes: "Patient requesting removal for cosmetic reasons. No concerning features on examination."
      }
    },
    {
      name: "MDT Review - Aesthetic Concern",
      data: {
        patientName: "Sarah Thompson",
        nhsNumber: "456 789 0123",
        patientAge: "28",
        dateOfBirth: "1996-11-10",
        gpPractice: "Oakwood Surgery",
        referringGP: "Dr. Lisa Chen",
        lesionType: "Facial scar from childhood accident causing significant psychological distress and social anxiety",
        lesionLocation: "Left cheek, extending from temple to jaw line",
        lesionSize: "7cm linear scar",
        lesionDuration: "15 years (from childhood accident)",
        growthRate: "stable",
        symptoms: [],
        familyHistory: "No relevant family history",
        previousBiopsies: "None applicable",
        currentMedications: "Sertraline 50mg for anxiety",
        biopsyResult: "N/A",
        urgencyLevel: "Psychological impact assessment needed",
        additionalNotes: "Patient reports severe impact on confidence, avoiding social situations, relationship difficulties. Currently seeing counselor for body dysmorphia concerns."
      }
    },
    {
      name: "Urgent SCC Case",
      data: {
        patientName: "Robert Jones",
        nhsNumber: "789 012 3456",
        patientAge: "72",
        dateOfBirth: "1952-05-03",
        gpPractice: "Valley View Practice",
        referringGP: "Dr. Ahmed Patel",
        lesionType: "Ulcerated lesion on lower lip, non-healing for 6 weeks, raised edges, central ulceration. Highly suspicious for squamous cell carcinoma.",
        lesionLocation: "Lower lip, right side",
        lesionSize: "12mm x 8mm",
        lesionDuration: "First noticed 8 weeks ago, progressively enlarging",
        growthRate: "rapid",
        symptoms: ["Ulcerated", "Bleeding", "Fast-growing", "Scabbing"],
        familyHistory: "No family history of cancer",
        previousBiopsies: "None",
        currentMedications: "Metformin 500mg BD, Amlodipine 5mg",
        biopsyResult: "",
        urgencyLevel: "Urgent - suspected SCC",
        additionalNotes: "Patient is a farmer with extensive sun exposure. Lesion appeared after minor trauma but has not healed. Very concerned appearance."
      }
    },
    {
      name: "Non-Priority Cosmetic",
      data: {
        patientName: "Jennifer Davis",
        nhsNumber: "234 567 8901",
        patientAge: "45",
        dateOfBirth: "1979-09-18",
        gpPractice: "Meadowbrook Surgery",
        referringGP: "Dr. Rachel Green",
        lesionType: "Multiple small skin tags on neck, purely cosmetic concern",
        lesionLocation: "Neck and axillary regions",
        lesionSize: "2-5mm each, approximately 8 lesions",
        lesionDuration: "Gradually appeared over 5 years",
        growthRate: "slow",
        symptoms: [],
        familyHistory: "Mother had similar skin tags",
        previousBiopsies: "None",
        currentMedications: "None",
        biopsyResult: "",
        urgencyLevel: "Non-urgent, cosmetic",
        additionalNotes: "Patient finds lesions aesthetically displeasing but no functional impact. Aware this may not be NHS funded."
      }
    }
  ];

  const symptoms = [
    'Ulcerated', 'Bleeding', 'Scabbing', 'Fast-growing', 
    'Irregular borders', 'Color changes', 'Itching', 'Pain',
    'Raised edges', 'Non-healing', 'Recent changes', 'Multiple colors'
  ];

  const growthRates = [
    { value: '', label: 'Select growth rate' },
    { value: 'rapid', label: 'Rapid (days to weeks)' },
    { value: 'moderate', label: 'Moderate (months)' },
    { value: 'slow', label: 'Slow (years)' },
    { value: 'stable', label: 'Stable/No change' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSymptomChange = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const validateForm = () => {
    const errors = {};
    const required = ['patientName', 'patientAge', 'lesionType', 'growthRate'];
    
    required.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        errors[field] = 'This field is required';
      }
    });

    // Age validation
    if (formData.patientAge && (isNaN(formData.patientAge) || formData.patientAge < 0 || formData.patientAge > 120)) {
      errors.patientAge = 'Please enter a valid age between 0 and 120';
    }

    // NHS Number validation (basic format check)
    if (formData.nhsNumber && !formData.nhsNumber.match(/^\d{3}\s\d{3}\s\d{4}$/)) {
      errors.nhsNumber = 'NHS Number should be in format: 123 456 7890';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateTriage = () => {
    if (!validateForm()) {
      showNotification('Please correct the validation errors before proceeding', 'error');
      return;
    }

    setIsCalculating(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const result = performTriageCalculation();
      setTriageResult(result);
      setIsCalculating(false);
      showNotification('Triage assessment completed successfully!', 'success');
    }, 2500);
  };

  const performTriageCalculation = () => {
    let urgencyScore = 0;
    let priority = 'routine';
    let reasoning = [];

    const lesionText = formData.lesionType.toLowerCase();
    const biopsyText = formData.biopsyResult.toLowerCase();
    const notesText = formData.additionalNotes.toLowerCase();
    
    // Cancer keyword detection
    const cancerKeywords = ['melanoma', 'scc', 'squamous cell', 'basal cell', 'bcc', 'sarcoma', 'malignant', 'cancer', 'carcinoma'];
    const foundCancerKeywords = cancerKeywords.filter(keyword => 
      lesionText.includes(keyword) || biopsyText.includes(keyword) || notesText.includes(keyword)
    );
    
    if (foundCancerKeywords.length > 0) {
      urgencyScore += 8;
      reasoning.push(`Cancer-related keywords detected: ${foundCancerKeywords.join(', ')}`);
    }

    // Suspicious descriptors
    const suspiciousTerms = ['suspicious', 'concerning', 'irregular', 'ulcerated', 'non-healing', 'bleeding'];
    const foundSuspiciousTerms = suspiciousTerms.filter(term => 
      lesionText.includes(term) || notesText.includes(term)
    );
    
    if (foundSuspiciousTerms.length > 0) {
      urgencyScore += foundSuspiciousTerms.length * 2;
      reasoning.push(`Suspicious features: ${foundSuspiciousTerms.join(', ')}`);
    }

    // Growth rate scoring
    switch (formData.growthRate) {
      case 'rapid':
        urgencyScore += 4;
        reasoning.push('Rapid growth rate (+4 points)');
        break;
      case 'moderate':
        urgencyScore += 2;
        reasoning.push('Moderate growth rate (+2 points)');
        break;
      case 'slow':
        urgencyScore += 1;
        reasoning.push('Slow growth rate (+1 point)');
        break;
    }

    // Symptoms scoring
    const highRiskSymptoms = ['ulcerated', 'bleeding', 'fast-growing', 'non-healing'];
    const mediumRiskSymptoms = ['irregular borders', 'color changes', 'raised edges'];
    
    formData.symptoms.forEach(symptom => {
      if (highRiskSymptoms.includes(symptom.toLowerCase())) {
        urgencyScore += 3;
        reasoning.push(`High-risk symptom: ${symptom} (+3 points)`);
      } else if (mediumRiskSymptoms.includes(symptom.toLowerCase())) {
        urgencyScore += 2;
        reasoning.push(`Medium-risk symptom: ${symptom} (+2 points)`);
      } else {
        urgencyScore += 1;
        reasoning.push(`Symptom noted: ${symptom} (+1 point)`);
      }
    });

    // Age factor (older patients higher risk for skin cancer)
    if (formData.patientAge >= 65) {
      urgencyScore += 2;
      reasoning.push('Patient age ≥65 years (+2 points)');
    }

    // Family history
    if (formData.familyHistory && (formData.familyHistory.toLowerCase().includes('melanoma') || 
        formData.familyHistory.toLowerCase().includes('cancer'))) {
      urgencyScore += 2;
      reasoning.push('Family history of cancer (+2 points)');
    }

    // Biopsy results
    if (biopsyText.includes('malignant') || biopsyText.includes('positive')) {
      urgencyScore += 10;
      reasoning.push('Positive biopsy result (+10 points)');
    }

    // Priority determination
    if (urgencyScore >= 8 || foundCancerKeywords.length > 0) {
      priority = 'urgent';
    } else if (lesionText.includes('cosmetic') || lesionText.includes('aesthetic') || 
               notesText.includes('psychological') || notesText.includes('anxiety') ||
               formData.currentMedications.toLowerCase().includes('sertraline') ||
               formData.currentMedications.toLowerCase().includes('anxiety')) {
      priority = 'mdt';
    } else if (urgencyScore >= 4) {
      priority = 'routine';
    } else if (lesionText.includes('cosmetic') && urgencyScore < 3) {
      priority = 'non-priority';
    } else {
      priority = 'routine';
    }

    return {
      priority,
      urgencyScore: Math.min(urgencyScore, 15),
      reasoning,
      recommendation: getRecommendation(priority),
      waitTime: getWaitTime(priority),
      nextSteps: getNextSteps(priority),
      clinicalNotes: generateClinicalNotes()
    };
  };

  const getRecommendation = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'Immediate referral to plastic surgery. Schedule within 2-week cancer pathway. Consider expedited diagnostic workup if not already completed.';
      case 'routine':
        return 'Standard plastic surgery referral. Schedule within 18 weeks according to NHS guidelines. Continue monitoring for any changes.';
      case 'mdt':
        return 'Requires multi-disciplinary team review including psychology assessment. Schedule combined clinic appointment within 4-6 weeks.';
      case 'non-priority':
        return 'Consider alternative treatment options. NHS funding unlikely for purely cosmetic procedures. Discuss self-funding options with patient.';
      default:
        return 'Standard review required. Monitor and reassess if symptoms change.';
    }
  };

  const getWaitTime = (priority) => {
    switch (priority) {
      case 'urgent': return '1-2 weeks (2WW pathway)';
      case 'routine': return '12-18 weeks';
      case 'mdt': return '4-6 weeks';
      case 'non-priority': return 'Not applicable (NHS)';
      default: return '12-18 weeks';
    }
  };

  const getNextSteps = (priority) => {
    switch (priority) {
      case 'urgent':
        return [
          'Submit to e-Referral Service immediately',
          'Contact plastic surgery team directly',
          'Arrange urgent photography if possible',
          'Inform patient of 2-week pathway'
        ];
      case 'routine':
        return [
          'Submit to e-Referral Service',
          'Provide patient with information leaflet',
          'Advise patient to monitor for changes',
          'Schedule follow-up if needed'
        ];
      case 'mdt':
        return [
          'Submit to MDT coordinator',
          'Arrange psychology pre-assessment',
          'Gather psychological impact evidence',
          'Schedule combined clinic appointment'
        ];
      case 'non-priority':
        return [
          'Discuss cosmetic surgery options',
          'Provide private provider information',
          'Document patient understanding',
          'Offer reassurance about benign nature'
        ];
      default:
        return ['Submit standard referral', 'Monitor symptoms'];
    }
  };

  const generateClinicalNotes = () => {
    return `
PLASTIC SURGERY REFERRAL - AI TRIAGE ASSESSMENT

Patient: ${formData.patientName} (Age: ${formData.patientAge})
NHS Number: ${formData.nhsNumber}
Referring GP: ${formData.referringGP}

CLINICAL PRESENTATION:
${formData.lesionType}

LOCATION: ${formData.lesionLocation}
SIZE: ${formData.lesionSize}
DURATION: ${formData.lesionDuration}
GROWTH PATTERN: ${formData.growthRate}

SYMPTOMS: ${formData.symptoms.join(', ') || 'None reported'}

RELEVANT HISTORY:
- Family History: ${formData.familyHistory || 'None reported'}
- Previous Biopsies: ${formData.previousBiopsies || 'None'}
- Current Medications: ${formData.currentMedications || 'None'}

BIOPSY RESULTS: ${formData.biopsyResult || 'Pending/Not performed'}

ADDITIONAL NOTES:
${formData.additionalNotes}

AI ASSESSMENT COMPLETED: ${new Date().toLocaleString()}
    `.trim();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-50 border-red-500 text-red-700';
      case 'routine': return 'bg-green-50 border-green-500 text-green-700';
      case 'non-priority': return 'bg-purple-50 border-purple-500 text-purple-700';
      case 'mdt': return 'bg-orange-50 border-orange-500 text-orange-700';
      default: return 'bg-gray-50 border-gray-500 text-gray-700';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="w-6 h-6" />;
      case 'routine': return <Clock className="w-6 h-6" />;
      case 'non-priority': return <X className="w-6 h-6" />;
      case 'mdt': return <Brain className="w-6 h-6" />;
      default: return <Clock className="w-6 h-6" />;
    }
  };

  const loadSyntheticData = (dataSet) => {
    setFormData(dataSet.data);
    setTriageResult(null);
    setShowSyntheticData(false);
    showNotification(`Loaded test case: ${dataSet.name}`, 'success');
  };

  const saveDraft = () => {
    // Simulate saving to localStorage or backend
    localStorage.setItem('nhs_referral_draft', JSON.stringify(formData));
    setIsDraftSaved(true);
    showNotification('Draft saved successfully', 'success');
    setTimeout(() => setIsDraftSaved(false), 3000);
  };

  const clearForm = () => {
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
    showNotification('Form cleared', 'info');
  };

  const submitToEReferral = () => {
    // Simulate e-Referral submission
    const submissionData = {
      ...formData,
      triageResult,
      submissionId: `REF${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'submitted'
    };
    
    console.log('Submitting to e-Referral Service:', submissionData);
    showNotification('Successfully submitted to e-Referral Service', 'success');
    
    // Clear form after successful submission
    setTimeout(() => {
      clearForm();
    }, 2000);
  };

  const showNotification = (message, type) => {
    // This would integrate with a proper notification system
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/heic'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        showNotification('Please upload a JPEG, PNG, or HEIC image file', 'error');
        return;
      }
      
      if (file.size > maxSize) {
        showNotification('File size must be less than 10MB', 'error');
        return;
      }
      
      setFormData(prev => ({ ...prev, photo: file }));
      showNotification('Photo uploaded successfully', 'success');
    }
  };

  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('nhs_referral_draft');
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
        showNotification('Draft loaded from previous session', 'info');
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">New Referral Assessment</h1>
                <p className="text-gray-600 mt-1">AI-powered plastic surgery triage system</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSyntheticData(!showSyntheticData)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Test Data
                </button>
                <button
                  onClick={saveDraft}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isDraftSaved ? 'Saved!' : 'Save Draft'}
                </button>
                <button
                  onClick={clearForm}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear Form
                </button>
              </div>
            </div>
          </div>

          {/* Synthetic Data Selector */}
          {showSyntheticData && (
            <div className="p-6 bg-blue-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Load Test Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {syntheticDataSets.map((dataSet, index) => (
                  <button
                    key={index}
                    onClick={() => loadSyntheticData(dataSet)}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-left"
                  >
                    <h4 className="font-medium text-gray-900">{dataSet.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {dataSet.data.patientName} - Age {dataSet.data.patientAge}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Referral Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Patient Information</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Patient Demographics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange('patientName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.patientName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter patient full name"
                  />
                  {validationErrors.patientName && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.patientName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NHS Number
                  </label>
                  <input
                    type="text"
                    value={formData.nhsNumber}
                    onChange={(e) => handleInputChange('nhsNumber', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.nhsNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123 456 7890"
                  />
                  {validationErrors.nhsNumber && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.nhsNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={formData.patientAge}
                    onChange={(e) => handleInputChange('patientAge', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.patientAge ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter age"
                    min="0"
                    max="120"
                  />
                  {validationErrors.patientAge && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.patientAge}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GP Practice
                  </label>
                  <input
                    type="text"
                    value={formData.gpPractice}
                    onChange={(e) => handleInputChange('gpPractice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="GP practice name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referring GP
                  </label>
                  <input
                    type="text"
                    value={formData.referringGP}
                    onChange={(e) => handleInputChange('referringGP', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dr. Name"
                  />
                </div>
              </div>

              {/* Clinical Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesion Description *
                </label>
                <textarea
                  value={formData.lesionType}
                  onChange={(e) => handleInputChange('lesionType', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.lesionType ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows="4"
                  placeholder="Detailed description of the lesion, including appearance, characteristics, and any concerning features..."
                />
                {validationErrors.lesionType && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.lesionType}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location on Body
                  </label>
                  <input
                    type="text"
                    value={formData.lesionLocation}
                    onChange={(e) => handleInputChange('lesionLocation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., face, arm, back"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <input
                    type="text"
                    value={formData.lesionSize}
                    onChange={(e) => handleInputChange('lesionSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 5mm, 2cm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration & History
                </label>
                <textarea
                  value={formData.lesionDuration}
                  onChange={(e) => handleInputChange('lesionDuration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="When first noticed, progression over time..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Growth Rate *
                </label>
                <select
                  value={formData.growthRate}
                  onChange={(e) => handleInputChange('growthRate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.growthRate ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {growthRates.map(rate => (
                    <option key={rate.value} value={rate.value}>{rate.label}</option>
                  ))}
                </select>
                {validationErrors.growthRate && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.growthRate}</p>
                )}
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symptoms (check all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {symptoms.map(symptom => (
                    <label key={symptom} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.symptoms.includes(symptom)}
                        onChange={() => handleSymptomChange(symptom)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{symptom}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Medical History */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Family History
                  </label>
                  <textarea
                    value={formData.familyHistory}
                    onChange={(e) => handleInputChange('familyHistory', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    placeholder="Relevant family history of skin cancer or other cancers..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Biopsies
                  </label>
                  <textarea
                    value={formData.previousBiopsies}
                    onChange={(e) => handleInputChange('previousBiopsies', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    placeholder="Any previous biopsies or skin procedures..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    value={formData.currentMedications}
                    onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    placeholder="List current medications and dosages..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biopsy Results (if available)
                  </label>
                  <textarea
                    value={formData.biopsyResult}
                    onChange={(e) => handleInputChange('biopsyResult', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    placeholder="Enter biopsy results or histology report..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Any additional clinical notes, patient concerns, or relevant information..."
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinical Photography
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('photo-upload').click()}
                >
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Click to upload clinical photo</p>
                    <p>or drag and drop</p>
                    <p className="text-xs mt-2">Supports: JPG, PNG, HEIC (Max 10MB)</p>
                  </div>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  {formData.photo && (
                    <div className="mt-3 text-sm text-green-600">
                      ✓ Photo uploaded: {formData.photo.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={calculateTriage}
                disabled={isCalculating}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium flex items-center justify-center gap-2"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing AI Assessment...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Calculate Triage Priority
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Triage Result Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">AI Triage Assessment</h2>
            </div>
            <div className="p-6">
              {triageResult ? (
                <div className="space-y-6">
                  {/* Priority Result */}
                  <div className={`p-6 rounded-lg border-2 ${getPriorityColor(triageResult.priority)}`}>
                    <div className="flex items-center gap-3 mb-4">
                      {getPriorityIcon(triageResult.priority)}
                      <h3 className="text-xl font-bold uppercase">
                        {triageResult.priority.replace('-', ' ')}
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><strong>Urgency Score:</strong> {triageResult.urgencyScore}/15</p>
                      <p><strong>Estimated Wait:</strong> {triageResult.waitTime}</p>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Clinical Recommendation
                    </h4>
                    <p className="text-sm text-gray-700">{triageResult.recommendation}</p>
                  </div>

                  {/* AI Reasoning */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">AI Assessment Reasoning</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {triageResult.reasoning.map((reason, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-600">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Recommended Next Steps</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {triageResult.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={submitToEReferral}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Submit to e-Referral Service
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => console.log('Generating clinical notes:', triageResult.clinicalNotes)}
                        className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Clinical Notes
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                      >
                        Print Report
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Complete the form and click "Calculate Triage Priority" to see AI assessment
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReferralAssessment;