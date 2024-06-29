
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import ContentArea from '../contentArea/ContentArea';
import SignupPage from '../signup/SignupPage';
import LogsPage from '../logs/LogsPage'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UploadFile from '../examiner/UploadFile';
import PaperVersions from '../version-pdf/PaperVersions';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tab1");

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Log Out successfully!');
    navigate('/login');
  };

  const tabs = [

    { id: 'tab1', name: 'Add People', content: <SignupPage /> },
    { id: 'tab2', name: 'Logs', content: <LogsPage /> },
    { id: 'tab3', name: 'Upload Paper', content: <UploadFile />},
    { id: 'tab4', name: 'paper', content: <PaperVersions />}
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      <div className="flex-grow overflow-y-auto">
        <ContentArea tabs={tabs} activeTab={activeTab} />
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminDashboard;
