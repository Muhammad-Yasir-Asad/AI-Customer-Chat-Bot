import React, { useState, useEffect } from 'react';
import './MessageBubble.css';

const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  const [isPlaying, setIsPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50); // trigger fade-in animation
  }, []);

  const handlePlayAudio = () => {
   
    if (message.audioUrl) return;

    const audio = new Audio(message.audioUrl);
    audio.play();
    setIsPlaying(true);
    setIsLoading(true);

    audio.onended = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    audio.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
      alert('Error playing the audio. Please try again.');
    };
  };

  const renderContent = () => {
    if (message.type === 'file' && message.content) {
      const fileUrl = `http://localhost:5000${message.content}`;
      const ext = message.content.split('.').pop().toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(ext);

      return isImage ? (
        <img src={fileUrl} alt="Uploaded" className="message-image" />
      ) : (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
          Download File
        </a>
      );
    }

    const handleFeedback = async (value) => {
      try {
        await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: message.content,
            feedback: value,
            timestamp: new Date().toISOString()
          })
        });
        alert("Thanks for your feedback!");
      } catch (err) {
        console.error("Feedback error:", err);
      }
    };

    return (
      <>
        <p className="message-text">{message.content}</p>
        {message.intent && <p className="meta"><strong>Intent:</strong> {message.intent}</p>}
        {message.sentiment && <p className="meta"><strong>Sentiment:</strong> {message.sentiment}</p>}
        {message.faq && <p className="meta"><strong>FAQ:</strong> {message.faq}</p>}
        {message.audioUrl && (
          <button onClick={handlePlayAudio} className="play-audio-btn">
            {isLoading ? '🔄 Loading Audio...' : isPlaying ? 'Playing...' : '🔊 Play Audio'}
          </button>
        )}
        {message.sender === 'bot' && (
          <div className="feedback-buttons">
            <button onClick={() => handleFeedback('positive')} className="thumb-btn">👍</button>
            <button onClick={() => handleFeedback('negative')} className="thumb-btn">👎</button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={`message-row ${isUser ? 'user-row' : 'bot-row'} ${visible ? 'visible' : ''}`}>
      <div className={`message-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default MessageBubble;
