import React from 'react'
import { useNavigate } from 'react-router-dom';


const InvigilatorDashboard = () => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login'); 
  };
  return (
    <div>
      <h1>
        Invigilator
      </h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default InvigilatorDashboard
