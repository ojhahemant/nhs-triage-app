// Test script for Ollama API connection
const axios = require('axios');

const OLLAMA_BASE_URL = 'http://localhost:11434';
const MODEL = 'llama3';

const testOllamaConnection = async () => {
  console.log('Testing connection to Ollama API...');
  console.log(`Using Ollama URL: ${OLLAMA_BASE_URL}`);
  console.log(`Using model: ${MODEL}`);
  
  try {
    // First, check if the API is responding
    console.log(`\nStep 1: Checking available models at ${OLLAMA_BASE_URL}/api/tags`);
    
    const tagsResponse = await axios.get(`${OLLAMA_BASE_URL}/api/tags`);
    if (tagsResponse.data && tagsResponse.data.models) {
      const modelNames = tagsResponse.data.models.map(m => m.name);
      console.log('Models available:', modelNames.join(', '));
      
      // Check if our target model exists
      if (!modelNames.includes(MODEL) && !modelNames.includes(`${MODEL}:latest`)) {
        console.error(`\nWARNING: Model "${MODEL}" not found in available models!`);
        console.error(`Please run: ollama pull ${MODEL}`);
      } else {
        console.log(`\nModel "${MODEL}" is available. ✓`);
      }
    } else {
      console.error('Unexpected response format from Ollama API:', tagsResponse.data);
    }    // Now test a simple completion
    console.log(`\nStep 2: Testing completion with model: ${MODEL}...`);
    
    const requestOptions = {
      model: MODEL,
      prompt: 'Say hello and identify yourself as an NHS assistant in one brief sentence.',
      options: {
        temperature: 0.7
      }
    };
    
    console.log('Sending request to:', `${OLLAMA_BASE_URL}/api/generate`);
    console.log('Request payload:', JSON.stringify(requestOptions, null, 2));
    
    const response = await axios.post(
      `${OLLAMA_BASE_URL}/api/generate`,
      requestOptions
    );
    
    console.log('\nResponse received:');
    console.log('Status:', response.status);
    console.log('Response:', response.data.response);
    
    console.log('\nTest completed successfully! ✓ Ollama API is working correctly.');
  } catch (error) {
    console.error('\n❌ Error connecting to Ollama:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server. Error code:', error.code);
      if (error.code === 'ECONNREFUSED') {
        console.error('\nConnection refused. Is Ollama running?');
        console.error('Please start Ollama with the command: ollama serve');
      }
    } else {
      // Something happened in setting up the request
      console.error('Error message:', error.message);
    }
    console.error('\nTest failed. Please check if Ollama is running and the API endpoint is correct.');
  }
};

console.log('==========================================');
console.log('  OLLAMA CONNECTION TEST');
console.log('==========================================');
testOllamaConnection();
