import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Dashboard from './components/Dashboard'; // Assuming you have a Dashboard component
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Updated import for React Router v6
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes> {/* Changed from Switch to Routes */}
        <Route path="/" element={<App />} /> {/* Use `element` prop instead of `component` */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Use `element` prop */}
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();

