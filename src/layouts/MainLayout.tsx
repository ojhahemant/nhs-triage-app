import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  FileText, 
  BarChart3, 
  MessageSquare, 
  Upload, 
  FileCheck, 
  BookOpen, 
  Home,
  Users,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import HelpSystem from '../components/HelpSystem';
import '../styles/layouts/layout.css';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: <Home size={20} />
    },
    {
      id: 'assessment',
      label: 'New Assessment',
      path: '/assessment',
      icon: <FileText size={20} />
    },
    {
      id: 'post-triaging',
      label: 'Post-Triaging Actions',
      path: '/post-triaging',
      icon: <Settings size={20} />
    },
    {
      id: 'referrals',
      label: 'Referral Tracking',
      path: '/referrals',
      icon: <BarChart3 size={20} />
    },
    {
      id: 'messaging',
      label: 'Secure Messaging',
      path: '/messaging',
      icon: <MessageSquare size={20} />
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      path: '/audit',
      icon: <FileCheck size={20} />
    },
    {
      id: 'guidelines',
      label: 'Clinical Guidelines',
      path: '/guidelines',
      icon: <BookOpen size={20} />
    },
    {
      id: 'bulk-upload',
      label: 'Bulk Upload',
      path: '/bulk-upload',
      icon: <Upload size={20} />
    }
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const isActiveRoute = (path: string) => {
    if (path === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Get current page context for help system
  const getCurrentPageContext = () => {
    const currentItem = navigationItems.find(item => isActiveRoute(item.path));
    if (currentItem) {
      switch (currentItem.id) {
        case 'dashboard': return 'dashboard';
        case 'assessment': return 'assessment';
        case 'post-triaging': return 'post-triaging';
        case 'referrals': return 'referral-tracking';
        case 'messaging': return 'messaging';
        case 'audit': return 'audit-trail';
        case 'guidelines': return 'guidelines';
        case 'bulk-upload': return 'bulk-upload';
        default: return 'dashboard';
      }
    }
    return 'dashboard';
  };

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            {!sidebarCollapsed && (
              <>
                <div className="brand-icon">
                  <Users size={24} />
                </div>
                <div className="brand-text">
                  <h2>Healthcare Triage</h2>
                  <span>Plastic Surgery</span>
                </div>
              </>
            )}
            {sidebarCollapsed && (
              <div className="brand-icon-collapsed">
                <Users size={24} />
              </div>
            )}
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navigationItems.map((item) => (
              <li key={item.id} className="nav-item">
                <Link
                  to={item.path}
                  className={`nav-link ${isActiveRoute(item.path) ? 'active' : ''} ${item.comingSoon ? 'coming-soon' : ''}`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!sidebarCollapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      {item.comingSoon && (
                        <span className="coming-soon-badge">Soon</span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {!sidebarCollapsed && (
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">
                <Users size={16} />
              </div>
              <div className="user-details">
                <div className="user-name">Dr. Sarah C</div>
                <div className="user-role">Plastic Surgery</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Header */}
        <header className="main-header">
          <div className="header-left">
            <h1 className="page-title">
              {navigationItems.find(item => isActiveRoute(item.path))?.label || 'Plastic Surgery Triage System'}
            </h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-welcome">Welcome, {user?.fullName}</span>
              <span className="user-role">{user?.role}</span>
            </div>
            
            <div className="header-actions">
              <button 
                className="logout-button-direct"
                onClick={handleLogout}
                title="Sign Out"
                style={{
                  background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="content-area">
          <Outlet />
        </main>
      </div>

      {/* Help System */}
      <HelpSystem 
        currentPage={getCurrentPageContext()}
        contextualHelp={true}
      />
    </div>
  );
};

export default MainLayout;
