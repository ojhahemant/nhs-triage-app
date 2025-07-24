import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-container" style={{
          margin: '2rem',
          padding: '2rem',
          backgroundColor: '#fff',
          border: '4px solid #d5281b',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#d5281b' }}>Something went wrong</h2>
          <p>We're sorry, but there was a problem with this part of the application.</p>
          
          {this.state.error && (
            <details style={{ 
              margin: '1rem', 
              padding: '1rem', 
              backgroundColor: '#f0f4f5',
              borderRadius: '4px',
              textAlign: 'left'
            }}>
              <summary>Technical Details</summary>
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          
          <button 
            onClick={() => this.setState({ hasError: false })}
            style={{
              backgroundColor: '#005eb8',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
