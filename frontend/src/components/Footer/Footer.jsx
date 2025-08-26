import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { FaPhone, FaEnvelope } from 'react-icons/fa'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img src={assets.logo} alt="Logo" className="footer-logo" />
            <p className="footer-description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
            <div className="footer-social-icons">
                <a href="#"><img src={assets.facebook_icon} alt="Facebook" /></a>
                <a href="#"><img src={assets.twitter_icon} alt="Twitter" /></a>
                <a href="#"><img src={assets.linkedin_icon} alt="LinkedIn" /></a>
            </div>
        </div>
        <div className="footer-content-center">
            <h2 className="footer-heading">COMPANY</h2>
            <ul className="footer-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">About us</a></li>
                <li><a href="#">Delivery</a></li>
                <li><a href="#">Privacy policy</a></li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2 className="footer-heading">GET IN TOUCH</h2>
            <ul className="footer-contact">
                <li><FaPhone className="contact-icon" /> +1-212-456-7890</li>
                <li><FaEnvelope className="contact-icon" /> contact@Myfoodie.com</li>
            </ul>
        </div>
      </div>
      <div className="footer-divider"></div>
      <p className="footer-copyright">Copyright 2024 © Myfoodie.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer