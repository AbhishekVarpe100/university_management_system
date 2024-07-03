const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the user schema
const staffSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    }
});

// Create the user model
const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;