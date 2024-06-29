import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import ContentArea from '../contentArea/ContentArea';
import './InvigilatorDashboard.css';

const InvigilatorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tab1');
  const [showPDF, setShowPDF] = useState(null); // Use null initially to indicate no PDF is shown
  const [papers, setPapers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScheduledPapers = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/papers/scheduled/');
        if (!response.ok) {
          if(response.status === 404) {
            const errRes = await response.json();
            throw new Error(errRes.error);
          }
          throw new Error('Failed to fetch scheduled papers');
        }
        const data = await response.json();
        setPapers(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      }
    };

    fetchScheduledPapers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const togglePDFViewer = (url) => {
    setShowPDF(url);
  };

  const disableCopyPaste = (event) => {
    event.preventDefault();
    alert("Copy/Paste is disabled.");
  };

  const tabs = [
    { id: 'tab1', name: 'View PDF'},
  ];

  return (
    <div className="flex h-screen bg-gray-100" onCopy={disableCopyPaste} onPaste={disableCopyPaste}>
      <Sidebar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <div className="flex-grow overflow-y-auto">
        {papers.map(paper => (
          <div key={paper._id}>
            <h3>{paper.title}</h3>
            {new Date() >= new Date(paper.scheduledFor) ? (
              <button onClick={() => togglePDFViewer(paper.downloadUrl)}>View PDF</button>
            ) : (
              <p>Not available until {new Date(paper.scheduledFor).toLocaleString()}</p>
            )}
          </div>
        ))}
        {showPDF && (
          <div className='pdf-container'>
            <object data={showPDF} type="application/pdf" width="100%" height="90%">
              <p>Alternative text - include a link <a href={showPDF}>to the PDF!</a></p>
            </object>
          </div>
        )}
        <ContentArea tabs={tabs} activeTab={activeTab} role="Invigilator" />
        {error && <p>Error loading papers: {error}</p>}
      </div>
    </div>
  );
};

export default InvigilatorDashboard;
