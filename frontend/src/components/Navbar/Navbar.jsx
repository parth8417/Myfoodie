import { useContext, useState, useRef, useEffect, useCallback } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import PropTypes from 'prop-types';

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const { getTotalCartAmount, token, setToken, cartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  // Focus input when shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const event = new CustomEvent('food-search', { detail: search });
    window.dispatchEvent(event);
    setSearch(""); // auto clear after search
    setShowSearch(false);
  };

  // Close search on outside click or when clicking any navbar option
  useEffect(() => {
    if (!showSearch) return;
    const handler = (e) => {
      // If click is outside the search bar and not on the search button
      if (
        searchInputRef.current &&
        !searchInputRef.current.parentNode.contains(e.target) &&
        !e.target.closest('.navbar-search-toggle')
      ) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showSearch]);

  // Also close search when clicking any navbar menu option
  const handleMenuClick = useCallback((menuName, scrollTarget) => {
    setMenu(menuName);
    setShowSearch(false);

    // Always navigate to home first when clicking home
    if (menuName === "home") {
      navigate('/', { replace: true });
      if (scrollTarget === "top") {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // For other menu items
    if (scrollTarget) {
      if (window.location.pathname !== '/') {
        navigate('/', { 
          state: { scrollTo: scrollTarget },
          replace: true 
        });
      } else {
        // Remove hash first to force scroll even if already on hash
        window.location.hash = '';
        setTimeout(() => {
          window.location.hash = scrollTarget;
        }, 50);
      }
    }
  }, [navigate]);

  // Handle scroll after navigation
  useEffect(() => {
    if (window.location.state?.scrollTo) {
      const scrollTarget = window.location.state.scrollTo;
      setTimeout(() => {
        window.location.hash = scrollTarget;
        // Clear the state to prevent re-scrolling
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, []);

  // Update active menu based on current route
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') setMenu('home');
    else if (path === '/cart') setMenu('');
    else if (path === '/myorders') setMenu('');
  }, [window.location.pathname]);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!mobileMenuOpen) return;
    
    const handleOutsideClick = (e) => {
      // Check if click is outside the menu and not on hamburger button
      if (!e.target.closest('.navbar-menu') && 
          !e.target.closest('.hamburger-menu')) {
        setMobileMenuOpen(false);
      }
    };
    
    // Add both mousedown and touchstart for better mobile experience
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    
    // Handle Escape key press to close menu
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [mobileMenuOpen]);

  // Add this function to count total items
  const getUniqueItemsCount = () => {
    return Object.values(cartItems).filter(qty => qty > 0).length;
  };

  // Close mobile menu when clicking a menu item
  const handleMobileMenuClick = (menuName, scrollTarget) => {
    handleMenuClick(menuName, scrollTarget);
    setMobileMenuOpen(false);
    // Also close search if it's open
    if (showSearch) {
      setShowSearch(false);
    }
  };

  return (
    <div className='navbar-outer'>
      <div className='navbar-bg-blur'></div>
      <nav className='navbar'>
        <div className='navbar-container'>
          <div className="navbar-mobile-header">
            <Link to='/'><img className='logo' src={assets.logo} alt="Logo" /></Link>
            <button 
              className="hamburger-menu" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
              <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
            </button>
          </div>
          <ul id="mobile-menu" className={`navbar-menu ${mobileMenuOpen ? 'mobile-menu-active' : ''}`}>
            <li
              className={`${menu === "home" ? "active" : ""}`}
              onClick={() => handleMobileMenuClick("home", "top")}
            >
              <span>Home</span>
            </li>
            <li
              className={`${menu === "menu" ? "active" : ""}`}
              onClick={() => handleMobileMenuClick("menu", "#explore-menu")}
            >
              <a href="#explore-menu">Menu</a>
            </li>
            <li
              className={`${menu === "mob-app" ? "active" : ""}`}
              onClick={() => handleMobileMenuClick("mob-app", "#app-download")}
            >
              <a href="#app-download">Mobile App</a>
            </li>
            <li
              className={`${menu === "contact" ? "active" : ""}`}
              onClick={() => handleMobileMenuClick("contact", "#footer")}
            >
              <a href="#footer">Contact Us</a>
            </li>
            {mobileMenuOpen && (
              <li className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
                <span>Close Menu</span>
              </li>
            )}
          </ul>
          <div className="navbar-right">
            <div className="navbar-search-wrapper">
              {/* Search Button */}
              <button
                type="button"
                className="navbar-search-toggle"
                aria-label="Open search"
                onClick={e => {
                  e.stopPropagation();
                  setShowSearch(true);
                }}
              >
                <img src={assets.search_icon} alt="search" />
              </button>
              {showSearch && (
                <div className="navbar-search-bar-down" onClick={e => e.stopPropagation()}>
                  <form
                    className="navbar-search-form-down"
                    onSubmit={e => {
                      e.preventDefault();
                      const event = new CustomEvent('food-search', { detail: search });
                      window.dispatchEvent(event);
                      setSearch("");
                      setShowSearch(false);

                      // Always navigate to "/" and set hash after navigation
                      if (window.location.pathname !== "/") {
                        navigate("/", { replace: true });
                        // Use a longer timeout to ensure navigation completes before setting hash
                        setTimeout(() => {
                          window.location.hash = "#explore-menu";
                        }, 350);
                      } else {
                        // Remove hash first to force scroll even if already on hash
                        if (window.location.hash === "#explore-menu") {
                          window.location.hash = "";
                          setTimeout(() => {
                            window.location.hash = "#explore-menu";
                          }, 50);
                        } else {
                          window.location.hash = "#explore-menu";
                        }
                      }
                    }}
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search food..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="navbar-search-input-down"
                      aria-label="Search for food items"
                    />
                    <button
                      type="submit"
                      className="navbar-search-submit-down"
                      aria-label="Search"
                      tabIndex={0}
                    >
                      <img src={assets.search_icon} alt="search" />
                    </button>
                  </form>
                </div>
              )}
            </div>
            <Link to='/cart' className='navbar-search-icon'>
              <img src={assets.basket_icon} alt="Cart" />
              {getUniqueItemsCount() > 0 && <div className="cart-badge">{getUniqueItemsCount()}</div>}
            </Link>
            {!token ? <button onClick={() => { setShowLogin(true); setShowSearch(false); }}>sign in</button>
              : <div className="profile-button">
                  <div className="profile-icon">
                    <img src={assets.profile_icon} alt="Profile" />
                  </div>
                  <div className="profile-dropdown">
                    <div className="profile-header">
                      <img src={assets.profile_icon} alt="" />
                      <span>My Account</span>
                    </div>
                    <hr />
                    <div className="profile-dropdown-item" onClick={() => { navigate('/myorders'); setShowSearch(false); }}>
                      <div className="item-icon">
                        <img src={assets.bag_icon} alt="" />
                      </div>
                      <span>My Orders</span>
                    </div>
                    <hr />
                    <div className="profile-dropdown-item" onClick={() => { logout(); setShowSearch(false); }}>
                      <div className="item-icon">
                        <img src={assets.logout_icon} alt="" />
                      </div>
                      <span>Sign Out</span>
                    </div>
                  </div>
                </div>
            }
          </div>
        </div>
      </nav>
    </div>
  )
}

Navbar.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default Navbar
