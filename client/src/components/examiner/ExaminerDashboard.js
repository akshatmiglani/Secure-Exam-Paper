import React from 'react'
import { useNavigate } from 'react-router-dom';


const ExaminerDashboard = () => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  };
  return (
    <div>
      <h1>Examiner</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default ExaminerDashboard
