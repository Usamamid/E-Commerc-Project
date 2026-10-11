const config=require('config');
const mongoose=require('mongoose');
const dbgr=require('debug')('development:mongoose-connections');
const OwnerModel=require('../models/ownerModel');

// 1. Owner create karne ka function
async function createDevelopmentOwner() {
    try {
        // Sirf development mode mein chalega
        if (process.env.NODE_ENV === 'development') {
            let owners = await OwnerModel.find();
            
            // Agar koi owner mojood nahi hai, tabhi create karega
            if (owners.length === 0) {
                await OwnerModel.create({
                    name: config.get('ADMIN_NAME'),
                    password: config.get('PASSWORD')
                });
                dbgr("✅ Default Development Owner successfully created!");
            } else {
                dbgr("ℹ️ Owner already exists.");
            }
        }
    } catch (err) {
        dbgr("❌ Error creating default owner:", err.message);
    }
}

// 2. MongoDB connection ke baad function ko call kar dein
mongoose.connect(`${config.get('MONGODB_URI')}`).then(async () => {
    dbgr('Connected to MongoDB');
    
    // Yahan function run ho jayega server start hote hi
    await createDevelopmentOwner();

}).catch((err) => {
    dbgr('Error connecting to MongoDB', err);
});

module.exports=mongoose;