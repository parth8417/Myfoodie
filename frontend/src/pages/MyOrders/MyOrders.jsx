import React, { useContext, useEffect, useState } from 'react'
import { 
  MdRestaurant, 
  MdDeliveryDining, 
  MdCheckCircle,
  MdPhone,
  MdMessage,
  MdLocationOn,
  MdAccessTime,
  MdStar,
  MdStarBorder,
  MdDirections,
  MdInfo,
  MdShoppingBag,
  MdError, // Add for error display
  MdOutlineLocalDining, // Add for empty orders display
  MdOutlineNoFood // Alternative icon for empty state
} from 'react-icons/md';
import './MyOrders.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate

const MyOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [imageError, setImageError] = useState(false); // Add state to track image loading errors
  const { url, token, currency } = useContext(StoreContext);
  const navigate = useNavigate(); // Add this hook

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(url+"/api/order/userorders", {}, { headers: { token } });
      setData(response.data.data.reverse());
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = React.useMemo(() => {
    let result = [...data];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(order => 
        order.status.toLowerCase().replace(/\s+/g, '-') === filterStatus
      );
    }

    // Apply sorting
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'amount') {
      result.sort((a, b) => b.amount - a.amount);
    }

    return result;
  }, [data, filterStatus, sortBy]);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
    
    // Set up refresh interval (every 2 minutes)
    const intervalId = setInterval(() => {
      if (token && trackingOrder) {
        fetchOrders();
      }
    }, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [token]);

  const getStatusSteps = (status) => {
    const steps = [
      { 
        label: 'Food Processing',
        icon: <MdRestaurant size={24} />,
        description: 'Your order is being prepared',
        estimate: '15-20 mins'
      },
      { 
        label: 'Out for delivery',
        icon: <MdDeliveryDining size={24} />,
        description: 'Your order is on the way',
        estimate: '20-30 mins'
      },
      { 
        label: 'Delivered',
        icon: <MdCheckCircle size={24} />,
        description: 'Order completed',
        estimate: null
      }
    ];
    const currentIndex = steps.findIndex(step => step.label === status);
    return { steps, currentIndex };
  };

  const handleTrackOrder = (orderId) => {
    if (trackingOrder === orderId) {
      setTrackingOrder(null); // Close tracking view
    } else {
      setTrackingOrder(orderId); // Open tracking view
      fetchOrders(); // Refresh order status
    }
  };

  // Improved format date function with direct string parsing fallback
  const formatOrderDate = (dateStr) => {
    try {
      // Try direct string approach first for consistent display
      if (dateStr && typeof dateStr === 'string') {
        // Parse the ISO date string
        const date = new Date(dateStr);
        
        // Check if date is valid by checking if it's not NaN
        if (!isNaN(date.getTime())) {
          // Format to show date in a nice readable format
          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
      }
      
      // If we can't parse the date, just show the raw value or a fallback
      return dateStr || 'Date unavailable';
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Date unavailable';
    }
  };

  // Improved format time function with direct string parsing fallback
  const formatOrderTime = (dateStr) => {
    try {
      // Try direct string approach first for consistent display
      if (dateStr && typeof dateStr === 'string') {
        // Parse the ISO date string
        const date = new Date(dateStr);
        
        // Check if date is valid by checking if it's not NaN
        if (!isNaN(date.getTime())) {
          // Format to show just the time portion
          return date.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      }
      
      // If we can't parse the time, just show a fallback
      return 'Time unavailable';
    } catch (error) {
      console.error("Error formatting time:", error);
      return 'Time unavailable';
    }
  };

  // Add a function to handle image errors
  const handleImageError = () => {
    console.log("Image failed to load, using fallback");
    setImageError(true);
  };

  // Add this function to handle menu navigation
  const handleBrowseMenu = () => {
    navigate('/');
    setTimeout(() => {
      const menuSection = document.getElementById('explore-menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300); // Small delay to ensure navigation completes
  };

  if (loading) {
    return (
      <div className="my-orders loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-orders error">
        <div className="error-icon">
          <MdError size={80} color="#ff6b6b" />
        </div>
        <h3>Oops! Something went wrong</h3>
        <p>{error}</p>
        <button onClick={fetchOrders} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className='my-orders'>
      <div className="my-orders-header">
        <div className="header-content">
          <h2>My Orders</h2>
          <p className="order-count">
            <span>{filteredOrders.length}</span> Orders
          </p>
        </div>
        
        <div className="header-filters">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Orders</option>
            <option value="food-processing">Processing</option>
            <option value="out-for-delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
          </select>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-filter"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
      </div>

      <div className="orders-container">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => {
            const { steps, currentIndex } = getStatusSteps(order.status);
            const isTracking = trackingOrder === order._id;
            
            // Use our new formatting functions directly inline
            const orderDate = formatOrderDate(order.createdAt);
            const orderTime = formatOrderTime(order.createdAt);
            
            return (
              <div 
                key={index} 
                className={`order-card ${isTracking ? 'tracking' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="order-top">
                  <div className="order-icon">
                    <img src={assets.parcel_icon} alt="Order" />
                  </div>
                  <div className="order-info">
                    <div className="order-id">
                      Order #<span>{order._id.slice(-6)}</span>
                    </div>
                    <div className="order-meta">
                      <span className="order-date">
                        {orderDate}
                      </span>
                      <span className="order-time">
                        {orderTime}
                      </span>
                    </div>
                  </div>
                  <div className={`order-status ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {order.status}
                  </div>
                </div>

                {isTracking && (
                  <div className="order-tracking-container">
                    <div className="order-progress">
                      {steps.map((step, idx) => (
                        <div 
                          key={idx} 
                          className={`progress-step ${idx <= currentIndex ? 'active' : ''}`}
                          style={{ animationDelay: `${idx * 0.15}s` }}
                        >
                          <div className="step-icon">
                            {step.icon}
                          </div>
                          <div className="step-info">
                            <span className="step-label">{step.label}</span>
                            <span className="step-description">{step.description}</span>
                            {step.estimate && (
                              <span className="step-estimate">
                                <MdAccessTime size={16} />
                                Est. {step.estimate}
                              </span>
                            )}
                          </div>
                          {idx < steps.length - 1 && <div className="step-line"></div>}
                        </div>
                      ))}
                    </div>
                    
                    {order.status === 'Out for delivery' && order.deliveryAgent && (
                      <div className="delivery-agent-info">
                        <div className="agent-section">
                          <div className="agent-header">
                            <div className="agent-avatar">
                              <img src={assets.driver_icon} alt="Delivery Agent" />
                              <span className="agent-status online"></span>
                            </div>
                            <div className="agent-details">
                              <div className="agent-name-badge">
                                <h4>{order.deliveryAgent.name}</h4>
                                <div className="agent-rating">
                                  {[...Array(5)].map((_, i) => (
                                    i < Math.floor(order.deliveryAgent.rating) 
                                      ? <MdStar key={i} className="star-filled" />
                                      : <MdStarBorder key={i} className="star-empty" />
                                  ))}
                                  <span className="rating-value">{order.deliveryAgent.rating}</span>
                                </div>
                              </div>
                              <div className="delivery-stats">
                                <span className="delivery-count">
                                  <MdDeliveryDining size={16} />
                                  {order.deliveryAgent.deliveries}+ deliveries
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="delivery-eta">
                            <div className="eta-info">
                              <MdAccessTime size={20} className="eta-icon" />
                              <div>
                                <p className="eta-label">Estimated Arrival</p>
                                <p className="eta-time">12:45 PM (10 mins)</p>
                              </div>
                            </div>
                            <div className="location-status">
                              <MdLocationOn size={20} className="location-icon" />
                              <span>2.5 km away</span>
                            </div>
                          </div>
                        </div>

                        <div className="contact-actions">
                          <button className="contact-btn call">
                            <MdPhone size={20} />
                            Call Driver
                          </button>
                          <button className="contact-btn chat">
                            <MdMessage size={20} />
                            Send Message
                          </button>
                          <button className="contact-btn track">
                            <MdDirections size={20} />
                            Live Track
                          </button>
                        </div>

                        <div className="delivery-instructions">
                          <MdInfo size={20} />
                          <p>Delivery instructions will be shared with your delivery partner</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">×{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="order-bottom">
                  <div className="order-details">
                    <div className="detail-group">
                      <span className="label">Items</span>
                      <span className="value">{order.items.length}</span>
                    </div>
                    <div className="detail-group">
                      <span className="label">Total Amount</span>
                      <span className="value amount">{currency}{order.amount}</span>
                    </div>
                  </div>
                  <button 
                    className={`track-button ${isTracking ? 'active' : ''}`} 
                    onClick={() => handleTrackOrder(order._id)}
                  >
                    {isTracking ? 'Hide Tracking' : 'Track Order'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-orders">
            <div className="empty-state-icon">
              <MdOutlineNoFood size={100} color="#aaa" />
            </div>
            <div className="empty-state-content">
              <h3>{filterStatus === 'all' ? 'No Orders Found' : 'No Orders in This Category'}</h3>
              <p>
                {filterStatus === 'all' 
                  ? "Looks like you haven't placed any orders yet." 
                  : `You don't have any ${filterStatus.replace(/-/g, ' ')} orders.`}
              </p>
              <div className="empty-state-actions">
                {/* Replace the Link with a button */}
                <button 
                  onClick={handleBrowseMenu}
                  className="browse-menu-btn"
                >
                  Browse Our Menu
                </button>
                {filterStatus !== 'all' && (
                  <button 
                    onClick={() => setFilterStatus('all')} 
                    className="view-all-btn"
                  >
                    View All Orders
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;