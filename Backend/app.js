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
const ownerRoute=require('./routes/ownerRoute');
const productRoute=require('./routes/productRoute');
const login=require('./routes/login')

app.use(cookieParser());

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/users',userRoute);
app.use('/owners',ownerRoute);
app.use('/products',productRoute);
app.use('/login',login)
app.listen(3000)