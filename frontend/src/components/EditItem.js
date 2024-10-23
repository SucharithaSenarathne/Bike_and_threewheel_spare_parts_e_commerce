// components/EditItemModal.js
import React, { useState, useEffect } from 'react';
import EditItemModal from '../Modals/EditItemModal';
import '../styles/edititem.css'

const EditItem = ({ isOpen, onClose, item, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        cost: '',
        description: '',
        category: '',
        stock: '',
        subcategory: '',
        brand: ''
    });

    useEffect(() => {
        if (item) {
            setFormData({ ...item });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <EditItemModal isOpen={isOpen} onClose={onClose}>
            <div className='edit-item-main'>
            <form onSubmit={handleSubmit}>
                <h2>Edit Item</h2>
                <div className='divdiv'>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className='txt876'
                        />
                    </div>
                    <div>
                        <label>Brand:</label>
                        <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                            className='txt876'
                        />
                    </div>
                </div>
                <div className='abc321'>
                    <div>
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </div>
                <div className='divdiv'>
                    <div>
                        <label>Category:</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className='txt876'
                        />
                    </div>
                    <div>
                        <label>Subcategory:</label>
                        <input
                            type="text"
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                            required
                            className='txt876'
                        />
                    </div>
                </div>
                <div className='divdiv'>
                    <div >
                        <label>Stock:</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            className='txt876'
                        />
                    </div>
                    <div>
                        <label>Cost:</label>
                        <input
                            type="number"
                            name="cost"
                            value={formData.cost}
                            onChange={handleChange}
                            required
                            className='txt876'
                        />
                    </div>
                </div>
                <button type="submit">Save Changes</button>
            </form>
            </div>
        </EditItemModal>
    );
};

export default EditItem;
