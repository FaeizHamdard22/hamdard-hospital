import express from 'express';
import { 
    register, 
    login, 
    logout, 
    getProfile,
    updateProfile,
    changePassword,
    validateToken
} from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);
router.get('/validate', authenticate, validateToken);

export default router;