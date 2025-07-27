# NHS AI Triaging System - Product Evolution Guide for AI Coding Agent

## 🎯 Mission Statement
Transform the existing NHS Plastic Surgery Triage System based on stakeholder feedback and requirements gathered from comprehensive user interviews. This guide provides step-by-step instructions for an AI coding agent to evolve the current application into the final production-ready system.

---

## 📋 Current State Analysis

### ✅ What Currently Works (Keep As-Is)
- **New Assessment functionality** - Fully functional with OpenAI integration
- **React TypeScript architecture** - Solid foundation
- **NHS design system** - Color scheme and styling
- **Document processing** - PDF, DOCX, image processing with OCR
- **Chat Assistant integration** - AI consultation features
- **Responsive design** - Mobile-first approach
- **Docker deployment setup** - Production-ready containerization

### ❌ Critical Issues to Address
- **Feature order is incorrect** - Dashboard should be #1, not redirect destination
- **Missing Post-Triaging Actions** - Major new feature group required
- **Dashboard lacks specific metrics** - Needs complete overhaul with specified KPIs
- **"Accuracy" terminology used** - Must be removed throughout
- **"Real-time" terminology used** - Must be replaced with "Live" or "Current"
- **Features need simulation** - Most features beyond New Assessment need working simulations

---

## 🔄 Required Feature Reordering

### Current Navigation Order (INCORRECT)
```typescript
// Current order from MainLayout.tsx
const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },           // Position 1
  { id: 'assessment', label: 'New Assessment', path: '/assessment' },    // Position 2
  { id: 'referrals', label: 'Referral Tracking', path: '/referrals' },  // Position 3
  { id: 'messaging', label: 'Secure Messaging', path: '/messaging' },   // Position 4
  { id: 'bulk-upload', label: 'Bulk Upload', path: '/bulk-upload' },    // Position 5
  { id: 'audit', label: 'Audit Trail', path: '/audit' },               // Position 6
  { id: 'guidelines', label: 'Clinical Guidelines', path: '/guidelines' } // Position 7
];
```

### Required Navigation Order (CORRECT)
```typescript
// Updated order based on stakeholder requirements
const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },                    // Feature 1
  { id: 'assessment', label: 'New Assessment', path: '/assessment' },             // Feature 2  
  { id: 'post-triaging', label: 'Post-Triaging Actions', path: '/post-triaging' }, // Feature 3 (NEW)
  { id: 'referrals', label: 'Referral Tracking', path: '/referrals' },           // Feature 4
  { id: 'messaging', label: 'Secure Messaging', path: '/messaging' },            // Feature 5
  { id: 'audit', label: 'Audit Trail', path: '/audit' },                        // Feature 6
  { id: 'guidelines', label: 'Clinical Guidelines', path: '/guidelines' },       // Feature 7
  { id: 'bulk-upload', label: 'Bulk Upload', path: '/bulk-upload' }             // Feature 8
];
```

---

## 📊 Feature 1: Dashboard Enhancement (MAJOR OVERHAUL REQUIRED)

### Current State
- Basic placeholder with timeframe selection
- Generic performance metrics
- Minimal functionality

### Required Implementation
Create a comprehensive dashboard with specific KPIs as discussed in stakeholder meetings.

#### 📋 TASK 1A: Update DashboardPage.tsx
Replace the entire dashboard implementation with the following specifications:

```typescript
// Required Dashboard State Interface
interface DashboardMetrics {
  totalAssessments: number;
  avgProcessingTime: number; // in seconds
  userSatisfaction: number; // rating out of 5
  priorityDistribution: {
    urgent: number;
    routine: number;
    nonPriority: number;
  };
  systemActivity: SystemActivity[];
  systemAlerts: SystemAlert[];
}

interface SystemActivity {
  id: string;
  type: 'assessment_completed' | 'referral_submitted' | 'system_update' | 'data_access';
  description: string;
  user: string;
  timestamp: Date;
}

interface SystemAlert {
  id: string;
  type: 'priority' | 'performance' | 'system';
  title: string;
  description: string;
  actionRequired: boolean;
  severity: 'low' | 'medium' | 'high';
}
```

