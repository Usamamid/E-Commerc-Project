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

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.MONGODB_URI, { bufferCommands: false })
            .then(async (m) => {
                dbgr('MongoDB Connected Successfully');
                await createDevelopmentOwner();
                return m;
            });
    }
    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        dbgr('MongoDB Connection Error:', err.message);
        throw err;
    }
    return cached.conn;
}

module.exports = connectDB;