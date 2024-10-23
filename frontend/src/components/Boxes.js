import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/boxes.css';
import helmet from '../assets/helmet.jpg';
import gloves from '../assets/gloves.jpg';
import headlight from '../assets/headlight.jpg';
import shock from '../assets/shock.jpg';
import tyre from '../assets/tyre.jpg';

const Boxes = () => {
    const navigate = useNavigate();

    const boxes = [
        {
            img: helmet,
            text: 'Helmets',
            route: '/items/Bike Accessories/Helmets'
        },
        {
            img: gloves,
            text: 'Gloves',
            route: '/items/Bike Accessories/Gloves' 
        },
        {
            img: headlight,
            text: 'Headlights',
            route: '/items/Bike Accessories/Lights' 
        },
        {
            img: shock,
            text: 'Shock Absorbers',
            route: '/items/Bike Accessories/Shock Absorbers' 
        },
        {
            img: tyre,
            text: 'Tyres',
            route: '/items/Bike Accessories/Tyres'
        }
    ];

    const handleBoxClick = (route) => {
        navigate(route);
    };

    return (
        <div className="box-container">
            {boxes.map((box, index) => (
                <div
                    key={index}
                    className={`box box-${index + 1}`}
                    style={{ backgroundImage: `url(${box.img})` }}
                    data-text={box.text}
                    onClick={() => handleBoxClick(box.route)}
                >
                </div>
            ))}
        </div>
    );
};

export default Boxes;