#### 📋 TASK 1B: Dashboard Layout Structure
```jsx
// Required Dashboard Layout
<div className="dashboard-page">
  <div className="dashboard-grid">
    {/* Key Performance Metrics Row */}
    <div className="metrics-row">
      <MetricCard title="Total Assessments" value={metrics.totalAssessments} />
      <MetricCard title="Avg Processing Time" value={`${metrics.avgProcessingTime}s`} />
      <MetricCard title="User Satisfaction" value={`${metrics.userSatisfaction}/5 ⭐`} />
    </div>
    
    {/* Charts Row */}
    <div className="charts-row">
      <AssessmentVolumeChart />
      <PriorityDistributionChart data={metrics.priorityDistribution} />
    </div>
    
    {/* Activity and Alerts Row */}
    <div className="activity-alerts-row">
      <SystemActivityFeed activities={metrics.systemActivity} />
      <SystemAlertsPanel alerts={metrics.systemAlerts} />
    </div>
  </div>
</div>
```

#### 📋 TASK 1C: Required Dashboard Components
Create the following new components in `src/components/dashboard/`:

1. **MetricCard.tsx** - Individual metric display cards
2. **AssessmentVolumeChart.tsx** - Volume trend visualization
3. **PriorityDistributionChart.tsx** - Priority breakdown (Urgent 20%, Routine 60%, Non-Priority 20%)
4. **SystemActivityFeed.tsx** - Live activity feed with examples:
   - "Assessment completed for patient ID 123456789" - Dr. Sarah Chen • 2 hours ago
   - "Referral submitted to Plastic Surgery" - Dr. Sarah Chen • 3 hours ago
   - "Patient record updated with Healthcare system data" - System • 4 hours ago
5. **SystemAlertsPanel.tsx** - Alert management with examples:
   - "5 urgent referrals requiring review" with Review button
   - "AI decision quality improved +1.2% improvement in clinical agreement" with Details button

#### 📋 TASK 1D: Simulated Data Service
Create `src/services/dashboardSimulation.ts`:
```typescript
export const getDashboardMetrics = (): Promise<DashboardMetrics> => {
  // Return realistic simulated data that updates every 30 seconds
  // Include the specific examples mentioned in stakeholder requirements
}
```

---

## 🆕 Feature 3: Post-Triaging Actions (COMPLETELY NEW FEATURE)

### Required Implementation
This is a major new feature group that needs to be built from scratch.

#### 📋 TASK 3A: Create Post-Triaging Actions Page
Create `src/pages/PostTriagingActionsPage.tsx` and `src/pages/PostTriagingActionsPage.css`

```typescript
// Required Post-Triaging Actions Interface
interface PostTriagingAction {
  id: string;
  patientId: string;
  triageCategory: 'urgent' | 'routine' | 'non-priority';
  assignedDoctor: string;
  status: 'pending' | 'in-progress' | 'completed';
  actions: {
    patientCommunication: PatientCommunication;
    scheduling: SchedulingAction;
    workflowAutomation: WorkflowAction;
  };
}

interface PatientCommunication {
  emailSent: boolean;
  smsSent: boolean;
  letterGenerated: boolean;
  communicationType: string;
  content: string;
  sentAt?: Date;
}

interface SchedulingAction {
  clinicAppointment: {
    scheduled: boolean;
    dateTime?: Date;
    practitioner?: string;
    location?: string;
  };
  theaterListing: {
    added: boolean;
    surgeryDate?: Date;
    surgeonAssigned?: string;
    procedure?: string;
  };
}
```

#### 📋 TASK 3B: Post-Triaging Actions Layout
```jsx
// Required Page Layout
<div className="post-triaging-actions-page">
  <div className="actions-header">
    <h2>Post-Triaging Actions</h2>
    <div className="action-filters">
      <select name="status">
        <option value="all">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  </div>
  
  <div className="actions-grid">
    <div className="communication-section">
      <h3>Patient Communication</h3>
      <AutomatedCommunicationPanel />
    </div>
    
    <div className="scheduling-section">
      <h3>Intelligent Scheduling</h3>
      <SchedulingManagementPanel />
    </div>
    
    <div className="workflow-section">
      <h3>Workflow Automation</h3>
      <WorkflowAutomationPanel />
    </div>
  </div>
</div>
```

