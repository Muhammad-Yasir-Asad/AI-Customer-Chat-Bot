import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import MessageBubble from './components/MessageBubble';
import { FaMicrophone, FaPaperPlane, FaUpload, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);  // Update the input field with spoken text
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = {
      sender: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
  
      const data = await response.json();
      console.log("Audio URL:", data.audioUrl?.url);
      const botMessage = {
        
    
        sender: 'bot',
        content: data.response,
        sentiment: data.sentiment,
        intent: data.intent,
        faq: data.faq,
        audioUrl: data.audioUrl?.url,
        timestamp: new Date().toLocaleTimeString(),
      };
  
      
      setMessages((prev) => [...prev, botMessage]);
  
      // Optional auto-play:
      // speak(botMessage.content);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    // Show a loading message while the file is uploading
    const fileMessage = {
      sender: 'user',
      content: 'Uploading image...',
      type: 'file',
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, fileMessage]);

    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        
        const imageMessage = {
          sender: 'user',
          content: data.filePath,
          type: 'file',
          timestamp: new Date().toLocaleTimeString(),
        };

        // Set the image message
        setMessages((prev) => [...prev, imageMessage]);

        // Fetch the response based on the image
        const botMessage = {
          sender: 'bot',
          content: data.response, // The response you get from the backend for the image
          sentiment: data.sentiment,
          intent: data.intent,
          faq: data.faq,
          audioUrl: data.audioUrl?.url,
          timestamp: new Date().toLocaleTimeString(),
        };

        // Add the bot's response
        setMessages((prev) => [...prev, botMessage]);
      } else {
        console.error("File upload failed.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="app-wrapper">
      <header className="chat-header">
        <div className="logo">Orhanix AI Support</div>
        <nav>
          <Link to="/">Chat</Link> | <Link to="/dashboard">Dashboard</Link>
        </nav>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en-US">English</option>
          <option value="es-ES">Español</option>
          <option value="fr-FR">Français</option>
          <option value="de-DE">Deutsch</option>
        </select>
      </header>

      <div className="chat-body">
        <div className="chat-window">
          {messages.map((msg, index) => (
            <MessageBubble key={index} message={msg} />
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="chat-input-area">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            rows={2}
          />
          <div className="chat-controls">
            <div className="left-controls">
              <input type="file" onChange={handleFileUpload} />
            </div>
            <div className="right-controls">
              <button onClick={handleVoiceInput}><FaMicrophone /></button>
              <button onClick={handleSendMessage}><FaPaperPlane /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
