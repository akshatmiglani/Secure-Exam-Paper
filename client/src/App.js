import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/login/LoginPage';
import SignupPage from './components/signup/SignupPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ExaminerDashboard from './components/examiner/ExaminerDashboard';
import InvigilatorDashboard from './components/invigilator/InvigilatorDashboard';
import PrivateRoute from './components/PrivateRoute'; 
import DownloadFile from './components/papers/DownloadFile';
import UpdateFile from './components/papers/UpdateFile';
import UploadFile from './components/papers/UploadFile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/admin"
          element={<PrivateRoute element={AdminDashboard} roles={['admin']} />}
        />
        <Route
          path="/examiner"
          element={<PrivateRoute element={ExaminerDashboard} roles={['examiner']} />}
        />
        <Route
          path="/invigilator"
          element={<PrivateRoute element={InvigilatorDashboard} roles={['invigilator']} />}
        />
        <Route path="/upload" element={<UploadFile />} />
        <Route path="/download/:id/version/:versionId" element={<DownloadFile />} />
        <Route path="/update/:id" element={<UpdateFile />} />
      </Routes>
    </Router>
  );
};

export default App;
