const config=require('config');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const dbgr=require('debug')('development:mongoose-connections');
const OwnerModel=require('../models/ownerModel');

async function createDevelopmentOwner() {
    try {
        if (process.env.NODE_ENV === 'development') {
            let owners = await OwnerModel.find();
            
            if (owners.length === 0) {
                const hashedPassword = await bcrypt.hash(config.get('PASSWORD'), 10);

                await OwnerModel.create({
                    name: config.get('ADMIN_NAME'),
                    password: hashedPassword
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

mongoose.connect(`${config.get('MONGODB_URI')}`).then(async () => {
    dbgr('Connected to MongoDB');
    
    await createDevelopmentOwner();

}).catch((err) => {
    dbgr('Error connecting to MongoDB', err);
});

module.exports=mongoose;