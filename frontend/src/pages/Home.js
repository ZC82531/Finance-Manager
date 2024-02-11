import React, { useEffect, useState, useRef } from 'react'; // Importing necessary React hooks
import { useNavigate } from 'react-router-dom'; // Hook for navigation
import Items from '../components/Items'; // Importing Items component for displaying expense items
import { Chartss } from '../components/Chartss'; // Importing Chart component for visualizing expenses
import "react-datepicker/dist/react-datepicker.css"; // DatePicker styles
import DatePicker from "react-datepicker"; // DatePicker component
import LoadingBar from 'react-top-loading-bar'; // Loading bar for async operations
import { createExpense, getUserExpenses } from '../utils/renders'; // Functions for expense operations
import NavBar from '../components/NavBar'; // Navigation bar component
import { GoogleGenerativeAI } from '@google/generative-ai'; // Google Generative AI for financial advice
import './fonts.css'; // Custom fonts

function Home() {
  const navigate = useNavigate(); // Initialize navigation
  const [selectDate, setSelectedDate] = useState(null); // State for selected date
  const [amount, setAmount] = useState(''); // State for expense amount
  const [category, setCategory] = useState(''); // State for expense category
  const [userdata] = useState(JSON.parse(localStorage.getItem('User'))); // Retrieve user data from localStorage
  const [userexp, setUserexp] = useState([]); // State for user expenses
  const [financialAdvice, setFinancialAdvice] = useState('Want Financial Advice? Just ask.'); // Initial advice message
  const [isLoading, setIsLoading] = useState(false); // State for loading status
  const [fetchingAdvice, setFetchingAdvice] = useState(false); // State for fetching advice status
  const loadingBarRef = useRef(null); // Ref for loading bar

  // Fetch user expenses on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!localStorage.getItem('User')) { // Check if user is logged in
          navigate('/login'); // Redirect to login if not
          return;
        }
        const data = await getUserExpenses(userdata._id); // Fetch user expenses
        setUserexp(data); // Update state with fetched expenses
      } catch (error) {
        console.error("Error fetching user expenses:", error); // Log error
      }
    };

    fetchData(); // Call fetchData
  }, [userdata._id, navigate]); // Dependencies: user ID and navigate function

  // Calculate total expenses
  const getTotal = () => {
    if (!Array.isArray(userexp)) {
      return 0; // Return 0 if userexp is not an array
    }
    return userexp.reduce((total, item) => total + item.amount, 0); // Sum up expense amounts
  };

  // Handle creating a new expense
  const handleCreateExpense = () => {
    const expInfo = {
      usersid: userdata._id, // User ID
      category, // Expense category
      date: selectDate, // Expense date
      amount // Expense amount
    };

    loadingBarRef.current.staticStart(); // Start loading bar
    createExpense(expInfo) // Create expense
      .then(() => {
        loadingBarRef.current.complete(); // Complete loading bar
        setCategory(''); // Reset category
        setAmount(''); // Reset amount
        setSelectedDate(null); // Reset date
        return getUserExpenses(userdata._id); // Fetch updated expenses
      })
      .then((data) => setUserexp(data)) // Update user expenses
      .catch((error) => {
        console.error("Error creating expense:", error); // Log error
        loadingBarRef.current.complete(); // Complete loading bar on error
      });
  };

  // Generate summary of expenses
  const generateExpenseSummary = () => {
    let summary = "Expense Summary:\n"; // Initialize summary string
    userexp.forEach((item) => {
      summary += `- Spent $${item.amount} on ${item.category}.\n`; // Append each expense to summary
    });
    return summary; // Return summary
  };

  // Generate prompt for AI financial advice
  const generatePromptForAI = () => {
    const expenseSummary = generateExpenseSummary(); // Get summary
    const prompt = `${expenseSummary}\nProvide financial advice in a sentence or two. Give specific budget percentages to aim for within each category, and do not output any stars in text`; // Format prompt
    return prompt; // Return prompt
  };

  // Fetch financial advice from Google Generative AI
  const fetchFinancialAdvice = async () => {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY); // Initialize Google AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Specify AI model
    const prompt = generatePromptForAI(); // Generate prompt

    try {
      setFetchingAdvice(true); // Set fetching status
      const result = await model.generateContent(prompt); // Generate content
      const response = await result.response; // Get response
      const advice = response.text(); // Extract text from response
      setFinancialAdvice(advice); // Update financial advice state
    } catch (error) {
      console.error("Error generating financial advice:", error); // Log error
    } finally {
      setFetchingAdvice(false); // Reset fetching status
    }
  };

  // Handle button click for fetching advice
  const handleFetchAdviceClick = () => {
    fetchFinancialAdvice(); // Call fetch advice function
  };

  return (
    <div>
      <LoadingBar color='orange' ref={loadingBarRef} /> {/* Loading bar component */}
      <NavBar data={userexp} /> {/* Navigation bar */}
      <div className='flex flex-col items-center pt-8 overflow-y-auto'>

        {/* Bar Graph Section */}
        <div className='w-full max-w-7xl px-0 mx-auto mb-8'>
          <div className='bg-gray-200 rounded-3xl shadow-md hover:shadow-lg transition duration-300'>
            <div className='flex justify-center mb-4'>
              <div style={{ maxWidth: '100%' }}>
                <Chartss exdata={userexp} /> {/* Chart component for expenses */}
              </div>
            </div>
          </div>
        </div>

        {/* Create Transaction Section */}
        <div className='w-full max-w-7xl px-4 py-8 bg-blue-600 rounded-3xl shadow-md hover:shadow-lg transition duration-300'>
          <div className='font-bold text-3xl text-black mb-6 text-center'>Create Transaction</div>
          <div className='flex flex-col sm:flex-row gap-4 items-center justify-center'>
            <input
              type='number'
              value={amount} // Amount input
              onChange={(e) => setAmount(e.target.value)} // Update amount state
              placeholder='Amount'
              className='h-12 w-full sm:w-36 text-base placeholder-black p-4 rounded-xl outline-none bg-opacity-50 focus:bg-opacity-70 transition duration-300'
            />
            <select
              id="categories"
              value={category} // Category select
              onChange={(e) => setCategory(e.target.value)} // Update category state
              className="bg-white w-full sm:w-36 outline-none border placeholder-black border-gray-300 text-gray-900 text-sm rounded-xl block p-2.5 focus:bg-opacity-70 transition duration-300"
            >
              <option value=''>--Select--</option> {/* Default option */}
              <option value='Grocery'>Grocery</option> {/* Category options */}
              <option value='Vehicle'>Vehicle</option>
              <option value='Shopping'>Shopping</option>
              <option value='Travel'>Travel</option>
              <option value='Food'>Food</option>
              <option value='Fun'>Fun</option>
              <option value='Other'>Other</option>
            </select>
            <div className='w-full sm:w-auto flex-shrink'>
              <DatePicker
                selected={selectDate} // Selected date
                onChange={(date) => setSelectedDate(date)} // Update selected date state
                className="p-3 placeholder-black w-full rounded-xl outline-none bg-opacity-50 focus:bg-opacity-70 transition duration-300"
                placeholderText="Date"
                showYearDropdown
              />
            </div>
            <button
              onClick={handleCreateExpense} // Handle adding expense
              className="h-12 w-full sm:w-auto min-w-max rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold focus:outline-none transition duration-300 hover:opacity-80 mt-4 sm:mt-0"
              style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
            >
              Add Expense
            </button>
          </div>
        </div>

        {/* Summary of Expenses Section */}
        <div className='w-full max-w-7xl px-4 py-8 mt-8 bg-purple-400 rounded-3xl shadow-md hover:shadow-lg transition duration-300'>
          <div className='font-bold text-3xl text-white mb-6 text-center'>Summary of Expenses</div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center'>
            {userexp.map((item) => (
              <Items key={item._id} data={item} /> // Render Items component for each expense
            ))}
          </div>
          {/* Display summary string */}
          <div className="text-white text-lg mt-4 text-center">
            <pre>{generateExpenseSummary()}</pre> {/* Display generated summary */}
          </div>
          {/* Button for fetching financial advice */}
          <button
            onClick={handleFetchAdviceClick} // Handle fetching advice
            className="h-12 w-full sm:w-auto min-w-max rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold focus:outline-none transition duration-300 hover:opacity-80 mt-4"
            style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
          >
            Get Financial Advice
          </button>
        </div>

        {/* Financial Advice Section */}
        {fetchingAdvice && (
          <div className="w-full max-w-7xl px-4 py-8 mt-8 bg-green-400 rounded-3xl shadow-md hover:shadow-lg transition duration-300">
            <div className="font-bold text-3xl text-white mb-6 text-center">Generating Response...</div>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div> {/* Loading spinner */}
            </div>
          </div>
        )}
        {!fetchingAdvice && financialAdvice && (
          <div className='w-full max-w-7xl px-4 py-8 mt-8 bg-green-500 rounded-3xl shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center justify-center'>
            <div className='font-bold text-4xl text-white mb-6 text-center'>Financial Advice</div>
            <div className="text-white text-lg mt-4 text-center">
              <p>{financialAdvice}</p> {/* Display fetched financial advice */}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Home; // Exporting Home component
