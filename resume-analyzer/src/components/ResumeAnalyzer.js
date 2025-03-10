import React, { useState } from 'react';
import './ResumeAnalyzer.css';
import { FaFileUpload, FaSearch, FaBriefcase, FaChartLine, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const ResumeAnalyzer = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setError(null);
    } else {
      setResumeFile(null);
      setError('Please upload a PDF file for your resume');
    }
  };

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resumeFile) {
      setError('Please upload your resume');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('job_description', jobDescription);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    if (!results) return null;
    
    switch(activeTab) {
      case 'summary':
        return (
          <div className="tab-content">
            <div className="score-container">
              <div className="score-circle">
                <h2>{results.match_score}%</h2>
                <p>Match Score</p>
              </div>
              <div className="score-circle">
                <h2>{results.ats_score}%</h2>
                <p>ATS Score</p>
              </div>
            </div>
            <div className="summary-text">
              <h3>Summary Analysis</h3>
              <p>{results.summary}</p>
            </div>
          </div>
        );
      case 'skills':
        return (
          <div className="tab-content">
            <div className="skills-container">
              <div className="skills-section">
                <h3>Matching Skills</h3>
                <ul className="skills-list matching">
                  {results.matching_skills.map((skill, index) => (
                    <li key={index}><FaCheckCircle className="icon-success" /> {skill}</li>
                  ))}
                </ul>
              </div>
              <div className="skills-section">
                <h3>Missing Skills</h3>
                <ul className="skills-list missing">
                  {results.missing_skills.map((skill, index) => (
                    <li key={index}><FaExclamationTriangle className="icon-warning" /> {skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      case 'improvements':
        return (
          <div className="tab-content">
            <h3>Recommended Improvements</h3>
            <ol className="improvements-list">
              {results.improvements.map((improvement, index) => (
                <li key={index}>
                  <p className="improvement-item">{improvement}</p>
                </li>
              ))}
            </ol>
          </div>
        );
      case 'jobs':
        return (
          <div className="tab-content">
            <h3>Recommended Jobs</h3>
            <div className="jobs-container">
              {results.recommended_jobs.map((job, index) => (
                <div key={index} className="job-card">
                  <h4>{job.title}</h4>
                  <p className="job-company">{job.company}</p>
                  <p className="job-match">Match: {job.match_percentage}%</p>
                  <p className="job-description">{job.description}</p>
                  <a href={job.link} target="_blank" rel="noopener noreferrer" className="job-link">
                    View Job
                  </a>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="resume-analyzer-container">
      <header className="analyzer-header">
        <h1>Resume Analyzer</h1>
        <p>Upload your resume and get personalized insights to land your dream job</p>
      </header>
      
      <div className="analyzer-content">
        <div className="upload-section">
          <form onSubmit={handleSubmit}>
            <div className="file-upload-container">
              <div className="file-upload">
                <label htmlFor="resume-upload" className="upload-label">
                  <FaFileUpload className="upload-icon" />
                  <span>{resumeFile ? resumeFile.name : 'Upload Resume (PDF)'}</span>
                </label>
                <input
                  type="file"
                  id="resume-upload"
                  onChange={handleResumeUpload}
                  accept=".pdf"
                />
              </div>
              
              <div className="job-description">
                <label htmlFor="job-description">Job Description (Optional)</label>
                <textarea
                  id="job-description"
                  placeholder="Paste the job description here to get a personalized match score..."
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="analyze-button"
                disabled={isLoading || !resumeFile}
              >
                {isLoading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
        
        {results && (
          <div className="results-section">
            <div className="tabs">
              <button 
                className={activeTab === 'summary' ? 'active' : ''} 
                onClick={() => setActiveTab('summary')}
              >
                <FaChartLine /> Summary
              </button>
              <button 
                className={activeTab === 'skills' ? 'active' : ''} 
                onClick={() => setActiveTab('skills')}
              >
                <FaSearch /> Skills Analysis
              </button>
              <button 
                className={activeTab === 'improvements' ? 'active' : ''} 
                onClick={() => setActiveTab('improvements')}
              >
                <FaCheckCircle /> Improvements
              </button>
              <button 
                className={activeTab === 'jobs' ? 'active' : ''} 
                onClick={() => setActiveTab('jobs')}
              >
                <FaBriefcase /> Recommended Jobs
              </button>
            </div>
            
            {renderTabContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;