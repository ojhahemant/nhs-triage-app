import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Import existing assessment component
import NewReferralAssessment from '../pages/Assessment/NewReferralAssessment';

// Import placeholder pages
import DashboardPage from '../pages/DashboardPage';
import PostTriagingActionsPage from '../pages/PostTriagingActionsPage';
import ReferralTrackingPage from '../pages/ReferralTrackingPage';
import MessagingPage from '../pages/MessagingPage';
import BulkUploadPage from '../pages/BulkUploadPage';
import AuditTrailPage from '../pages/AuditTrailPage';
import GuidelinesPage from '../pages/GuidelinesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <DashboardPage />
      },
      {
        path: 'assessment',
        element: <NewReferralAssessment />
      },
      {
        path: 'post-triaging',
        element: <PostTriagingActionsPage />
      },
      {
        path: 'referrals',
        element: <ReferralTrackingPage />
      },
      {
        path: 'messaging',
        element: <MessagingPage />
      },
      {
        path: 'audit',
        element: <AuditTrailPage />
      },
      {
        path: 'guidelines',
        element: <GuidelinesPage />
      },
      {
        path: 'bulk-upload',
        element: <BulkUploadPage />
      }
    ]
  }
]);

export default router;
