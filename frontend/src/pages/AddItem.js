import React, { useState } from 'react';
import axios from 'axios';
import '../styles/additem.css';
import LeftPane from '../components/LeftPane';

const AddItem = () => {
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [brand, setBrand] = useState(''); 
    const [stock, setStock] = useState('');
    const [image, setImage] = useState(null); 
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('cost', cost);
            formData.append('description', description);
            formData.append('category', category);
            formData.append('subcategory', subcategory);
            formData.append('brand', brand);
            formData.append('stock', stock);
            formData.append('image', image);

            await axios.post('/api/items/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Item added Successfully!');
            setName('');
            setCost('');
            setDescription('');
            setCategory('');
            setSubcategory('');
            setBrand('');
            setStock('');
            setImage(null);
        } catch (error) {
            console.error(error);
        }   finally {
            setLoading(false);
        }
    };

    // Function to handle image selection
    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div className="add-item-main">
        <LeftPane/>
        <div className="add-item-container">
            <h2>Add Item</h2>
            <form className='add-item-form' onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Category</label>
                    <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)} 
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Bike Accessories">Bike Accessories</option>
                        <option value="Three Wheeler Accessories">Three Wheeler Accessories</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Subcategory</label>
                    <select 
                        value={subcategory} 
                        onChange={(e) => setSubcategory(e.target.value)} 
                        required
                    >
                        <option value="">Select Subcategory</option>
                        {category === 'Bike Accessories' && (
                            <>
                                <option value="Helmets">Helmets</option>
                                <option value="Lights">Lights</option>
                                <option value="Stickers">Stickers</option>
                                <option value="Tyres">Tyres</option>
                                <option value="Shock Absorbers">Shock Absorbers</option>
                                <option value="Gloves">Gloves</option>
                            </>
                        )}
                        {category === 'Three Wheeler Accessories' && (
                            <>
                                <option value="Seat Sets">Seat sets</option>
                                <option value="Tyres">Tyres</option>
                                <option value="Battery">Battery</option>
                            </>
                        )}
                    </select>
                </div>
                <div className="inputbox">
                    <ion-icon name="lock-closed-outline"></ion-icon>                    
                    <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} required />
                    <label for="">Brand</label>
                </div>
                <div className="inputbox">
                    <ion-icon name="lock-closed-outline"></ion-icon>                    
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    <label>Model</label>
                </div>
                <div className="inputbox">
                    <ion-icon name="lock-closed-outline"></ion-icon>
                    <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} required />
                    <label>Cost</label>
                </div>
                <div className="inputbox">
                    <ion-icon name="lock-closed-outline"></ion-icon>
                    <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                    <label>Stocks</label>
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Image</label>
                    <input type="file" onChange={handleImageChange} required />
                </div>
                <button type="submit" className='btn328p' disabled={loading}>{loading ? 'Processing...' : 'Submit'}</button>
            </form>
        </div>
        </div>
    );
};

export default AddItem;
