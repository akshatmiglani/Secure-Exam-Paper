import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, roles, ...rest }) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = token !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: rest.location }} />;
  }

  // Decode token to get user's role
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  const userRole = decodedToken.role;

  // Check if the user's role is authorized for the route
  if (!roles.includes(userRole)) {
    return <Navigate to="/login" replace state={{ from: rest.location }} />;
  }

  return <Element {...rest} />;
};

export default PrivateRoute;
