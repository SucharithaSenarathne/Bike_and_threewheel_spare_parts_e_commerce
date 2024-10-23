import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/rightpane.css';

const RightPane = ({ onFilterChange, onSortChange, sortOrder }) => {
    const [lowerPrice, setLowerPrice] = useState('');
    const [upperPrice, setUpperPrice] = useState('');
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [inStockOnly, setInStockOnly] = useState(false);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await axios.get('/api/items');
                const allBrands = res.data.map(item => item.brand);
                const uniqueBrands = [...new Set(allBrands)];
                setBrands(uniqueBrands);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBrands();
    }, []);

    const handleFilterChange = () => {
        onFilterChange({ lowerPrice, upperPrice, selectedBrand, inStockOnly });
    };

    useEffect(() => {
        handleFilterChange();
    }, [inStockOnly, selectedBrand]);

    const handleSortChange = (e) => {
        const newSortOrder = e.target.value;
        onSortChange(newSortOrder);
    };

    const handleReset = () => {
        setLowerPrice('');
        setUpperPrice('');
        setSelectedBrand('');
        setInStockOnly(false);
        onSortChange('desc');
        onFilterChange({ lowerPrice: '', upperPrice: '', selectedBrand: '', inStockOnly: false }); // Trigger reset in parent
    };

    return (
        <div className="righty-pane">
            <div className="filt-group">
                <h4>Filter by Price</h4>
                <input
                    type="number"
                    placeholder="Lower Price"
                    value={lowerPrice}
                    onChange={(e) => setLowerPrice(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Upper Price"
                    value={upperPrice}
                    onChange={(e) => setUpperPrice(e.target.value)}
                />
                <button onClick={handleFilterChange}>Apply</button>
            </div>
            <div className="filt-group">
                <h4>Filter by Brand</h4>
                <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                >
                    <option value="">All Brands</option>
                    {brands.map((brand, index) => (
                        <option key={index} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>
            </div>
            <div className="filt-group">
                <h4>Filter by Sell Trends</h4>
                <select value={sortOrder} onChange={handleSortChange}>
                    <option value="desc">Most Sold</option>
                    <option value="asc">Least Sold</option>
                </select>
            </div>
            <div className="filt-group" style={{display:"flex"}}>
                    <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)} // Trigger filter when checked/unchecked
                    />
                <label>
                    In Stock
                </label>
            </div>
            <div className="filt-group">
                <button className="reset-button" onClick={handleReset}>
                    Reset Filters
                </button>
            </div>
        </div>
    );
};

export default RightPane;
