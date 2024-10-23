// src/components/AdminOrderList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/adminorderlist.css';
import { useAuth } from '../context/AuthContext';
import LeftPane from '../components/LeftPane';
import avatar from '../assets/avatar.jpg';

const AdminOrderList = () => {
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filters, setFilters] = useState({
        pending: false,
        dispatched: false,
        received: false,
        completed: false
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/orders', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setOrders(res.data);
                setFilteredOrders(res.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOrders();
        } else {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleDispatch = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://wickramasinghemotors.onrender.com/api/orders/${orderId}/order-dispatched`, {}, {
                headers: {
                    'x-auth-token': token
                }
            });
            const updatedOrders = orders.map(order => order._id === orderId ? { ...order, status: 'dispatched' } : order);
            setOrders(updatedOrders);
            filterOrders(filters, updatedOrders);
        } catch (error) {
            console.error('Error dispatching:', error);
        }
    };

    const handleOrderClick = (orderId) => {
        navigate(`/admin/orders/${orderId}`);
    };

    const handleFilterChange = (e) => {
        const { name, checked } = e.target;
        const newFilters = { ...filters, [name]: checked };
        setFilters(newFilters);
        filterOrders(newFilters, orders);
    };

    const filterOrders = (filters, orders) => {
        const filterValues = Object.values(filters);
        const noFiltersSelected = filterValues.every(value => !value);

        if (noFiltersSelected) {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter(order => filters[order.status]);
            setFilteredOrders(filtered);
        }
    };

    return (
        <div className='admin-order-main'>
            <LeftPane/>
        <div className="admin-order-list-container">
            <ul className='adminis-11'>
                {filteredOrders.map(order => (
                    <li key={order._id} className="order-item-11" onClick={() => handleOrderClick(order._id)}>
                        <p className="order-id-11">Order ID: {order._id}</p>
                        <p className="total-cost-11">Total Cost: Rs. {order.totalCost}</p>
                        <p className="status-11">Status: {order.status}</p>
                        <ul className='orderlist-22'>
                                {order.items.map((orderedItem) => (
                                    <li key={orderedItem._id} className='orderlist-22-li'>
                                    <div>
                                        {orderedItem.item.image ? (
                                            <img className='item-image' src={`/${orderedItem.item.image}`} alt='abc' />
                                        ) : (
                                            <img className='item-image' src={avatar} alt='Placeholder' />
                                        )}
                                    </div>
                                    <div className='oinq2'>
                                            <p className='order-item-name2'>{orderedItem.item.name.length > 19 ? `${orderedItem.item.name.substring(0, 19)}..` : orderedItem.item.name}</p>                              
                                            <p> x </p>
                                            <p>{orderedItem.quantity}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        {order.status === 'dispatched' || order.status === 'received' ? (
                            <button  className='dispatch-btn' onClick={() => handleOrderClick(order._id)}>View Order</button>
                        ) : (
                            <button style={{backgroundColor:"red"}} className='dispatch-btn' onClick={(e) => {
                                e.stopPropagation();
                                handleDispatch(order._id);
                            }}>Dispatch</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
        <div className='admin-order-filter'>
    <h2>Filter</h2>
    <div className='slider-container'>
        <div className='checkbox-wrapper-39'>
            <div>
            <label className='label-39'>
                <input
                    type="checkbox"
                    name="pending"
                    checked={filters.pending}
                    onChange={handleFilterChange}
                />
                <span className="checkbox"></span>
            </label>
            </div>
            <div>
                <label className='abc'>Pending</label>
            </div>
        </div>
        <div className='checkbox-wrapper-39'>
            <div>
            <label className='label-39'>
                <input
                    type="checkbox"
                    name="dispatched"
                    checked={filters.dispatched}
                    onChange={handleFilterChange}
                />
                <span className="checkbox"></span>
            </label>
            </div>
            <div><label className='abc'>Dispatched</label></div>
        </div>
        <div className='checkbox-wrapper-39'>
            <div>
            <label className='label-39'>
                <input
                    type="checkbox"
                    name="received"
                    checked={filters.received}
                    onChange={handleFilterChange}
                />
                <span className="checkbox"></span>
            </label>
            </div>
            <div><label className='abc'>Received</label></div>
        </div>
        <div className='checkbox-wrapper-39'>
            <div>
            <label className='label-39'>
                <input
                    type="checkbox"
                    name="completed"
                    checked={filters.completed}
                    onChange={handleFilterChange}
                />
                <span className="checkbox"></span>
            </label>
            </div>
            <div><label className='abc'>Completed</label></div>
        </div>
    </div>
</div>        
        </div>
    );
};

export default AdminOrderList;
