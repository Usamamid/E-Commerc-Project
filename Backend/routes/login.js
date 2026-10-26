const express = require('express');
const userModel = require('../models/userModel');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ownerModel = require('../models/ownerModel');

const isProd = process.env.NODE_ENV === 'production';

const baseCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/'
};

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const loginCookieOptions = { ...baseCookieOptions, maxAge: SEVEN_DAYS };

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const owner = await ownerModel.findOne({ name: email });

        if (owner) {
            const isOwnerMatch = await bcrypt.compare(password, owner.password);
            if (!isOwnerMatch) {
                return res.status(401).json({ message: "Incorrect Owner Password" });
            }

            const token = jwt.sign(
                { id: owner._id, email: owner.name, name: owner.name, role: 'owner' },
                process.env.JWT_SECRET
            );
            res.cookie("token", token, loginCookieOptions);

            return res.status(200).json({
                message: "Owner login successfully",
                role: "owner",
                userId: owner._id,
                user: {
                    _id: owner._id,
                    name: owner.name,
                    email: owner.name
                }
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not registered / User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect Password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name, role: 'user' },
            process.env.JWT_SECRET
        );
        res.cookie("token", token, loginCookieOptions);

        res.status(200).json({
            message: "Login successfully",
            role: "user",
            userId: user._id,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
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

        res.status(200).json({
            isAuthenticated: true,
            role: decoded.role,
            userId: decoded.id,
            user: {
                _id: decoded.id,
                name: decoded.name || "User",
                email: decoded.email
            }
        });
    } catch (err) {
        res.status(401).json({ isAuthenticated: false });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token', baseCookieOptions);
    return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;