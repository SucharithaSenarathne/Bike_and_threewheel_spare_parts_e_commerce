// src/components/OrderList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/orderlist.css';
import LeftPane from './LeftPane';
import { useAuth } from '../context/AuthContext';

import itemdef from '../assets/gloves.jpg';


const OrderList = () => {
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            const fetchOrders = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get('/api/userorders', {
                        headers: {
                            'x-auth-token': token
                        }
                    });
                    setOrders(res.data);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchOrders();
        } else {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleOrderClick = (orderId) => {
        navigate(`/userorders/${orderId}`);
    };

    const handleConfirmReceived = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/userorders/${orderId}/confirm-received`, {}, {
                headers: {
                    'x-auth-token': token
                }
            });
            setOrders(orders.map(order => order._id === orderId ? { ...order, status: 'received' } : order));
        } catch (error) {
            console.error('Error confirming order received:', error);
        }
    };

    return (
        <div className='orders-main'>
            <LeftPane />
            <div className="user-orders-container">
            
                <h2>Your Orders</h2>
                <ul className='orderlist-1'>
                    {orders.map(order => (
                        <li key={order._id} onClick={() => handleOrderClick(order._id)} className='orderlist-1-li'>
                            <p>Order ID: {order._id}</p>
                            <p>Total Cost: Rs. {order.totalCost}</p>
                            <p>Status: {order.status}</p>
                            <ul className='orderlist-2'>
                                {order.items.map((orderedItem) => (
                                    <li key={orderedItem._id} className='orderlist-2-li'>
                                        <img 
                                            src={orderedItem.item.image ? orderedItem.item.image : {itemdef}} 
                                            alt={orderedItem.item.name || 'Default Item'} 
                                        />
                                        <div className='oinq'>
                                            <p className='order-item-name'>{orderedItem.item.name}</p>                              
                                            <p> x </p>
                                            <p>{orderedItem.quantity}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>              
                            {order.status === 'received' ? (
                                <button className='confirm-btn' style={{backgroundColor:"purple"}}>View Order</button>
                            ) : (
                                <button className='confirm-btn' onClick={(e) => {
                                    e.stopPropagation();
                                    handleConfirmReceived(order._id);
                                }}>Confirm Received</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrderList;
