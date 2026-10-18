const multer = require('multer');

// Memory storage use karne se file direct buffer mein milti hai (MongoDB mein save karne ke liye best)
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Optional: Max 5MB file size limit
});

module.exports = upload;