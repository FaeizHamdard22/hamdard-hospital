import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Set token cookie
const setTokenCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ 
                error: 'Please provide all required fields' 
            });
        }
        
        // Check if user exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                error: 'User with this email or username already exists' 
            });
        }
        
        // Create new user
        const user = await User.create({
            username,
            email,
            password,
            role: role || 'receptionist'
        });
        
        // Generate token
        const token = generateToken(user._id, user.role);
        setTokenCookie(res, token);
        
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            error: 'Registration failed', 
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validation
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Please provide username/email and password' 
            });
        }
        
        // Find user
        const user = await User.findOne({ 
            $or: [{ email: username }, { username }] 
        });
        
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid credentials' 
            });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                error: 'Invalid credentials' 
            });
        }
        
        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ 
                error: 'Account is deactivated. Please contact administrator.' 
            });
        }
        
        // Generate token
        const token = generateToken(user._id, user.role);
        setTokenCookie(res, token);
        
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        
        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Login failed', 
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.json({ 
            success: true, 
            message: 'Logged out successfully' 
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            error: 'Logout failed' 
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -__v');
            
        if (!user) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }
        
        res.json({ 
            success: true, 
            user 
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch profile' 
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.user.id;
        
        // Check if username or email already taken by another user
        if (username || email) {
            const existingUser = await User.findOne({
                $and: [
                    { _id: { $ne: userId } },
                    { $or: [] }
                ]
            });
            
            if (username) {
                existingUser.$or.push({ username });
            }
            
            if (email) {
                existingUser.$or.push({ email });
            }
            
            if (existingUser.$or.length > 0) {
                const foundUser = await User.findOne(existingUser);
                if (foundUser) {
                    return res.status(400).json({ 
                        error: 'Username or email already taken' 
                    });
                }
            }
        }
        
        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: req.body },
            { 
                new: true,
                runValidators: true 
            }
        ).select('-password -__v');
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            error: 'Failed to update profile' 
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                error: 'Please provide current and new password' 
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                error: 'New password must be at least 6 characters long' 
            });
        }
        
        // Get user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }
        
        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ 
                error: 'Current password is incorrect' 
            });
        }
        
        // Update password
        user.password = newPassword;
        await user.save();
        
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ 
            error: 'Failed to change password' 
        });
    }
};

export const validateToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password -__v');
            
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid token' 
            });
        }
        
        res.json({
            success: true,
            user,
            valid: true
        });
    } catch (error) {
        console.error('Token validation error:', error);
        res.status(401).json({ 
            error: 'Invalid token' 
        });
    }
};