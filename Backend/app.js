const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config(); 

// ✅ FIX 1: Allow credentials and dynamic/all origins for Vercel & local
app.use(cors({
    origin: true, // Allows requests from any frontend origin (including your Vercel URL)
    credentials: true            
}));

app.use(express.json());
const path = require('path');
const cookieParser = require('cookie-parser');
const mongooseConnections = require('./config/mongoose-connections');

const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const login = require('./routes/login');
const orderRoute = require('./routes/orderRoute');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ✅ FIX 2: Added '/api' prefix to match vercel.json routing
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/login', login);
app.use('/api/order', orderRoute);
app.get('/', (req, res) => {
    res.send('Backend is running successfully!');
});

// Optional: Fallback for local testing if needed
const PORT = process.env.PORT || 3000;

// ✅ FIX 3: Conditional listen for local, export app for Vercel serverless
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;