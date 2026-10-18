const express = require('express');
const router = express.Router();
const productModel = require('../models/productModel');
const upload = require('../config/multer-config'); // Aapka multer configuration

router.post('/create', upload.single('image'), async (req, res) => {
    try {
        let { name, price } = req.body;

        // 1. Check if product already exists
        const existingProduct = await productModel.findOne({ name });
        if (existingProduct) {
            return res.status(409).json({ message: "Product already exists" });
        }

        // 2. Check if image is uploaded
        if (!req.file) {
            return res.status(400).json({ message: "Product image is required" });
        }

        // 3. Create Product in MongoDB
        const createdProduct = await productModel.create({
            image: req.file.buffer, // Agar memoryStorage use kar rahe ho (Buffer)
            name,
            price
        });

        // 4. Send success response back to frontend
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
        let products = await productModel.find();
        
        let formattedProducts = products.map(product => {
            return {
                _id: product._id,
                name: product.name,
                price: product.price,
                // Check karein ke product.image Buffer hai ya nahi
                image: product.image ? `data:image/jpeg;base64,${Buffer.from(product.image).toString('base64')}` : null
            };
        });

        res.status(200).json(formattedProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;