import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentArea from "../contentArea/ContentArea";
import Sidebar from "../sidebar/Sidebar";
import UpdatePaper from "./UpdatePaper";
import UploadFile from "./UploadFile";
import ViewPaper from "./ViewPaper";

const ExaminerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tab1");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const tabs = [
    {
      id: "tab1",
      name: "Upload Paper",
      content: <UploadFile />,
    },
    {
      id: "tab2",
      name: "Update Paper",
      content: <UpdatePaper />,
    },
    {
      id: "tab3",
      name: "View all Papers",
      content: <ViewPaper />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        title="Examiner Panel"
      />
      <ContentArea
        tabs={tabs}
        activeTab={activeTab}
        title="Examiner Dashboard"
      />
    </div>
  );
};

export default ExaminerDashboard;
