// StarRating2.js
import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating2 = ({ rating }) => {
    const stars2 = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars2.push(<FaStar key={i} />);
        } else if (i - 0.5 <= rating) {
            stars2.push(<FaStarHalfAlt key={i} />);
        } else {
            stars2.push(<FaRegStar key={i} />);
        }
    }
    return <div className="star-rating-2">{stars2}</div>;
};

export default StarRating2;
