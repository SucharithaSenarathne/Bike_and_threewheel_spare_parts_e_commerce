import React from 'react';
import '../styles/edititemmodal.css';

const EditItemModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="edit-modal-overlay">
            <div className="edit-modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
};

export default EditItemModal;