#### 📋 TASK 3C: Required Components
Create the following components in `src/components/post-triaging/`:

1. **AutomatedCommunicationPanel.tsx** - Shows patient communication status and options
2. **SchedulingManagementPanel.tsx** - Displays clinic and theater scheduling
3. **WorkflowAutomationPanel.tsx** - Shows automated workflow progress
4. **PatientCommunicationCard.tsx** - Individual patient communication tracking
5. **SchedulingCard.tsx** - Individual scheduling item display

#### 📋 TASK 3D: Simulation Service
Create `src/services/postTriagingSimulation.ts` with realistic simulated data for all post-triaging actions.

---

## 🔧 Feature 2: New Assessment (MINOR UPDATES ONLY)

### Current State
✅ Fully functional - DO NOT BREAK existing functionality

### Required Changes
Only terminology updates - NO functional changes.

#### 📋 TASK 2A: Terminology Updates in NewReferralAssessment.tsx
1. Replace "accuracy" with "quality" or "effectiveness"
2. Replace "real-time" with "live" or "current"
3. Update user satisfaction description to clarify it's doctors rating AI decisions

#### 📋 TASK 2B: Update Interface Comments
```typescript
// Update interface documentation
interface TriageResult {
  urgencyScore: number;                  // Numerical urgency score
  recommendedTimeframe: string;          // Assessment timeframe
  recommendedSpecialty: string;          // Recommended specialty
  recommendationReason: string;          // Clinical reasoning
  categorization?: {
    category: ClinicalCaseCategory;      // URGENT, ROUTINE, MDT, NON_PRIORITY
    confidence: number;                  // AI confidence score (keep this internal)
    rationale: string;                   // Categorization reasoning
  };
}
```

---

## 📈 Feature 4: Referral Tracking (ENHANCE WITH SIMULATION)

### Current State
Basic placeholder page

### Required Implementation

#### 📋 TASK 4A: Update ReferralTrackingPage.tsx
```typescript
// Required Referral Tracking Interface
interface ReferralCase {
  id: string;
  patientId: string;
  referralDate: Date;
  currentStatus: 'received' | 'triaged' | 'scheduled' | 'completed';
  urgencyLevel: 'urgent' | 'routine' | 'non-priority';
  assignedDepartment: string;
  progress: ReferralProgress[];
  estimatedCompletion?: Date;
}

interface ReferralProgress {
  stage: string;
  status: 'completed' | 'in-progress' | 'pending';
  timestamp?: Date;
  notes?: string;
}
```

#### 📋 TASK 4B: Required Components
Create in `src/components/referral-tracking/`:
1. **ReferralCaseCard.tsx** - Individual case display
2. **ReferralProgressTracker.tsx** - Progress visualization
3. **ReferralFilters.tsx** - Filtering and search
4. **ReferralStatusBadge.tsx** - Status indicators

---

## 💬 Feature 5: Secure Messaging (ENHANCE WITH SIMULATION)

### Current State
Basic placeholder

### Required Implementation

#### 📋 TASK 5A: Update MessagingPage.tsx
Create a comprehensive NHS-integrated messaging simulation with:
1. **Internal Messaging** - Between medical professionals
2. **Patient Communication Hub** - Centralized patient communications
3. **Template Management** - Standardized message templates
4. **Priority Messaging** - Urgent case communications

#### 📋 TASK 5B: Required Components
Create in `src/components/messaging/`:
1. **MessageThread.tsx** - Individual conversation thread
2. **MessageComposer.tsx** - Message creation interface
3. **TemplateSelector.tsx** - Pre-built message templates
4. **PriorityMessageAlert.tsx** - Urgent message notifications

---

## 📝 Feature 6: Audit Trail (ENHANCE WITH SIMULATION)

### Current State
Basic placeholder

### Required Implementation

#### 📋 TASK 6A: Update AuditTrailPage.tsx
```typescript
// Required Audit Interface
interface AuditEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  resourceType: 'assessment' | 'referral' | 'patient' | 'system';
  resourceId: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}
```

