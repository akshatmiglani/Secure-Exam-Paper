import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import ContentArea from '../contentArea/ContentArea';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tab1');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const tabs = [
    { id: 'tab1', name: 'Tab 1', content: 'This is the content of Tab 1.' },
    { id: 'tab2', name: 'Tab 2', content: 'This is the content of Tab 2.' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <ContentArea tabs={tabs} activeTab={activeTab} />
    </div>
  );
};

export default AdminDashboard;
