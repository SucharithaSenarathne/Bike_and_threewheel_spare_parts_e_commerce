import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const AdminRoute = ({ children }) => {
    const { isAdmin, isAuthenticated } = useAuth();

    if (!isAdmin || !isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children; 
};

export default AdminRoute;
