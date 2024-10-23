// src/components/Footer.js

import React from 'react';
import '../styles/footer.css';
import ParticleCanvas from './ParticleCanvas';
import { Link } from 'react-router-dom';

import instagramLogo from '../assets/insta.png';
import facebookLogo from '../assets/fb.png';
import twitterLogo from '../assets/x.png';

import visa from '../assets/visa.jpg';
import mcard from '../assets/mastercard.png';
import cod from '../assets/cod.jpg';


const scrollToTop = () => {
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
};


const Footer = () => {
  return (
    <div className='footer'>
      <div className='social-links'>
        <div className="social-item">
          <a href="https://www.instagram.com/chamuboy_99/" target="_blank" rel="noopener noreferrer">
            <img className='socialicons' src={instagramLogo} alt="Instagram"/>
          </a>
        </div>
        <div className="social-item">
          <a href="https://www.facebook.com/dinuwan.tennakoon/" target="_blank" rel="noopener noreferrer">
            <img className='socialicons' src={facebookLogo} alt="Facebook" />
          </a>
        </div>
        <div className="social-item">
          <a href="https://x.com/chamuboy99" target="_blank" rel="noopener noreferrer">
            <img className='socialicons' src={twitterLogo} alt="Twitter" />
          </a>
        </div>
      </div>
      <div className="footer-content">
        <p>&copy; 2024 Wickramasinghe Motors. All rights reserved.</p>
        <div className='terms-privacy'>
            <div><Link className='aaa'>Terms of Service</Link></div>
            <div><Link className='aaa'>Privacy Policy</Link></div>
            <div><Link className='aaa'>Sitemap</Link></div>
        </div>
      </div>
      <div className='bottom-div'>
      <div className='all-links'>
        <h3>Customer Care</h3>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Home</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Help centre</Link></div>
        <div><Link className='bbb' to='/items/all' onClick={scrollToTop}>Browse items</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Registration</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Company info</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Contact us</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Locate us</Link></div>
      </div>
      <div className='all-links'>
        <h3>Customer Care</h3>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Home</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Help centre</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Browse items</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Registration</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Company info</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Contact us</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Locate us</Link></div>
      </div>
      <div className='all-links'>
        <h3>Customer Care</h3>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Home</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Help centre</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Browse items</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Registration</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Company info</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Contact us</Link></div>
        <div><Link className='bbb' to='/' onClick={scrollToTop}>Locate us</Link></div>
      </div>
      <div className='all-links'>
        <h3>Payment Methods</h3>
        <div style={{display:'flex', gap:'10px'}}>
          <div><img src={visa} alt='visa'/></div>
          <div><img src={mcard} alt='mastercard'/></div>
          <div><img src={cod} alt='cash on delivery'/></div>
        </div>
      </div>
      </div>
      <ParticleCanvas/>
    </div>
  )
}

export default Footer;
