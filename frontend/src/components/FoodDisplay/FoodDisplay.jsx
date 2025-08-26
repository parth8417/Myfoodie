import React, { useContext, useEffect, useState } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../Context/StoreContext'

const FoodDisplay = ({category}) => {

  const {food_list} = useContext(StoreContext);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Listen for search events from Navbar
    const handler = (e) => setSearchQuery(e.detail.trim().toLowerCase());
    window.addEventListener('food-search', handler);
    return () => window.removeEventListener('food-search', handler);
  }, []);

  // Filter food list by category and search query
  const filteredList = food_list.filter(item => {
    const matchesCategory = category === "All" || category === item.category;
    const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      {/* Show Clear Search button only if searchQuery is active */}
      {searchQuery && (
        <button
          className="food-display-clear-btn"
          type="button"
          onClick={e => {
            e.currentTarget.blur(); // Remove focus after click for proper color reset
            setSearchQuery("");
          }}
        >
          Clear Search
        </button>
      )}
      <div className='food-display-list'>
        {filteredList.length === 0 ? (
          <p style={{ gridColumn: '1/-1', color: '#888', fontSize: '1.1em' }}>No food found.</p>
        ) : (
          filteredList.map((item) =>
            <FoodItem key={item._id} image={item.image} name={item.name} desc={item.description} price={item.price} id={item._id}/>
          )
        )}
      </div>
    </div>
  )
}

export default FoodDisplay