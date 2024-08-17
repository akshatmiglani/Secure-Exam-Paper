import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SignupPage = () => {
  const initialFormData = {
    username: '',
    password: '',
    role: 'admin'
  };
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/users/signup', formData);
      toast.success('Added successfully!');
      setFormData(initialFormData);
      navigate('/admin'); 
    } catch (error) {
      setError('Error creating user');
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <ToastContainer />
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Add User</h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700">Role</label>
            <select
              id="role"
              name="role"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="admin">Admin</option>
              <option value="examiner">Examiner</option>
              <option value="invigilator">Invigilator</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Add User
          </button>
        </form>
        {/* <p className="mt-4 text-center text-gray-700">
          Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Log in</a>
        </p> */}
      </div>
    </div>
  );
};

export default SignupPage;
