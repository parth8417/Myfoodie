import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      <div className="nav-right">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
        <img className='profile' src={assets.profile_image} alt="" />
      </div>
    </div>
  )
}

export default Navbar
