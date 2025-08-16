import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'clinician' | 'admin' | 'consultant';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #005eb8 0%, #003d82 100%)',
        color: 'white'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: 'white',
          borderRadius: '16px',
          color: '#323130',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e1e5e9',
            borderTop: '4px solid #005eb8',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: '600'
          }}>
            Verifying credentials...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permissions if required
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #005eb8 0%, #003d82 100%)',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px'
          }}>
            🚫
          </div>
          <h2 style={{
            color: '#dc2626',
            margin: '0 0 16px 0',
            fontSize: '24px',
            fontWeight: '600'
          }}>
            Access Denied
          </h2>
          <p style={{
            color: '#6b7280',
            margin: '0 0 24px 0',
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            You don't have permission to access this page. This area requires{' '}
            <strong>{requiredRole}</strong> level access.
          </p>
          <div style={{
            padding: '16px',
            background: '#f8f9fb',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <p style={{
              margin: '0',
              fontSize: '14px',
              color: '#323130'
            }}>
              <strong>Current Role:</strong> {user.role}
              <br />
              <strong>Required Role:</strong> {requiredRole}
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            style={{
              background: 'linear-gradient(135deg, #005eb8 0%, #003d82 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #004494 0%, #002d5e 100%)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #005eb8 0%, #003d82 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and has proper permissions
  return <>{children}</>;
};

export default ProtectedRoute;
