/**
 * Responsive behavior utilities for MyFoodie website
 */
import { useState, useEffect } from 'react';

// Detect touch device
export const isTouchDevice = () => {
  return ('ontouchstart' in window) || 
    (navigator.maxTouchPoints > 0) || 
    (navigator.msMaxTouchPoints > 0);
};

// Add touch device class to body for CSS targeting
export const initTouchDetection = () => {
  if (isTouchDevice()) {
    document.body.classList.add('touch-device');
  } else {
    document.body.classList.add('no-touch');
  }
};

// Handle viewport height for mobile browsers (solving the "100vh" issue)
export const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Debounce function for performance optimization
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Initialize responsive behaviors
export const initResponsiveBehaviors = () => {
  // Set initial viewport height
  setViewportHeight();
  
  // Update on resize
  window.addEventListener('resize', debounce(setViewportHeight, 150));
  
  // Initialize touch detection
  initTouchDetection();
};

// Handle responsive images (lazy loading)
export const initResponsiveImages = () => {
  if ('loading' in HTMLImageElement.prototype) {
    // Use native lazy loading if available
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support native lazy loading
    const lazyImageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });
    
    const lazyImages = document.querySelectorAll('.lazy-image');
    lazyImages.forEach(image => {
      lazyImageObserver.observe(image);
    });
  }
};

// Detect screen size changes for conditional rendering in React components
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 992,
    isDesktop: window.innerWidth >= 992
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      setScreenSize({
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 992,
        isDesktop: window.innerWidth >= 992
      });
    }, 250);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

export default {
  initResponsiveBehaviors,
  initResponsiveImages,
  useScreenSize,
  isTouchDevice
};
