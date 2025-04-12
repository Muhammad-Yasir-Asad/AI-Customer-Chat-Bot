import React, { useState } from 'react';
import MessageBubble from './MessageBubble';
import LanguageToggle from './LanguageToggle';
import './ChatWindow.css';
import axios from 'axios';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('en');

  const getTimestamp = () => new Date().toLocaleTimeString();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { message: input, sender: 'user', timestamp: getTimestamp() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        message: input,
        language: language
      });

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            message: res.data.response,
            sender: 'bot',
            sentiment: res.data.sentiment,
            timestamp: getTimestamp()
          }
        ]);
        setIsTyping(false);
      }, 1000); // Simulate delay
    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>AI Support Bot</h3>
        <LanguageToggle currentLanguage={language} onChange={setLanguage} />
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} {...msg} />
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
