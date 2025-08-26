import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(null);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    
    // Check if account is locked from previous session
    const lockedUntil = localStorage.getItem('admin_locked_until');
    if (lockedUntil && new Date(parseInt(lockedUntil)) > new Date()) {
      setIsLocked(true);
      setLockTime(new Date(parseInt(lockedUntil)));
    }
    
    // Check for previous login attempts to show password hint
    const attempts = localStorage.getItem('admin_login_attempts');
    if (attempts && parseInt(attempts) >= 1) {
      setLoginAttempts(parseInt(attempts));
      setShowPasswordHint(true);
    }
  }, [isAuthenticated, navigate]);

  // Timer for locked account
  useEffect(() => {
    let interval;
    if (isLocked && lockTime) {
      interval = setInterval(() => {
        const now = new Date();
        if (lockTime <= now) {
          setIsLocked(false);
          localStorage.removeItem('admin_locked_until');
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      toast.error('Account is temporarily locked. Please try again later.');
      return;
    }

    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    
    try {
      // Add a small delay for security (prevents timing attacks)
      await new Promise(r => setTimeout(r, 500 + Math.random() * 500));
      
      const success = login(username, password);
      
      if (success) {
        toast.success('Login successful!');
        navigate('/');
        // Reset login attempts on success
        setLoginAttempts(0);
        localStorage.removeItem('admin_login_attempts');
      } else {
        // Increment login attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        localStorage.setItem('admin_login_attempts', newAttempts.toString());
        
        // Show password hint after first attempt
        if (newAttempts >= 1) {
          setShowPasswordHint(true);
        }
        
        // Lock account after 5 failed attempts
        if (newAttempts >= 5) {
          const lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
          setIsLocked(true);
          setLockTime(lockUntil);
          localStorage.setItem('admin_locked_until', lockUntil.getTime().toString());
          toast.error('Too many failed attempts. Account locked for 15 minutes.');
        } else {
          toast.error('Invalid username or password');
        }
      }
    } catch (error) {
      toast.error('An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate remaining lock time
  const getRemainingLockTime = () => {
    if (!lockTime) return '';
    const diffMs = lockTime - new Date();
    if (diffMs <= 0) return '';
    
    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-brand">
          <img src={assets.logo} alt="MyFoodie Logo" className="login-logo" />
        </div>
        
        <div className="login-header">
          <h1>Admin Panel</h1>
          <p>Please enter your credentials to access the admin dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading || isLocked}
              autoComplete="username"
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || isLocked}
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>
          
          {showPasswordHint && (
            <div className="password-hint">
              <p>
                <strong>Hint:</strong> Jainam Best Friends Name is Username And Dishant Gf Name Is Password
              </p>
            </div>
          )}
          
          {isLocked && (
            <div className="login-locked-message">
              <p>Account is temporarily locked due to too many failed attempts.</p>
              <p>Try again in: {getRemainingLockTime()}</p>
            </div>
          )}
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading || isLocked}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
