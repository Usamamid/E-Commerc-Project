const express=require('express');
const app=express();
const cors=require('cors');
app.use(cors());
app.use(express.json());
const path=require('path');
const cookieParser=require('cookie-parser');
const mongooseConnections=require('./config/mongoose-connections');
const userRoute=require('./routes/userRoute');
const ownerRoute=require('./routes/ownerRoute');
const productRoute=require('./routes/productRoute');

app.use(cookieParser());

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/users',userRoute);
app.use('/owners',ownerRoute);
app.use('/products',productRoute);
app.listen(3000)