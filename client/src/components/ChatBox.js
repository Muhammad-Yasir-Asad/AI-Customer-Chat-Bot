import React, { useState } from 'react';

const ChatBox = ({ onSubmit }) => {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSubmit(message);
      setMessage('');
    }
  };

  return (
    <div className="chat-box">
      <textarea
        value={message}
        onChange={handleChange}
        placeholder="Enter your query..."
        rows="4"
      />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default ChatBox;
