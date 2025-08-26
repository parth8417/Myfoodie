import React from 'react'
import './Header.css'

const Header = () => {
    // Scroll to the menu section on button click
    const handleViewMenuClick = () => {
        const menuSection = document.getElementById('explore-menu');
        if (menuSection) {
            menuSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className='header'>
            <div className='header-contents'>
                <h2>Order your favourite food here</h2>
                <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
                <button onClick={handleViewMenuClick}>View Menu</button>
            </div>
        </div>
    )
}

export default Header
