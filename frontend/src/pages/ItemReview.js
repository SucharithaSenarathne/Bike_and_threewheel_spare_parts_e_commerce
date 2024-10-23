import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/itemreview.css';
import useAutoResizeTextarea from '../hooks/useAutoResizeTextarea';

const ItemReview = ({ itemId }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const { isAuthenticated } = useAuth();

  const textareaRef = useAutoResizeTextarea();

  const handleSubmit = async (e) => {
    e.preventDefault();

	if (!isAuthenticated) {
		alert('Please log in to proceed with checkout.');
		return;
	}

  const numericalRatings = {
    'Terrible': 1,
    'Bad': 2,
    'Ok': 3,
    'Good': 4,
    'Excellent': 5
};

const numericalRating = numericalRatings[rating];

if (!numericalRating) {
    setMessage('Invalid rating value');
    return;
}
	
    try {
		const token = localStorage.getItem('token');
      	const response = await axios.post(`/api/items/${itemId}/review`, {
        reviewText,
        rating,
        numericalRating
      }, {
        headers: {
          'x-auth-token': token
        }
      });

      setMessage(response.data.message);
      // Optionally, reset the form
      setReviewText('');
      setRating('');
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Server Error');
    }
  };

  return (
    <div className="review-form">
      <h2>Submit a Review</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className='review-textarea'>
          <label>Review:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            ref={textareaRef}
			      placeholder='start typing ...'
			      required
          />
        </div>
        <div className='rate-value'>
          <label>Rating:  </label>
          <select value={rating} onChange={(e) => setRating(e.target.value)} required>
            <option value="">Select a rating</option>
            <option value="Terrible">Terrible</option>
            <option value="Bad">Bad</option>
            <option value="Ok">Ok</option>
            <option value="Good">Good</option>
            <option value="Excellent">Excellent</option>
          </select>
        </div>
        <button type="submit" className='review-submit-btn'>Submit Review</button>
      </form>
    </div>
  );
};

export default ItemReview;
