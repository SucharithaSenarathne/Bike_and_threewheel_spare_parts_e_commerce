import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import RightPane from './RightPane';
import '../styles/itemlist.css';
import LeftPane from './LeftPane';
import StarRating2 from '../utils/StarRating2';

import itemdef from '../assets/gloves.jpg';

const ItemList = () => {
    const { category, subcategory } = useParams();
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await axios.get('/api/items');
                let filteredItems = res.data;

                if (category && subcategory) {
                    filteredItems = filteredItems.filter(item => item.category === category && item.subcategory === subcategory);
                }

                // Sort the items based on sortOrder
                filteredItems.sort((a, b) => sortOrder === 'desc' ? b.itemsSold - a.itemsSold : a.itemsSold - b.itemsSold);

                setItems(filteredItems);
                setFilteredItems(filteredItems);
            } catch (error) {
                console.error(error);
            }
        };

        fetchItems();
    }, [category, subcategory, sortOrder]);

    const handleFilterChange = ({ lowerPrice, upperPrice, selectedBrand, inStockOnly }) => {
        let filtered = items;

        if (lowerPrice) {
            filtered = filtered.filter(item => item.cost >= lowerPrice);
        }

        if (upperPrice) {
            filtered = filtered.filter(item => item.cost <= upperPrice);
        }

        if (selectedBrand) {
            filtered = filtered.filter(item => item.brand === selectedBrand);
        }

        if (searchQuery) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (inStockOnly) {
            filtered = filtered.filter(item => item.stock > 0); 
        }

        setFilteredItems(filtered);
    };

    const handleAddToCart = (item) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItem = { ...item, quantity: 1 }; // Default quantity to 1 for simplicity
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Item added to cart');
    };

    const handleItemClick = (id) => {
        navigate(`/item/${id}`);
    };

    const handleSortChange = (newSortOrder) => {
        setSortOrder(newSortOrder);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (!query) {
            setFilteredItems(items);
        } else {
            handleFilterChange({ lowerPrice: null, upperPrice: null, selectedBrand: null });
        }
    };
    

    return (
        <div className='itemlist-main'>
            <LeftPane />
            <div className="item-list-container">
                <div className="search">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <i className="search-icon fa fa-search"></i>
                </div>
                <ul>
                    {filteredItems.map(item => (
                        <li key={item._id} onClick={() => handleItemClick(item._id)}>
                            <div className="card-full">
                                <div className="card-fro">
                                    <div>
                                        {item.image ? (
                                            <img className='item-image' src={`/${item.image}`} alt={item.name} />
                                        ) : (
                                            <img className='item-image' src={itemdef} alt='Default Item' />
                                        )}
                                    </div>                                    <div><h3 className='item-name'>{item.name.length > 19 ? `${item.name.substring(0, 19)}..` : item.name}</h3></div>
                                    <div className='item-list-rating-div'>
                                        <StarRating2  rating={item.reviews.reduce((acc, review) => acc + review.numericalRating, 0) / item.reviews.length || 0}/>
                                        <p className='item-list-rating-amount'>{item.reviews.length} reviews</p>
                                    </div>                                  
                                    <div className='cost-sold'>
                                        <p className='item-cost'>LKR {item.cost}</p>
                                        <p className='items-sold'>{item.itemsSold} sold</p>
                                    </div> 
                                    <div className='stock-block'>
                                        <p
                                            className='stock-availability'
                                            style={{ color: item.stock > 0 ? 'green' : 'red' }}
                                        >
                                            {item.stock > 0 ? 'In stock' : 'Out of stock'}
                                        </p>
                                    </div>                                   
                                </div>

                                <div className="card-rear">
                                    <button className='add-cart-btn' onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(item);}}
                                    >Add to Cart
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <RightPane onFilterChange={handleFilterChange} onSortChange={handleSortChange} sortOrder={sortOrder} />
            <div className="night">
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
                <div className="shooting_star"></div>
            </div>            
        </div>
    );
};

export default ItemList;
