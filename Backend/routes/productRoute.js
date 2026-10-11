const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Logic to fetch products from the database
    res.send("its working");
});

module.exports = router;