import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { analyzeImage } from '../services/openaiService';

// Set the worker source path for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

/**
 * Available vision models - now using OpenAI models
 */
export enum VisionModel {
  GPT_4O = 'gpt-4o',
  GPT_4O_MINI = 'gpt-4o-mini'
}

/**
 * Result from image processing
 */
export interface ImageProcessingResult {
  extractedText: string;
  imageDescription?: string;
}

/**
 * Extract text from a PDF file
 */
export const extractPdfText = async (file: File): Promise<string> => {
  try {
    // Read the file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;
    
    // Get the total number of pages
    const numPages = pdf.numPages;
    let extractedText = '';
    
    // Extract text from each page
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      // Join all the text items
      const pageText = textContent.items
        .map(item => 'str' in item ? item.str : '')
        .join(' ');
      
      extractedText += pageText + '\n\n';
    }
    
    return extractedText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Extract text from a DOCX file
 */
export const extractDocxText = async (file: File): Promise<string> => {
  try {
    // Read the file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Extract text using mammoth
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

/**
 * Extract text from a plain text file
 */
export const extractTxtText = async (file: File): Promise<string> => {
  try {
    // Read the file as text
    const text = await file.text();
    return text;
  } catch (error) {
    console.error('Error extracting text from TXT:', error);
    throw new Error('Failed to extract text from text file');
  }
};

/**
 * Process an image using OpenAI vision model to extract text and optionally describe the image
 */
export const processImageWithVisionModel = async (
  file: File,
  model: VisionModel = VisionModel.GPT_4O,
  includeDescription: boolean = false
): Promise<ImageProcessingResult> => {
  try {
    // Convert the file to base64 data URL
    const base64DataUrl = await fileToBase64DataUrl(file);
    
    // Text extraction using OpenAI vision
    const extractionPrompt = 'Extract and transcribe ALL text from this image, including any handwritten text. Just return the text content without any additional commentary.';
    
    const extractedText = await analyzeImage(base64DataUrl, extractionPrompt, model);
    
    let result: ImageProcessingResult = {
      extractedText: extractedText || 'No text could be extracted from the image'
    };
    
    // If image description is requested, make a separate call
    if (includeDescription) {
      const descriptionPrompt = 'Please describe this image in detail, focusing on medically relevant aspects. What do you see in this clinical image?';
      
      const imageDescription = await analyzeImage(base64DataUrl, descriptionPrompt, model);
      
      if (imageDescription) {
        result.imageDescription = imageDescription.trim();
      }
    }
    
    return result;
  } catch (error) {
    console.error(`Error processing image with ${model}:`, error);
    throw new Error(`Failed to process image using ${model} model: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Backwards compatibility function for text extraction only
 */
export const extractHandwrittenText = async (file: File, model: VisionModel = VisionModel.GPT_4O): Promise<string> => {
  try {
    const result = await processImageWithVisionModel(file, model, false);
    return result.extractedText;
  } catch (error) {
    console.error('Error in extractHandwrittenText:', error);
    throw error;
  }
};

/**
 * Convert file to base64 data URL for OpenAI API
 */
const fileToBase64DataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Extract text from a document based on file type
 * @param file The file to extract text from
 * @param visionModel The vision model to use for image processing
 * @param includeImageDescription Whether to include image description for images
 */
export const extractTextFromDocument = async (
  file: File, 
  visionModel: VisionModel = VisionModel.GPT_4O,
  includeImageDescription: boolean = false
): Promise<ImageProcessingResult> => {
  if (!file) return { extractedText: '' };
  
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  try {
    // Process based on file type
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      try {
        // First try standard PDF text extraction
        const extractedText = await extractPdfText(file);
        
        // If minimal text was extracted (possibly a scanned document or handwritten),
        // try with vision model
        if (extractedText.trim().length < 50) {
          console.log(`Minimal text extracted from PDF, attempting OCR with ${visionModel}...`);
          return await processImageWithVisionModel(file, visionModel, includeImageDescription);
        }
        return { extractedText };
      } catch (error) {
        // If standard extraction fails, try with vision model
        console.log(`Standard PDF extraction failed, attempting OCR with ${visionModel}...`);
        return await processImageWithVisionModel(file, visionModel, includeImageDescription);
      }
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      const text = await extractDocxText(file);
      return { extractedText: text };
    } else if (
      fileType === 'application/msword' ||
      fileName.endsWith('.doc')
    ) {
      throw new Error('Legacy DOC files are not supported. Please convert to DOCX or PDF.');
    } else if (
      fileType === 'text/plain' ||
      fileName.endsWith('.txt')
    ) {
      const text = await extractTxtText(file);
      return { extractedText: text };
    } else if (
      fileType.startsWith('image/') ||
      ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].some(ext => fileName.endsWith(ext))
    ) {
      // Handle image files using vision model
      return await processImageWithVisionModel(file, visionModel, includeImageDescription);
    } else {
      throw new Error(`Unsupported file type: ${fileType || fileName}`);
    }
  } catch (error) {
    console.error('Error in extractTextFromDocument:', error);
    if (error instanceof Error) {
      return { 
        extractedText: `Error extracting text: ${error.message}`,
        imageDescription: includeImageDescription ? 'Failed to generate image description due to an error.' : undefined
      };
    }
    return { 
      extractedText: 'Unknown error occurred while extracting text',
      imageDescription: includeImageDescription ? 'Failed to generate image description due to an error.' : undefined
    };
  }
};
