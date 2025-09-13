import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Protect routes - require user to be authenticated
export const protect = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.status(401).json({success:false, message:'Not authorized, no token'});
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id;
        
        // Add user data to request object
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        return res.status(401).json({success:false, message:'Not authorized, token failed'});
    }
};

// Admin middleware - check if user is admin
export const adminMiddleware = async (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({success:false, message:'Not authorized as an admin'});
    }
};

// For backward compatibility
const authMiddleware = protect;

export default authMiddleware;