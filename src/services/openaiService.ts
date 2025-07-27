import OpenAI from 'openai';

// Get environment variables with fallbacks
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || '';
const DEFAULT_MODEL = process.env.REACT_APP_OPENAI_MODEL || 'gpt-4o';
const DEFAULT_TEMPERATURE = parseFloat(process.env.REACT_APP_OPENAI_TEMPERATURE || '0.7');

console.log('OpenAI Service Initialized with:');
console.log(`- DEFAULT_MODEL: ${DEFAULT_MODEL}`);
console.log(`- DEFAULT_TEMPERATURE: ${DEFAULT_TEMPERATURE}`);
console.log(`- API Key configured: ${OPENAI_API_KEY ? 'Yes' : 'No'}`);
console.log(`- API Key length: ${OPENAI_API_KEY.length}`);
console.log(`- Raw API Key env var: "${process.env.REACT_APP_OPENAI_API_KEY}"`);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
});

interface TriageDataType {
  patientInfo: {
    age: string;
    symptoms: string[];
  };
  assessment: {
    urgencyScore: number;
    recommendedTimeframe: string;
    recommendedSpecialty: string;
    recommendationReason: string;
    categorization?: {
      category: ClinicalCaseCategory;
      confidence: number;
      rationale: string;
    };
  };
}

// Available clinical case categories based on Plastic Surgery expert guidelines
export enum ClinicalCaseCategory {
  URGENT = "URGENT",
  ROUTINE = "ROUTINE", 
  NON_PRIORITY = "NON_PRIORITY"
}

// Interface for categorization result
export interface CategorizationResult {
  category: ClinicalCaseCategory;
  confidence: number;
  rationale: string;
}

// Interface for OpenAI model information
export interface OpenAIModel {
  name: string;
  size: number;
  modified_at: string;
  digest: string;
}

/**
 * Fetches the list of available models from OpenAI
 * @returns Array of OpenAIModel objects or empty array if failed
 */
export const fetchAvailableModels = async (): Promise<OpenAIModel[]> => {
  try {
    console.log('Fetching available models from OpenAI');
    
    if (!OPENAI_API_KEY) {
      console.warn('No OpenAI API key configured, returning default models');
      return getDefaultModels();
    }

    const models = await openai.models.list();
    
    // Filter to only include chat completion models and format for compatibility
    const chatModels = models.data
      .filter(model => model.id.includes('gpt'))
      .map(model => ({
        name: model.id,
        size: 0, // OpenAI doesn't provide size info
        modified_at: model.created ? new Date(model.created * 1000).toISOString() : '',
        digest: model.id
      }));

    return chatModels.length > 0 ? chatModels : getDefaultModels();
  } catch (error) {
    console.error('Error fetching available models:', error);
    return getDefaultModels();
  }
};

/**
 * Returns default OpenAI models for fallback - now featuring gpt-4o as primary
 */
const getDefaultModels = (): OpenAIModel[] => {
  return [
    { name: 'gpt-4o', size: 0, modified_at: '', digest: 'gpt-4o' },
    { name: 'gpt-4o-mini', size: 0, modified_at: '', digest: 'gpt-4o-mini' },
    { name: 'gpt-4-turbo', size: 0, modified_at: '', digest: 'gpt-4-turbo' },
    { name: 'gpt-4', size: 0, modified_at: '', digest: 'gpt-4' },
    { name: 'gpt-3.5-turbo', size: 0, modified_at: '', digest: 'gpt-3.5-turbo' }
  ];
};

/**
 * Main function to fetch completion from OpenAI LLM
 * @param prompt User prompt/question
 * @param triageData Current triage data for context
 * @param model OpenAI model to use
 * @param temperature Temperature parameter for LLM
 * @returns Promise resolving to the LLM response text
 */
