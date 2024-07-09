import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/login/LoginPage';
import SignupPage from './components/signup/SignupPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ExaminerDashboard from './components/examiner/ExaminerDashboard';
import InvigilatorDashboard from './components/invigilator/InvigilatorDashboard';
import PrivateRoute from './components/PrivateRoute'; 
import DownloadFile from './components/papers/DownloadFile';
import UpdateFile from './components/examiner/UpdateFile';
import UploadFile from './components/papers/UploadFile';
import PapersList from './components/papers/PapersList';

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
        {/* <Route
          path="/upload"
          element={<PrivateRoute element={UploadFile} roles={['admin', 'examiner']} />}
        /> */}
        {/* <Route
          path="/download/:id/version/:versionId"
          element={<PrivateRoute element={DownloadFile} roles={['admin', 'examiner']} />}
        /> */}
        <Route
          path="/update/:id"
          element={<PrivateRoute element={UpdateFile} roles={['admin', 'examiner']} />}
        />
        {/* <Route
          path="/all"
          element={<PrivateRoute element={PapersList} roles={['admin', 'examiner']} />}
        /> */}

      </Routes>
    </Router>
  );
};

export default App;
