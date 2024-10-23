import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginRegister from '../pages/LoginRegister';
import '../styles/itemdetail.css';
import LoginModal from '../Modals/LoginModal';
import LeftPane from '../components/LeftPane';
import StarRating from '../utils/StarRating';
import propic from '../assets/propic.jpg';

const ItemDetail = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await axios.get(`/api/items/${id}`);
                setItem(res.data);
                setReviews(res.data.reviews);
            } catch (error) {
                console.error(error);
            }
        };

        fetchItem();
    }, [id]);

    const handleAddToCart = () => {
        if (quantity > item.stock) {
            alert('Selected quantity exceeds available stock.');
            return;
        }

        if (!isAuthenticated) {
            setIsModalOpen(true);
        } else {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const cartItem = { ...item, quantity };
            cart.push(cartItem);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Item added to cart');
        }
    };

    const handleBuyNow = () => {
        if (quantity > item.stock) {
            alert('Selected quantity exceeds available stock.');
            return;
        }

        if (!isAuthenticated) {
            setIsModalOpen(true);
        } else {
            navigate(`/checkout/${id}`, { state: { item, quantity } });
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (!item) {
        return <div>Loading...</div>;
    }

    const reviewCount = reviews.length;
    const averageRating = reviews.reduce((acc, review) => acc + review.numericalRating, 0) / reviewCount || 0;

    const isOutOfStock = quantity > item.stock;

    return (
        <div className='item-details-main'>
            <LeftPane />
            <div className="item-detail-container">
                <div className='item-image-info-div'>
                    <div className='item-image-div'>
                        {item.image && <img src={`/${item.image}`} alt={item.name} />}
                    </div>
                    <div className='item-info-div'>
                        <h2>{item.name}</h2>
                        <p style={{ marginBottom: '5px' }}>LKR {item.cost}</p>
                        <p style={{ marginBottom: '15px' }}>Brand: {item.brand}</p>
                        <p style={{ marginBottom: '15px' }}>{item.description}</p>
                        <div className="quantity-container">
                            <label>Quantity: </label>
                            <input
                                type="number"
                                value={quantity}
                                min="1"
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            />
                            {isOutOfStock && <p style={{ color: 'red' }}>Only {item.stock} left in stock.</p>}
                        </div>
                        <div className='item-details-btns'>
                            <button
                                onClick={handleAddToCart}
                                className='item-det-but'
                                style={{ backgroundColor: isOutOfStock ? 'gray' : '' }}
                                disabled={isOutOfStock}
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className='item-det-but'
                                style={{ backgroundColor: isOutOfStock ? 'gray' : '' }}
                                disabled={isOutOfStock}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
                <div className="reviews-div">
                    <h3>Customer Reviews ({reviewCount})</h3>
                    <div className='average-rating-div'>
                        <p className='avg-rat'>{averageRating.toFixed(1)}</p>
                        <StarRating rating={averageRating} />
                        <p className='verified-purchases'>All from verified purchases</p>
                    </div>
                    {reviews.length === 0 ? (
                        <p>No reviews yet.</p>
                    ) : (
                        <ul>
                            {reviews.map((review) => (
                                <li key={review._id}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                    <div>
                                        <img src={propic} alt='propic' />
                                        </div>
                                        <div>
                                            <p>{review.user.fname} {review.user.lname}</p>
                                            <StarRating rating={review.numericalRating} />
                                        </div>
                                    </div>
                                    <p>{review.reviewText}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <LoginModal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <LoginRegister onClose={handleCloseModal} />
                </LoginModal>
            </div>
        </div>
    );
};

export default ItemDetail;
