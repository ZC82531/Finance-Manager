const { createExpense, deleteExpense, getCategoryExpense, getAllExpenses } = require('../controller/expenseController');

const router = require('express').Router();
// Each one is an HTTP route and invokes a function imported from expenseController in the header. The specific HTTP request is specified.
router.post('/addExpense',createExpense)
router.post('/deleteExpense',deleteExpense)
router.get('/categoryExpense',getCategoryExpense)
router.post('/allExpenses',getAllExpenses)

module.exports = router;