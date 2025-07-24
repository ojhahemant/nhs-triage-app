# Plastic Surgery Triage System with OpenAI Integration

## Setup and Running Instructions

### Prerequisites
- Node.js 14+ and npm installed
- OpenAI API key (for AI chat functionality)

### Steps to Run the Application

1. **Install Dependencies**
   ```
   npm install
   ```

2. **Configure OpenAI API**
   - Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key to the `.env` file:
   ```
   REACT_APP_OPENAI_API_KEY=your_api_key_here
   REACT_APP_OPENAI_MODEL=gpt-4o
   REACT_APP_OPENAI_TEMPERATURE=0.7
   ```

3. **Start the React Application**
   ```
   npm start
   ```
### Using the Application

1. Fill in the patient information and clinical details in the form
2. You can use the "Test Data" button to load sample patient cases
3. Click "Calculate Referral Priority" to generate a triage result
4. Once a triage result is displayed, click "Ask AI Assistant about this triage" to open the chat interface
5. In the chat interface, you can ask questions about the triage results or seek additional information

### Notes for AI Assistant Functionality

- The AI assistant uses the OpenAI API
- The chat requires a valid OpenAI API key to be configured
- You can customize the model and parameters in `src/services/openaiService.ts`
- The system provides relevant context to the LLM including patient data and triage results
- Example questions to ask the AI:
  - "Why was this patient given a high urgency score?"
  - "What are typical symptoms of melanoma?"
  - "What should I tell the patient about their wait time?"
  - "How should I explain this triage result to the patient?"
  - "What are the next steps for this referral?"

## Technical Details

### OpenAI Integration

The application uses the OpenAI API to communicate with GPT models. Key integration points:

- `src/services/openaiService.ts` - Handles API communication with OpenAI
- `src/components/ChatAssistant.tsx` - UI component for the chat interface
- Default configuration uses GPT-4o model (multimodal - supports both text and images)
- Patient data and triage results are automatically formatted and included in the system prompt

### Environment Configuration

The application uses environment variables for configuration, stored in the `.env` file:

- `REACT_APP_OPENAI_API_KEY` - Your OpenAI API key (required)
- `REACT_APP_OPENAI_MODEL` - Default LLM model to use (default: gpt-4o)
- `REACT_APP_OPENAI_TEMPERATURE` - Temperature setting for the LLM (default: 0.7)

**Note about GPT-4o**: This is OpenAI's multimodal model that supports both text and vision capabilities, making it perfect for medical applications that may need to analyze images alongside text.

### Error Handling

The application includes error handling for various scenarios:

- Error boundary component (`ErrorBoundary.tsx`) to catch and display React errors
- Proper error handling in the OpenAI service if the API is unavailable
- Graceful degradation if OpenAI API key is not configured (chat feature becomes unavailable but the rest of the app works)

### Security Note

**Important**: This implementation includes the OpenAI API key in the frontend for development purposes only. In a production environment, all AI API calls should be routed through your backend server to keep API keys secure.
