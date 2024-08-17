import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import ContentArea from '../contentArea/ContentArea';
import SignupPage from '../signup/SignupPage';
import LogsPage from '../logs/LogsPage'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios";
import ViewUserPaper from "../examiner/ViewUserPaper";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tab1");

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

  const handleUpload = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/papers/${id}`);
      const paper = response.data;

      navigate(`/update/${id}`, { paper });
      setActiveTab("tab3");
    } catch (error) {
      console.error(`Error fetching paper details for id ${id}:`, error);
      toast.error('Failed to fetch paper details. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  const tabs = [
    { id: 'tab1', name: 'Add User', content: <SignupPage /> },
    { id: 'tab2', name: 'Logs', content: <LogsPage /> },
    { id: 'tab3', name: 'View your Papers', content: <ViewUserPaper handleUpload={handleUpload} />}
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        role="Admin"
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
      <div className="flex-grow overflow-y-auto">
        <ContentArea tabs={tabs} activeTab={activeTab} role="admin" />
      </div>
    </div>
  );
};

export default AdminDashboard;