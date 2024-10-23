// src/pages/BuyerDashboard.js

import React from 'react';
import LeftPane from '../components/LeftPane';
import '../styles/buyerdashboard.css';

const BuyerDashboard = () => {
    return (
        <div className='buyer-main'>
            <LeftPane/>
            <div className='content'>
                <h2>Buyer Dashboard</h2>
                
            </div>
        </div>
    );
};

export default BuyerDashboard;
