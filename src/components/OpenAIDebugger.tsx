import React, { useState, useEffect } from 'react';
import { fetchOllamaCompletion } from '../services/openaiService';

const OpenAIDebugger: React.FC = () => {
  const [prompt, setPrompt] = useState('Hello, can you help me understand a dermatology triage?');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  
  // Mock triage data for testing
  const mockTriageData = {
    patientInfo: {
      age: '45',
      symptoms: ['Itching', 'Redness']
    },
    assessment: {
      urgencyScore: 6,
      recommendedTimeframe: '4 weeks (soon)',
      recommendedSpecialty: 'Dermatology',
      recommendationReason: '- Multiple concerning symptoms\n- Location in high-risk area'
    }
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // Load environment variables
  useEffect(() => {
    addLog('OpenAI Debugger initialized');
    addLog(`OpenAI Model: ${process.env.REACT_APP_OPENAI_MODEL || 'gpt-4o'}`);
    addLog(`API Key configured: ${process.env.REACT_APP_OPENAI_API_KEY ? 'Yes' : 'No'}`);
  }, []);

  const handleTest = async () => {
    setLoading(true);
    setError('');
    setResponse('');
    addLog(`Testing with prompt: ${prompt}`);

    try {
      addLog('Calling OpenAI service...');
      const result = await fetchOllamaCompletion(prompt, mockTriageData);
      addLog('Response received from OpenAI');
      setResponse(result);
    } catch (err) {
      console.error('Error in debugger:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      addLog(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#005EB8', marginBottom: '20px' }}>OpenAI API Debug Tool</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Test Prompt:
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{
              width: '100%',
              height: '80px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}
          />
        </div>

        <button
          onClick={handleTest}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#005EB8',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Testing...' : 'Test OpenAI API'}
        </button>

        <button
          onClick={clearLogs}
          style={{
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Logs
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          border: '1px solid #e57373',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3>Error</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{error}</pre>
        </div>
      )}

      {response && (
        <div style={{
          backgroundColor: '#e8f5e8',
          color: '#2e7d32',
          border: '1px solid #4caf50',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3>OpenAI Response</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{response}</p>
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <h2>Debug Information</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>Environment Variables</h3>
          <ul>
            <li>OPENAI_MODEL: {process.env.REACT_APP_OPENAI_MODEL || 'gpt-4o'}</li>
            <li>OPENAI_API_KEY: {process.env.REACT_APP_OPENAI_API_KEY ? 'Configured' : 'Not configured'}</li>
            <li>OPENAI_TEMPERATURE: {process.env.REACT_APP_OPENAI_TEMPERATURE || '0.7'}</li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>Setup Instructions</h3>
          <p>To use OpenAI API, you need to:</p>
          <ol>
            <li>Get an API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">OpenAI Platform</a></li>
            <li>Create a <code>.env</code> file in your project root with:</li>
          </ol>
          <pre style={{
            backgroundColor: '#f4f4f4',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginTop: '10px'
          }}>
{`REACT_APP_OPENAI_API_KEY=your_api_key_here
REACT_APP_OPENAI_MODEL=gpt-4o
REACT_APP_OPENAI_TEMPERATURE=0.7`}
          </pre>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Debug Logs</h3>
          <div style={{
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '4px',
            height: '200px',
            overflowY: 'scroll',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Mock Triage Data Used for Testing</h3>
          <pre style={{
            backgroundColor: '#f4f4f4',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '12px'
          }}>
            {JSON.stringify(mockTriageData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default OpenAIDebugger;
