const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dbgr = require('debug')('development:mongoose-connections');
const OwnerModel = require('../models/ownerModel');

async function createDevelopmentOwner() {
    try {
        let owners = await OwnerModel.find();
        
        if (owners.length === 0) {
            const hashedPassword = await bcrypt.hash(process.env.PASSWORD, 10);

            await OwnerModel.create({
                name: process.env.ADMIN_NAME,
                password: hashedPassword
            });
            dbgr("✅ Default Owner successfully created!");
        } else {
            dbgr("ℹ️ Owner already exists.");
        }
    } catch (err) {
        dbgr("❌ Error creating default owner:", err.message);
    }
}
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('MongoDB Connected Successfully');

        await createDevelopmentOwner();
    })
    .catch((err) => {
        console.error('MongoDB Connection Error:', err.message);
    });

module.exports = mongoose;