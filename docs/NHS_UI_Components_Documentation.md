# NHS Plastic Surgery Triage System - UI Components Documentation

## Table of Contents
1. [Overview](#overview)
2. [Main Application Structure](#main-application-structure)
3. [Core UI Components](#core-ui-components)
4. [Form Components](#form-components)
5. [Interactive Elements](#interactive-elements)
6. [AI Integration Components](#ai-integration-components)
7. [Debug and Testing Components](#debug-and-testing-components)
8. [Essential vs Optional UI Elements](#essential-vs-optional-ui-elements)
9. [UI Component Dependencies](#ui-component-dependencies)
10. [Styling and Design System](#styling-and-design-system)

---

## Overview

The NHS Plastic Surgery Triage System is a React-based web application designed to assess plastic surgery referrals using AI-powered categorization. The application follows NHS Design System guidelines and provides a comprehensive form for capturing patient information, clinical details, and generating AI-powered triage recommendations.

---

## Main Application Structure

### App.tsx
**Purpose**: Root application component that manages navigation between main application and debug tools.

**Key Features**:
- Main header with NHS branding
- Debug mode toggle (Ctrl+Shift+D)
- Error boundary wrapper
- Footer with NHS copyright

**UI Elements**:
- Header with title "NHS Plastic Surgery Triage System"
- Debug button (top-right corner)
- Debug mode switcher (Ollama Debugger / Simple Test)
- NHS footer

---

## Core UI Components

### 1. NewReferralAssessment.tsx
**Purpose**: Main form component for capturing referral details and displaying triage results.

**Sections**:
- **Patient Information**: Name, NHS number, date of birth, age
- **Referrer Information**: GP practice, referring GP
- **Lesion Details**: Clinical description, location, size, duration, growth rate, symptoms
- **Medical History**: Family history, previous biopsies, medications, biopsy results
- **Referral Details**: Urgency level, additional notes, document uploads
- **Results Display**: AI categorization results with confidence indicators

### 2. ChatAssistant.tsx
**Purpose**: AI-powered chat interface for discussing triage results.

**Features**:
- Collapsible chat window
- Message history
- Suggested questions
- Markdown rendering with syntax highlighting
- Loading states

### 3. ErrorBoundary.tsx
**Purpose**: Error handling component to catch and display React errors gracefully.

**Features**:
- Error display with NHS styling
- Technical details toggle
- Reset functionality

---

## Form Components

### Patient Information Section
**Fields**:
- ✅ **Patient Name** (text input)
- ✅ **NHS Number** (text input with placeholder)
- ✅ **Date of Birth** (date picker)
- ✅ **Age** (auto-calculated, read-only)

### Referrer Information Section
**Fields**:
- ✅ **GP Practice** (text input)
- ✅ **Referring GP** (text input)

### Lesion Details Section
**Fields**:
- ✅ **Clinical Description** (required textarea)
- ✅ **Location** (text input)
- ✅ **Size** (text input)
- ✅ **Duration** (text input)
- ✅ **Growth Rate** (dropdown: stable/slow/moderate/rapid)
- ✅ **Symptoms** (checkbox group: Asymptomatic, Itching, Pain, Bleeding, Ulceration, Color changes, Irregular borders, Fast-growing)
- ✅ **Clinical Photograph** (file upload for images)

### Medical History Section
**Fields**:
- ✅ **Family History** (textarea)
- ✅ **Previous Biopsies** (textarea)
- ✅ **Current Medications** (textarea)
- ✅ **Recent Biopsy Results** (textarea)

### Referral Details Section
**Fields**:
- ✅ **GP Assessment of Urgency** (dropdown)
- ✅ **Additional Notes** (textarea)
- ✅ **Clinical Documents** (file upload with OCR)
- ✅ **Vision Model Selection** (GPT-4o/GPT-4o Mini)
- ✅ **Include Image Description** (checkbox)

---

## Interactive Elements

### Action Buttons
- ✅ **Reset Form** (with confirmation dialog)
- ✅ **Save Draft** (localStorage with confirmation)
- ✅ **Get AI Categorization** (submit button)
- ✅ **Chat with AI** (opens chat assistant)
- ✅ **Export PDF** (generates assessment report)

### File Upload Components
- ✅ **Clinical Photograph Upload**
  - Accepts: image/* files
  - Max size: 5MB
  - Visual file selector with camera icon

- ✅ **Document Upload with OCR**
  - Accepts: .pdf, .docx, .txt, .jpg, .jpeg, .png
  - Max size: 10MB
  - AI-powered text extraction
  - Image preview for uploaded images
  - Extracted text preview

### Model Selection
- ✅ **AI Model Selector** (dropdown for available OpenAI models)
- ✅ **Vision Model Selector** (GPT-4o variants for document processing)

---

## AI Integration Components

### Triage Results Display
**Elements**:
- ✅ **Category Badge** (Urgent/Routine/Non-Priority/MDT Review)
- ✅ **Confidence Gauge** (visual bar with percentage)
- ✅ **AI Rationale** (formatted text explanation)
- ✅ **Model Information** (shows which AI model was used)
- ✅ **Disclaimer** (clinical responsibility note)

### Chat Assistant Interface
**Elements**:
- ✅ **Chat Window** (collapsible overlay)
- ✅ **Message History** (user/assistant messages)
- ✅ **Input Field** (with send button)
- ✅ **Suggested Questions** (clickable quick starts)
- ✅ **Loading States** (spinner during AI responses)
- ✅ **Markdown Rendering** (for formatted AI responses)

---

## Debug and Testing Components

### OpenAIDebugger.tsx
**Purpose**: Testing and debugging AI service connections.

**Features**:
- ✅ **Prompt Input** (textarea for test prompts)
- ✅ **Test Button** (trigger AI calls)
- ✅ **Response Display** (formatted AI responses)
- ✅ **Error Display** (connection/API errors)
- ✅ **Logs Panel** (timestamped debug information)

### SimpleTest.tsx
**Purpose**: Basic functionality testing component.

### EnvDebugger.tsx
**Purpose**: Environment variable debugging (unused in current build).

### OllamaDebugger.tsx
**Purpose**: Local Ollama testing (unused in current build).

---

## Essential vs Optional UI Elements

### Essential UI Elements (Required for Core Functionality)

#### Critical for App Operation:
- ✅ **Clinical Description field** (only required field)
- ✅ **Submit button** (Get AI Categorization)
- ✅ **AI Results display** (categorization output)
- ✅ **Error Boundary** (prevents app crashes)
- ✅ **Main Header** (navigation and branding)

#### Important for User Experience:
- ✅ **Form sections organization** (Patient, Referrer, Lesion, History)
- ✅ **File upload functionality** (clinical photos and documents)
- ✅ **Model selection** (AI model choice)
- ✅ **Reset/Save draft buttons** (form management)

### Optional UI Elements (Enhancement Features)

#### Currently Implemented but Not Essential:
- ⭐ **Chat Assistant** (helpful but not required for triage)
- ⭐ **PDF Export** (nice-to-have reporting feature)
- ⭐ **Debug Tools** (development/testing only)
- ⭐ **Suggested Questions** (chat enhancement)
- ⭐ **Confidence Gauge** (visual enhancement)
- ⭐ **Save Draft functionality** (convenience feature)
- ⭐ **Image preview** (helpful but not essential)
- ⭐ **Auto-calculated age** (convenience feature)
- ⭐ **Keyboard shortcuts** (power user feature)

#### Present but Unused Elements:
- ❌ **OllamaDebugger** (commented out, not accessible)
- ❌ **EnvDebugger** (present but not used)
- ❌ **isGuideOpen state** (categorization guide - commented out)
- ❌ **AlertCircle icon** (imported but removed from use)

### Redundant/Unused Code Elements:
- ❌ **Legacy triage calculation** (replaced by AI categorization)
- ❌ **Manual urgency scoring** (superseded by AI confidence)
- ❌ **Old validation logic** (simplified to require only clinical description)

---

## UI Component Dependencies

### External Dependencies:
- **React**: Core framework
- **Lucide React**: Icon system
- **React-to-PDF**: PDF generation
- **React-Markdown**: Chat message formatting
- **React-Syntax-Highlighter**: Code formatting in chat
- **OpenAI SDK**: AI service integration

### Internal Service Dependencies:
- **openaiService.ts**: AI categorization and chat
- **documentParser.ts**: File upload and OCR processing
- **questionSuggestions.ts**: Chat question generation

### Styling Dependencies:
- **NHS Design System**: Color scheme and typography
- **Custom CSS**: Component-specific styling
- **Responsive Grid**: Form layout system

---

## Styling and Design System

### NHS Design System Implementation:
- **Colors**: NHS Blue (#005EB8), NHS Green (#007f3b), NHS Red (#d5281b)
- **Typography**: Frutiger W01 font family
- **Spacing**: Consistent 16px/24px/32px spacing system
- **Border Radius**: 4px standard radius
- **Box Shadows**: Subtle elevation effects

### CSS Architecture:
- **App.css**: Global styles and NHS header/footer
- **NewReferralAssessment.css**: Main form styling (883 lines)
- **ChatAssistant.css**: Chat interface styling
- **Component-specific styles**: Inline styles for specialized components

### Responsive Design:
- **Mobile-first approach** with progressive enhancement
- **Grid layouts** that adapt to screen size
- **Flexible form rows** that stack on smaller screens
- **Touch-friendly** button sizes and spacing

---

## Summary

The NHS Plastic Surgery Triage System provides a comprehensive UI for medical referral assessment with AI integration. The application successfully balances essential clinical functionality with modern user experience features. The core workflow (form completion → AI categorization → results display) is supported by essential UI elements, while additional features like chat assistance and document processing enhance the user experience without being critical to basic operation.

The modular component architecture allows for easy maintenance and feature toggles, making it possible to enable/disable optional features based on deployment requirements or user needs.
