# Plan: Integrating the Triage App into a Scalable Frontend Architecture by HEMANT OJHA

**Objective:** To evolve the current single-view React application into a multi-page, feature-rich platform as outlined in the `FEATURE_EVOLUTION_ROADMAP.md`. This will be done by creating a new, scalable application structure and integrating the existing assessment tool as the first fully functional module.

---

#### **Phase 1: Project Restructuring & Layout Creation**

1.  **New Directory Structure:** I will reorganize the `src` directory to support a multi-page application. This makes the codebase cleaner and easier to navigate as it grows.
    *   `src/components/`: For reusable, shared components (like buttons, modals, icons).
    *   `src/layouts/`: For the main application layout components (e.g., `MainLayout.tsx` which will include the sidebar and header).
    *   `src/pages/`: For top-level page components, each corresponding to a major feature.
    *   `src/services/`: Will continue to hold services like `openaiService.ts`.
    *   `src/utils/`: Will continue to hold utility functions like `documentParser.ts`.
    *   `src/routes/`: To manage application routing.

2.  **Create the Main Application Layout:** I will create a new `MainLayout.tsx` component. This component will define the overall structure of the application, including:
    *   A persistent, collapsible **Sidebar** for navigation.
    *   A **Header** bar for global actions and user information.
    *   A main **Content Area** where the different pages will be rendered.

3.  **Implement Routing:** I will introduce `react-router-dom` to handle navigation between different pages of the application. This is essential for a multi-page application.

---

#### **Phase 2: Stubbing Future Features**

1.  **Create Placeholder Page Components:** For each major feature outlined in the `FEATURE_EVOLUTION_ROADMAP.md`, I will create a placeholder (or "stub") component in the `src/pages/` directory. These will be simple components that indicate a feature is planned for future development.
    *   `DashboardPage.tsx`
    *   `ReferralTrackingPage.tsx`
    *   `MessagingPage.tsx`
    *   `BulkUploadPage.tsx`
    *   `AuditTrailPage.tsx`
    *   `GuidelinesPage.tsx`

2.  **Populate the Sidebar:** The navigation links in the sidebar will be wired up to these new placeholder pages. This will make the future roadmap visible and tangible within the application itself.

---

#### **Phase 3: Integrating the Existing Assessment Tool**

1.  **Relocate and Refactor:** The existing `NewReferralAssessment.tsx` and its associated CSS files will be moved into `src/pages/Assessment/`.

2.  **Integrate into the Layout:** The `NewReferralAssessment` page will be modified to render correctly within the new `MainLayout`. This means it will appear as the main content when the "New Assessment" link in the sidebar is clicked. Its styling will be adjusted to ensure it is visually consistent with the new layout.

3.  **Preserve Functionality:** All existing functionality of the assessment tool—including form handling, document and image processing, AI categorization, and PDF export—will be fully preserved and tested to ensure it works seamlessly within the new structure.

---

**Outcome:**

By the end of this process, we will have a single, cohesive application that:
*   Has a professional, scalable structure with a sidebar and header.
*   Contains the fully functional "New Referral Assessment" tool as its primary, working feature.
*   Includes placeholders for all the future features outlined in the roadmap, providing a clear path for future development.

This approach allows us to continue using the working part of the application without interruption while providing a solid foundation to build upon for future features.