export const fetchOpenAICompletion = async (
  prompt: string,
  triageData: TriageDataType,
  model: string = DEFAULT_MODEL,
  temperature: number = DEFAULT_TEMPERATURE
): Promise<string> => {
  try {
    console.log('Starting OpenAI request with:', {
      model,
      temperature,
      promptLength: prompt.length
    });

    if (!OPENAI_API_KEY) {
      return 'Sorry, OpenAI API key is not configured. Please set REACT_APP_OPENAI_API_KEY in your environment variables.';
    }

    // Create a system prompt with NHS context and triage data
    const systemPrompt = `You are an AI assistant for the Plastic Surgery Triage System. 
You help healthcare professionals understand triage results and provide additional information about plastic surgery cases.

You have access to the following triage data:
- Patient Age: ${triageData.patientInfo.age}
- Patient Symptoms: ${triageData.patientInfo.symptoms.join(', ') || 'None reported'}
- Urgency Score: ${triageData.assessment.urgencyScore}/10
- Recommended Timeframe: ${triageData.assessment.recommendedTimeframe}
- Recommended Specialty: ${triageData.assessment.recommendedSpecialty}
- Recommendation Rationale: ${triageData.assessment.recommendationReason}
${triageData.assessment.categorization ? 
`- Clinical Case Category: ${triageData.assessment.categorization.category}
- Categorization Rationale: ${triageData.assessment.categorization.rationale}` : ''}

Provide concise, clinically relevant information. Be professional and empathetic.
Do not make specific diagnoses but help with understanding the triage results.
If you don't know something, acknowledge your limitations.`;

    console.log('Sending request to OpenAI API');
    
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: temperature,
      max_tokens: 1000
    });

    const response = completion.choices[0]?.message?.content || 'No response content received';
    console.log('OpenAI response received successfully');
    
    return response;
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return 'Sorry, there was an authentication error with the OpenAI API. Please check your API key configuration.';
      } else if (error.message.includes('quota') || error.message.includes('billing')) {
        return 'Sorry, the OpenAI API quota has been exceeded. Please check your billing and usage limits.';
      } else if (error.message.includes('model')) {
        return `Sorry, the requested model "${model}" is not available. Please try a different model.`;
      }
    }
    
    return `Sorry, I was unable to connect to the OpenAI service. Please try again later.
Error details: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

/**
 * Categorizes a clinical case based on the description using OpenAI LLM
 * @param clinicalDescription Detailed description of the clinical case
 * @param additionalContext Additional context that might help with categorization
 * @param model OpenAI model to use
 * @param temperature Temperature parameter for LLM
 * @returns CategorizationResult containing category, confidence, and rationale
 */
export const categorizeClinicalCase = async (
  clinicalDescription: string,
  additionalContext: {
    patientAge?: string;
    symptoms?: string[];
    otherNotes?: string;
    extractedDocumentText?: string;
    imageDescription?: string;
  } = {},
  model: string = DEFAULT_MODEL,
  temperature: number = DEFAULT_TEMPERATURE
): Promise<CategorizationResult> => {
  try {
    console.log('Starting clinical case categorization with OpenAI');

    if (!OPENAI_API_KEY) {
      return {
        category: ClinicalCaseCategory.ROUTINE,
        confidence: 0.5,
        rationale: 'OpenAI API key not configured - using default categorization'
      };
    }

    // Build context string with enhanced parsing for NHS referral patterns
    let contextString = '';
    let urgencyIndicators: string[] = [];
    let routineIndicators: string[] = [];
    let nonPriorityIndicators: string[] = [];
    
    if (additionalContext.patientAge) {
      contextString += `Patient Age: ${additionalContext.patientAge}\n`;
      // Elderly patients may need higher priority
      const age = parseInt(additionalContext.patientAge);
      if (age >= 70) {
        urgencyIndicators.push('elderly patient (age ≥70)');
      }
    }
    
    if (additionalContext.symptoms && additionalContext.symptoms.length > 0) {
      contextString += `Symptoms: ${additionalContext.symptoms.join(', ')}\n`;
    }
    
    if (additionalContext.otherNotes) {
      contextString += `Additional Notes: ${additionalContext.otherNotes}\n`;
    }
    
    if (additionalContext.extractedDocumentText) {
      const docText = additionalContext.extractedDocumentText.toLowerCase();
      contextString += `Document Content: ${additionalContext.extractedDocumentText.substring(0, 1000)}...\n`;
      
      // Parse document for specific NHS referral urgency indicators
      const urgentKeywords = [
        'malignancy', 'malignant', 'cancer', 'carcinoma', 'melanoma',
        'bleeding', 'ulcerat', 'rapid', 'growing', 'chang', 'enlarg',
        'urgent', '2 week', 'two week', 'immediately', 'asap',
        'suspicious', 'irregular', 'asymmetr', 'variegated',
        'fixed', 'attach', 'lymph', 'node', 'swelling',
        'immunocompromised', 'transplant', 'immunosuppress',
        'head', 'face', 'functional', 'vision', 'breathing',
        'speech', 'hearing', 'eating', 'activities of daily living', 'adl'
      ];
      
      const routineKeywords = [
        'routine', 'soon', '4-6 week', '6 week', 'expedite',
        'cyst', 'lipoma', 'seborrheic', 'actinic', 'keratosis',
        'scar', 'keloid', 'cosmetic', 'appearance'
      ];
      
      const nonPriorityKeywords = [
        'cosmetic only', 'appearance only', 'when convenient',
        'no urgency', 'stable', 'long-standing', 'no change'
      ];
      
      // Check for urgent indicators
      urgentKeywords.forEach(keyword => {
        if (docText.includes(keyword)) {
          urgencyIndicators.push(`document mentions "${keyword}"`);
        }
      });
      
      // Check for routine indicators
      routineKeywords.forEach(keyword => {
        if (docText.includes(keyword)) {
          routineIndicators.push(`document mentions "${keyword}"`);
        }
      });
      
      // Check for non-priority indicators
      nonPriorityKeywords.forEach(keyword => {
        if (docText.includes(keyword)) {
          nonPriorityIndicators.push(`document mentions "${keyword}"`);
        }
      });
    }
    
    if (additionalContext.imageDescription) {
      const imgDesc = additionalContext.imageDescription.toLowerCase();
      contextString += `Image Description: ${additionalContext.imageDescription}\n`;
      
      // Parse image description for visual indicators
      const visualUrgentKeywords = [
        'irregular', 'asymmetric', 'bleeding', 'ulcerated', 'black', 'dark',
        'variegated', 'multiple colors', 'raised', 'nodular', 'large'
      ];
      
      visualUrgentKeywords.forEach(keyword => {
        if (imgDesc.includes(keyword)) {
          urgencyIndicators.push(`image shows "${keyword}" features`);
        }
      });
    }
    
    // Add parsed indicators to context
    if (urgencyIndicators.length > 0) {
      contextString += `\nURGENT INDICATORS DETECTED: ${urgencyIndicators.join(', ')}\n`;
    }
    if (routineIndicators.length > 0) {
      contextString += `\nROUTINE INDICATORS DETECTED: ${routineIndicators.join(', ')}\n`;
    }
    if (nonPriorityIndicators.length > 0) {
      contextString += `\nNON-PRIORITY INDICATORS DETECTED: ${nonPriorityIndicators.join(', ')}\n`;
    }

    const systemPrompt = `You are a clinical triage assistant for Plastic Surgery services following expert-defined clinical guidelines. 
