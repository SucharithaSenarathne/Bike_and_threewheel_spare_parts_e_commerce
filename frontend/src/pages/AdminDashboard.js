import React from 'react';
import LeftPane from '../components/LeftPane';
import CardComponent from '../components/Card';
import '../styles/admindashboard.css';

const AdminDashboard = () => {
    return (
        <div className='main-division'>
            <LeftPane/>
            <div className='admin-content'>
                <CardComponent/>
            </div>
        </div>
    );
};

export default AdminDashboard;
