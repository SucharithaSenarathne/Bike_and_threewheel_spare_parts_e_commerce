import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/orderdetails.css';
import { useAuth } from '../context/AuthContext';
import LeftPane from './LeftPane';
import Modal from '../Modals/Modal';
import ItemReview from '../pages/ItemReview';
import itemdef from '../assets/gloves.jpg';

const OrderDetail = () => {
    const { isAuthenticated } = useAuth();
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {  
            const fetchOrder = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const res = await axios.get(`/api/userorders/${orderId}`, {
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
    }, [isAuthenticated, navigate, orderId]);

    const handleConfirmReceived = async () => {
        try {
            const response = await axios.put(`/api/userorders/${orderId}`, { status: 'received' });
            if (response.status === 200) {
                alert('Order received successfully!');
                setOrder({ ...order, status: 'received' });
            }
        } catch (error) {
            console.error(error);
            alert('Failed to confirm order received. Please try again.');
        }
    };

    const handleItemClick = (id) => {
        navigate(`/item/${id}`);
    };

    const handleReviewClick = (id) => {
        setSelectedItemId(id);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItemId(null);
    };

    return (
        <div className='order-details-main'>
            <LeftPane />
            <div className='single-order'>
                <h3>Order Details</h3>
                {order && (
                    <div>
                        <p>Order ID: {order._id}</p>
                        <p>Total Cost: Rs. {order.totalCost}</p>
                        <p>Status: {order.status}</p>
                        
                        <div className='order-items'>
                            <h3>Items</h3>
                            <div className='order-details-information'>
                                {order.items.map((orderItem) => (
                                    <div key={orderItem.item._id} className='order-details-item' onClick={() => handleItemClick(orderItem.item._id)}>
                                        {orderItem.item.image ? (
                                            <img src={`/${orderItem.item.image}`} alt={orderItem.item.name} className='order-detail-item-image' />
                                            ) : (
                                            <img src={itemdef} alt='Default Item' className='order-detail-item-image' />
                                            )}
                                        <div className='order-item-details'>
                                            <p>{orderItem.item.name.length > 19 ? `${orderItem.item.name.substring(0, 19)}..` : orderItem.item.name}</p>
                                            <p>LKR {orderItem.item.cost}</p>
                                            <p>Quantity: {orderItem.quantity}</p>
                                        </div>
                                        <button className='review-btn' onClick={(e) => {
                                            e.stopPropagation();
                                            handleReviewClick(orderItem.item._id);
                                        }}>Write a Review</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='shipping-details'>
                            <p>Name: {order.shippingDetails.name}</p>
                            <p>Address: {order.shippingDetails.address}</p>
                            <p>City: {order.shippingDetails.city}</p>
                            <p>State: {order.shippingDetails.state}</p>
                            <p>Zip: {order.shippingDetails.zip}</p>
                        </div>

                        {order.status === 'pending' && <button onClick={handleConfirmReceived}>Confirm Received</button>}
                    </div>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {selectedItemId && <ItemReview itemId={selectedItemId} onClose={handleCloseModal} />}
            </Modal>
        </div>
    );
};

export default OrderDetail;
