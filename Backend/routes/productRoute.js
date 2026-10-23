const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const router = express.Router();
const productModel = require('../models/productModel');
const upload = require('../config/multer-config');

const ownerOnly = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'owner') {
            return res.status(403).json({ success: false, message: "Owner access only" });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

router.post('/create', ownerOnly, upload.single('image'), async (req, res) => {
    try {
        const { name, price, stock } = req.body;
        const numericPrice = Number(price);

        if (!name || price === undefined || price === '' || !Number.isFinite(numericPrice) || numericPrice < 0) {
            return res.status(400).json({ message: "Valid name and price are required" });
        }

        const existingProduct = await productModel.findOne({ name });
        if (existingProduct) {
            return res.status(409).json({ message: "Product already exists" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Product image is required" });
        }

        const createdProduct = await productModel.create({
            image: req.file.buffer,
            name,
            price: numericPrice,
            stock: stock ? Number(stock) : 0
        });

        res.status(201).json({
            message: "Product created successfully",
            product: createdProduct
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const products = await productModel.find();

        const formattedProducts = products.map(product => {
            return {
                _id: product._id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                image: product.image ? `data:image/jpeg;base64,${Buffer.from(product.image).toString('base64')}` : null
            };
        });

        res.status(200).json(formattedProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.patch('/update-stock/:id', ownerOnly, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid product id" });
        }

        const { addStock, price } = req.body;
        const update = {};

        if (addStock !== undefined && addStock !== '') {
            const qty = Number(addStock);
            if (!Number.isInteger(qty) || qty <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid stock quantity to add."
                });
            }
            update.$inc = { stock: qty };
        }

        if (price !== undefined && price !== '') {
            const newPrice = Number(price);
            if (!Number.isFinite(newPrice) || newPrice < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid price."
                });
            }
            update.$set = { price: newPrice };
        }

        if (!update.$inc && !update.$set) {
            return res.status(400).json({
                success: false,
                message: "Provide a stock quantity to add or a new price."
            });
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true, runValidators: true }
        ).select('-image');

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: `Product successfully updated for ${updatedProduct.name}!`,
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;