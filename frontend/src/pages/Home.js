// src/pages/Home.js

import React from 'react';
import LoginRegister from './LoginRegister';
import Boxes from '../components/Boxes';
import InfiniteScroller from '../components/Infinityscroll';
import '../styles/home.css'

const Home = () => {
    return (
        <div className="home-container">
            <LoginRegister/>
            <InfiniteScroller/>
            <Boxes/>
        </div>
    );
};

export default Home;
