import React, { useState, useEffect, useMemo } from 'react';
import { 
  HelpCircle, 
  X, 
  Search, 
  ChevronRight, 
  ChevronDown,
  BookOpen,
  Video,
  MessageCircle,
  Download,
  ExternalLink,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';
import './HelpSystem.css';

interface HelpSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  subsections?: HelpSubsection[];
  quickTips?: string[];
  troubleshooting?: string[];
}

interface HelpSubsection {
  id: string;
  title: string;
  content: string;
  steps?: string[];
}

interface HelpSystemProps {
  currentPage?: string;
  contextualHelp?: boolean;
}

const HelpSystem: React.FC<HelpSystemProps> = ({ 
  currentPage = 'dashboard',
  contextualHelp = false 
}) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('getting-started');
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<HelpSection[]>([]);

  // Sync external isOpen prop with internal state
  useEffect(() => {
    setIsHelpOpen(false);
  }, []);

  const helpSections: HelpSection[] = useMemo(() => [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <BookOpen size={20} />,
      content: `Welcome to the NHS Plastic Surgery Triage System! This system provides AI-powered clinical decision support for plastic surgery referrals, streamlining the assessment process while maintaining clinical safety and professional standards.`,
      subsections: [
        {
          id: 'first-setup',
          title: 'First Time Setup',
          content: 'No complex setup required - just open your web browser and start using the system.',
          steps: [
            'Open your web browser and navigate to the system URL',
            'Use the sidebar menu to access different sections',
            'Ensure JavaScript is enabled for full functionality',
            'No login required - this is a demonstration system'
          ]
        },
        {
          id: 'interface-overview',
          title: 'Understanding the Interface',
          content: 'The system uses NHS design standards with clear navigation and status indicators.',
          steps: [
            'Blue NHS branding throughout for consistency',
            'Sidebar navigation always visible for quick switching',
            'Main content area changes based on selected section',
            'Color-coded priority levels (Red=Urgent, Yellow=Routine, Green=Non-Priority)'
          ]
        }
      ],
      quickTips: [
        'Start with the Dashboard to get an overview of system activity',
        'Use the New Assessment page for individual referral evaluations',
        'Click any section in the sidebar to navigate instantly',
        'Look for color-coded indicators throughout the system'
      ]
    },
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      icon: <ChevronRight size={20} />,
      content: `Monitor system performance and recent activity at a glance. The dashboard provides key metrics, charts, and real-time updates.`,
      subsections: [
        {
          id: 'key-metrics',
          title: 'Key Metrics',
          content: 'Essential performance indicators for system monitoring.',
          steps: [
            'Total Assessments: Current volume of processed referrals',
            'Average Processing Time: System efficiency metrics',
            'User Satisfaction: Star rating feedback system',
            'Priority Distribution: Breakdown of urgent/routine/non-priority cases'
          ]
        },
        {
          id: 'charts-analytics',
          title: 'Charts and Analytics',
          content: 'Visual representations of system performance and trends.',
          steps: [
            'Volume Trends: 7-day assessment volume chart',
            'Priority Distribution: Visual breakdown of case categories',
            'System Activity Feed: Real-time updates of recent actions',
            'System Alerts: Important notifications requiring attention'
          ]
        }
      ],
      quickTips: [
        'Check the dashboard first thing each day for system health',
        'Review alerts immediately - they indicate priority issues',
        'Use charts to identify patterns and trends',
        'Monitor activity feed for recent system actions'
      ],
      troubleshooting: [
        'If metrics show "0" - refresh the page',
        'If charts not loading - check internet connection',
        'If alerts not displaying - clear browser cache'
      ]
    },
    {
      id: 'assessment',
      title: 'New Referral Assessment',
      icon: <CheckCircle size={20} />,
      content: `Assess new plastic surgery referrals using AI-powered clinical decision support. This is the core feature of the system.`,
      subsections: [
        {
          id: 'clinical-description',
          title: 'Clinical Description',
          content: 'The most important field - describe the clinical condition requiring assessment.',
          steps: [
            'Required field - system will not process without this',
            'Be specific: include lesion characteristics, location, symptoms',
            'Example: "Irregular pigmented lesion on patient\'s back, 8mm diameter, recent changes in color and size"',
            'More detail = better AI assessment accuracy'
          ]
        },
        {
          id: 'document-upload',
          title: 'Document Upload (Optional)',
          content: 'Upload supporting clinical documents for enhanced assessment.',
          steps: [
            'Supported formats: PDF, Word documents, images (JPEG, PNG)',
            'AI automatically extracts relevant text',
            'Maximum file size: 10MB per file',
            'Use cases: GP referral letters, clinical notes, photographs'
          ]
        },
        {
          id: 'ai-models',
          title: 'AI Model Selection',
          content: 'Choose the appropriate AI model for your assessment.',
          steps: [
            'GPT-4o (recommended): Best clinical reasoning',
            'GPT-4o-mini: Faster processing, good accuracy',
            'GPT-4-turbo: Alternative high-quality option',
            'Access settings via floating button (top-right)'
          ]
        },
        {
          id: 'generate-assessment',
          title: 'Generate Assessment',
          content: 'Submit your information for AI-powered analysis.',
          steps: [
            'Click "Perform AI Assessment" button',
            'Processing takes 15-30 seconds',
            'Progress indicator shows AI processing status',
            'Results appear below the form when complete'
          ]
        }
      ],
      quickTips: [
        'Always provide detailed clinical descriptions for best results',
        'Upload documents when available - they improve accuracy',
        'Higher confidence scores (80%+) indicate more reliable results',
        'Use the chat assistant after assessment for follow-up questions'
      ],
      troubleshooting: [
        'Assessment not working? Check internet connection',
        'No results appearing? Ensure clinical description is detailed',
        'Processing taking too long? Try a different AI model',
        'Upload failing? Check file format and size limits'
      ]
    },
    {
      id: 'understanding-results',
      title: 'Understanding Results',
      icon: <Info size={20} />,
      content: `Learn how to interpret AI assessment results and categorization outputs.`,
      subsections: [
        {
          id: 'categorization',
          title: 'Categorization Output',
          content: 'The AI assigns cases to one of three priority levels.',
          steps: [
            '🔴 URGENT (Within 2 weeks): Suspected malignancy, rapid changes, bleeding',
            '🟡 ROUTINE (Within 6 weeks): Standard clinical pathway cases',
            '🟢 NON-PRIORITY (Routine scheduling): Cosmetic or stable lesions',
            'Categories follow NHS plastic surgery protocols'
          ]
        },
        {
          id: 'result-components',
          title: 'Result Components',
          content: 'Each assessment provides multiple pieces of information.',
          steps: [
            'Category Badge: Color-coded urgency level',
            'Confidence Score: AI certainty percentage (70-95% typical)',
            'Clinical Rationale: Detailed reasoning for categorization',
            'Recommended Timeframe: NHS-compliant scheduling guidance',
            'Key Indicators: Specific clinical factors influencing decision'
          ]
        }
      ],
      quickTips: [
        'Higher confidence scores indicate more reliable assessments',
        'Read the clinical rationale to understand AI reasoning',
        'Always validate AI recommendations with clinical judgment',
        'Use recommended timeframes as guidance, not absolute rules'
      ]
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant Chat',
      icon: <MessageCircle size={20} />,
      content: `Interactive consultation with AI about assessment results. The AI has full context of your assessment.`,
      subsections: [
        {
          id: 'accessing-chat',
          title: 'How to Access',
          content: 'The chat becomes available after completing an assessment.',
          steps: [
            'Complete an assessment first',
            'Click "Ask AI Assistant about this triage"',
            'Chat window opens with context-aware AI',
            'AI already knows your assessment details'
          ]
        },
        {
          id: 'chat-features',
          title: 'Chat Features',
          content: 'Advanced AI consultation capabilities.',
          steps: [
            'Contextual Awareness: AI knows your current assessment details',
            'Suggested Questions: Pre-written clinical queries',
            'Medical Knowledge: Specialized plastic surgery expertise',
            'Professional Language: NHS-appropriate clinical terminology'
          ]
        }
      ],
      quickTips: [
        'Ask specific clinical questions for best responses',
        'Use suggested questions to get started quickly',
        'Chat supports ongoing conversation - ask follow-ups',
        'AI responses are educational, not diagnostic'
      ]
    },
    {
      id: 'post-triaging',
      title: 'Post-Triaging Actions',
      icon: <CheckCircle size={20} />,
      content: `Manage actions after triage assessment completion, including letter generation and workflow management.`,
      subsections: [
        {
          id: 'letter-generation',
          title: 'Letter Generation',
          content: 'Generate NHS-compliant appointment letters.',
          steps: [
            'Click "Generate Letter" from any patient action',
            'Select appropriate template (urgent/routine/non-priority)',
            'Complete patient information form',
            'Add appointment details and preview content',
            'Generate final letter for download or printing'
          ]
        },
        {
          id: 'workflow-management',
          title: 'Workflow Management',
          content: 'Track and manage patient communication and scheduling.',
          steps: [
            'Monitor email and SMS status',
            'Track clinic appointments and scheduling',
            'View workflow automation progress',
            'Complete communication audit trail'
          ]
        }
      ],
      quickTips: [
        'Use appropriate letter templates for each urgency level',
        'Double-check patient details before generating letters',
        'Keep track of communication status for governance',
        'Export letters as PDFs for record keeping'
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <AlertTriangle size={20} />,
      content: `Common issues and solutions to help you resolve problems quickly.`,
      subsections: [
        {
          id: 'ai-issues',
          title: 'AI Assessment Issues',
          content: 'Solutions for AI-related problems.',
          steps: [
            'Check internet connection - AI requires online access',
            'Verify clinical description has meaningful details',
            'Wait 15-30 seconds for AI processing',
            'Try different AI model in settings if problems persist'
          ]
        },
        {
          id: 'upload-issues',
          title: 'Document Upload Issues',
          content: 'Fixing file upload problems.',
          steps: [
            'Check file format: PDF, Word, or image files only',
            'Verify file size is under 10MB',
            'Clear browser cache and try again',
            'Try different file if upload continues to fail'
          ]
        },
        {
          id: 'performance-issues',
          title: 'Performance Issues',
          content: 'Improving system performance.',
          steps: [
            'Close other browser tabs to free up resources',
            'Clear browser storage of old cached data',
            'Update to latest browser version',
            'Check system has adequate RAM available'
          ]
        }
      ],
      troubleshooting: [
        'System slow? Close unnecessary browser tabs',
        'Upload failing? Check file size and format',
        'AI not responding? Verify internet connection',
        'Page not loading? Clear browser cache and refresh'
      ]
    }
  ], []);

  // Set contextual help based on current page when opening
  useEffect(() => {
    if (isHelpOpen && currentPage && currentPage !== 'dashboard') {
      const pageSection = helpSections.find(section => 
        section.id === currentPage || section.id.includes(currentPage)
      );
      if (pageSection) {
        setActiveSection(pageSection.id);
        setExpandedSections([pageSection.id]);
      }
    }
  }, [isHelpOpen, currentPage, helpSections]);

  // Get contextual help based on current page
  useEffect(() => {
    if (contextualHelp && currentPage) {
      const pageSection = helpSections.find(section => 
        section.id === currentPage || section.id.includes(currentPage)
      );
      if (pageSection) {
        setActiveSection(pageSection.id);
        setExpandedSections([pageSection.id]);
      }
    }
  }, [currentPage, contextualHelp, helpSections]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = helpSections.filter(section =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.subsections?.some(sub => 
          sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, helpSections]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getActiveSection = () => {
    return helpSections.find(section => section.id === activeSection) || helpSections[0];
  };

  if (!isHelpOpen) {
    return (
      <button 
        className="floating-help-button"
        onClick={() => setIsHelpOpen(true)}
        aria-label="Open help system"
        title="Need help? Click here for guidance"
      >
        <span className="help-button-text">Help</span>
        <HelpCircle size={20} />
      </button>
    );
  }

  return (
    <div className="help-system-overlay">
      <div className="help-system-modal">
        
        {/* Header */}
        <div className="help-header">
          <div className="help-title">
            <HelpCircle size={24} />
            <h2>NHS Triage System - User Guide</h2>
          </div>
          <button 
            className="help-close-button"
            onClick={() => {
              setIsHelpOpen(false);
            }}
            aria-label="Close help system"
          >
            <X size={24} />
          </button>
        </div>

        <div className="help-content">
          
          {/* Sidebar */}
          <div className="help-sidebar">
            
            {/* Search */}
            <div className="help-search">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Navigation */}
            <div className="help-navigation">
              {(searchQuery ? searchResults : helpSections).map((section) => (
                <div key={section.id} className="help-nav-section">
                  <button
                    className={`help-nav-item ${activeSection === section.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSection(section.id);
                      toggleSection(section.id);
                    }}
                  >
                    <div className="help-nav-item-content">
                      {section.icon}
                      <span>{section.title}</span>
                    </div>
                    {expandedSections.includes(section.id) ? 
                      <ChevronDown size={16} /> : 
                      <ChevronRight size={16} />
                    }
                  </button>
                  
                  {/* Subsections */}
                  {expandedSections.includes(section.id) && section.subsections && (
                    <div className="help-nav-subsections">
                      {section.subsections.map((subsection) => (
                        <button
                          key={subsection.id}
                          className="help-nav-subsection"
                          onClick={() => {
                            const element = document.getElementById(`help-${subsection.id}`);
                            element?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          {subsection.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="help-quick-links">
              <h4>Quick Links</h4>
              <button className="help-quick-link" onClick={() => console.log('Video tutorials')}>
                <Video size={16} />
                Video Tutorials
              </button>
              <button className="help-quick-link" onClick={() => console.log('Download guide')}>
                <Download size={16} />
                Download Guide
              </button>
              <button className="help-quick-link" onClick={() => console.log('NHS guidelines')}>
                <ExternalLink size={16} />
                NHS Guidelines
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="help-main-content">
            {searchQuery && searchResults.length === 0 ? (
              <div className="help-no-results">
                <AlertTriangle size={48} />
                <h3>No results found</h3>
                <p>Try different search terms or browse the sections manually.</p>
              </div>
            ) : (
              <div className="help-section-content">
                {(() => {
                  const section = getActiveSection();
                  return (
                    <>
                      <div className="help-section-header">
                        <div className="help-section-icon">{section.icon}</div>
                        <h3>{section.title}</h3>
                      </div>
                      
                      <div className="help-section-description">
                        <p>{section.content}</p>
                      </div>

                      {/* Subsections */}
                      {section.subsections && (
                        <div className="help-subsections">
                          {section.subsections.map((subsection) => (
                            <div key={subsection.id} id={`help-${subsection.id}`} className="help-subsection">
                              <h4>{subsection.title}</h4>
                              <p>{subsection.content}</p>
                              {subsection.steps && (
                                <ol className="help-steps">
                                  {subsection.steps.map((step, index) => (
                                    <li key={index}>{step}</li>
                                  ))}
                                </ol>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Quick Tips */}
                      {section.quickTips && (
                        <div className="help-quick-tips">
                          <h4>💡 Quick Tips</h4>
                          <ul>
                            {section.quickTips.map((tip, index) => (
                              <li key={index}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Troubleshooting */}
                      {section.troubleshooting && (
                        <div className="help-troubleshooting">
                          <h4>🔧 Troubleshooting</h4>
                          <ul>
                            {section.troubleshooting.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="help-footer">
          <div className="help-footer-info">
            <span>NHS Plastic Surgery Triage System v2.1</span>
            <span>Last Updated: July 2025</span>
          </div>
          <div className="help-footer-actions">
            <button className="help-footer-button">
              <MessageCircle size={16} />
              Feedback
            </button>
            <button className="help-footer-button">
              <Download size={16} />
              Download Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSystem;
