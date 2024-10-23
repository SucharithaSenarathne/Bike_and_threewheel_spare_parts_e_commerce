// src/components/AdminOrderDetail.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom'; 
import '../styles/adminorderdetail.css';
import { useAuth } from '../context/AuthContext';


const AdminOrderDetail = () => {
    const { isAuthenticated } = useAuth();
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      if (isAuthenticated) {  
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/api/orders/${orderId}`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setOrder(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOrder();
      } else {
        navigate('/');
      }
    }, [isAuthenticated, navigate,orderId]);

    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-order-detail-container">
            <h2>Order ID: {order._id}</h2>
            <p>Total Cost: Rs. {order.totalCost}</p>
            <p>Status: {order.status}</p>
            <div className="shipping-details">
                <h3>Shipping Details:</h3>
                <p>Name: {order.shippingDetails.name}</p>
                <p>Address: {order.shippingDetails.address}</p>
                <p>Contact: {order.shippingDetails.contact}</p>
            </div>
        </div>
    );
};

export default AdminOrderDetail;
