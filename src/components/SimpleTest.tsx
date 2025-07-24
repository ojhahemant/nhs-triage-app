import React, { useState } from 'react';
import { fetchOllamaCompletion } from '../services/openaiService';

const SimpleTest: React.FC = () => {
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock triage data for testing
  const mockTriageData = {
    patientInfo: {
      age: '35',
      symptoms: ['Test symptom']
    },
    assessment: {
      urgencyScore: 5,
      recommendedTimeframe: '2 weeks',
      recommendedSpecialty: 'Dermatology',
      recommendationReason: 'Testing purposes'
    }
  };

  const testOpenAI = async () => {
    setLoading(true);
    setError('');
    setResponse('');
    
    try {
      console.log('Testing OpenAI API through service...');
      
      const result = await fetchOllamaCompletion(
        'Say hello and identify yourself as an NHS assistant.',
        mockTriageData
      );
      
      setResponse(result);
    } catch (error) {
      const serviceError = error as Error;
      console.error('Service error:', serviceError);
      setError(`Service error: ${serviceError.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Simple OpenAI Test</h1>
      
      <button
        onClick={testOpenAI}
        disabled={loading}
        style={{
          backgroundColor: '#005EB8',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Testing...' : 'Test OpenAI API'}
      </button>
      
      {loading && <p>Loading response...</p>}
      
      {error && (
        <div style={{ 
          backgroundColor: '#FCEDB9', 
          border: '1px solid #D5281B', 
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#D5281B', margin: '0 0 10px 0' }}>Error</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{error}</pre>
        </div>
      )}
      
      {response && (
        <div style={{ 
          backgroundColor: '#F0F4F5', 
          border: '1px solid #4C6272', 
          padding: '15px',
          borderRadius: '4px'
        }}>
          <h3>Response</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default SimpleTest;
