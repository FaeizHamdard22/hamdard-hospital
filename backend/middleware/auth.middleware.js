import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const authenticate = async (req, res, next) => {
    try {
        // Get token from cookies or Authorization header
        const token = req.cookies.token || 
                     req.headers.authorization?.replace('Bearer ', '') ||
                     req.headers['x-access-token'];
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                error: 'Access denied. No authentication token provided.' 
            });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user still exists
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ 
                success: false,
                error: 'User no longer exists.' 
            });
        }
        
        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ 
                success: false,
                error: 'Account is deactivated.' 
            });
        }
        
        // Attach user to request
        req.user = {
            id: user._id,
            role: user.role,
            username: user.username,
            email: user.email
        };
        
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                error: 'Invalid token.' 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                error: 'Token has expired.' 
            });
        }
        
        res.status(500).json({ 
            success: false,
            error: 'Authentication failed.' 
        });
    }
};

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false,
                error: 'Authentication required.' 
            });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                error: `Access denied. Required roles: ${allowedRoles.join(', ')}` 
            });
        }
        
        next();
    };
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false,
            error: 'Access denied. Admin privileges required.' 
        });
    }
    next();
};

// Middleware to check if user is doctor or admin
export const isDoctorOrAdmin = (req, res, next) => {
    if (!['doctor', 'admin'].includes(req.user.role)) {
        return res.status(403).json({ 
            success: false,
            error: 'Access denied. Doctor or Admin privileges required.' 
        });
    }
    next();
};