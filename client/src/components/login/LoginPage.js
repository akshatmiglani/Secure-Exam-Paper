import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'admin' // Default role set to 'admin'
  });
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
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      localStorage.setItem('token', response.data.token);
      switch (formData.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'examiner':
          navigate('/examiner');
          break;
        case 'invigilator':
          navigate('/invigilator');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      setError('Invalid username, password, or role');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
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
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-700">
          Don't have an account? <a href="/signup" className="text-indigo-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
