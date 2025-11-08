import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { FaPhone, FaEnvelope } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="Myfoodie" className="footer-logo" />
          <p className="footer-description">
            Fresh meals, fast delivery, and support on standby so a great bite is always within reach.
          </p>
          <div className="footer-social-icons">
            <a href="#" aria-label="Facebook">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a href="#" aria-label="Twitter">
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
          </div>
        </div>
        <div className="footer-columns">
          <div className="footer-block">
            <h2 className="footer-heading">Company</h2>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Delivery</a></li>
              <li><a href="#">Privacy</a></li>
            </ul>
          </div>
          <div className="footer-block">
            <h2 className="footer-heading">Get in touch</h2>
            <ul className="footer-contact">
              <li><FaPhone className="contact-icon" /> +1-212-456-7890</li>
              <li><FaEnvelope className="contact-icon" /> support@myfoodie.com</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-divider"></div>
      <p className="footer-copy">© {new Date().getFullYear()} Myfoodie. All rights reserved.</p>
    </footer>
  )
}

export default Footer