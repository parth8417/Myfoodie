import React, { useContext, useState, useEffect } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Cart = () => {
  const {cartItems, food_list, removeFromCart,getTotalCartAmount,url,currency,deliveryCharge,addToCart,setCartItems,token,loadCartData} = useContext(StoreContext);
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState({ message: '', type: '' });
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [savedItems, setSavedItems] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [removingItems, setRemovingItems] = useState(new Set());
  const [addingItem, setAddingItem] = useState(null);

  // Check if cart is empty
  const isCartEmpty = food_list.every(item => !cartItems[item._id] || cartItems[item._id] <= 0);

  // Remove item completely from cart (set quantity to zero in backend)
  const removeItemCompletely = async (itemId) => {
    setRemovingItems(prev => new Set([...prev, itemId]));
    try {
      if (token) {
        // Remove until quantity is zero
        while (cartItems[itemId] > 0) {
          await removeFromCart(itemId);
        }
        await loadCartData({ token });
      } else {
        // For guest/local cart
        const updatedCartItems = { ...cartItems };
        delete updatedCartItems[itemId];
        setCartItems(updatedCartItems);
      }
    } finally {
      setRemovingItems(prev => {
        const next = new Set([...prev]);
        next.delete(itemId);
        return next;
      });
    }
  };

  const [appliedPromo, setAppliedPromo] = useState(null);

  const handlePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoStatus({ message: 'Please enter a promo code', type: 'error' });
      return;
    }

    setIsApplyingPromo(true);
    try {
      const response = await fetch(`${url}/api/promocode/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: promoCode.trim(),
          orderAmount: getTotalCartAmount() 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setAppliedPromo(data.promoCode);
        setPromoStatus({ 
          message: `${data.promoCode.description || 'Promo code applied successfully!'}`, 
          type: 'success' 
        });
      } else {
        setPromoStatus({ 
          message: data.message || 'Invalid promo code', 
          type: 'error' 
        });
        setAppliedPromo(null);
      }
    } catch (error) {
      console.error('Error validating promo code:', error);
      setPromoStatus({ 
        message: 'Error applying promo code', 
        type: 'error' 
      });
      setAppliedPromo(null);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const moveToSavedForLater = (itemId) => {
    setSavedItems(prev => ({
      ...prev,
      [itemId]: cartItems[itemId]
    }));
    removeItemCompletely(itemId);
  };

  const moveToCart = (itemId) => {
    addToCart(itemId);
    const updatedSavedItems = { ...savedItems };
    delete updatedSavedItems[itemId];
    setSavedItems(updatedSavedItems);
  };

  const handleAddToCart = async (itemId) => {
    setAddingItem(itemId);
    try {
      await addToCart(itemId);
      const button = document.querySelector(`[data-item-id="${itemId}"]`);
      button?.classList.add('add-to-cart-success');
      setTimeout(() => {
        button?.classList.remove('add-to-cart-success');
      }, 400);
    } catch (error) {
      toast.error('Failed to add item');
    } finally {
      setAddingItem(null);
    }
  };

  return (
    <div className='cart'>
      <div className="cart-header">
        <h1 className="cart-heading">Your Cart</h1>
        <p className="cart-desc">
          {isCartEmpty 
            ? "Your cart is waiting to be filled with delicious items!"
            : `You have ${Object.keys(cartItems).length} items in your cart`
          }
        </p>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {isCartEmpty ? (
            <div className="cart-empty-state">
              <img src={assets.empty_cart} alt="" className="empty-cart-image" />
              <h2>Your cart is empty</h2>
              <p>Browse our menu and discover our best dishes!</p>
              <button onClick={() => navigate('/')} className="browse-menu-btn">
                Start Ordering
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items-header">
                <span>Item</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span></span>
              </div>
              {food_list.map((item, index) => {
                if (cartItems[item._id] > 0) {
                  const isRemoving = removingItems.has(item._id);
                  return (
                    <div 
                      key={item._id} 
                      className={`cart-item ${isRemoving ? 'removing' : ''}`}
                    >
                      <div className="cart-item-info">
                        <img src={url+"/images/"+item.image} alt={item.name} />
                        <div>
                          <h3>{item.name}</h3>
                          <p className="item-desc">{item.description}</p>
                        </div>
                      </div>
                      <div className="cart-item-price">
                        {currency}{item.price}
                      </div>
                      <div className="cart-qty-control">
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          disabled={addingItem === item._id || cartItems[item._id] <= 1}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span>{cartItems[item._id] || 0}</span>
                        <button 
                          onClick={() => handleAddToCart(item._id)}
                          disabled={addingItem === item._id}
                          data-item-id={item._id}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <div className="cart-item-total">
                        {currency}{item.price * cartItems[item._id]}
                      </div>
                      <button
                        className="remove-item-btn"
                        onClick={() => removeItemCompletely(item._id)}
                        disabled={isRemoving}
                      >
                        {isRemoving ? '...' : '×'}
                      </button>
                    </div>
                  );
                }
                return null;
              })}
            </>
          )}
        </div>

        <div className="cart-sidebar">
          <div className="cart-total">
            <h2>Order Summary</h2>
            <div className="cart-total-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{currency}{getTotalCartAmount()}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>{currency}{getTotalCartAmount() === 0 ? 0 : deliveryCharge}</span>
              </div>
              {promoStatus.type === 'success' && appliedPromo && (
                <div className="summary-row discount">
                  <span>Discount {appliedPromo.isPercentage ? `(${appliedPromo.discount}%)` : ''}</span>
                  <span>-{currency}{appliedPromo.discountAmount}</span>
                </div>
              )}
              <div className="summary-row total">
                <strong>Total</strong>
                <strong>
                  {currency}
                  {getTotalCartAmount() === 0 
                    ? 0 
                    : promoStatus.type === 'success' && appliedPromo
                      ? (getTotalCartAmount() - parseFloat(appliedPromo.discountAmount) + deliveryCharge).toFixed(2)
                      : (getTotalCartAmount() + deliveryCharge).toFixed(2)
                  }
                </strong>
              </div>
            </div>

            <div className="promo-code-section">
              <div className="promo-input">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  disabled={isApplyingPromo}
                />
                <button 
                  onClick={handlePromoCode}
                  disabled={isApplyingPromo || !promoCode.trim()}
                >
                  {isApplyingPromo ? 'Applying...' : 'Apply'}
                </button>
              </div>
              {promoStatus.message && (
                <p className={`promo-message ${promoStatus.type}`}>
                  {promoStatus.message}
                </p>
              )}
            </div>

            <button 
              className={`checkout-btn ${isCartEmpty ? 'disabled' : ''}`}
              onClick={() => !isCartEmpty && navigate('/order')}
              disabled={isCartEmpty}
            >
              {isCartEmpty ? 'Add Items to Checkout' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
