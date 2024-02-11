const expenseModel = require('../db/expenseModel');
const userModel = require('../db/userModel');
const { error, success } = require('../utils/handler');

/**
 * Creates a new expense entry.
 */
const createExpense = async (req, res) => {
    try {
        // Destructure required fields from request body
        const { amount, category, date, usersid } = req.body;
        
        // Check for missing fields
        if (!amount || !category || !date || !usersid) {
            return res.send(error(401, "All Details Are Required"));
        }

        // Create the new expense
        const newExpense = await expenseModel.create(req.body);

        // Find the user and populate their expense list
        const userToUse = await userModel.findById(usersid).populate('expense_id');
        
        // Add the new expense ID to the user's expense list
        userToUse.expense_id.push(newExpense._id);
        
        // Save the new expense and update the user
        newExpense.save();
        userToUse.save();
        
        // Send success response
        return res.send(success(200, newExpense));
    } catch (e) {
        // Handle errors
        return res.send(error(401, e.message));
    }
};

/**
 * Deletes an expense entry.
 */
const deleteExpense = async (req, res) => {
    try {
        // Extract expenseId and userId from request body
        const { expenseId, userId } = req.body;

        // Find the expense and user
        const expense = await expenseModel.findById(expenseId);
        const user = await userModel.findById(userId);

        // Check if both expense and user exist
        if (!expense || !user) {
            return res.send(error(401, `Invalid ${!expense} + ${!user}`));
        }

        // If the user has the expense, delete it
        if (user.expense_id.includes(expenseId)) {
            await expenseModel.findByIdAndDelete(expenseId);
            
            // Remove the expense ID from the user's list
            const index = user.expense_id.indexOf(expenseId);
            user.expense_id.splice(index, 1);
        }

        // Save the updated user
        await user.save();

        // Send success response
        return res.send(success(201, { respo: 'Successfully Deleted', user }));
    } catch (e) {
        // Handle errors
        return res.send(error(401, e.message));
    }
};

/**
 * Retrieves all expenses associated with a user.
 */
const getAllExpenses = async (req, res) => {
    try {
        // Extract userId from request body
        const { userId } = req.body;

        // Find the user and populate their expense list
        const user = await userModel.findById(userId).populate('expense_id');
        
        // Send success response with sorted expenses
        return res.send(success(200, user.expense_id.sort()));
    } catch (e) {
        // Handle errors
        return res.send(error(401, e.message));
    }
};

/**
 * Retrieves expenses filtered by category (currently unimplemented).
 */
const getCategoryExpense = async (req, res) => {
    try {
        // Implementation to be added
    } catch (e) {
        // Handle errors
        return res.send(error(401, e.message));
    }
};

module.exports = {
    createExpense,
    deleteExpense,
    getCategoryExpense,
    getAllExpenses,
};
