import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentArea from "../contentArea/ContentArea";
import Sidebar from "../sidebar/Sidebar";
import UpdateFile from "./UpdateFile";
import UploadFile from "./UploadFile";
import ViewPaper from "./ViewPaper";
import axios from "axios";
import ViewUserPaper from "./ViewUserPaper";

const ExaminerDashboard = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleUpload=async(id)=>{
    try {
      const response = await axios.get(`http://localhost:4000/api/papers/${id}`);
      const paper = response.data;

      navigate(`/update/${id}`, { paper });
      setActiveTab("tab3");
    } catch (error) {
      console.error(`Error fetching paper details for id ${id}:`, error);
    }
  }

  const tabs = [
    {
      id: "tab1",
      name: "Upload Paper",
      content: <UploadFile  />,
      visible:true
    },
    // {
    //   id: "tab2",
    //   name: "View all Papers",
    //   content: <ViewPaper handleUpload={handleUpload} />,
    //   visible:true
    // },
    {
      id: "tab2",
      name: "View your Papers",
      content: <ViewUserPaper handleUpload={handleUpload} />,
      visible:true
    },
    {
      id:"tab3",
      name:"Update File",
      content: <UpdateFile />,
      visible:false
    }
  ];
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        tabs={tabs.filter(tab => tab.visible)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        title="Examiner Panel"
      />
      <ContentArea
        tabs={tabs}
        activeTab={activeTab}
        title="Examiner Dashboard"
        role="examiner"
      />
    </div>
  );
};

export default ExaminerDashboard;