Your task is to categorize clinical cases into one of three categories based on Plastic Surgery Urgency Categorization Rules:

## 🔴 URGENT (Urgency Score 8-10, Within 2 weeks):
- Suspected malignancy
- Large lesion
- Rapidly enlarging or changing lesion
- Bleeding or ulcerated lesion
- Non-healing lesions or ulcers
- Lesions fixed to underlying structures
- Pigmented lesions with irregular features (>6mm, asymmetry, variegated color)
- Nodular lesion with telangiectasia
- History of skin cancer (BCC, SCC, Melanoma)
- Elderly or immunocompromised patients (e.g. transplant patients)
- Lesions on head/face with above high-risk features
- History of excessive sun exposure / tanning bed usage
- Lymphadenopathy (neck, axilla, groin swelling)
- Functional compromise (vision, breathing, speech, hearing, smell, eating)
- Untreated cancer
- Pre-treatment planning for cancer reconstruction
- Hand issues seriously affecting ADL (Activities of Daily Living)
- GP explicitly concerned about malignancy or requesting urgent referral

## 🟡 ROUTINE (Urgency Score 5-7, Within 6 weeks):
- Slowly growing lesions
- Long-standing lesions with minimal change
- Cystic lesions
- Lipomas
- Actinic (solar) keratosis
- Large seborrheic keratosis
- Cosmetic or appearance concerns
- Planning reconstruction post-cancer treatment
- Hand cases NOT compromising ADL
- Scars, abnormal scars, and keloids
- GP requesting "soon" or "within 4-6 weeks"

