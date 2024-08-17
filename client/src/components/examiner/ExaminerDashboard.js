import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentArea from "../contentArea/ContentArea";
import Sidebar from "../sidebar/Sidebar";
import UpdateFile from "./UpdateFile";
import UploadFile from "./UploadFile";
import axios from "axios";
import ViewUserPaper from "./ViewUserPaper";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ExaminerDashboard = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
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
  const handleUpload=async(id)=>{
    try {
      const response = await axios.get(`http://localhost:4000/api/papers/${id}`);
      const paper = response.data;

      setTabs((prevTabs) => {
        return prevTabs.map((tab) =>
          tab.id === "tab3"
            ? { ...tab, visible: true, content: <UpdateFile paper={paper} paperid={id}/> }
            : tab
        );
      });

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
  const [tabs,setTabs]=useState([
    {
      id: "tab1",
      name: "Upload Paper",
      content: <UploadFile />,
      visible: true
    },
    {
      id: "tab2",
      name: "View your Papers",
      content: <ViewUserPaper handleUpload={handleUpload} />,
      visible: true
    },
    {
      id: "tab3",
      name: "Update File",
      content: <UpdateFile />,
      visible: false
    }
  ])
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        tabs={tabs.filter(tab => tab.visible)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        title="Examiner Panel"
        role="Examiner"
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
      <ContentArea
        tabs={tabs}
        activeTab={activeTab}
        title="Examiner Dashboard"
        role="Examiner"
      />
    </div>
  );
};

export default ExaminerDashboard;
