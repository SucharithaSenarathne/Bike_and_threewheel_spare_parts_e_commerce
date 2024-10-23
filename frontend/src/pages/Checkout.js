import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import '../styles/checkout.css';
import LeftPane from '../components/LeftPane';

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const stripe = useStripe();
    const elements = useElements();

    const [shippingDetails, setShippingDetails] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        contactNo: ''
    });

    const [cart, setCart] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [userAddresses, setUserAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);

    useEffect(() => {
        const cartItems = state?.item ? [{ ...state.item, quantity: state.quantity }] : JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartItems);
        setTotalCost(cartItems.reduce((total, item) => total + item.cost * item.quantity, 0));

        const fetchUserAddresses = async () => {
            if (isAuthenticated) {
                const token = localStorage.getItem('token');
                try {
                    const response = await axios.get('/api/users/me', {
                        headers: { 'x-auth-token': token }
                    });
                    setUserAddresses(response.data.addresses || []);
                } catch (error) {
                    console.error('Error fetching user addresses:', error);
                }
            }
        };

        fetchUserAddresses();
    }, [state, isAuthenticated]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handleAddressSelection = (e) => {
        const addressIndex = e.target.value;
        const selected = userAddresses[addressIndex];
        setSelectedAddress(selected);
        setShippingDetails({
            name: selected.name,
            address: selected.address,
            city: selected.city,
            state: selected.state,
            zip: selected.zip,
            contactNo: selected.contactNo
        });
    };

    const handleAddNewAddress = async () => {
        if (!isAuthenticated) {
            alert('Please log in to proceed with checkout.');
            return;
        }
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                '/api/users/address',
                shippingDetails,
                {
                    headers: { 'x-auth-token': token }
                }
            );
    
            setUserAddresses(prevAddresses => [...prevAddresses, response.data]);
            setShowNewAddressForm(false);
            setShippingDetails({
                name: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                contactNo: ''
            });
        } catch (error) {
            console.error('Error adding new address:', error);
            alert('Failed to add address. Please try again.');
        }
    };

    const handleConfirmOrder = async () => {
        if (!isAuthenticated) {
            alert('Please log in to proceed with checkout.');
            return;
        }

        if (Object.values(shippingDetails).some(detail => !detail)) {
            alert('Please fill in all the shipping details.');
            return;
        }

        if (paymentMethod === 'cash') {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(
                    '/api/orders/checkout',
                    {
                        items: cart.map(item => ({ item: item._id, quantity: item.quantity })),
                        totalCost,
                        shippingDetails,
                        paymentMethod
                    },
                    {
                        headers: {
                            'x-auth-token': token
                        }
                    }
                );
                if (response.status === 201) {
                    localStorage.removeItem('cart');
                    alert('Order confirmed. Cash on delivery.');
                    navigate('/items/all');
                }
            } catch (error) {
                console.error(error);
                alert('Failed to confirm order. Please try again.');
            }
        } else if (paymentMethod === 'card') {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(
                    '/api/orders/checkout',
                    {
                        items: cart.map(item => ({ item: item._id, quantity: item.quantity })),
                        totalCost,
                        shippingDetails,
                        paymentMethod
                    },
                    {
                        headers: {
                            'x-auth-token': token
                        }
                    }
                );

                const { clientSecret } = response.data;
                setClientSecret(clientSecret);

                const cardElement = elements.getElement(CardElement);

                const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: shippingDetails.name,
                            address: {
                                line1: shippingDetails.address,
                                city: shippingDetails.city,
                                state: shippingDetails.state,
                                postal_code: shippingDetails.zip
                            }
                        }
                    }
                });

                if (paymentResult.error) {
                    alert(paymentResult.error.message);
                } else if (paymentResult.paymentIntent.status === 'succeeded') {
                    localStorage.removeItem('cart');
                    alert('Payment successful. Order confirmed.');
                    navigate('/items/all');
                }
            } catch (error) {
                console.error(error);
                alert('Failed to confirm order. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className='check-main'>
            <LeftPane/>
        <div className="checkout-container">
            <h2>Checkout</h2>
            <div className="shipping-form">
                <h4>Shipping Details</h4>
                {userAddresses.length > 0 ? (
                    <div className="address-selection">
                        {userAddresses.map((address, index) => (
                            <div key={index} className="address-item">
                                <input 
                                    type="radio" 
                                    id={`address-${index}`} 
                                    name="address" 
                                    value={index} 
                                    onChange={handleAddressSelection}
                                    checked={selectedAddress === address}
                                />
                                <label htmlFor={`address-${index}`}>
                                    {address.name}, {address.address}, {address.city}, {address.state}, {address.zip}, {address.contactNo}
                                </label>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{color:'purple'}}>No saved addresses found.</p>
                )}

                <button onClick={() => setShowNewAddressForm(!showNewAddressForm)} className='addressbtn'>
                    {showNewAddressForm ? 'Cancel' : '+ Add New Address'}
                </button>

                {showNewAddressForm && (
                    <div className="new-address-form">
                        <input type="text" name="name" placeholder="Name" value={shippingDetails.name} onChange={handleChange} required />
                        <input type="text" name="address" placeholder="Address" value={shippingDetails.address} onChange={handleChange} required/>
                        <input type="text" name="city" placeholder="City" value={shippingDetails.city} onChange={handleChange} required/>
                        <input type="text" name="state" placeholder="State" value={shippingDetails.state} onChange={handleChange} required/>
                        <input type="text" name="zip" placeholder="Zip Code" value={shippingDetails.zip} onChange={handleChange} required/>
                        <input type="text" name="contactNo" placeholder="Contact Number" value={shippingDetails.contactNo} onChange={handleChange} required/>
                        <button onClick={handleAddNewAddress} className='addressbtn'>Save Address</button>
                    </div>
                )}
            </div>
            <div className="payment-method">
                <h4>Payment Method</h4>
                <select value={paymentMethod} onChange={handlePaymentMethodChange}>
                    <option value="cash">Cash on Delivery</option>
                    <option value="card">Credit/Debit Card</option>
                </select>
            </div>
            {paymentMethod === 'card' && (
                <div className="card-details">
                    <h4>Card Details</h4>
                    <CardElement options={{ hidePostalCode: true }} />
                </div>
            )}
            <div className="order-summary">
                <h4>Order Summary</h4>
                <ul>
                    {cart.map((item, index) => (
                        <li key={index}>
                            <div>
                                <p>{item.name}</p>
                                <p>Rs. {item.cost} x {item.quantity}</p>
                                <p>Total: Rs. {item.cost * item.quantity}</p>
                            </div>
                            <div>
                                {item.image && <img src={`/${item.image}`} alt={item.name} />}
                            </div>
                        </li>
                    ))}
                </ul>
                <p>Total Cost: Rs. {totalCost}</p>
                <button onClick={handleConfirmOrder} disabled={loading} className='confirmorderbtn'>
                    {loading ? 'Processing...' : 'Confirm Order'}
                </button>
            </div>
        </div>
        </div>
    );
};

export default Checkout;