## 🟢 NON_PRIORITY (Urgency Score 2-4, Routine scheduling):
- Cosmetic or appearance concerns only
- Stable lesions with no recent changes
- Abnormal scars or keloids (stable)
- Seborrheic keratosis (large but stable)
- Actinic keratosis (stable)
- Lipomas (stable)
- Cystic lesions (stable)
- GP marking as "routine" with no urgency indicators

## CONFIDENCE SCORING GUIDELINES:
- High Confidence (≥80%): Clear indicators present, strong clinical evidence
- Medium Confidence (50-79%): Some indicators present, clinical review recommended
- Low Confidence (<50%): Weak indicators, manual review required

Analyze the clinical information provided and respond with a JSON object containing:
- category: One of "URGENT", "ROUTINE", or "NON_PRIORITY"
- confidence: A number between 0 and 1 indicating your confidence in the categorization
- rationale: A brief explanation referencing specific clinical indicators from the guidelines

Base your categorization strictly on the clinical indicators listed above, patient age, functional impact, and GP assessment language.`;

    const prompt = `Clinical Description: ${clinicalDescription}

${contextString}

SPECIAL ATTENTION TO GP ASSESSMENT LANGUAGE:
- Look for phrases like "GP concerned about malignancy", "urgent", "within 2 weeks" → URGENT
- Look for phrases like "soon", "within 4-6 weeks", "expedite" → ROUTINE  
- Look for phrases like "routine", "when convenient", "no urgency" → NON_PRIORITY

SCORING FACTORS TO CONSIDER:
1. Clinical Description Features:
   - Mention of bleeding, ulceration, rapid growth → URGENT
   - Large size (>6mm for pigmented lesions) → Higher urgency
   - Irregular features, asymmetry, color variation → URGENT
   - Fixed to underlying structures → URGENT
   
2. Patient Demographics:
   - Elderly patients with suspicious lesions → Higher urgency
   - Immunocompromised status → Higher urgency
   - History of skin cancer → Higher urgency
   
3. Functional Impact:
   - Affecting vision, breathing, speech, hearing, eating → URGENT
   - Hand issues affecting daily activities → URGENT
   - Cosmetic concerns only → NON_PRIORITY

4. Location and Risk Factors:
   - Head/face lesions with high-risk features → Higher urgency
   - History of sun exposure/tanning with suspicious features → Higher urgency

Please categorize this clinical case and provide your response in JSON format.`;

    console.log('Sending categorization request to OpenAI');
    
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: temperature,
      max_tokens: 300
    });

    const llmResponse = completion.choices[0]?.message?.content || '';
    console.log('OpenAI categorization response received');

    // Try to extract JSON from the response
    const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const resultJson = JSON.parse(jsonMatch[0]);
        
        // Validate and normalize the result
        const category = mapToCategory(resultJson.category);
        const confidence = Math.min(Math.max(resultJson.confidence || 0.7, 0), 1);
        const rationale = resultJson.rationale || "No rationale provided";
        
        return {
          category,
          confidence,
          rationale
        };
      } catch (jsonError) {
        console.error('Error parsing JSON from OpenAI response:', jsonError);
        return extractCategoryFromText(llmResponse);
      }
    } else {
      // Fallback if no JSON is found
      return extractCategoryFromText(llmResponse);
    }
  } catch (error) {
    console.error('Error in clinical case categorization:', error);
    
    return {
      category: ClinicalCaseCategory.ROUTINE,
      confidence: 0.5,
      rationale: `Error occurred during categorization: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Maps various category strings to the standardized ClinicalCaseCategory enum
 * @param categoryString Raw category string from LLM
 * @returns Standardized ClinicalCaseCategory
 */
const mapToCategory = (categoryString: string): ClinicalCaseCategory => {
  const normalized = categoryString.toUpperCase().replace(/[^A-Z]/g, '');
  
  if (normalized.includes('URGENT')) {
    return ClinicalCaseCategory.URGENT;
  } else if (normalized.includes('ROUTINE')) {
    return ClinicalCaseCategory.ROUTINE;
  } else if (normalized.includes('NONPRIORITY') || normalized.includes('NON_PRIORITY')) {
    return ClinicalCaseCategory.NON_PRIORITY;
  } else {
    // Default fallback - most cases should be routine if unclear
    return ClinicalCaseCategory.ROUTINE;
  }
};

