import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Calendar, 
  Settings, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Mail,
  MessageSquare,
  FileText,
  Plus
} from 'lucide-react';
import './PostTriagingActionsPage.css';
import LetterGenerator from '../components/LetterGenerator';
import OpList from '../components/OpList';

interface PatientCommunication {
  emailSent: boolean;
  smsSent: boolean;
  letterGenerated: boolean;
  letterSent: boolean;
  communicationType: string;
  content: string;
  sentAt?: Date;
  letterDetails?: {
    templateUsed: string;
    generatedAt: Date;
    sentAt?: Date;
    deliveryMethod: 'postal' | 'email' | 'secure-message';
  };
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

interface WorkflowAction {
  status: 'pending' | 'in-progress' | 'completed';
  automatedSteps: string[];
  nextAction?: string;
}

interface PostTriagingAction {
  id: string;
  patientId: string;
  patientName: string;
  triageCategory: 'urgent' | 'routine' | 'non-priority';
  assignedDoctor: string;
  status: 'pending' | 'in-progress' | 'completed';
  triageDate: Date;
  actions: {
    patientCommunication: PatientCommunication;
    scheduling: SchedulingAction;
    workflowAutomation: WorkflowAction;
  };
}

const PostTriagingActionsPage: React.FC = () => {
  const [postTriagingActions, setPostTriagingActions] = useState<PostTriagingAction[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [letterGeneratorVisible, setLetterGeneratorVisible] = useState(false);
  const [selectedPatientForLetter, setSelectedPatientForLetter] = useState<{
    id: string;
    name: string;
    category: 'urgent' | 'routine' | 'non-priority';
  } | null>(null);
  const [opListExpanded, setOpListExpanded] = useState(false);

  useEffect(() => {
    // Simulate loading post-triaging actions data
    const loadPostTriagingActions = () => {
      const mockData: PostTriagingAction[] = [
        {
          id: 'PTA001',
          patientId: 'P123456789',
          patientName: 'Sarah Johnson',
          triageCategory: 'urgent',
          assignedDoctor: 'Dr. Sarah Chen',
          status: 'in-progress',
          triageDate: new Date('2025-07-26T14:30:00'),
          actions: {
            patientCommunication: {
              emailSent: true,
              smsSent: true,
              letterGenerated: false,
              letterSent: false,
              communicationType: 'Urgent Referral Notification',
              content: 'Your urgent plastic surgery referral has been processed. You will be contacted within 48 hours to schedule your appointment.',
              sentAt: new Date('2025-07-26T15:00:00')
            },
            scheduling: {
              clinicAppointment: {
                scheduled: true,
                dateTime: new Date('2025-07-28T10:00:00'),
                practitioner: 'Dr. Michael Roberts',
                location: 'Plastic Surgery Clinic A'
              },
              theaterListing: {
                added: false
              }
            },
            workflowAutomation: {
              status: 'in-progress',
              automatedSteps: [
                'Referral received and validated',
                'AI triage completed - Urgent category',
                'Patient communication sent',
                'Clinic appointment scheduled'
              ],
              nextAction: 'Await consultant review'
            }
          }
        },
        {
          id: 'PTA002',
          patientId: 'P987654321',
          patientName: 'John Smith',
          triageCategory: 'routine',
          assignedDoctor: 'Dr. Sarah Chen',
          status: 'completed',
          triageDate: new Date('2025-07-25T09:15:00'),
          actions: {
            patientCommunication: {
              emailSent: true,
              smsSent: false,
              letterGenerated: true,
              letterSent: true,
              communicationType: 'Routine Referral Acknowledgment',
              content: 'Your referral has been received and will be processed within 2 weeks. You will receive a letter with your appointment details.',
              sentAt: new Date('2025-07-25T10:00:00'),
              letterDetails: {
                templateUsed: 'routine-appointment',
                generatedAt: new Date('2025-07-25T10:30:00'),
                sentAt: new Date('2025-07-25T11:00:00'),
                deliveryMethod: 'postal'
              }
            },
            scheduling: {
              clinicAppointment: {
                scheduled: true,
                dateTime: new Date('2025-08-08T14:30:00'),
                practitioner: 'Dr. Emma Wilson',
                location: 'Plastic Surgery Clinic B'
              },
              theaterListing: {
                added: false
              }
            },
            workflowAutomation: {
              status: 'completed',
              automatedSteps: [
                'Referral received and validated',
                'AI triage completed - Routine category',
                'Patient communication sent',
                'Appointment letter generated',
                'Clinic appointment scheduled',
                'Process completed'
              ]
            }
          }
        },
        {
          id: 'PTA003',
          patientId: 'P456789123',
          patientName: 'Emma Brown',
          triageCategory: 'urgent',
          assignedDoctor: 'Dr. Sarah Chen',
          status: 'pending',
          triageDate: new Date('2025-07-27T11:45:00'),
          actions: {
            patientCommunication: {
              emailSent: false,
              smsSent: false,
              letterGenerated: false,
              letterSent: false,
              communicationType: 'Urgent Referral Notification',
              content: 'Template ready for urgent referral notification'
            },
            scheduling: {
              clinicAppointment: {
                scheduled: false
              },
              theaterListing: {
                added: false
              }
            },
            workflowAutomation: {
              status: 'pending',
              automatedSteps: [
                'Referral received and validated',
                'AI triage completed - Urgent category'
              ],
              nextAction: 'Initiate patient communication'
            }
          }
        }
      ];
      
      setPostTriagingActions(mockData);
      setLoading(false);
    };

    setTimeout(loadPostTriagingActions, 500);
  }, []);

  const filteredActions = postTriagingActions.filter(action => 
    selectedStatus === 'all' || action.status === selectedStatus
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="status-icon completed" size={16} />;
      case 'in-progress':
        return <Clock className="status-icon in-progress" size={16} />;
      case 'pending':
        return <AlertCircle className="status-icon pending" size={16} />;
      default:
        return <Clock className="status-icon" size={16} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'urgent':
        return 'urgent';
      case 'routine':
        return 'routine';
      case 'non-priority':
        return 'non-priority';
      default:
        return 'routine';
    }
  };

  const handleGenerateLetter = (action: PostTriagingAction) => {
    setSelectedPatientForLetter({
      id: action.patientId,
      name: action.patientName,
      category: action.triageCategory
    });
    setLetterGeneratorVisible(true);
  };

  const handleLetterGenerated = (letterInfo: any) => {
    // Update the action to show letter has been generated
    setPostTriagingActions(prev => prev.map(action => {
      if (action.patientId === letterInfo.patientId) {
        return {
          ...action,
          actions: {
            ...action.actions,
            patientCommunication: {
              ...action.actions.patientCommunication,
              letterGenerated: true,
              letterSent: letterInfo.status === 'sent',
              letterDetails: {
                templateUsed: letterInfo.templateId,
                generatedAt: letterInfo.generatedAt,
                sentAt: letterInfo.status === 'sent' ? letterInfo.generatedAt : undefined,
                deliveryMethod: 'postal'
              }
            }
          }
        };
      }
      return action;
    }));
    setLetterGeneratorVisible(false);
  };

  if (loading) {
    return (
      <div className="post-triaging-actions-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading post-triaging actions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-triaging-actions-page">
      <div className="actions-header">
        <h2>Post-Triaging Actions</h2>
        <div className="header-controls">
          <div className="action-filters">
            <label htmlFor="status-filter">Filter by Status:</label>
            <select 
              id="status-filter"
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="actions-overview">
        <div className="overview-cards">
          <div className="overview-card">
            <div className="card-header">
              <Send size={24} />
              <h3>Patient Communication</h3>
            </div>
            <div className="card-content">
              <p>Automated messaging system for patient notifications and updates</p>
              <div className="card-stats">
                <span>Active: {postTriagingActions.filter(a => a.actions.patientCommunication.emailSent || a.actions.patientCommunication.smsSent).length}</span>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-header">
              <Calendar size={24} />
              <h3>Intelligent Scheduling</h3>
            </div>
            <div className="card-content">
              <p>Automated appointment and theater scheduling based on triage priority</p>
              <div className="card-stats">
                <span>Scheduled: {postTriagingActions.filter(a => a.actions.scheduling.clinicAppointment.scheduled).length}</span>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <div className="card-header">
              <Settings size={24} />
              <h3>Workflow Automation</h3>
            </div>
            <div className="card-content">
              <p>Streamlined process automation from triage to treatment</p>
              <div className="card-stats">
                <span>Completed: {postTriagingActions.filter(a => a.actions.workflowAutomation.status === 'completed').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Op List Section */}
      <OpList 
        isExpanded={opListExpanded} 
        onToggle={() => setOpListExpanded(!opListExpanded)} 
      />

      <div className="actions-grid">
        {filteredActions.map((action) => (
          <div key={action.id} className="action-card">
            <div className="card-header-main">
              <div className="patient-info">
                <User size={20} />
                <div>
                  <h4>{action.patientName}</h4>
                  <span className="patient-id">ID: {action.patientId}</span>
                </div>
              </div>
              <div className="action-status">
                {getStatusIcon(action.status)}
                <span className={`status-text ${action.status}`}>
                  {action.status.charAt(0).toUpperCase() + action.status.slice(1).replace('-', ' ')}
                </span>
                <span className={`category-badge ${getCategoryColor(action.triageCategory)}`}>
                  {action.triageCategory.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="action-details">
              <div className="detail-section">
                <h5><Mail size={16} /> Patient Communication</h5>
                <div className="communication-status">
                  <div className={`comm-item ${action.actions.patientCommunication.emailSent ? 'sent' : 'pending'}`}>
                    <Mail size={14} />
                    <span>Email: {action.actions.patientCommunication.emailSent ? 'Sent' : 'Pending'}</span>
                  </div>
                  <div className={`comm-item ${action.actions.patientCommunication.smsSent ? 'sent' : 'pending'}`}>
                    <MessageSquare size={14} />
                    <span>SMS: {action.actions.patientCommunication.smsSent ? 'Sent' : 'Pending'}</span>
                  </div>
                  <div className={`comm-item ${action.actions.patientCommunication.letterGenerated ? 'sent' : 'pending'}`}>
                    <FileText size={14} />
                    <span>Letter: {action.actions.patientCommunication.letterGenerated ? 
                      (action.actions.patientCommunication.letterSent ? 'Sent' : 'Generated') : 'Pending'}</span>
                    {!action.actions.patientCommunication.letterGenerated && (
                      <button 
                        className="generate-letter-btn"
                        onClick={() => handleGenerateLetter(action)}
                        title="Generate Letter"
                      >
                        <Plus size={12} />
                      </button>
                    )}
                  </div>
                </div>
                {action.actions.patientCommunication.sentAt && (
                  <p className="comm-details">
                    <strong>Type:</strong> {action.actions.patientCommunication.communicationType}<br />
                    <strong>Sent:</strong> {action.actions.patientCommunication.sentAt.toLocaleString()}
                  </p>
                )}
                {action.actions.patientCommunication.letterDetails && (
                  <div className="letter-details">
                    <p><strong>Letter Details:</strong></p>
                    <p>Template: {action.actions.patientCommunication.letterDetails.templateUsed}</p>
                    <p>Generated: {action.actions.patientCommunication.letterDetails.generatedAt.toLocaleString()}</p>
                    {action.actions.patientCommunication.letterDetails.sentAt && (
                      <p>Sent: {action.actions.patientCommunication.letterDetails.sentAt.toLocaleString()}</p>
                    )}
                    <p>Method: {action.actions.patientCommunication.letterDetails.deliveryMethod}</p>
                  </div>
                )}
              </div>

              <div className="detail-section">
                <h5><Calendar size={16} /> Scheduling</h5>
                {action.actions.scheduling.clinicAppointment.scheduled ? (
                  <div className="scheduling-info">
                    <p><strong>Clinic Appointment:</strong> Scheduled</p>
                    <p><strong>Date:</strong> {action.actions.scheduling.clinicAppointment.dateTime?.toLocaleString()}</p>
                    <p><strong>Practitioner:</strong> {action.actions.scheduling.clinicAppointment.practitioner}</p>
                    <p><strong>Location:</strong> {action.actions.scheduling.clinicAppointment.location}</p>
                  </div>
                ) : (
                  <p className="scheduling-pending">Clinic appointment not yet scheduled</p>
                )}
              </div>

              <div className="detail-section">
                <h5><Settings size={16} /> Workflow Progress</h5>
                <div className="workflow-steps">
                  {action.actions.workflowAutomation.automatedSteps.map((step, index) => (
                    <div key={index} className="workflow-step completed">
                      <CheckCircle size={12} />
                      <span>{step}</span>
                    </div>
                  ))}
                  {action.actions.workflowAutomation.nextAction && (
                    <div className="workflow-step next">
                      <Clock size={12} />
                      <span><strong>Next:</strong> {action.actions.workflowAutomation.nextAction}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card-footer">
              <div className="assigned-info">
                <span><strong>Assigned to:</strong> {action.assignedDoctor}</span>
                <span><strong>Triaged:</strong> {action.triageDate.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredActions.length === 0 && (
        <div className="no-actions">
          <AlertCircle size={48} />
          <h3>No post-triaging actions found</h3>
          <p>There are no actions matching the selected filter criteria.</p>
        </div>
      )}

      {/* Letter Generator Modal */}
      <LetterGenerator
        isVisible={letterGeneratorVisible}
        onClose={() => setLetterGeneratorVisible(false)}
        patientId={selectedPatientForLetter?.id}
        patientName={selectedPatientForLetter?.name}
        triageCategory={selectedPatientForLetter?.category}
        onLetterGenerated={handleLetterGenerated}
      />
    </div>
  );
};

export default PostTriagingActionsPage;
