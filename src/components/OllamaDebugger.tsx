import React, { useState, useEffect } from 'react';
// import { fetchOllamaCompletion } from '../services/ollamaService'; // Service removed - local Ollama not used
import axios from 'axios';

const OllamaDebugger: React.FC = () => {
  const [prompt, setPrompt] = useState('Hello, can you help me understand a dermatology triage?');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  
  // Direct API test
  const [directResponse, setDirectResponse] = useState('');
  const [directError, setDirectError] = useState('');
  const [directLoading, setDirectLoading] = useState(false);
  
  const curlCommand = `curl -X POST http://localhost:11434/api/generate -d '{"model": "llama3", "prompt": "Hello", "stream": false}'`;

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // Load environment variables
  useEffect(() => {
    addLog('Debugger initialized');
    addLog(`Ollama API URL: ${process.env.REACT_APP_OLLAMA_API_URL || 'http://localhost:11434'}`);
    addLog(`Ollama Model: ${process.env.REACT_APP_OLLAMA_MODEL || 'llama3'}`);
  }, []);

  const handleTest = async () => {
    setLoading(true);
    setError('');
    setResponse('');
    addLog(`Testing with prompt: ${prompt}`);

    try {
      addLog('Note: Ollama service has been removed from this application');
      // Local Ollama integration has been removed in favor of OpenAI
      const result = "Ollama service not available - this application now uses OpenAI for AI functionality. Please use the OpenAI Debugger instead.";
      addLog('Mock response provided');
      setResponse(result);
    } catch (err) {
      console.error('Error in debugger:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      addLog(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDirectTest = async () => {
    setDirectLoading(true);
    setDirectError('');
    setDirectResponse('');
    addLog('Testing direct API call to Ollama...');

    try {
      const OLLAMA_BASE_URL = process.env.REACT_APP_OLLAMA_API_URL || 'http://localhost:11434';
      const MODEL = process.env.REACT_APP_OLLAMA_MODEL || 'llama3';
      
      const requestOptions = {
        model: MODEL,
        prompt: 'Say hello in one short sentence.',
        options: {
          temperature: 0.7
        }
      };
      
      addLog(`Sending direct request to: ${OLLAMA_BASE_URL}/api/generate`);
      addLog(`Request payload: ${JSON.stringify(requestOptions)}`);
      
      const response = await axios.post(
        `${OLLAMA_BASE_URL}/api/generate`,
        requestOptions
      );
      
      addLog(`Direct API status: ${response.status}`);
      setDirectResponse(response.data.response);
    } catch (err) {
      console.error('Direct fetch error:', err);
      let errorMessage = 'Unknown error';
      
      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage = `Status ${err.response.status}: ${JSON.stringify(err.response.data)}`;
        } else if (err.request) {
          errorMessage = 'No response received from server';
        } else {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setDirectError(errorMessage);
      addLog(`Direct API error: ${errorMessage}`);
    } finally {
      setDirectLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Ollama Integration Debugger</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Test Ollama Service</h2>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="prompt" style={{ display: 'block', marginBottom: '5px' }}>Prompt:</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ width: '100%', height: '100px', padding: '8px' }}
          />
        </div>
        
        <button
          onClick={handleTest}
          disabled={loading}
          style={{
            backgroundColor: '#005EB8',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Testing...' : 'Test Ollama Service'}
        </button>
        
        <button
          onClick={handleDirectTest}
          disabled={directLoading}
          style={{
            backgroundColor: '#330072',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: directLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {directLoading ? 'Testing...' : 'Test Direct API'}
        </button>
      </div>
      
      {loading && <p>Loading response from service...</p>}
      {directLoading && <p>Loading response from direct API...</p>}
      
      {error && (
        <div style={{ 
          backgroundColor: '#FCEDB9', 
          border: '1px solid #D5281B', 
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#D5281B', margin: '0 0 10px 0' }}>Service Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {directError && (
        <div style={{ 
          backgroundColor: '#FCEDB9', 
          border: '1px solid #D5281B', 
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#D5281B', margin: '0 0 10px 0' }}>Direct API Error</h3>
          <p>{directError}</p>
        </div>
      )}
      
      {response && (
        <div style={{ 
          backgroundColor: '#F0F4F5', 
          border: '1px solid #4C6272', 
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3>Service Response</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{response}</p>
        </div>
      )}
      
      {directResponse && (
        <div style={{ 
          backgroundColor: '#F0F4F5', 
          border: '1px solid #4C6272', 
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3>Direct API Response</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{directResponse}</p>
        </div>
      )}
      
      <div style={{ marginTop: '30px' }}>
        <h2>Debug Information</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>Environment Variables</h3>
          <ul>
            <li>OLLAMA_API_URL: {process.env.REACT_APP_OLLAMA_API_URL || 'http://localhost:11434'}</li>
            <li>OLLAMA_MODEL: {process.env.REACT_APP_OLLAMA_MODEL || 'llama3'}</li>
          </ul>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>Test with CURL</h3>
          <pre style={{ 
            backgroundColor: '#212B32', 
            color: 'white', 
            padding: '15px',
            borderRadius: '4px',
            overflowX: 'auto'
          }}>{curlCommand}</pre>
        </div>
        
        <div>
          <h3>Logs</h3>
          <div style={{ 
            backgroundColor: '#212B32', 
            color: 'white', 
            padding: '15px',
            borderRadius: '4px',
            height: '200px',
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: '14px'
          }}>
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OllamaDebugger;
