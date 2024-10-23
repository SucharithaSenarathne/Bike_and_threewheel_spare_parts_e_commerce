import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LeftPane from './LeftPane';
import EditItem from '../components/EditItem';
import { ConfirmDialog } from '@vaadin/react-components';
import '../styles/inventory.css';

import itemdef from '../assets/gloves.jpg';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await axios.get('/api/items');
                setItems(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchItems();
    }, []);

    const handleItemClick = (id) => {
        navigate(`/item/${id}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/items/${itemToDelete._id}`);
            setItems(items.filter(item => item._id !== itemToDelete._id));
            setIsConfirmDialogOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditClick = (item) => {
        setSelectedItem(item); 
        setTimeout(() => setIsModalOpen(true), 0);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const handleEditSave = async (updatedItem) => {
        try {
            await axios.put(`/api/items/${selectedItem._id}`, updatedItem);
            const updatedItems = items.map(item => 
                item._id === selectedItem._id ? { ...item, ...updatedItem } : item
            );
            setItems(updatedItems);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setIsConfirmDialogOpen(true);  // Open the confirmation dialog
    };

    return (
        <div className='main-inventory-container'>
            <LeftPane />
            <div className='inventory-container'>
                <ul>
                    {items.map(item => (
                        <li key={item._id} onClick={() => handleItemClick(item._id)}>
                            <div className='inventory-div'>
                                <div>
                                    {item.image ? (
                                        <img src={`/${item.image}`} alt={item.name} />
                                    ) : (
                                        <img src={itemdef} alt='Default Item' />
                                    )}
                                    </div>
                                <div className='ncsdiv'>
                                    <div><h3>{item.name.length > 20 ? `${item.name.substring(0, 18)}..` : item.name}</h3></div>                                  
                                    <div className='csdiv'>
                                        <p>LKR {item.cost}</p> 
                                        <p style={{ color: item.stock < 10 ? 'red' : 'black' }}>
                                            Stock: {item.stock}
                                        </p>
                                    </div>                                     
                                </div> 
                                <div className='inventory-buttons'>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(item)
                                    }}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(item)
                                    }}>
                                        <i className="fas fa-trash"></i>
                                    </button> 
                                </div>                               
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <EditItem
                isOpen={isModalOpen} 
                onClose={handleModalClose} 
                item={selectedItem} 
                onSave={handleEditSave} 
            />

            <ConfirmDialog
                header="Confirm Delete"
                opened={isConfirmDialogOpen}
                cancelButtonVisible
                onConfirm={handleDelete}
                onCancel={() => setIsConfirmDialogOpen(false)}
                cancelText="Cancel"
                confirmText="Delete"
                message={`Are you sure you want to delete ${itemToDelete?.name}?`}
            />
        </div>
    );
}

export default Inventory;
