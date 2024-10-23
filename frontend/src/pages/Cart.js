import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/cart.css';
import LeftPane from '../components/LeftPane';

const Cart = () => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            setCart(JSON.parse(localStorage.getItem('cart')) || []);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleBuyNow = () => {
        navigate('/checkout');
    };

    const handleClearCart = () => {
        setLoading(true);
        localStorage.removeItem('cart');
        setCart([]);
        alert('Cart cleared');
        setLoading(false);
    };

    return (
        <div className='cart-main'>
            <LeftPane/>
            <div className="cart-container">
                {cart.length === 0 ? (
                    <p style={{fontSize:'20px', color:'red'}}>Your cart is empty</p>
                ) : (
                    <ul>
                        {cart.map((item, index) => (
                            <li key={index}>
                                <div style={{display:"flex",justifyContent:'space-between'}}>
                                    <div>
                                        <h3>{item.name}</h3>
                                        <p>Rs. {item.cost} x {item.quantity}</p>
                                        <p>Total: Rs. {item.cost * item.quantity}</p>
                                    </div>
                                    <div>
                                        <img src={item.image} alt='abc'></img>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {cart.length > 0 && <button onClick={handleBuyNow}>Buy Now</button>}
                {cart.length > 0 && <button onClick={handleClearCart} disabled={loading}>{loading ? 'Processing...' : 'Clear Cart'}</button>}
            </div>
        </div>
    );
};

export default Cart;
