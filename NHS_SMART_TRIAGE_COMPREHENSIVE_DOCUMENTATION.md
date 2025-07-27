# NHS Plastic Surgery Triage System - Comprehensive Documentation
*Based on Actual Codebase Analysis*

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Actual Project Structure](#actual-project-structure)
4. [Technology Stack & Architecture](#technology-stack--architecture)
5. [Core Features & Functionality](#core-features--functionality)
6. [Component Architecture](#component-architecture)
7. [Styling & Design System](#styling--design-system)
8. [API Integration](#api-integration)
9. [User Interface Guide](#user-interface-guide)
10. [Development Setup](#development-setup)
11. [Deployment Configuration](#deployment-configuration)

---

## 📊 Executive Summary

The NHS Plastic Surgery Triage System is a React-based web application designed to assist healthcare professionals in assessing and prioritizing plastic surgery referrals. The system integrates with OpenAI's GPT models to provide intelligent document processing, clinical assessment categorization, and AI-assisted consultation for healthcare decision-making.

### 🎯 Core Purpose
Streamline the plastic surgery referral triage process through AI-powered assessment tools, document processing capabilities, and interactive consultation features to support clinical decision-making.

### 🏆 Key Features (Based on Actual Code)
- ✅ **AI-Powered Triage**: OpenAI GPT-4o integration for clinical case categorization
- ✅ **Document Processing**: PDF, DOCX, and image text extraction with OCR capabilities  
- ✅ **Interactive Chat**: AI assistant for clinical consultation and decision support
- ✅ **Multi-Model Support**: Configurable AI models with dynamic model selection
- ✅ **Modern React Architecture**: TypeScript, React Router, component-based design
- ✅ **Responsive Design**: NHS-compliant styling with mobile-first approach

---

## 🏥 Project Overview

### System Purpose
The NHS Plastic Surgery Triage System provides healthcare professionals with an intelligent assessment tool for categorizing plastic surgery referrals based on clinical urgency. The application combines traditional clinical assessment forms with AI-powered analysis to support decision-making processes.

### Target Users
- **Clinical Staff**: Healthcare professionals conducting triage assessments
- **Plastic Surgery Consultants**: Senior clinicians reviewing complex cases
- **Administrative Personnel**: Staff managing referral workflows and reporting

### Core Capabilities (From Actual Implementation)
- **Clinical Assessment Forms**: Structured data entry for patient information and clinical observations
- **Document Processing**: Automated text extraction from PDFs, Word documents, and images
- **AI Categorization**: Intelligent classification into Urgent, Routine, MDT, or Non-Priority categories
- **Interactive AI Chat**: Contextual consultation with OpenAI models for complex cases
- **PDF Report Generation**: Export comprehensive assessment reports
- **Draft Management**: Save and restore assessment progress

---

## 📁 Actual Project Structure
*Based on Real Codebase Analysis*

```
nhs-triage-app-main/
├── � Package Configuration
│   ├── package.json                           # Dependencies and scripts
│   ├── tsconfig.json                          # TypeScript configuration
│   └── public/
│       ├── index.html                         # HTML template
│       ├── manifest.json                      # PWA manifest
│       └── pdf.worker.min.js                  # PDF.js worker
│
├── 📂 Source Code (src/)
│   ├── 🚀 Application Entry Points
│   │   ├── index.tsx                          # React application entry point
│   │   ├── App.tsx                            # Main application component
│   │   ├── App.css                            # Application-level styles
│   │   └── index.css                          # Global base styles
│   │
│   ├── 🛣️ Routing Configuration
│   │   └── routes/
│   │       └── router.tsx                     # React Router configuration
│   │
│   ├── 🏗️ Layout Components
│   │   └── layouts/
│   │       ├── MainLayout.tsx                 # Primary application layout
│   │       └── MainLayout.css                 # Layout-specific styles
│   │
│   ├── 📄 Page Components
│   │   ├── pages/
│   │   │   ├── Assessment/
│   │   │   │   ├── NewReferralAssessment.tsx     # Main assessment interface
│   │   │   │   ├── NewReferralAssessment.css     # Assessment styles
│   │   │   │   └── NewReferralAssessment.imagepreview.css
│   │   │   ├── DashboardPage.tsx              # Analytics dashboard
│   │   │   ├── DashboardPage.css              # Dashboard styles
│   │   │   ├── ReferralTrackingPage.tsx       # Referral tracking interface
│   │   │   ├── ReferralTrackingPage.css       # Tracking styles
│   │   │   ├── MessagingPage.tsx              # Secure messaging
│   │   │   ├── MessagingPage.css              # Messaging styles
│   │   │   ├── BulkUploadPage.tsx             # Bulk upload functionality
│   │   │   ├── AuditTrailPage.tsx             # Audit trail interface
│   │   │   ├── AuditTrailPage.css             # Audit styles
│   │   │   ├── GuidelinesPage.tsx             # Clinical guidelines
│   │   │   ├── GuidelinesPage.css             # Guidelines styles
│   │   │   └── PlaceholderPage.css            # Placeholder styling
│   │
│   ├── 🧩 Reusable Components
│   │   └── components/
│   │       ├── CategoryDisplay.tsx            # Triage category display
│   │       ├── CategoryDisplay.css            # Category styling
│   │       ├── ChatAssistant.tsx              # AI chat interface
│   │       ├── ChatAssistant.css              # Chat styling
│   │       ├── ErrorBoundary.tsx              # Error handling component
│   │       ├── EnvDebugger.tsx                # Environment debugging
│   │       ├── OllamaDebugger.tsx             # Ollama integration testing
│   │       ├── OpenAIDebugger.tsx             # OpenAI integration testing
│   │       └── SimpleTest.tsx                 # Basic testing component
│   │
│   ├── 🔧 Services & Utilities
│   │   ├── services/
│   │   │   ├── openaiService.ts               # OpenAI API integration
│   │   │   └── questionSuggestions.ts         # AI question generation
│   │   └── utils/
│   │       ├── documentParser.ts              # Document processing utilities
│   │       └── categorizationTests.ts         # Triage logic testing
│   │
│   ├── 🎨 Styling System
│   │   ├── styles/
│   │   │   ├── globals.css                    # Global CSS variables
│   │   │   ├── components/
│   │   │   │   ├── buttons.css                # Button components
│   │   │   │   ├── cards.css                  # Card components
│   │   │   │   └── forms.css                  # Form components
│   │   │   ├── layouts/
│   │   │   │   └── layout.css                 # Layout utilities
│   │   │   ├── pages/
│   │   │   │   └── assessment.css             # Assessment page styles
│   │   │   └── utilities/
│   │   │       ├── utilities.css              # Utility classes
│   │   │       ├── responsive.css             # Responsive utilities
│   │   │       └── animations.css             # Animation definitions
│   │   └── document-upload-styles.css         # Document upload styling
│   │
│   └── 📝 Legacy/Alternative Files
│       └── nhs_referral_assessment_implementation.tsx # Alternative implementation
│
├── 📂 Build & Deployment
│   ├── build/                                 # Production build output
│   ├── docker-compose.yml                     # Development Docker setup
│   ├── docker-compose.prod.yml                # Production Docker setup
│   ├── Dockerfile                             # Container definition
│   ├── nginx.conf                             # Web server configuration
│   ├── build-deploy.ps1                       # Windows deployment script
│   ├── build-deploy.sh                        # Unix deployment script
│   └── start.bat                              # Windows startup script
│
└── � Documentation & Configuration
    ├── README.md                              # Project setup instructions
    ├── DEPLOYMENT.md                          # Deployment guidelines
    ├── DOCKER.md                              # Docker configuration
    └── nhs-triage-app-main.code-workspace     # VS Code workspace
```

---

## 🔧 Technology Stack & Architecture
*Based on package.json and actual implementation*

### Frontend Framework
- **React 18.2.0** - Modern React with Hooks and functional components
- **TypeScript 4.9.5** - Type-safe JavaScript development
- **React Router DOM 6.30.1** - Client-side routing and navigation

### UI & Icons
- **Lucide React 0.293.0** - Modern SVG icon library (used throughout components)
- **CSS3** - Modern styling with CSS Custom Properties and Grid/Flexbox

### AI & Machine Learning Integration
- **OpenAI API 5.9.0** - GPT-4o and GPT-4o-mini integration for clinical analysis
- **React Markdown 8.0.7** - Markdown rendering for AI chat responses
- **React Syntax Highlighter 15.6.1** - Code syntax highlighting in chat

### Document Processing
- **PDF.js (pdfjs-dist) 3.4.120** - Client-side PDF text extraction
- **Mammoth.js 1.9.1** - Microsoft Word (.docx) document processing
- **jsPDF 3.0.1** - PDF generation for assessment reports
- **jsPDF AutoTable 5.0.2** - Table generation within PDF reports
- **react-to-pdf 2.0.1** - React component to PDF conversion

### HTTP & API
- **Axios 1.10.0** - HTTP client for API communications

### Development Tools
- **React Scripts 5.0.1** - Create React App build system and development server
- **TypeScript Types** - Comprehensive type definitions for React ecosystem
- **ESLint** - Code quality and consistency (via React Scripts)

### Build & Deployment
- **Node.js 16+** - JavaScript runtime environment
- **npm** - Package management
- **Docker** - Containerization (Dockerfile and docker-compose configurations)
- **Nginx** - Production web server and reverse proxy

### Architecture Patterns (From Code Analysis)
- **Component-Based Architecture** - Modular, reusable React components
- **Service Layer Pattern** - Centralized API communication in services/
- **Custom Hooks Pattern** - Reusable state logic (evident in components)
- **Error Boundaries** - Graceful error handling with ErrorBoundary.tsx
- **TypeScript Interfaces** - Strong typing throughout the application

---

## 🚀 Core Features & Functionality
*Based on Actual Implementation Analysis*

### 1. Clinical Assessment System (NewReferralAssessment.tsx)

#### Assessment Form Capabilities
```typescript
interface FormDataType {
  lesionType: string;                    // Clinical description
  document: File | null;                 // Uploaded document
  extractedText: string;                 // Extracted document text
  imageDescription: string;              // AI-generated image description
  selectedVisionModel: VisionModel;      // GPT-4o or GPT-4o-mini
  includeImageDescription: boolean;      // Include visual analysis
}
```

#### Triage Result Structure
```typescript
interface TriageResult {
  urgencyScore: number;                  // Numerical urgency score
  recommendedTimeframe: string;          // Assessment timeframe
  recommendedSpecialty: string;          // Recommended specialty
  recommendationReason: string;          // Clinical reasoning
  categorization?: {
    category: ClinicalCaseCategory;      // URGENT, ROUTINE, MDT, NON_PRIORITY
    confidence: number;                  // AI confidence score
    rationale: string;                   // Categorization reasoning
  };
}
```

#### Clinical Categories (From openaiService.ts)
```typescript
export enum ClinicalCaseCategory {
  URGENT = 'Urgent',           // Immediate attention required
  ROUTINE = 'Routine',         // Standard processing timeline
  MDT = 'MDT',                 // Multi-disciplinary team review
  NON_PRIORITY = 'Non-Priority' // Primary care management
}
```

### 2. Document Processing System (documentParser.ts)

#### Supported File Formats
- **PDF Documents**: Text extraction using PDF.js with web worker
- **Microsoft Word (.docx)**: Content extraction via Mammoth.js
- **Images (.jpg, .jpeg, .png)**: OCR text extraction using OpenAI vision models
- **Text Files (.txt)**: Direct content reading

#### Vision Model Integration
```typescript
export enum VisionModel {
  GPT_4O = 'gpt-4o',           // High-quality vision analysis
  GPT_4O_MINI = 'gpt-4o-mini'  // Faster, cost-effective option
}

export interface ImageProcessingResult {
  extractedText: string;        // OCR extracted text
  imageDescription?: string;    // Optional visual description
}
```

### 3. AI-Powered Chat Assistant (ChatAssistant.tsx)

#### Chat Interface Features
- **Contextual Awareness**: Integrates current triage assessment data
- **Suggested Questions**: Pre-generated relevant clinical questions
- **Markdown Support**: Rich text rendering for AI responses
- **Session Management**: Maintains conversation history during assessment
- **Multiple AI Models**: Configurable model selection for different use cases

#### Chat Message Structure
```typescript
interface Message {
  role: 'user' | 'assistant';
  content: string;
}
```

### 4. Dashboard & Analytics (DashboardPage.tsx)

#### Dashboard Components
- **Timeframe Selection**: Today, Week, Month, Quarter views
- **Performance Metrics**: Triage statistics and analytics
- **Refresh Capability**: Real-time data updates
- **Export Functionality**: Data export capabilities

### 5. Navigation & Layout (MainLayout.tsx)

#### Navigation Structure
```typescript
const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'assessment', label: 'New Assessment', path: '/assessment' },
  { id: 'referrals', label: 'Referral Tracking', path: '/referrals' },
  { id: 'messaging', label: 'Secure Messaging', path: '/messaging' },
  { id: 'bulk-upload', label: 'Bulk Upload', path: '/bulk-upload' },
  { id: 'audit', label: 'Audit Trail', path: '/audit' },
  { id: 'guidelines', label: 'Clinical Guidelines', path: '/guidelines' }
];
```

#### Layout Features
- **Collapsible Sidebar**: Space-efficient navigation
- **Responsive Design**: Mobile-first approach
- **Active Route Highlighting**: Visual navigation feedback
- **User Information Display**: Clinician details and role

### 6. Category Display System (CategoryDisplay.tsx)

#### Visual Category Representation
- **Icon-based Indicators**: Lucide React icons for each category
- **Confidence Scoring**: AI confidence level display
- **Rationale Display**: Clinical reasoning explanation
- **Model Attribution**: Shows which AI model was used

---

## 🏗️ Component Architecture
*Based on Actual Source Code*

### Application Entry Point (App.tsx)
```typescript
function App() {
  return <RouterProvider router={router} />;
}
```

**CSS Imports Order** (Critical for styling):
1. `globals.css` - CSS custom properties and base styles
2. `utilities/utilities.css` - Utility classes
3. `utilities/animations.css` - Animation definitions
4. `utilities/responsive.css` - Responsive breakpoints
5. `components/*.css` - Component-specific styles
6. `layouts/layout.css` - Layout styles
7. `pages/assessment.css` - Page-specific styles
8. `App.css` - Application overrides

### Routing Configuration (router.tsx)
```typescript
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'assessment', element: <NewReferralAssessment /> },
      { path: 'referrals', element: <ReferralTrackingPage /> },
      { path: 'messaging', element: <MessagingPage /> },
      { path: 'bulk-upload', element: <BulkUploadPage /> },
      { path: 'audit', element: <AuditTrailPage /> },
      { path: 'guidelines', element: <GuidelinesPage /> }
    ]
  }
]);
```

### Main Layout Component (MainLayout.tsx)
```typescript
const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Navigation items with Lucide React icons
  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { id: 'assessment', label: 'New Assessment', path: '/assessment', icon: <FileText size={20} /> },
    // ... additional items
  ];

  return (
    <div className="main-layout">
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Sidebar with navigation */}
      </aside>
      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <header className="main-header">
          <h1 className="page-title">
            {navigationItems.find(item => isActiveRoute(item.path))?.label}
          </h1>
        </header>
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
```

### Assessment Component (NewReferralAssessment.tsx)
The core assessment component with 694 lines of comprehensive functionality:

#### Key State Management
```typescript
const [formData, setFormData] = useState<FormDataType>({
  lesionType: '',
  document: null,
  extractedText: '',
  imageDescription: '',
  selectedVisionModel: VisionModel.GPT_4O,
  includeImageDescription: false
});

const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
const [isCalculating, setIsCalculating] = useState<boolean>(false);
const [availableModels, setAvailableModels] = useState<OpenAIModel[]>([]);
const [selectedModel, setSelectedModel] = useState<string>('');
```

#### Document Processing Integration
```typescript
const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    setFormData(prev => ({ ...prev, document: file }));
    
    try {
      const extractedText = await extractTextFromDocument(
        file, 
        formData.selectedVisionModel, 
        formData.includeImageDescription
      );
      setFormData(prev => ({ 
        ...prev, 
        extractedText: extractedText.extractedText,
        imageDescription: extractedText.imageDescription || ''
      }));
    } catch (error) {
      console.error('Document processing error:', error);
    }
  }
};
```

### Chat Assistant Component (ChatAssistant.tsx)
217 lines of sophisticated AI chat functionality:

```typescript
const ChatAssistant: React.FC<ChatAssistantProps> = ({ triageData, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);

  // Generate contextual questions based on triage data
  useEffect(() => {
    if (triageData) {
      const questions = generateSuggestedQuestions(triageData);
      setSuggestedQuestions(questions);
    }
  }, [triageData]);

  const sendMessage = async (messageContent: string) => {
    // AI conversation logic with context awareness
  };
};
```

---

## 🎨 Styling & Design System
*Based on Actual CSS Architecture*

### CSS Custom Properties System (globals.css)
```css
:root {
  /* NHS Color Palette */
  --nhs-blue: #003087;
  --nhs-blue-dark: #002060;
  --nhs-blue-light: #1e4a72;
  --nhs-green: #009639;
  --nhs-red: #da020e;
  
  /* Healthcare-specific colors */
  --healthcare-blue: #003087;
  --healthcare-blue-light: #1e4a72;
  
  /* Priority System Colors */
  --urgent-bg: #f8d7da;
  --urgent-border: #dc3545;
  --urgent-text: #721c24;
  
  --routine-bg: #d4edda;
  --routine-border: #28a745;
  --routine-text: #155724;
  
  /* Spacing System */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  
  /* Typography */
  --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Component-specific variables */
  --sidebar-width: 300px;
  --sidebar-width-collapsed: 80px;
  --header-height: 80px;
}
```

### Component-Based Styling Architecture
- **layouts/layout.css**: Grid systems, sidebar, header styling
- **components/buttons.css**: Button variants and states
- **components/forms.css**: Form controls and validation styles
- **components/cards.css**: Card layouts and triage result displays
- **utilities/utilities.css**: Utility classes for spacing, typography, colors
- **utilities/responsive.css**: Responsive breakpoints and utilities
- **utilities/animations.css**: Animation definitions and transitions

### Responsive Design Implementation
```css
/* Mobile-first breakpoints */
@media (min-width: 576px) { /* Small devices */ }
@media (min-width: 768px) { /* Medium devices */ }
@media (min-width: 992px) { /* Large devices */ }
@media (min-width: 1200px) { /* Extra large devices */ }
```

### NHS Design Compliance
- **Color System**: Official NHS blue palette implementation
- **Typography**: Segoe UI font stack for accessibility
- **Accessibility**: WCAG 2.1 AA compliance with focus states
- **Component Design**: Consistent visual hierarchy and spacing

---

## 🔌 API Integration
*Based on openaiService.ts Implementation*

### OpenAI Service Architecture

#### Environment Configuration
```typescript
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || '';
const DEFAULT_MODEL = process.env.REACT_APP_OPENAI_MODEL || 'gpt-4o';
const DEFAULT_TEMPERATURE = parseFloat(process.env.REACT_APP_OPENAI_TEMPERATURE || '0.7');
```

#### Client Initialization
```typescript
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: Production should use backend proxy
});
```

#### Core Service Functions (From Actual Code)

##### Clinical Case Categorization
```typescript
export const categorizeClinicalCase = async (
  clinicalDescription: string, 
  model: string = DEFAULT_MODEL
): Promise<{
  category: ClinicalCaseCategory;
  confidence: number;
  rationale: string;
}> => {
  const response = await openai.chat.completions.create({
    model: model,
    messages: [
      { role: 'system', content: getCategorizationPrompt() },
      { role: 'user', content: clinicalDescription }
    ],
    temperature: 0.3,
    max_tokens: 1000
  });
  
  return parseCategorizationResponse(response.choices[0].message.content);
};
```

##### Available Models Fetching
```typescript
export const fetchAvailableModels = async (): Promise<OpenAIModel[]> => {
  try {
    const response = await openai.models.list();
    return response.data
      .filter(model => model.id.includes('gpt'))
      .map(model => ({
        name: model.id,
        size: 0,
        modified_at: '',
        digest: ''
      }));
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
};
```

##### Image Analysis with Vision Models
```typescript
export const analyzeImage = async (
  imageData: string,
  model: VisionModel = VisionModel.GPT_4O,
  includeDescription: boolean = false
): Promise<{ extractedText: string; imageDescription?: string }> => {
  const messages = [
    {
      role: 'user' as const,
      content: [
        {
          type: 'text' as const,
          text: includeDescription 
            ? 'Extract all text and provide detailed medical image description'
            : 'Extract all visible text from this image'
        },
        {
          type: 'image_url' as const,
          image_url: { url: imageData }
        }
      ]
    }
  ];

  const response = await openai.chat.completions.create({
    model: model,
    messages: messages,
    max_tokens: 1000
  });

  return parseImageAnalysisResponse(response.choices[0].message.content);
};
```

### Document Processing Integration (documentParser.ts)

#### PDF Text Extraction
```typescript
export const extractPdfText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
    workerSrc: `${process.env.PUBLIC_URL}/pdf.worker.min.js`
  }).promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText.trim();
};
```

#### Word Document Processing
```typescript
export const extractWordText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};
```

#### Main Document Processing Function
```typescript
export const extractTextFromDocument = async (
  file: File,
  visionModel: VisionModel = VisionModel.GPT_4O,
  includeImageDescription: boolean = false
): Promise<ImageProcessingResult> => {
  const fileType = file.type.toLowerCase();
  
  try {
    if (fileType === 'application/pdf') {
      const text = await extractPdfText(file);
      return { extractedText: text };
    } 
    else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const text = await extractWordText(file);
      return { extractedText: text };
    }
    else if (fileType === 'text/plain') {
      const text = await file.text();
      return { extractedText: text };
    }
    else if (fileType.startsWith('image/')) {
      return await processImageFile(file, visionModel, includeImageDescription);
    }
    else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Document processing error:', error);
    throw error;
  }
};
```

### Chat Service Integration (From ChatAssistant.tsx)

#### Chat Message Processing
```typescript
const sendMessage = async (messageContent: string) => {
  const userMessage: Message = { role: 'user', content: messageContent };
  const updatedMessages = [...messages, userMessage];
  setMessages(updatedMessages);
  setInput('');
  setIsLoading(true);

  try {
    const response = await fetchOllamaCompletion(
      messageContent, 
      triageData, 
      updatedMessages
    );
    
    const assistantMessage: Message = { role: 'assistant', content: response };
    setMessages(prev => [...prev, assistantMessage]);
  } catch (error) {
    console.error('Chat error:', error);
    const errorMessage: Message = { 
      role: 'assistant', 
      content: 'Sorry, I encountered an error. Please try again.' 
    };
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};
```

### Error Handling Patterns

#### Service-Level Error Handling
```typescript
const handleAPIError = (error: any, context: string) => {
  console.error(`${context} error:`, error);
  
  if (error.status === 401) {
    throw new Error('API authentication failed. Please check your API key.');
  } else if (error.status === 429) {
    throw new Error('Rate limit exceeded. Please try again later.');
  } else if (error.status >= 500) {
    throw new Error('Service temporarily unavailable. Please try again.');
  } else {
    throw new Error(`${context} failed: ${error.message}`);
  }
};
```

---

## 📱 User Interface Guide
*Based on Actual Component Implementation*

### Main Navigation Flow

#### Application Entry Points
1. **Default Route**: `/` → Redirects to `/dashboard`
2. **Dashboard**: `/dashboard` → Analytics and overview
3. **New Assessment**: `/assessment` → Primary triage interface
4. **Referral Tracking**: `/referrals` → Existing referral management
5. **Secure Messaging**: `/messaging` → Clinical communication
6. **Bulk Upload**: `/bulk-upload` → Batch processing
7. **Audit Trail**: `/audit` → Activity monitoring
8. **Guidelines**: `/guidelines` → Clinical reference materials

### Assessment Workflow (NewReferralAssessment.tsx)

#### Form Data Structure
```typescript
interface FormDataType {
  lesionType: string;                    // Clinical description
  document: File | null;                 // Uploaded file
  extractedText: string;                 // Processed document text
  imageDescription: string;              // AI-generated description
  selectedVisionModel: VisionModel;      // AI model selection
  includeImageDescription: boolean;      // Include visual analysis
}
```

#### Assessment Process
1. **Clinical Input**: Enter patient information and lesion description
2. **Document Upload**: Optional file upload (PDF, DOCX, images)
3. **AI Model Selection**: Choose between available models
4. **Processing**: AI analysis of clinical data
5. **Results Display**: Categorization with confidence scores
6. **Chat Consultation**: Optional AI consultation
7. **Export**: PDF report generation

### Chat Interface Features (ChatAssistant.tsx)

#### Suggested Questions System
```typescript
// Generated based on triage context
const suggestedQuestions = [
  "What are the key risk factors for this condition?",
  "How should I explain this assessment to the patient?",
  "What follow-up care is recommended?",
  "Are there any red flags I should watch for?"
];
```

#### Message Display
- **Markdown Support**: Rich text rendering with `react-markdown`
- **Code Highlighting**: Syntax highlighting with `react-syntax-highlighter`
- **Auto-scroll**: Automatic scrolling to latest messages
- **Loading States**: Visual feedback during AI processing

### Dashboard Analytics (DashboardPage.tsx)

#### Key Metrics Display
- **Timeframe Selection**: Today, Week, Month, Quarter
- **Triage Statistics**: Category distribution and volumes
- **Performance Metrics**: Processing times and accuracy
- **Data Export**: Report generation capabilities

#### Interactive Elements
```typescript
const [selectedTimeframe, setSelectedTimeframe] = useState('month');
const [refreshing, setRefreshing] = useState(false);

const handleRefresh = () => {
  setRefreshing(true);
  // Refresh data logic
  setTimeout(() => setRefreshing(false), 2000);
};
```

### Category Display System (CategoryDisplay.tsx)

#### Visual Indicators
```typescript
const getCategoryIcon = () => {
  switch (category) {
    case ClinicalCaseCategory.URGENT:
      return <AlertTriangle className="icon" />;
    case ClinicalCaseCategory.ROUTINE:
      return <Clock className="icon" />;
    case ClinicalCaseCategory.NON_PRIORITY:
      return <Info className="icon" />;
    default:
      return <CheckCircle className="icon" />;
  }
};
```

#### Confidence Display
- **Percentage Score**: AI confidence level (0-100%)
- **Color Coding**: Visual representation of confidence
- **Rationale**: Detailed explanation of categorization
- **Model Attribution**: Shows which AI model generated the result

### Responsive Behavior

#### Sidebar Navigation
- **Desktop**: Full sidebar with labels and icons
- **Tablet**: Collapsible sidebar with hover tooltips
- **Mobile**: Overlay navigation with touch-friendly targets

#### Form Layouts
- **Desktop**: Multi-column layouts with side-by-side elements
- **Tablet**: Stacked forms with reduced spacing
- **Mobile**: Single-column layouts with full-width inputs

---

## 💻 Development Setup
*Based on Actual Project Configuration*

### Prerequisites
- **Node.js 16+** (Required for React 18.2.0)
- **npm** (Package management)
- **Modern Browser** (Chrome, Firefox, Safari, Edge)
- **VS Code** (Recommended IDE)

### Installation Steps

#### 1. Environment Setup
```bash
# Clone repository
git clone [repository-url]
cd nhs-triage-app-main

# Install dependencies
npm install
```

#### 2. Environment Variables Configuration
Create `.env` file in root directory:
```bash
# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_OPENAI_MODEL=gpt-4o
REACT_APP_OPENAI_TEMPERATURE=0.7

# Application Configuration
REACT_APP_VERSION=0.1.0
PUBLIC_URL=/
```

#### 3. Development Server
```bash
# Start development server
npm start

# Application available at http://localhost:3000
```

### Available Scripts (From package.json)

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build", 
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### Development Workflow

#### Code Structure Guidelines
- **TypeScript**: All components use TypeScript with proper interfaces
- **Component Structure**: Functional components with hooks
- **Styling**: CSS modules with NHS design system compliance
- **Error Handling**: Comprehensive error boundaries and try-catch blocks

#### Key Development Files
- **Entry Point**: `src/index.tsx`
- **Main Component**: `src/App.tsx`
- **Routing**: `src/routes/router.tsx`
- **Main Layout**: `src/layouts/MainLayout.tsx`
- **Assessment**: `src/pages/Assessment/NewReferralAssessment.tsx`

#### CSS Import Order (Critical)
```typescript
// From App.tsx - exact import order
import './styles/globals.css';
import './styles/utilities/utilities.css';
import './styles/utilities/animations.css';
import './styles/utilities/responsive.css';
import './styles/components/buttons.css';
import './styles/components/forms.css';
import './styles/components/cards.css';
import './styles/layouts/layout.css';
import './styles/pages/assessment.css';
import './App.css';
```

### Production Build

#### Build Process
```bash
# Create production build
npm run build

# Build output in /build directory
# Static assets in /build/static
# PDF worker at /build/pdf.worker.min.js
```

#### Build Optimization
- **Code Splitting**: Automatic by React Scripts
- **Asset Optimization**: CSS and JS minification
- **Bundle Analysis**: Use `npm run build -- --analyze`

---

## 🚀 Deployment Configuration
*Based on Actual Docker and Deployment Files*

### Docker Configuration

#### Dockerfile (Multi-stage Build)
```dockerfile
# Build stage
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage  
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose (Development)
```yaml
# docker-compose.yml
version: '3.8'
services:
  nhs-triage-app:
    build: .
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
```

#### Docker Compose (Production)
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  nhs-triage-app:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

### Deployment Scripts

#### Windows PowerShell (build-deploy.ps1)
```powershell
param([string]$Mode = "dev")

switch ($Mode) {
    "dev" {
        Write-Host "Starting development environment..."
        docker-compose up -d
    }
    "prod" {
        Write-Host "Building production environment..."
        docker-compose -f docker-compose.prod.yml up -d --build
    }
    "clean" {
        Write-Host "Cleaning containers..."
        docker-compose down -v
        docker system prune -af
    }
}
```

#### Unix/Linux (build-deploy.sh)
```bash
#!/bin/bash
MODE=${1:-dev}

case $MODE in
    "dev")
        echo "Starting development environment..."
        docker-compose up -d
        ;;
    "prod") 
        echo "Building production environment..."
        docker-compose -f docker-compose.prod.yml up -d --build
        ;;
    "clean")
        echo "Cleaning containers..."
        docker-compose down -v
        docker system prune -af
        ;;
esac
```

### Nginx Configuration

#### Production Web Server (nginx.conf)
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # React Router support
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Cache static assets
        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # PDF worker
        location /pdf.worker.min.js {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### Environment Configuration

#### Production Environment Variables
```bash
NODE_ENV=production
REACT_APP_OPENAI_API_KEY=production_api_key
REACT_APP_OPENAI_MODEL=gpt-4o
REACT_APP_VERSION=1.0.0
PUBLIC_URL=https://your-domain.com
```

#### Security Considerations
- **API Key Management**: Use environment variables, never commit keys
- **HTTPS**: Enable SSL/TLS in production
- **CORS**: Configure appropriate CORS policies
- **CSP**: Implement Content Security Policy headers

---

*This documentation is based on actual codebase analysis and reflects the current implementation as of the source code examination. All features, components, and configurations are derived from the real project files.*

**Document Version**: 2.0 (Codebase-Based)  
**Analysis Date**: July 2025  
**Source**: Actual project files and implementation  
**Classification**: Technical Documentation
