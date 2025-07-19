import React, { useState } from 'react';
import './App.css';
import NewReferralAssessment from './NewReferralAssessment';
import ErrorBoundary from './components/ErrorBoundary';
import OpenAIDebugger from './components/OpenAIDebugger';
import SimpleTest from './components/SimpleTest';

function App() {
  const [showDebugger, setShowDebugger] = useState(false);
  const [debugComponent, setDebugComponent] = useState<'debugger' | 'simpleTest'>('debugger');

  // Keyboard shortcut: Ctrl+Shift+D to toggle debugger
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setShowDebugger(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="App">      <header className="App-header">
        <h1>NHS Plastic Surgery Referral System</h1>
        {!showDebugger && (
          <button 
            onClick={() => setShowDebugger(true)} 
            style={{ 
              position: 'absolute', 
              right: '20px',
              top: '20px',
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '12px',
              opacity: 0.7
            }}
            title="Press Ctrl+Shift+D to toggle debugger"
          >
            Debug
          </button>
        )}
      </header>
      <main>
        <ErrorBoundary>
          {showDebugger ? (
            <div>              <button 
                onClick={() => setShowDebugger(false)}
                style={{
                  margin: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#005EB8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Return to Application
              </button>
              
              <div style={{ display: 'flex', gap: '10px', margin: '0 10px 20px' }}>
                <button
                  onClick={() => setDebugComponent('debugger')}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: debugComponent === 'debugger' ? '#330072' : '#4C6272',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Ollama Debugger
                </button>
                <button
                  onClick={() => setDebugComponent('simpleTest')}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: debugComponent === 'simpleTest' ? '#330072' : '#4C6272',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px'
                  }}
                >
                  Simple Test
                </button>
              </div>
              
              {debugComponent === 'debugger' ? <OpenAIDebugger /> : <SimpleTest />}
            </div>
          ) : (
            <NewReferralAssessment />
          )}
        </ErrorBoundary>
      </main>
      <footer className="nhsuk-footer">
        <div className="nhsuk-footer__container">
          <div className="nhsuk-footer__copyright">
            © NHS England {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
