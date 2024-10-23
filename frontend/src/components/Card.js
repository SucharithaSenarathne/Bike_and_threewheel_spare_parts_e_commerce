import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/card.css';

import additem from '../assets/scooty.png';
import orders from '../assets/order.png';
import viewitem from '../assets/view.png';
import category from '../assets/category.png';
import subcategory from '../assets/sub-category.png';
import inventory from '../assets/inventory.png';
import settings from '../assets/settings.png';
import user from '../assets/user.png';

const CardComponent = () => {
  const cardsRef = useRef(null);

  const handleMouseMove = (e) => {
    const cards = Array.from(cardsRef.current.children);
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  };

  return (
    <div id="cards" ref={cardsRef} onMouseMove={handleMouseMove}>
      <Link to="/add-item" className="card">
        <div className="card-content">
          <img className="fa-brands fa-instagram" src={additem} style={{width:'150px',height:'150px'}} alt=''/>
          <h2 className="text">Add Item</h2>
			    <span className="shimmer"></span>
        </div>
      </Link>
      <Link to="/admin/orders" className="card">
        <div className="card-content">
          <img className="fa-brands fa-instagram" src={orders} style={{width:'150px',height:'150px'}} alt=''/>
          <h2 className="text">View Orders</h2>
          <span className="shimmer"></span>
        </div>
      </Link>
      <Link to="/items/all" className="card">
        <div className="card-content">
          <img className="fa-brands fa-instagram" src={viewitem} style={{width:'150px',height:'150px'}} alt=''/>
          <h2 className="text">View Items</h2>
          <span className="shimmer"></span>
        </div>
      </Link>
      <Link to="/items" className="card">
        <div className="card-content">
          <img className="fa-brands fa-instagram" src={category} style={{width:'150px',height:'150px'}} alt=''/>
          <h2 className="text">Add Categories</h2>
          <span className="shimmer"></span>
        </div>
      </Link>
      <Link to="/items" className="card">
        <div className="card-content">
          <img className="fa-brands fa-instagram" src={subcategory} style={{width:'150px',height:'150px'}} alt=''/>
          <h2 className="text">Add Sub-categories</h2>
          <span className="shimmer"></span>
        </div>
      </Link>
      <Link to="/inventory" className="card">
        <div className="card-content">
          <img className="fa-brands fa-instagram" src={inventory} style={{width:'180px',height:'150px'}} alt=''/>
          <h2 className="text">Inventory</h2>
          <span className="shimmer"></span>
        </div>
      </Link>
      <Link to="/settings" className="card">
        <div className="card-content">
          <img className="fa-brands fa-instagram" src={settings} style={{width:'150px',height:'150px'}} alt=''/>
          <h2 className="text">Settings</h2>
          <span className="shimmer"></span>
        </div>
      </Link>
      <Link to="/usermanagement" className="card">
        <div className="card-content">
          <img className="fa-brands fa-instagram" src={user} style={{width:'150px',height:'150px'}} alt=''/>
          <h2 className="text">User Control</h2>
          <span className="shimmer"></span>
        </div>
      </Link>
    </div>
  );
};

export default CardComponent;
