const mongoose = require('mongoose');

// Define the schema for expense documents in the database
const expenseSchema = new mongoose.Schema({
    usersid: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user
        required: true,
        ref: 'users'
    },
    amount: {
        type: Number, // Amount of the expense
        required: true 
    },
    category: {
        type: String, // Category of the expense
        required: true,
    },
    date: {
        type: String, // Date of the expense
        required: true,
    }
}, {
    timestamps: true // Automatically create createdAt and updatedAt fields
});

// Create a model based on the expense schema
const expenseModel = mongoose.model('expenses', expenseSchema);

// Export the expense model for use in other parts of the application
module.exports = expenseModel;