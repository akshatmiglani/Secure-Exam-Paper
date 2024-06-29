import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentArea from "../contentArea/ContentArea";
import Sidebar from "../sidebar/Sidebar";
import SignupPage from "../signup/SignupPage";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tab1");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const tabs = [
    { id: "tab1", name: "Add People", content: <SignupPage /> },
    { id: "tab2", name: "Tab 2", content: "This is the content of Tab 2." },
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
      </div>
    </div>
  );
};

export default AdminDashboard;