/**
 * Fallback function to extract category from plain text when JSON parsing fails
 * @param text Raw text response from LLM
 * @returns CategorizationResult with extracted information
 */
const extractCategoryFromText = (text: string): CategorizationResult => {
  const upperText = text.toUpperCase();
  
  let category = ClinicalCaseCategory.ROUTINE;
  let confidence = 0.7;
  
  if (upperText.includes('URGENT')) {
    category = ClinicalCaseCategory.URGENT;
    confidence = 0.8;
  } else if (upperText.includes('NON-PRIORITY') || upperText.includes('NON_PRIORITY')) {
    category = ClinicalCaseCategory.NON_PRIORITY;
    confidence = 0.8;
  } else if (upperText.includes('ROUTINE')) {
    category = ClinicalCaseCategory.ROUTINE;
    confidence = 0.8;
  }
  
  // Try to extract confidence if mentioned
  const confidenceMatch = text.match(/confidence[:\s]*(\d*\.?\d+)/i);
  if (confidenceMatch) {
    confidence = Math.min(Math.max(parseFloat(confidenceMatch[1]), 0), 1);
  }
  
  return {
    category,
    confidence,
    rationale: `Extracted from text response: ${text.substring(0, 100)}...`
  };
};

/**
 * Analyzes medical images using OpenAI's vision capabilities
 * @param imageUrl URL or base64 string of the image to analyze
 * @param clinicalContext Clinical context to help with analysis
 * @param model OpenAI model to use (should be vision-capable like gpt-4o)
 * @param temperature Temperature parameter for LLM
 * @returns Promise resolving to the analysis result
 */
export const analyzeImage = async (
  imageUrl: string,
  clinicalContext: string = '',
  model: string = DEFAULT_MODEL,
  temperature: number = DEFAULT_TEMPERATURE
): Promise<string> => {
  try {
    console.log('Starting image analysis with OpenAI Vision');

    if (!OPENAI_API_KEY) {
      return 'Sorry, OpenAI API key is not configured. Please set REACT_APP_OPENAI_API_KEY in your environment variables.';
    }

    // Ensure we're using a vision-capable model
    const visionModel = model.includes('gpt-4o') ? model : 'gpt-4o';

    const systemPrompt = `You are a medical AI assistant specialized in analyzing clinical images for Plastic Surgery services. 
Provide detailed, objective observations about what you see in the image. Focus on:
- Visual characteristics relevant to plastic surgery
- Any visible abnormalities or conditions
- Size, color, texture, and location of any lesions or marks
- Overall appearance and any notable features

Be professional and clinical in your analysis. Do not provide diagnoses but describe what is visible.
If the image quality is poor or unclear, mention this in your response.`;

    const userPrompt = clinicalContext 
      ? `Please analyze this medical image. Clinical context: ${clinicalContext}`
      : 'Please analyze this medical image and describe what you observe.';

    console.log(`Sending image analysis request to OpenAI with model: ${visionModel}`);
    
    const completion = await openai.chat.completions.create({
      model: visionModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: [
            { type: 'text', text: userPrompt },
            { 
              type: 'image_url', 
              image_url: { 
                url: imageUrl,
                detail: 'high' // Use high detail for medical images
              } 
            }
          ]
        }
      ],
      temperature: temperature,
      max_tokens: 1000
    });

    const response = completion.choices[0]?.message?.content || 'No analysis content received';
    console.log('OpenAI image analysis completed successfully');
    
    return response;
  } catch (error) {
    console.error('Error in image analysis:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return 'Sorry, there was an authentication error with the OpenAI API. Please check your API key configuration.';
      } else if (error.message.includes('quota') || error.message.includes('billing')) {
        return 'Sorry, the OpenAI API quota has been exceeded. Please check your billing and usage limits.';
      } else if (error.message.includes('model')) {
        return `Sorry, the requested model "${model}" does not support vision. Please use gpt-4o or gpt-4o-mini.`;
      }
    }
    
    return `Sorry, I was unable to analyze the image. Please try again later.
Error details: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};

// Export the main completion function with the same name as the Ollama service for compatibility
export const fetchOllamaCompletion = fetchOpenAICompletion;
