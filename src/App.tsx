import React from 'react';
import './App.css';
import NewReferralAssessment from './NewReferralAssessment';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Plastic Surgery Referral System</h1>
      </header>
      <main>
        <ErrorBoundary>
          <NewReferralAssessment />
        </ErrorBoundary>
      </main>
      <footer className="nhsuk-footer">
        <div className="nhsuk-footer__container">
          <div className="nhsuk-footer__copyright">
            {/* Footer content removed per user request */}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
