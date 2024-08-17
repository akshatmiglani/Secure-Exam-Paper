import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import ContentArea from '../contentArea/ContentArea';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InvigilatorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tab1');
  const [showPDF, setShowPDF] = useState(null);
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
    toast.warn('Logged out successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  const togglePDFViewer = (url) => {
    setShowPDF(url);
  };

  const closePDFViewer = () => {
    setShowPDF(null);
  };

  const disableCopyPaste = (event) => {
    event.preventDefault();
    alert("Copy/Paste is disabled.");
  };

  const disableRightClick = (event) => {
    event.preventDefault();
    alert("Right-click is disabled.");
  };

  const disableKeyboardShortcuts = (event) => {
    if (event.ctrlKey && (event.key === 'c' || event.key === 'x' || event.key === 'v' || event.key === 'a')) {
      event.preventDefault();
      alert("Keyboard shortcuts are disabled.");
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', disableKeyboardShortcuts);
    return () => {
      document.removeEventListener('keydown', disableKeyboardShortcuts);
    };
  }, []);

  const tabs = [
    { id: 'tab1', name: 'View PDF' },
  ];

  return (
    <div 
      className="flex h-screen bg-gray-50" 
      onCopy={disableCopyPaste} 
      onPaste={disableCopyPaste} 
      onContextMenu={disableRightClick}
    >
      <Sidebar 
        tabs={tabs} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex-grow p-6 overflow-y-auto">
        <ContentArea 
          tabs={tabs} 
          activeTab={activeTab}
          role="Invigilator" 
        />

        {papers.map(paper => (
          <div key={paper._id} className="mb-6 p-4 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{paper.title}</h3>
            {new Date() >= new Date(paper.scheduledFor) ? (
              <button 
                onClick={() => togglePDFViewer(paper.downloadUrl)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                View PDF
              </button>
            ) : (
              <p className="text-gray-500">Not available until {new Date(paper.scheduledFor).toLocaleString()}</p>
            )}
          </div>
        ))}

        {showPDF && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-11/12 max-w-4xl bg-white p-6 rounded-lg shadow-lg">
              <button 
                onClick={closePDFViewer} 
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <div className="relative w-full h-96 overflow-y-scroll">
                <object 
                  data={showPDF} 
                  type="application/pdf" 
                  className="w-full h-full" 
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  <p>Alternative text - include a link <a href={showPDF} download="paper.pdf">to the PDF!</a></p>
                </object>
              </div>
              {/* Download button */}
              <a 
                href={showPDF} 
                download="paper.pdf" 
                className="absolute bottom-2 right-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Download PDF
              </a>
            </div>
          </div>
        )}

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default InvigilatorDashboard;
