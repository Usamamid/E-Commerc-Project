const mongoose=require('mongoose');

const ownerSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

module.exports=mongoose.model('Owner', ownerSchema);