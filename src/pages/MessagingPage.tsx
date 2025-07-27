import React, { useState } from 'react';
import { MessageSquare, Send, Video, Monitor, Plus } from 'lucide-react';
import './MessagingPage.css';

const MessagingPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState('conv1');
  const [messageText, setMessageText] = useState('');

  const conversations = [
    {
      id: 'conv1',
      name: 'Dr. James Wilson',
      title: 'Plastic Surgery Team',
      lastMessage: '2 hours ago',
      active: true,
      avatar: '👨‍⚕️'
    },
    {
      id: 'conv2',
      name: 'Dr. Sarah Chen',
      title: 'Dermatology',
      lastMessage: '1 day ago',
      active: false,
      avatar: '👩‍⚕️'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Dr. James Wilson',
      time: '2 hours ago',
      text: 'Thanks for the referral. The images show concerning asymmetry and irregular borders. I agree with the urgent classification. Can you send the patient for appointment this week?',
      sent: false
    },
    {
      id: 2,
      sender: 'You',
      time: '1 hour ago',
      text: 'Absolutely. Patient has been contacted and appointment scheduled for Thursday 2pm. I\'ve sent updated medical history via secure link.',
      sent: true
    },
    {
      id: 3,
      sender: 'Dr. James Wilson',
      time: '30 mins ago',
      text: 'Perfect. I\'ll review the history before the appointment. Good catch on this one - the AI triage was spot on.',
      sent: false
    }
  ];

  const sendMessage = () => {
    if (messageText.trim()) {
      // Handle message sending logic here
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="messaging-page">
      <div className="page-header">
        <h1>Secure Messaging</h1>
        <p>Communicate securely with plastic surgery teams and colleagues</p>
      </div>

      <div className="messaging-layout">
        {/* Conversations list */}
        <div className="conversations-panel">
          <div className="panel-header">
            <h3>
              <MessageSquare size={20} />
              Conversations
            </h3>
            <button className="btn primary small">
              <Plus size={16} />
              New
            </button>
          </div>
          <div className="conversations-list">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-item ${conv.id === selectedConversation ? 'active' : ''}`}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <div className="conversation-avatar">{conv.avatar}</div>
                <div className="conversation-info">
                  <div className="conversation-name">{conv.name}</div>
                  <div className="conversation-title">{conv.title}</div>
                  <div className="conversation-time">{conv.lastMessage}</div>
                </div>
                {conv.active && <div className="online-indicator"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Active conversation */}
        <div className="conversation-panel">
          <div className="conversation-header">
            <div className="header-info">
              <div className="header-avatar">👨‍⚕️</div>
              <div className="header-details">
                <div className="header-name">Dr. James Wilson</div>
                <div className="header-title">Plastic Surgery Consultant</div>
              </div>
            </div>
            <div className="header-actions">
              <button className="btn secondary small" title="Video Call">
                <Video size={16} />
              </button>
              <button className="btn secondary small" title="Share Screen">
                <Monitor size={16} />
              </button>
            </div>
          </div>

          <div className="messages-container">
            <div className="messages-list">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.sent ? 'sent' : 'received'}`}
                >
                  <div className="message-header">
                    {message.sender} • {message.time}
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="message-input-container">
            <input
              type="text"
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="message-input"
            />
            <button 
              className="btn primary" 
              onClick={sendMessage}
              disabled={!messageText.trim()}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