#### 📋 TASK 6B: Required Features
1. **Complete Activity Log** - All system interactions
2. **Compliance Reporting** - NHS governance reports
3. **User Activity Tracking** - Individual user actions
4. **System Performance Logs** - Technical monitoring

---

## 📚 Feature 7: Clinical Guidelines (ENHANCE WITH SIMULATION)

### Current State
Basic placeholder

### Required Implementation

#### 📋 TASK 7A: Update GuidelinesPage.tsx
Create comprehensive medical protocol database with:
1. **BAD Guidelines** - British Association of Dermatology
2. **NICE Guidelines** - National Institute for Health and Care Excellence  
3. **BSSH Guidelines** - British Society for Hand Surgery
4. **Search and Navigation** - Interactive guideline browsing

#### 📋 TASK 7B: Required Components
Create in `src/components/guidelines/`:
1. **GuidelineCard.tsx** - Individual guideline display
2. **GuidelineSearch.tsx** - Search and filter interface
3. **GuidelineViewer.tsx** - Full guideline content display
4. **GuidelineNavigation.tsx** - Hierarchical navigation

---

## 📤 Feature 8: Bulk Upload (ENHANCE EXISTING)

### Current State
Basic placeholder

### Required Implementation
Enhance with comprehensive bulk processing simulation showing:
1. **Progress Tracking** - Batch processing progress
2. **Error Reporting** - Failed upload handling
3. **Validation Results** - Data quality checks
4. **Processing Analytics** - Batch performance metrics

---

## 🎨 Global Styling Updates

### 📋 TASK: Terminology Replacements
Search and replace throughout ALL files:

1. **"Real-time" → "Live"**
   - "Real-time dashboard" → "Live dashboard"
   - "Real-time updates" → "Live updates"
   - "Real-time monitoring" → "Live monitoring"

2. **"Accuracy" → "Quality" or "Effectiveness"**
   - "AI accuracy" → "AI decision quality"
   - "Accuracy rate" → "Quality score"
   - "Accuracy improvement" → "Quality enhancement"

3. **User Satisfaction Clarification**
   - Update all references to clarify this means "medical professionals rating AI triaging decisions"

### 📋 TASK: CSS Updates
1. Update `src/styles/globals.css` to ensure proper NHS color compliance
2. Add new CSS for Post-Triaging Actions components
3. Enhance dashboard styling for new metric cards
4. Ensure responsive design for all new components

---

## 🔧 Technical Implementation Requirements

### File Structure Changes Required

#### New Files to Create
```
src/
├── pages/
│   └── PostTriagingActionsPage.tsx (NEW)
│   └── PostTriagingActionsPage.css (NEW)
├── components/
│   ├── dashboard/ (NEW FOLDER)
│   │   ├── MetricCard.tsx
│   │   ├── AssessmentVolumeChart.tsx
│   │   ├── PriorityDistributionChart.tsx
│   │   ├── SystemActivityFeed.tsx
│   │   └── SystemAlertsPanel.tsx
│   ├── post-triaging/ (NEW FOLDER)
│   │   ├── AutomatedCommunicationPanel.tsx
│   │   ├── SchedulingManagementPanel.tsx
│   │   ├── WorkflowAutomationPanel.tsx
│   │   ├── PatientCommunicationCard.tsx
│   │   └── SchedulingCard.tsx
│   ├── referral-tracking/ (NEW FOLDER)
│   ├── messaging/ (NEW FOLDER)
│   └── guidelines/ (NEW FOLDER)
├── services/
│   ├── dashboardSimulation.ts (NEW)
│   ├── postTriagingSimulation.ts (NEW)
│   ├── referralTrackingSimulation.ts (NEW)
│   ├── messagingSimulation.ts (NEW)
│   └── guidelinesSimulation.ts (NEW)
```

#### Files to Modify
```
src/
├── routes/router.tsx (Add new route for post-triaging)
├── layouts/MainLayout.tsx (Update navigation order)
├── pages/Assessment/NewReferralAssessment.tsx (Terminology only)
├── pages/DashboardPage.tsx (Complete overhaul)
├── pages/ReferralTrackingPage.tsx (Major enhancement)
├── pages/MessagingPage.tsx (Major enhancement)
├── pages/AuditTrailPage.tsx (Major enhancement)
├── pages/GuidelinesPage.tsx (Major enhancement)
├── pages/BulkUploadPage.tsx (Enhancement)
```

