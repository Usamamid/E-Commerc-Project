const express=require('express');
const app=express();
const cors=require('cors');
require('dotenv').config(); 
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true                
}));
app.use(express.json());
const path=require('path');
const cookieParser=require('cookie-parser');
const mongooseConnections=require('./config/mongoose-connections');
const userRoute=require('./routes/userRoute');
const productRoute=require('./routes/productRoute');
const login=require('./routes/login')
const orderRoute=require('./routes/orderRoute')

app.use(cookieParser());

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/users',userRoute);
app.use('/products',productRoute);
app.use('/login',login)
app.use('/order', orderRoute)


app.use(express.static(path.join(__dirname, '../Frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/dist', 'index.html'));
});

app.listen(3000)