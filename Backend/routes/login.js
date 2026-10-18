const express = require('express');
const userModel = require('../models/userModel');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ownerModel = require('../models/ownerModel');

router.post('/', async (req, res) => {
    try {
        let { email, password } = req.body;

        // 1. Pehle Owner check karo
        let owner = await ownerModel.findOne({ $or: [{ email: email }, { name: email }] });
        
        if (owner) {
            if (owner.password === password) {
                const token = jwt.sign({ id: owner._id, email: owner.email || owner.name, name: owner.name || "Owner", role: 'owner' }, process.env.JWT_SECRET);
                res.cookie("token", token, { httpOnly: true });
                return res.status(200).json({ 
                    message: "Owner login successfully", 
                    role: "owner",
                    user: { name: owner.name || "Owner", email: owner.email || owner.name }
                });
            } else {
                return res.status(401).json({ message: "Incorrect Owner Password" });
            }
        }

        // 2. Agar owner nahi mila, toh Normal User check karo
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not registered / User not found" });
        }

        // 3. User Password Compare
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect Password" });
        }

        // 4. User Token & Cookie
        const token = jwt.sign({ id: user._id, email: user.email, name: user.name, role: 'user' }, process.env.JWT_SECRET);
        res.cookie("token", token, { httpOnly: true });

        res.status(200).json({ 
            message: "Login successfully", 
            role: "user", 
            user: { name: user.name, email: user.email } 
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/checkAuth', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ isAuthenticated: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Token se data nikal kar sahi format mein bhej rahe hain
        res.status(200).json({ 
            isAuthenticated: true, 
            role: decoded.role,
            user: {
                name: decoded.name || "User",
                email: decoded.email
            } 
        });
    } catch (err) {
        res.status(401).json({ isAuthenticated: false });
    }
});

// Logout Route (Cookie ko clear karega)
router.get('/logout', (req, res) => {
    // Cookie ko clear karne ke liye exact wahi options dein
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax', // Agar cross-origin hai toh adjust karein
        path: '/'
    });
    return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;