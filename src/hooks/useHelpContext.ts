import { useState, useCallback } from 'react';

export interface HelpContextData {
  page: string;
  section?: string;
  action?: string;
  data?: any;
}

export const useHelpContext = () => {
  const [helpContext, setHelpContext] = useState<HelpContextData>({
    page: 'dashboard'
  });

  const updateHelpContext = useCallback((context: Partial<HelpContextData>) => {
    setHelpContext(prev => ({ ...prev, ...context }));
  }, []);

  const setCurrentPage = useCallback((page: string) => {
    setHelpContext(prev => ({ ...prev, page }));
  }, []);

  const setCurrentSection = useCallback((section: string) => {
    setHelpContext(prev => ({ ...prev, section }));
  }, []);

  const setCurrentAction = useCallback((action: string, data?: any) => {
    setHelpContext(prev => ({ ...prev, action, data }));
  }, []);

  // Get help suggestions based on current context
  const getContextualSuggestions = useCallback(() => {
    const suggestions: string[] = [];
    
    switch (helpContext.page) {
      case 'dashboard':
        suggestions.push('How to read dashboard metrics');
        suggestions.push('Understanding system alerts');
        suggestions.push('Using performance charts');
        break;
        
      case 'assessment':
        suggestions.push('Writing effective clinical descriptions');
        suggestions.push('Uploading supporting documents');
        suggestions.push('Understanding AI results');
        suggestions.push('Using the AI chat assistant');
        break;
        
      case 'post-triaging':
        suggestions.push('Generating patient letters');
        suggestions.push('Managing clinic appointments');
        suggestions.push('Tracking communication status');
        break;
        
      case 'messaging':
        suggestions.push('Sending secure messages');
        suggestions.push('Using message templates');
        suggestions.push('Managing urgent communications');
        break;
        
      case 'bulk-upload':
        suggestions.push('Preparing CSV files');
        suggestions.push('Understanding validation errors');
        suggestions.push('Processing large batches');
        break;
        
      default:
        suggestions.push('Getting started guide');
        suggestions.push('System overview');
    }
    
    return suggestions;
  }, [helpContext]);

  // Get quick actions based on current context
  const getQuickActions = useCallback(() => {
    const actions: Array<{ label: string; action: () => void }> = [];
    
    switch (helpContext.page) {
      case 'assessment':
        actions.push({
          label: 'Show example clinical description',
          action: () => console.log('Show example')
        });
        actions.push({
          label: 'How to improve AI accuracy',
          action: () => console.log('Show accuracy tips')
        });
        break;
        
      case 'dashboard':
        actions.push({
          label: 'Explain current metrics',
          action: () => console.log('Explain metrics')
        });
        break;
        
      case 'bulk-upload':
        actions.push({
          label: 'Download CSV template',
          action: () => console.log('Download template')
        });
        break;
    }
    
    return actions;
  }, [helpContext]);

  return {
    helpContext,
    updateHelpContext,
    setCurrentPage,
    setCurrentSection,
    setCurrentAction,
    getContextualSuggestions,
    getQuickActions
  };
};

// Context-aware help messages
export const getContextualHelpMessage = (page: string, section?: string): string => {
  const messages: Record<string, Record<string, string>> = {
    assessment: {
      'clinical-description': 'Provide detailed information about the clinical condition. Include lesion characteristics, location, size, symptoms, and any recent changes.',
      'document-upload': 'Upload supporting documents like GP referral letters, clinical notes, or medical images to improve assessment accuracy.',
      'ai-results': 'Review the AI categorization and confidence score. Higher confidence (>80%) indicates more reliable results.',
      'chat-assistant': 'Ask specific questions about the assessment results. The AI has full context of your case.'
    },
    dashboard: {
      'metrics': 'Monitor system performance through key indicators. Check for unusual patterns or trends.',
      'alerts': 'Address high-priority alerts immediately. These indicate issues requiring attention.',
      'charts': 'Use visual data to identify trends and patterns in referral volume and processing.'
    },
    'post-triaging': {
      'letters': 'Generate NHS-compliant appointment letters using appropriate templates for each urgency level.',
      'scheduling': 'Track appointment scheduling and resource allocation for optimal workflow management.'
    }
  };

  return messages[page]?.[section || 'default'] || 'Use the help system for detailed guidance on this feature.';
};

// Help content categorization
export const getHelpCategoryForPage = (page: string): string => {
  const categories: Record<string, string> = {
    'dashboard': 'dashboard',
    'assessment': 'assessment',
    'post-triaging': 'post-triaging',
    'referrals': 'understanding-results',
    'messaging': 'ai-assistant',
    'audit': 'troubleshooting',
    'guidelines': 'understanding-results',
    'bulk-upload': 'bulk-upload'
  };

  return categories[page] || 'getting-started';
};
