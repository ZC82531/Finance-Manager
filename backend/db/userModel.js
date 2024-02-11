const mongoose = require('mongoose');

// Define the schema for user documents in the database
const userSchema = new mongoose.Schema({
    username: {
        type: String, // Username of the user
        required: true
    },
    email: {
        type: String, // Email of the user
        required: true,
        unique: true // Email must be unique
    },
    password: {
        type: String, // Password of the user
        required: true,
    },
    expense_id: [{
        type: mongoose.Schema.Types.ObjectId, // References to associated expenses
        ref: 'expenses'
    }],
}, {
    timestamps: true // Automatically create createdAt and updatedAt fields
});

// Create a model based on the user schema
const userModel = mongoose.model('users', userSchema);

// Export the user model for use in other parts of the application
module.exports = userModel;
