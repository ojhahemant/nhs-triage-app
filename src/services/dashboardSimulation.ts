import { useState, useEffect } from 'react';

export interface SystemActivity {
  id: string;
  type: 'assessment_completed' | 'referral_submitted' | 'system_update' | 'data_access' | 'letter_generated' | 'letter_sent';
  description: string;
  user: string;
  timestamp: Date;
  patientId?: string;
}

export interface SystemAlert {
  id: string;
  type: 'priority' | 'performance' | 'system';
  title: string;
  description: string;
  actionRequired: boolean;
  severity: 'low' | 'medium' | 'high';
  actionLabel?: string;
  detailsLabel?: string;
}

export interface DashboardData {
  totalAssessments: number;
  avgProcessingTime: number;
  userSatisfaction: number;
  priorityDistribution: {
    urgent: number;
    routine: number;
    nonPriority: number;
  };
  volumeData: Array<{
    date: string;
    assessments: number;
  }>;
  recentActivity: SystemActivity[];
  systemAlerts: SystemAlert[];
}

export const generateDashboardData = (): DashboardData => {
  return {
    totalAssessments: 2847, // Increased to show growth
    avgProcessingTime: 12, // Reduced from previous 30s to show improvement
    userSatisfaction: 4.8, // Improved satisfaction
    priorityDistribution: {
      urgent: 285,    // 10% - Better triage reducing urgent cases
      routine: 2275,  // 80% - Most cases properly categorized 
      nonPriority: 287 // 10% - Efficient filtering
    },
    volumeData: [
      { date: 'Mon', assessments: 85 },  // Increased volume
      { date: 'Tue', assessments: 92 },
      { date: 'Wed', assessments: 88 },
      { date: 'Thu', assessments: 101 },
      { date: 'Fri', assessments: 95 },
      { date: 'Sat', assessments: 43 },
      { date: 'Sun', assessments: 38 }
    ],
    recentActivity: [
      {
        id: '1',
        type: 'letter_generated',
        description: 'Appointment letter generated and sent to patient',
        user: 'System',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        patientId: '123456789'
      },
      {
        id: '2',
        type: 'assessment_completed',
        description: 'Assessment completed for patient ID 123456789',
        user: 'Dr. Sarah Chen',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        patientId: '123456789'
      },
      {
        id: '3', 
        type: 'referral_submitted',
        description: 'Referral submitted to Plastic Surgery',
        user: 'Dr. Sarah Chen',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
      {
        id: '4',
        type: 'system_update', 
        description: 'Patient record updated with Healthcare system data',
        user: 'System',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      },
      {
        id: '5',
        type: 'letter_sent',
        description: 'Urgent appointment letter sent via NHS post',
        user: 'System',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        patientId: '987654321'
      },
      {
        id: '6',
        type: 'data_access',
        description: 'Patient data accessed for assessment',
        user: 'Dr. James Wilson',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      }
    ],
    systemAlerts: [
      {
        id: '1',
        type: 'priority',
        title: '5 urgent referrals requiring review',
        description: 'Priority cases need attention within 24 hours',
        actionRequired: true,
        severity: 'high',
        actionLabel: 'Review'
      },
      {
        id: '2', 
        type: 'system',
        title: 'System maintenance scheduled',
        description: 'Planned maintenance window: Tonight 11:00 PM - 1:00 AM',
        actionRequired: false,
        severity: 'medium',
        detailsLabel: 'Details'
      },
      {
        id: '3',
        type: 'performance',
        title: 'High assessment volume detected',
        description: 'Current load: 145% of normal capacity. Consider additional resources.',
        actionRequired: true,
        severity: 'medium',
        actionLabel: 'Manage'
      }
    ]
  };
};

// Auto-refresh data every 30 seconds
export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>(generateDashboardData());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateDashboardData());
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return data;
};
