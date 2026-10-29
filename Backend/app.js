const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/mongoose-connections');

const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');
const login = require('./routes/login');
const orderRoute = require('./routes/orderRoute');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({ message: 'Database connection failed' });
    }
});

app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/login', login);
app.use('/api/order', orderRoute);
app.get('/', (req, res) => {
    res.send('Backend is running successfully!');
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT);
}

module.exports = app;