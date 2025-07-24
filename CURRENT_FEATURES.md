# Current Features of the NHS Plastic Surgery Triage System

This document provides a detailed overview of the current features of the NHS Plastic Surgery Triage System application.

## 1. Main Application (`App.tsx`)

The main application serves as the entry point and container for the triage system.

-   **Header**: Displays the title "Plastic Surgery Referral System".
-   **Main Content**: Renders the `NewReferralAssessment` component, which is the core of the application.
-   **Error Handling**: Wraps the `NewReferralAssessment` component in an `ErrorBoundary` to catch and handle any rendering errors within the main form, preventing the entire application from crashing.
-   **Footer**: A standard NHS-branded footer.

## 2. New Referral Assessment (`NewReferralAssessment.tsx`)

This is the primary interface for healthcare professionals to create and submit a new clinical assessment for triage.

### 2.1. Form and Data Entry

-   **Clinical Condition Description**: A mandatory text area (`lesionType`) for the user to enter a detailed description of the patient's clinical condition. This includes observations about appearance, color, texture, size, changes over time, and patient concerns.
-   **Document Upload**: An optional file upload feature that accepts various document types:
    -   PDF (`.pdf`)
    -   Word Documents (`.docx`)
    -   Text files (`.txt`)
    -   Images (`.jpg`, `.jpeg`, `.png`)
-   **Form Actions**:
    -   **Clear Form**: Resets all form fields and triage results.
    -   **Save Progress**: Saves the current form data to the browser's local storage as a draft, allowing users to resume their work later.

### 2.2. Document Processing and Text Extraction

The application can automatically extract text from uploaded documents to provide more context for the AI analysis.

-   **Text Extraction**:
    -   Uses `pdfjs-dist` to extract text from PDF files.
    -   Uses `mammoth.js` to extract text from `.docx` files.
    -   Reads plain text from `.txt` files.
-   **Image Analysis (OCR)**:
    -   When an image is uploaded, the application uses an AI vision model to perform Optical Character Recognition (OCR) and extract any text present in the image.
    -   The user can choose between two vision models for this process:
        -   `gpt-4o` (higher quality)
        -   `gpt-4o-mini` (faster)
    -   There is an option to generate a detailed description of the image content, which is useful for clinical photos.
-   **Preview**: The extracted text and image descriptions are displayed in a preview section, allowing the user to verify the extracted information.

### 2.3. AI-Powered Triage and Categorization

The core of the application is its ability to use AI to categorize clinical cases based on urgency.

-   **AI Analysis Model Selection**: The user can select the AI model to be used for the analysis from a list of available models, which are fetched from the OpenAI API. The default options are:
    -   `gpt-4o`
    -   `gpt-4o-mini`
    -   `gpt-4-turbo`
-   **Categorization**: The application sends the clinical description, along with any extracted text from documents, to the selected AI model. The model then categorizes the case into one of three urgency levels:
    -   **URGENT**
    -   **ROUTINE**
    -   **NON_PRIORITY**
-   **Triage Result**: The AI's response is displayed to the user, including:
    -   **Category**: The assigned urgency category.
    -   **Confidence**: A score indicating the AI's confidence in its categorization.
    -   **Rationale**: An explanation of why the AI assigned that category.
    -   **Urgency Score**: A numerical score based on the category for quick visual reference.

### 2.4. Results and Export

-   **Result Display**: The triage results are clearly displayed in a dedicated section of the page.
-   **PDF Export**: The user can generate a PDF of the complete referral assessment, including the form data and the triage results, for record-keeping or sharing.

## 3. Chat Assistant (`ChatAssistant.tsx`)

The application includes an interactive chat assistant to help users understand the triage results.

-   **Interactive Chat**: Provides a chat interface where users can ask questions about the triage assessment.
-   **Context-Aware**: The assistant has access to the triage data and can answer specific questions about the patient's case and the AI's recommendation.
-   **Suggested Questions**: The assistant suggests relevant questions to the user based on the triage results to guide the conversation.
-   **Backend Service**: The chat functionality is powered by a local Ollama instance, as indicated by the use of `fetchOllamaCompletion` in the `openaiService.ts` file.

## 4. Services and Utilities

### 4.1. `openaiService.ts`

This service module handles all interactions with external AI services.

-   **OpenAI API Integration**: Manages API calls to OpenAI for fetching available models, categorizing clinical cases, and analyzing images.
-   **Ollama Integration**: Includes a function to communicate with a local Ollama service for the chat assistant.

### 4.2. `documentParser.ts`

This utility module contains the logic for processing uploaded documents.

-   **File Type Handling**: Determines the type of an uploaded file and calls the appropriate text extraction function.
-   **Text Extraction Logic**: Contains the implementations for extracting text from PDF, DOCX, and TXT files.
-   **Image Processing**: Implements the logic for sending images to the AI vision model for OCR and description.
