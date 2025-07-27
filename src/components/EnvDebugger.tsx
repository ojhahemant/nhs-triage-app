import React from 'react';

const EnvDebugger: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f0f0f0',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>Environment Debug:</h4>
      <div>API Key: {process.env.REACT_APP_OPENAI_API_KEY ? 'Configured' : 'NOT CONFIGURED'}</div>
      <div>Model: {process.env.REACT_APP_OPENAI_MODEL || 'NOT SET'}</div>
      <div>Temperature: {process.env.REACT_APP_OPENAI_TEMPERATURE || 'NOT SET'}</div>
      <div>Key Length: {process.env.REACT_APP_OPENAI_API_KEY?.length || 0}</div>
    </div>
  );
};

export default EnvDebugger;
