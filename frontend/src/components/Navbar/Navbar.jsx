import { useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import PropTypes from 'prop-types';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState('home');
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchInputRef = useRef(null);
  const profileMenuRef = useRef(null);
  const { getTotalCartAmount, token, setToken, cartItems, currency } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();

  const closeProfile = useCallback(() => {
    setProfileOpen(false);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    if (!profileOpen) {
      return;
    }

    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        closeProfile();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closeProfile();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [closeProfile, profileOpen]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken('');
    setShowSearch(false);
    closeProfile();
    closeMobileMenu();
    navigate('/');
  }, [closeMobileMenu, closeProfile, navigate, setToken]);

  const openLoginModal = useCallback(() => {
    setShowLogin(true);
    setShowSearch(false);
    closeProfile();
    closeMobileMenu();
  }, [closeMobileMenu, closeProfile, setShowLogin]);

  const goToOrders = useCallback(() => {
    navigate('/myorders');
    setShowSearch(false);
    closeMobileMenu();
    closeProfile();
  }, [closeMobileMenu, closeProfile, navigate]);

  const handleMenuClick = useCallback((menuName, scrollTarget) => {
    setMenu(menuName);
    setShowSearch(false);
    closeProfile();

    if (menuName === 'home') {
      navigate('/', { replace: true });
      if (scrollTarget === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (scrollTarget) {
      if (location.pathname !== '/') {
        navigate('/', {
          state: { scrollTo: scrollTarget },
          replace: true
        });
      } else {
        if (window.location.hash === scrollTarget) {
          window.location.hash = '';
          setTimeout(() => {
            window.location.hash = scrollTarget;
          }, 50);
        } else {
          window.location.hash = scrollTarget;
        }
      }
    }
  }, [closeProfile, location.pathname, navigate]);

  const handleMenuSelection = useCallback((menuName, scrollTarget) => {
    handleMenuClick(menuName, scrollTarget);
    closeMobileMenu();
  }, [closeMobileMenu, handleMenuClick]);

  useEffect(() => {
    if (showSearch) {
      const handleSearchOutside = (e) => {
        if (
          searchInputRef.current &&
          !searchInputRef.current.parentNode.contains(e.target) &&
          !e.target.closest('.navbar-search-toggle')
        ) {
          setShowSearch(false);
        }
      };

      document.addEventListener('mousedown', handleSearchOutside);
      document.addEventListener('touchstart', handleSearchOutside);

      return () => {
        document.removeEventListener('mousedown', handleSearchOutside);
        document.removeEventListener('touchstart', handleSearchOutside);
      };
    }
  }, [showSearch]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handleOutsideClick = (e) => {
      if (
        !e.target.closest('.navbar-menu-wrapper') &&
        !e.target.closest('.hamburger-menu')
      ) {
        closeMobileMenu();
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [closeMobileMenu, mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const { scrollTo } = location.state;
      setTimeout(() => {
        window.location.hash = scrollTo;
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname === '/') {
      setMenu('home');
    } else if (location.pathname === '/cart' || location.pathname === '/myorders') {
      setMenu('');
    }
  }, [location.pathname]);

  useEffect(() => {
    closeProfile();
  }, [closeProfile, location.pathname]);

  useEffect(() => {
    if (!token) {
      closeProfile();
    }
  }, [closeProfile, token]);

  useEffect(() => {
    closeMobileMenu();
  }, [closeMobileMenu, location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        closeMobileMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [closeMobileMenu]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => {
      const next = !prev;
      if (next) {
        setShowSearch(false);
        closeProfile();
      }
      return next;
    });
  };

  const toggleProfileDropdown = (event) => {
    event.stopPropagation();
    setProfileOpen((prev) => !prev);
    setShowSearch(false);
    closeMobileMenu();
  };

  const uniqueItemsCount = useMemo(() => {
    return Object.values(cartItems).filter((qty) => qty > 0).length;
  }, [cartItems]);

  const cartTotalAmount = useMemo(() => {
    if (!token) {
      return 0;
    }
    return getTotalCartAmount();
  }, [cartItems, getTotalCartAmount, token]);

  const formattedCartTotal = useMemo(() => {
    if (!cartTotalAmount) {
      return '';
    }
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(cartTotalAmount);
    } catch (error) {
      return `${currency}${Number(cartTotalAmount).toFixed(0)}`;
    }
  }, [cartTotalAmount, currency]);

  return (
    <div className='navbar-outer'>
      <div className='navbar-bg-blur'></div>
      {mobileMenuOpen && (
        <button
          type="button"
          className="navbar-backdrop"
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
        />
      )}
      <nav className='navbar'>
        <div className='navbar-container'>
          <div className='navbar-bar'>
            <Link to='/' className="navbar-logo-link">
              <img className='logo' src={assets.logo} alt="Logo" />
            </Link>

            <div className={`navbar-menu-wrapper ${mobileMenuOpen ? 'open' : ''}`}>
              <ul id="mobile-menu" className="navbar-menu">
                <li className={menu === 'home' ? 'active' : ''}>
                  <button type="button" onClick={() => handleMenuSelection('home', 'top')}>
                    Home
                  </button>
                </li>
                <li className={menu === 'menu' ? 'active' : ''}>
                  <button type="button" onClick={() => handleMenuSelection('menu', '#explore-menu')}>
                    Menu
                  </button>
                </li>
                <li className={menu === 'mob-app' ? 'active' : ''}>
                  <button type="button" onClick={() => handleMenuSelection('mob-app', '#app-download')}>
                    Mobile App
                  </button>
                </li>
                <li className={menu === 'contact' ? 'active' : ''}>
                  <button type="button" onClick={() => handleMenuSelection('contact', '#footer')}>
                    Contact Us
                  </button>
                </li>
                {token && (
                  <li className={`navbar-mobile-only ${location.pathname === '/myorders' ? 'active' : ''}`}>
                    <button type="button" onClick={goToOrders}>
                      My Orders
                    </button>
                  </li>
                )}
              </ul>

              <div className="navbar-menu-footer">
                {!token ? (
                  <button
                    type="button"
                    className="navbar-menu-primary"
                    onClick={openLoginModal}
                  >
                    Sign in
                  </button>
                ) : (
                  <div className="navbar-menu-profile">
                    <div className="navbar-menu-profile-info">
                      <div className="navbar-menu-profile-avatar">
                        <img src={assets.profile_icon} alt="Profile avatar" />
                      </div>
                      <div className="navbar-menu-profile-copy">
                        <span className="navbar-menu-profile-label">My Account</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="navbar-menu-primary"
                      onClick={logout}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="navbar-actions">
              <div className="navbar-search-wrapper">
                <button
                  type="button"
                  className="navbar-search-toggle"
                  aria-label={showSearch ? 'Close search' : 'Open search'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSearch((prev) => !prev);
                    closeProfile();
                    closeMobileMenu();
                  }}
                >
                  <img src={assets.search_icon} alt="Search" />
                </button>
                {showSearch && (
                  <div
                    className="navbar-search-bar-down"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <form
                      className="navbar-search-form-down"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const event = new CustomEvent('food-search', { detail: search });
                        window.dispatchEvent(event);
                        setSearch('');
                        setShowSearch(false);

                        if (location.pathname !== '/') {
                          navigate('/', { replace: true });
                          setTimeout(() => {
                            window.location.hash = '#explore-menu';
                          }, 350);
                        } else {
                          if (window.location.hash === '#explore-menu') {
                            window.location.hash = '';
                            setTimeout(() => {
                              window.location.hash = '#explore-menu';
                            }, 50);
                          } else {
                            window.location.hash = '#explore-menu';
                          }
                        }
                      }}
                    >
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search food..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="navbar-search-input-down"
                        aria-label="Search for food items"
                      />
                      <button
                        type="submit"
                        className="navbar-search-submit-down"
                        aria-label="Run search"
                        tabIndex={0}
                      >
                        <img src={assets.search_icon} alt="search" />
                      </button>
                    </form>
                  </div>
                )}
              </div>

              <Link
                to='/cart'
                className='navbar-search-icon'
                aria-label={uniqueItemsCount > 0 ? `Cart with ${uniqueItemsCount} items` : 'Cart'}
                onClick={closeMobileMenu}
              >
                <img src={assets.basket_icon} alt="Cart" />
                {uniqueItemsCount > 0 && <div className="cart-badge">{uniqueItemsCount}</div>}
              </Link>

              {!token ? (
                <button
                  type="button"
                  className="navbar-auth-btn"
                  onClick={openLoginModal}
                >
                  Sign in
                </button>
              ) : (
                <div
                  className={`profile-button ${profileOpen ? 'open' : ''}`}
                  ref={profileMenuRef}
                >
                  <button
                    type="button"
                    className="profile-icon"
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                    aria-controls="profile-menu"
                    onClick={toggleProfileDropdown}
                  >
                    <span className="profile-status-dot" aria-hidden="true"></span>
                    <img src={assets.profile_icon} alt="Profile" />
                  </button>
                  <div
                    id="profile-menu"
                    className="profile-dropdown"
                    data-open={profileOpen}
                    role="menu"
                  >
                    <div className="profile-section">
                      <div className="profile-avatar">
                        <img src={assets.profile_icon} alt="Profile avatar" />
                      </div>
                      <div className="profile-copy">
                        <p className="profile-name">My Account</p>
                        <p className="profile-meta">
                          {uniqueItemsCount > 0
                            ? `${uniqueItemsCount} ${uniqueItemsCount === 1 ? 'item' : 'items'} in cart`
                            : 'Ready for your next order?'}
                        </p>
                      </div>
                    </div>

                    {(uniqueItemsCount > 0 || formattedCartTotal) && (
                      <div className="profile-overview" role="presentation">
                        <div className="profile-overview-item">
                          <span className="profile-overview-label">Items in cart</span>
                          <span className="profile-overview-value">{uniqueItemsCount}</span>
                        </div>
                        {formattedCartTotal && (
                          <div className="profile-overview-item">
                            <span className="profile-overview-label">Cart total</span>
                            <span className="profile-overview-value">{formattedCartTotal}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="profile-divider" role="separator" />

                    <div className="profile-dropdown-actions" role="presentation">
                      <button
                        type="button"
                        className="profile-dropdown-item"
                        onClick={goToOrders}
                        role="menuitem"
                      >
                        <div className="item-icon">
                          <img src={assets.bag_icon} alt="" />
                        </div>
                        <div className="profile-item-copy">
                          <span className="profile-item-title">My Orders</span>
                          <span className="profile-item-subtitle">Track &amp; reorder favourites</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        className="profile-dropdown-item profile-dropdown-danger"
                        onClick={logout}
                        role="menuitem"
                      >
                        <div className="item-icon">
                          <img src={assets.logout_icon} alt="" />
                        </div>
                        <div className="profile-item-copy">
                          <span className="profile-item-title">Sign Out</span>
                          <span className="profile-item-subtitle">We&apos;ll keep your cart safe</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <button
                className="hamburger-menu"
                type="button"
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
                <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
                <span className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

Navbar.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default Navbar;