### 📋 TASK: Router Updates
Update `src/routes/router.tsx`:
```typescript
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },                    // Feature 1
      { path: 'assessment', element: <NewReferralAssessment /> },            // Feature 2
      { path: 'post-triaging', element: <PostTriagingActionsPage /> },       // Feature 3 (NEW)
      { path: 'referrals', element: <ReferralTrackingPage /> },             // Feature 4
      { path: 'messaging', element: <MessagingPage /> },                    // Feature 5
      { path: 'audit', element: <AuditTrailPage /> },                      // Feature 6
      { path: 'guidelines', element: <GuidelinesPage /> },                 // Feature 7
      { path: 'bulk-upload', element: <BulkUploadPage /> }                 // Feature 8
    ]
  }
]);
```

---

## 🚦 Implementation Priority Order

### Phase 1: Core Structure (Implement First)
1. **Navigation Reordering** - Update MainLayout.tsx and router.tsx
2. **Terminology Updates** - Replace "real-time" and "accuracy" throughout
3. **Dashboard Overhaul** - Complete dashboard replacement

### Phase 2: Major New Feature (Implement Second)
1. **Post-Triaging Actions** - Complete new feature implementation
2. **Simulation Services** - All required simulation data services

### Phase 3: Feature Enhancements (Implement Third)
1. **Referral Tracking Enhancement**
2. **Secure Messaging Enhancement**
3. **Audit Trail Enhancement**
4. **Clinical Guidelines Enhancement**
5. **Bulk Upload Enhancement**

### Phase 4: Polish and Testing (Implement Last)
1. **CSS and Styling Updates**
2. **Responsive Design Verification**
3. **Component Testing**
4. **Error Handling Verification**

---

## ⚠️ Critical Requirements

### DO NOT BREAK
- **New Assessment functionality** - This is the only fully working feature
- **Document processing** - PDF, DOCX, image processing must continue working
- **Chat Assistant** - AI consultation must remain functional
- **OpenAI integration** - Do not modify openaiService.ts unless for terminology
- **TypeScript interfaces** - Maintain type safety throughout

### MUST IMPLEMENT
- **Post-Triaging Actions** - This is the most critical new feature
- **Dashboard metrics** - Exact specifications as provided
- **Navigation reordering** - Feature order is mandatory
- **Terminology changes** - Remove "accuracy" and "real-time" completely
- **Simulation services** - All non-functional features need working simulations

### SIMULATION REQUIREMENTS
Since most features don't have real system integrations yet:
1. **Create realistic data** - Use medically plausible examples
2. **Update data periodically** - Simulate system activity
3. **Make it interactive** - Users should be able to interact with simulated features
4. **Maintain consistency** - Simulated data should be consistent across features
5. **Include error states** - Show how system handles errors and edge cases

---

## 📝 Testing Checklist

After implementation, verify:
- [ ] Navigation order matches requirements (Dashboard → New Assessment → Post-Triaging → etc.)
- [ ] Dashboard shows all required metrics with exact examples
- [ ] Post-Triaging Actions page is fully functional with simulations
- [ ] No "accuracy" or "real-time" terminology remains
- [ ] New Assessment still works exactly as before
- [ ] All pages load without errors
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Simulation data is realistic and updates appropriately
- [ ] NHS design system compliance maintained
- [ ] TypeScript compilation succeeds with no errors

---

## 🎯 Success Criteria

The implementation is complete when:
1. **All 8 features** are functional (real or simulated)
2. **Feature ordering** matches stakeholder requirements exactly
3. **Dashboard contains** all specified metrics and examples
4. **Post-Triaging Actions** is fully implemented as a major feature group
5. **Terminology is clean** - no "accuracy" or "real-time" references
6. **New Assessment** continues to work perfectly
7. **All pages are responsive** and follow NHS design guidelines
8. **Simulation data** provides realistic user experience for non-integrated features

This guide provides the AI coding agent with clear, actionable instructions to transform the existing application into the stakeholder-approved final version while maintaining all existing functionality and adding the required new features.
