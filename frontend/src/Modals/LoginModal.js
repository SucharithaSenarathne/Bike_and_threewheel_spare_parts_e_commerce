// src/components/LoginModal.js

import React from 'react';
import '../styles/loginmodal.css';

const LoginModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="login-modal-overlay">
            <div className="login-modal">
                <button className="login-modal-close" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
};

export default LoginModal;
