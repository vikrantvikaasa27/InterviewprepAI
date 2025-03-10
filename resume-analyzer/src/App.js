import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<ResumeAnalyzer />} />
          {/* Add more routes as needed for other parts of the application */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;