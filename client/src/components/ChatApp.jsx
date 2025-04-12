import React, { useState } from 'react';
import './ChatApp.css'; 
import axios from 'axios';

const ChatApp = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: 'user', text: message };
    setChat([...chat, userMsg]);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message });
      const botMsg = {
        sender: 'bot',
        text: res.data.response,
      };
      setChat(prev => [...prev, botMsg]);
    } catch (error) {
      setChat(prev => [...prev, { sender: 'bot', text: 'Something went wrong.' }]);
    }

    setMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {chat.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatApp;
