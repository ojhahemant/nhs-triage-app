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

// Available clinical case categories
export enum ClinicalCaseCategory {
  URGENT = "Urgent",
  ROUTINE = "Routine",
  NON_PRIORITY = "Non-Priority",
  MDT_REVIEW = "Multi-Disciplinary Review"
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
    const systemPrompt = `You are an AI assistant for the NHS Plastic Surgery Triage System. 
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

    // Build context string
    let contextString = '';
    if (additionalContext.patientAge) {
      contextString += `Patient Age: ${additionalContext.patientAge}\n`;
    }
    if (additionalContext.symptoms && additionalContext.symptoms.length > 0) {
      contextString += `Symptoms: ${additionalContext.symptoms.join(', ')}\n`;
    }
    if (additionalContext.otherNotes) {
      contextString += `Additional Notes: ${additionalContext.otherNotes}\n`;
    }
    if (additionalContext.extractedDocumentText) {
      contextString += `Document Content: ${additionalContext.extractedDocumentText.substring(0, 500)}...\n`;
    }
    if (additionalContext.imageDescription) {
      contextString += `Image Description: ${additionalContext.imageDescription}\n`;
    }

    const systemPrompt = `You are a clinical triage assistant for NHS Plastic Surgery services. 
Your task is to categorize clinical cases into one of four categories:

1. URGENT - Cases requiring immediate attention (within 2 weeks)
2. ROUTINE - Standard cases that can wait (2-18 weeks)  
3. NON-PRIORITY - Cases with low clinical priority (18+ weeks)
4. MDT_REVIEW - Complex cases requiring multi-disciplinary team review

Analyze the clinical information provided and respond with a JSON object containing:
- category: One of the four categories above
- confidence: A number between 0 and 1 indicating your confidence in the categorization
- rationale: A brief explanation of your reasoning

Base your categorization on clinical urgency, complexity, and potential impact on patient outcomes.`;

    const prompt = `Clinical Description: ${clinicalDescription}

${contextString}

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
  } else if (normalized.includes('MDT') || normalized.includes('REVIEW')) {
    return ClinicalCaseCategory.MDT_REVIEW;
  } else {
    // Default fallback
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
  } else if (upperText.includes('NON-PRIORITY') || upperText.includes('NON_PRIORITY')) {
    category = ClinicalCaseCategory.NON_PRIORITY;
  } else if (upperText.includes('MDT') || upperText.includes('REVIEW')) {
    category = ClinicalCaseCategory.MDT_REVIEW;
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

    const systemPrompt = `You are a medical AI assistant specialized in analyzing clinical images for NHS Plastic Surgery services. 
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
