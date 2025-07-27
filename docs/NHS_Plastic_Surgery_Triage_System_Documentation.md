# NHS Plastic Surgery Triage System - Complete Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Features](#features)
5. [Installation & Setup](#installation--setup)
6. [Architecture](#architecture)
7. [Component Documentation](#component-documentation)
8. [Service Layer](#service-layer)
9. [Configuration](#configuration)
10. [Usage Guide](#usage-guide)
11. [Development](#development)
12. [Deployment](#deployment)
13. [API Integration](#api-integration)
14. [Troubleshooting](#troubleshooting)

## 🏥 Project Overview

The NHS Plastic Surgery Triage System is a comprehensive React-based web application designed to streamline the assessment and prioritization of plastic surgery referrals. The system integrates with OpenAI's GPT-4o model to provide intelligent document processing, clinical assessment, and AI-assisted triage support.

### Key Capabilities
- **Intelligent Document Processing**: Automatically extracts text from PDFs, images, and handwritten documents using OCR
- **Clinical Assessment**: Structured assessment forms with priority scoring algorithms
- **AI-Powered Chat Assistant**: Interactive AI support for clinical decision-making
- **Vision Model Integration**: Process medical images and extract relevant information
- **NHS Design System**: Compliant with NHS design standards and accessibility guidelines

## 📁 Project Structure

```
triage_app_V2/
├── 📂 build/                           # Production build output
│   ├── static/
│   │   ├── css/                        # Compiled CSS files
│   │   └── js/                         # Compiled JavaScript bundles
│   ├── index.html                      # Main HTML file
│   └── manifest.json                   # PWA manifest
│
├── 📂 docs/                            # Documentation files
│   ├── NHS_Plastic_Surgery_Triage_System_Technical_Overview.md
│   └── NHS_Plastic_Surgery_Triage_System_Documentation.md (this file)
│
├── 📂 public/                          # Static public assets
│   ├── index.html                      # HTML template
│   └── manifest.json                   # PWA configuration
│
├── 📂 src/                             # Source code
│   ├── 📂 components/                  # React components
│   │   ├── ChatAssistant.tsx           # AI chat interface
│   │   ├── ChatAssistant.css           # Chat styles
│   │   ├── ErrorBoundary.tsx           # Error handling wrapper
│   │   ├── OpenAIDebugger.tsx          # Development debugging tool
│   │   ├── SimpleTest.tsx              # Testing component
│   │   └── EnvDebugger.tsx             # Environment debugger (unused)
│   │
│   ├── 📂 services/                    # Business logic services
│   │   ├── openaiService.ts            # OpenAI API integration
│   │   ├── questionSuggestions.ts      # Pre-defined AI prompts
│   │   └── ollamaService.ts            # Legacy Ollama service (deprecated)
│   │
│   ├── 📂 utils/                       # Utility functions
│   │   └── documentParser.ts           # Document processing utilities
│   │
│   ├── App.tsx                         # Main application component
│   ├── App.css                         # Global application styles
│   ├── index.tsx                       # React application entry point
│   ├── index.css                       # Global CSS styles
│   ├── NewReferralAssessment.tsx       # Main triage form component
│   ├── NewReferralAssessment.css       # Triage form styles
│   └── document-upload-styles.css      # Document upload styling
│
├── 📂 .vscode/                         # VS Code configuration
│   └── tasks.json                      # Build tasks
│
├── .env                                # Environment variables (private)
├── .env.example                        # Environment variables template
├── package.json                        # Project dependencies
├── package-lock.json                   # Dependency lock file
├── tsconfig.json                       # TypeScript configuration
├── README.md                           # Basic setup instructions
├── start.bat                           # Windows startup script
└── triage_app_V2.code-workspace        # VS Code workspace file
```

## 🛠 Technology Stack

### Frontend
- **React 18.2.0** - Modern React framework with hooks
- **TypeScript** - Type-safe JavaScript development
- **NHS Design System** - Official NHS styling and components
- **CSS3** - Custom styling with NHS design tokens

### AI Integration
- **OpenAI GPT-4o** - Large language model for text processing
- **OpenAI Vision API** - Image analysis and OCR capabilities
- **Custom Prompt Engineering** - Tailored prompts for medical triage

### Document Processing
- **PDF.js 3.4.120** - PDF text extraction
- **Mammoth.js** - DOCX document processing
- **FileReader API** - Browser-native file handling
- **Base64 Encoding** - Image processing for AI vision

### Development Tools
- **Create React App** - Development environment
- **TypeScript Compiler** - Type checking and compilation
- **ESLint** - Code quality and consistency
- **VS Code** - Integrated development environment

### Dependencies
```json
{
  "openai": "^5.9.0",           // OpenAI API client
  "pdfjs-dist": "^3.4.120",    // PDF processing
  "mammoth": "^1.9.1",         // DOCX processing  
  "lucide-react": "^0.293.0",  // Icon library
  "axios": "^1.10.0",          // HTTP client
  "react-markdown": "^8.0.7",  // Markdown rendering
  "jspdf": "^3.0.1"            // PDF generation
}
```

## ✨ Features

### 1. Document Upload & Processing
- **Multi-format Support**: PDF, DOCX, TXT, Images (JPG, PNG, etc.)
- **OCR Technology**: Extract text from images and scanned documents
- **Vision Model Integration**: Describe medical images and extract clinical information
- **Fallback Processing**: Automatic OCR when standard text extraction fails

### 2. Clinical Assessment Form
- **Patient Demographics**: Name, age, gender, contact information
- **Clinical Information**: Symptoms, duration, severity, medical history
- **Priority Scoring**: Automated urgency calculation based on clinical criteria
- **Test Data Loading**: Pre-populated scenarios for testing

### 3. AI-Powered Chat Assistant
- **Contextual Awareness**: AI has access to current patient data and triage results
- **Medical Knowledge**: Specialized prompts for plastic surgery triage
- **Question Suggestions**: Pre-defined clinical questions
- **Real-time Responses**: Powered by OpenAI GPT-4o

### 4. Vision Model Processing
- **Image Analysis**: Process medical photographs and scans
- **Text Extraction**: OCR for handwritten notes and printed documents
- **Clinical Description**: AI-generated descriptions of medical images
- **Model Selection**: Choose between GPT-4o and GPT-4o Mini

## 🚀 Installation & Setup

### Prerequisites
```bash
# Required software
Node.js 14.0.0 or higher
npm 6.0.0 or higher
Modern web browser (Chrome, Firefox, Safari, Edge)
```

### Step-by-Step Installation

1. **Clone or Download Project**
   ```bash
   # If using Git
   git clone [repository-url]
   cd triage_app_V2
   
   # Or extract from ZIP file
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env file with your OpenAI credentials
   ```

4. **Set OpenAI API Key**
   ```env
   # Add to .env file
   REACT_APP_OPENAI_API_KEY=sk-your-openai-api-key-here
   REACT_APP_OPENAI_MODEL=gpt-4o
   REACT_APP_OPENAI_TEMPERATURE=0.7
   ```

5. **Start Development Server**
   ```bash
   npm start
   ```

6. **Access Application**
   ```
   Open browser to: http://localhost:3000
   ```

### Production Build
```bash
# Create optimized production build
npm run build

# Serve static files
npx serve -s build
```

## 🏗 Architecture

### Component Hierarchy
```
App.tsx
├── ErrorBoundary.tsx
│   ├── NewReferralAssessment.tsx (Main Form)
│   │   ├── Document Upload Section
│   │   ├── Patient Information Form
│   │   ├── Clinical Assessment Form
│   │   ├── Vision Model Selection
│   │   └── ChatAssistant.tsx (AI Chat)
│   │
│   └── OpenAIDebugger.tsx (Development Tool)
```

### Data Flow
```
User Input → Form State → OpenAI Service → AI Response → UI Update
     ↓
Document Upload → Document Parser → Vision API → Extracted Text
     ↓
Clinical Data → Priority Algorithm → Triage Result → Chat Context
```

### Service Architecture
```
Frontend Components
       ↓
Service Layer (openaiService.ts)
       ↓
OpenAI API (GPT-4o)
       ↓
AI Response Processing
       ↓
State Management (React Hooks)
       ↓
UI Updates
```

## 📦 Component Documentation

### App.tsx
**Purpose**: Main application wrapper and routing
**Key Features**:
- Debug mode toggle (Ctrl+Shift+D)
- Error boundary integration
- NHS header and footer
- Component switching between main app and debug tools

**State Management**:
```typescript
const [showDebugger, setShowDebugger] = useState(false);
const [debugComponent, setDebugComponent] = useState<'debugger' | 'simpleTest'>('debugger');
```

### NewReferralAssessment.tsx
**Purpose**: Core triage form and assessment logic
**Key Features**:
- Multi-step form with validation
- Document upload and processing
- Priority calculation algorithm
- Integration with AI chat assistant

**State Interface**:
```typescript
interface TriageFormData {
  patientName: string;
  age: number;
  gender: string;
  symptoms: string;
  duration: string;
  severity: 'mild' | 'moderate' | 'severe';
  urgency: 'routine' | 'urgent' | 'emergency';
  // ... additional fields
}
```

### ChatAssistant.tsx
**Purpose**: AI-powered chat interface for clinical support
**Key Features**:
- Real-time OpenAI integration
- Context-aware responses
- Question suggestions
- Chat history management

**Props Interface**:
```typescript
interface ChatAssistantProps {
  triageData: TriageFormData;
  triageResult: TriageResult | null;
  isVisible: boolean;
  onClose: () => void;
}
```

### ErrorBoundary.tsx
**Purpose**: React error boundary for graceful error handling
**Key Features**:
- Catches JavaScript errors in component tree
- Displays user-friendly error messages
- Provides error reporting capabilities

## 🔧 Service Layer

### openaiService.ts
**Purpose**: Core OpenAI API integration and AI functionality

**Key Functions**:

1. **fetchOpenAICompletion**
   ```typescript
   export const fetchOpenAICompletion = async (
     prompt: string, 
     context: string = ''
   ): Promise<string>
   ```
   - Handles text-based AI requests
   - Includes context awareness
   - Error handling and retries

2. **analyzeImage**
   ```typescript
   export const analyzeImage = async (
     imageDataUrl: string,
     prompt: string,
     model: string = 'gpt-4o'
   ): Promise<string>
   ```
   - Process images with OpenAI Vision API
   - Extract text and generate descriptions
   - Support for multiple vision models

3. **categorizeClinicalCase**
   ```typescript
   export const categorizeClinicalCase = async (
     clinicalData: TriageFormData
   ): Promise<ClinicalCategorizationResult>
   ```
   - AI-powered clinical assessment
   - Priority scoring
   - Recommendation generation

### documentParser.ts
**Purpose**: Document processing and text extraction utilities

**Key Components**:

1. **VisionModel Enum**
   ```typescript
   export enum VisionModel {
     GPT_4O = 'gpt-4o',
     GPT_4O_MINI = 'gpt-4o-mini'
   }
   ```

2. **Document Processing Functions**:
   - `extractPdfText()` - PDF text extraction
   - `extractDocxText()` - DOCX processing
   - `processImageWithVisionModel()` - Image OCR
   - `extractTextFromDocument()` - Universal document processor

### questionSuggestions.ts
**Purpose**: Pre-defined AI prompts for clinical scenarios

**Categories**:
- Clinical assessment questions
- Patient communication templates
- Diagnostic assistance prompts
- Treatment recommendation queries

## ⚙️ Configuration

### Environment Variables
```env
# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=sk-your-key-here
REACT_APP_OPENAI_MODEL=gpt-4o
REACT_APP_OPENAI_TEMPERATURE=0.7

# Application Settings
REACT_APP_DEBUG_MODE=false
REACT_APP_API_TIMEOUT=30000
```

### TypeScript Configuration (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```

## 📖 Usage Guide

### Basic Workflow

1. **Start Application**
   - Launch development server: `npm start`
   - Navigate to: `http://localhost:3000`

2. **Patient Assessment**
   - Fill in patient demographics
   - Enter clinical symptoms and history
   - Upload relevant documents/images
   - Select vision model if needed

3. **Document Processing**
   - Choose file from computer
   - System automatically detects file type
   - AI processes and extracts relevant information
   - Extracted text appears in the form

4. **Triage Calculation**
   - Click "Calculate Referral Priority"
   - System analyzes all clinical data
   - Priority score and recommendations generated

5. **AI Consultation**
   - Click "Ask AI Assistant"
   - Chat interface opens with context
   - Ask clinical questions or seek clarification
   - Receive evidence-based responses

### Test Data Scenarios

The application includes several pre-loaded test scenarios:

1. **High Priority Cancer Case**
   - Suspicious melanoma
   - Rapid growth and bleeding
   - Immediate referral recommended

2. **Moderate Priority Reconstruction**
   - Post-trauma reconstruction
   - Functional impairment
   - Routine referral appropriate

3. **Low Priority Cosmetic**
   - Elective aesthetic procedure
   - No medical urgency
   - Standard waiting list

### Advanced Features

#### Vision Model Selection
- **GPT-4o**: Higher accuracy, slower processing
- **GPT-4o Mini**: Faster processing, good accuracy
- Automatic fallback for failed text extraction

#### Chat Assistant Tips
- Be specific with clinical questions
- Include relevant patient details
- Ask for clarification on recommendations
- Request patient communication templates

## 👨‍💻 Development

### Development Workflow

1. **Setup Development Environment**
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm start
   
   # Run tests
   npm test
   
   # Build for production
   npm run build
   ```

2. **Code Organization**
   - Components in `/src/components/`
   - Services in `/src/services/`
   - Utilities in `/src/utils/`
   - Styles co-located with components

3. **Debugging Tools**
   - Press `Ctrl+Shift+D` to open debug mode
   - OpenAI API testing interface
   - Environment variable inspector
   - Service testing components

### Adding New Features

1. **New AI Prompts**
   ```typescript
   // Add to questionSuggestions.ts
   export const newPromptCategory = [
     "Your new prompt here",
     "Another prompt option"
   ];
   ```

2. **Document Processing**
   ```typescript
   // Extend documentParser.ts
   export const processNewFileType = async (file: File): Promise<string> => {
     // Implementation here
   };
   ```

3. **UI Components**
   ```typescript
   // Create new component
   interface NewComponentProps {
     // Define props
   }
   
   export const NewComponent: React.FC<NewComponentProps> = ({ props }) => {
     // Implementation
   };
   ```

### Testing Strategy

1. **Unit Testing**
   - Test service functions independently
   - Mock OpenAI API responses
   - Validate document processing logic

2. **Integration Testing**
   - Test component interactions
   - Verify API integration
   - Check error handling

3. **User Acceptance Testing**
   - Clinical workflow validation
   - Accessibility compliance
   - Performance benchmarking

## 🚢 Deployment

### Production Build Process

1. **Optimize Build**
   ```bash
   # Create production build
   npm run build
   
   # Analyze bundle size
   npm install -g webpack-bundle-analyzer
   npx webpack-bundle-analyzer build/static/js/*.js
   ```

2. **Environment Configuration**
   ```bash
   # Production environment variables
   REACT_APP_OPENAI_API_KEY=production-key
   REACT_APP_OPENAI_MODEL=gpt-4o
   REACT_APP_OPENAI_TEMPERATURE=0.7
   ```

3. **Security Considerations**
   - Store API keys securely
   - Implement rate limiting
   - Enable HTTPS in production
   - Validate all user inputs

### Deployment Options

1. **Static Hosting**
   - AWS S3 + CloudFront
   - Netlify
   - Vercel
   - GitHub Pages

2. **Container Deployment**
   ```dockerfile
   FROM nginx:alpine
   COPY build/ /usr/share/nginx/html/
   EXPOSE 80
   ```

3. **NHS Infrastructure**
   - Follow NHS security guidelines
   - Ensure GDPR compliance
   - Implement audit logging

## 🔌 API Integration

### OpenAI API Configuration

```typescript
// Service configuration
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Development only
});

// Production considerations
const openai = new OpenAI({
  apiKey: getSecureApiKey(), // Fetch from secure storage
  timeout: 30000,
  maxRetries: 3
});
```

### API Rate Limiting

```typescript
// Implement rate limiting
const rateLimiter = {
  requests: 0,
  lastReset: Date.now(),
  limit: 100, // requests per hour
  
  canMakeRequest(): boolean {
    const now = Date.now();
    if (now - this.lastReset > 3600000) { // 1 hour
      this.requests = 0;
      this.lastReset = now;
    }
    return this.requests < this.limit;
  }
};
```

### Error Handling

```typescript
// Robust error handling
try {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: messages,
    temperature: 0.7
  });
  return response.choices[0]?.message?.content || '';
} catch (error) {
  if (error.status === 429) {
    throw new Error('Rate limit exceeded. Please try again later.');
  } else if (error.status === 401) {
    throw new Error('Invalid API key. Please check your configuration.');
  } else {
    throw new Error(`AI service error: ${error.message}`);
  }
}
```

## 🔍 Troubleshooting

### Common Issues

1. **API Key Not Working**
   ```
   Symptoms: "Invalid API key" errors
   Solution: 
   - Verify API key in .env file
   - Check OpenAI account billing
   - Ensure no extra spaces in key
   ```

2. **Document Upload Fails**
   ```
   Symptoms: Upload errors or no text extracted
   Solution:
   - Check file format support
   - Verify file size limits
   - Try different vision model
   ```

3. **Build Failures**
   ```
   Symptoms: npm run build fails
   Solution:
   - Clear node_modules: rm -rf node_modules && npm install
   - Check TypeScript errors
   - Verify all imports are correct
   ```

4. **Slow AI Responses**
   ```
   Symptoms: Long wait times for AI responses
   Solution:
   - Switch to GPT-4o Mini model
   - Reduce context length
   - Implement request caching
   ```

### Debug Mode

Access debug mode with `Ctrl+Shift+D`:
- Test OpenAI API connectivity
- Inspect environment variables
- Try sample AI requests
- Check service configurations

### Logging

```typescript
// Enable detailed logging
const debugLog = (message: string, data?: any) => {
  if (process.env.REACT_APP_DEBUG_MODE === 'true') {
    console.log(`[NHS Triage] ${message}`, data);
  }
};
```

## 📊 Performance Optimization

### Bundle Size Optimization

```bash
# Analyze bundle size
npm run build
npx webpack-bundle-analyzer build/static/js/*.js

# Recommendations:
# - Code splitting for large components
# - Lazy loading for non-critical features
# - Tree shaking for unused code
```

### AI Response Caching

```typescript
// Implement response caching
const responseCache = new Map();

const getCachedResponse = (prompt: string): string | null => {
  return responseCache.get(prompt) || null;
};

const setCachedResponse = (prompt: string, response: string): void => {
  responseCache.set(prompt, response);
};
```

## 🔒 Security & Compliance

### Data Protection
- Patient data stored locally only
- No server-side data persistence
- GDPR compliance considerations
- NHS data handling guidelines

### API Security
- Secure API key storage
- Request validation
- Input sanitization
- Rate limiting implementation

### Audit Trail
```typescript
// Implement audit logging
const auditLog = {
  logAction: (action: string, userId: string, data?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId,
      data: data ? JSON.stringify(data) : null
    };
    // Send to audit service
  }
};
```

## 📝 Contributing

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- NHS design system compliance

### Pull Request Process
1. Create feature branch
2. Implement changes with tests
3. Update documentation
4. Submit pull request
5. Code review and approval

## 📞 Support

### Technical Support
- Check troubleshooting guide
- Review error logs
- Test in debug mode
- Contact development team

### Clinical Support
- Validate triage algorithms
- Review AI prompt effectiveness
- Gather user feedback
- Clinical workflow optimization

---

**Document Version**: 1.0  
**Last Updated**: July 15, 2025  
**Authors**: NHS Plastic Surgery Triage Development Team  
**License**: NHS Open Source License

---

> This documentation is maintained alongside the codebase. For the most current information, always refer to the latest version in the project repository.
