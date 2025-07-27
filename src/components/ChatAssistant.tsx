import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageSquare, X, HelpCircle } from 'lucide-react';
import { fetchOllamaCompletion } from '../services/openaiService';
import './ChatAssistant.css';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ClinicalCaseCategory } from '../services/openaiService';
import { generateSuggestedQuestions } from '../services/questionSuggestions';

interface TriageDataType {
  patientInfo: {
    age: string;
    symptoms: string[];
  };
  assessment: {
    urgencyScore: number;
    recommendedTimeframe: string;
    recommendedSpecialty: string;
    recommendationReason: string;
    categorization?: {
      category: ClinicalCaseCategory;
      confidence: number;
      rationale: string;
    };
  };
}

interface ChatAssistantProps {
  triageData: TriageDataType;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ triageData, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate suggested questions based on triage data
  useEffect(() => {
    if (triageData) {
      const questions = generateSuggestedQuestions(triageData);
      setSuggestedQuestions(questions);
    }
  }, [triageData]);

  // Add initial welcome message when the component mounts
  useEffect(() => {
    if (messages.length === 0) {setMessages([
        {
          role: 'assistant',
          content: `Hello, I'm your Healthcare Dermatology Triage assistant. I can help you understand the triage results and answer questions about the assessment${triageData.assessment.categorization ? ', including the AI-suggested case categorization' : ''}. How can I help you today?`
        }
      ]);    }
  }, [messages.length, triageData.assessment.categorization]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetchOllamaCompletion(input, triageData);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get response:', error);
      
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I was unable to process your request. Please try again later.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clicking on a suggested question
  const handleSuggestedQuestionClick = (question: string) => {
    setInput(question);
    // Optional: Automatically submit the question
    // handleSendMessage({ preventDefault: () => {} } as React.FormEvent);
  };

  if (!isOpen) return null;

  return (
    <div className="chat-assistant-container">
      <div className="chat-header">
        <h3>
          <MessageSquare className="icon" />
          Healthcare Triage Assistant
        </h3>
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <div className="message-content">
              <ReactMarkdown
                components={{
                  code({node, inline, className, children, ...props}: {
                    node?: any;
                    inline?: boolean;
                    className?: string;
                    children: React.ReactNode;
                    [key: string]: any;
                  }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vs}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant-message">
            <div className="message-content loading">
              <Loader2 className="loading-icon" size={20} />
              Thinking...
            </div>
          </div>
        )}        <div ref={messagesEndRef} />
      </div>
      
      {/* Suggested Questions */}
      {suggestedQuestions.length > 0 && (
        <div className="suggested-questions-container">
          <div className="suggested-questions-scroll">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="suggested-question-button"
                onClick={() => handleSuggestedQuestionClick(question)}
                disabled={isLoading}
              >
                <HelpCircle size={14} className="question-icon" />
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <form className="chat-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the triage results..."
          disabled={isLoading}
          className="chat-input"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="chat-send-button"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatAssistant;
