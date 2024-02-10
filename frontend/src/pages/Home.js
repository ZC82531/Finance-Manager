import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Items from '../components/Items';
import { Chartss } from '../components/Chartss';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import LoadingBar from 'react-top-loading-bar';
import { createExpense, getUserExpenses } from '../utils/renders';
import NavBar from '../components/NavBar';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './fonts.css';

function Home() {
  const navigate = useNavigate();
  const [selectDate, setSelectedDate] = useState(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [userdata] = useState(JSON.parse(localStorage.getItem('User')));
  const [userexp, setUserexp] = useState([]);
  const [financialAdvice, setFinancialAdvice] = useState('Want Financial Advice? Just ask.');
  const [isLoading, setIsLoading] = useState(false); 
  const [fetchingAdvice, setFetchingAdvice] = useState(false); 
  const loadingBarRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!localStorage.getItem('User')) {
          navigate('/login');
          return;
        }
        const data = await getUserExpenses(userdata._id);
        setUserexp(data);
      } catch (error) {
        console.error("Error fetching user expenses:", error);
      }
    };

    fetchData();
  }, [userdata._id, navigate]);

  const getTotal = () => {
    if (!Array.isArray(userexp)) {
      return 0;
    }
    return userexp.reduce((total, item) => total + item.amount, 0);
  };

  const handleCreateExpense = () => {
    const expInfo = {
      usersid: userdata._id,
      category,
      date: selectDate,
      amount
    };

    loadingBarRef.current.staticStart();
    createExpense(expInfo)
      .then(() => {
        loadingBarRef.current.complete();
        setCategory('');
        setAmount('');
        setSelectedDate(null);
        return getUserExpenses(userdata._id);
      })
      .then((data) => setUserexp(data))
      .catch((error) => {
        console.error("Error creating expense:", error);
        loadingBarRef.current.complete();
      });
  };

 
  const generateExpenseSummary = () => {
    let summary = "Expense Summary:\n";
    userexp.forEach((item) => {
      summary += `- Spent $${item.amount} on ${item.category}.\n`;
    });
    return summary;
  };


  const generatePromptForAI = () => {
    const expenseSummary = generateExpenseSummary();
    const prompt = `${expenseSummary}\nProvide financial advice in a sentence or two. Give specific budget percentages to aim for within each category, and do not output any stars in text`;
    return prompt;
  };

 
  const fetchFinancialAdvice = async () => {
    const genAI = new GoogleGenerativeAI('AIzaSyAx0mb2jYfwVCwrDIc4gquyPvKCZDUAoPA'); 
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = generatePromptForAI();

    try {
      setFetchingAdvice(true); 
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const advice = response.text();
      setFinancialAdvice(advice);
    } catch (error) {
      console.error("Error generating financial advice:", error);
    } finally {
      setFetchingAdvice(false); 
    }
  };


  const handleFetchAdviceClick = () => {
    fetchFinancialAdvice();
  };

  return (
    <div>
      <LoadingBar color='orange' ref={loadingBarRef} />
      <NavBar data={userexp} />
      <div className='flex flex-col items-center pt-8 overflow-y-auto'>

        {/* Bar Graph Section */}
        <div className='w-full max-w-7xl px-0 mx-auto mb-8'>
          <div className='bg-gray-200 rounded-3xl shadow-md hover:shadow-lg transition duration-300'>
            <div className='flex justify-center mb-4'>
              <div style={{ maxWidth: '100%' }}>
                <Chartss exdata={userexp} />
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='Amount'
              className='h-12 w-full sm:w-36 text-base placeholder-black p-4 rounded-xl outline-none bg-opacity-50 focus:bg-opacity-70 transition duration-300'
            />
            <select
              id="categories"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white w-full sm:w-36 outline-none border placeholder-black border-gray-300 text-gray-900 text-sm rounded-xl block p-2.5 focus:bg-opacity-70 transition duration-300"
            >
              <option value=''>--Select--</option>
              <option value='Grocery'>Grocery</option>
              <option value='Vehicle'>Vehicle</option>
              <option value='Shopping'>Shopping</option>
              <option value='Travel'>Travel</option>
              <option value='Food'>Food</option>
              <option value='Fun'>Fun</option>
              <option value='Other'>Other</option>
            </select>
            <div className='w-full sm:w-auto flex-shrink'>
              <DatePicker
                selected={selectDate}
                onChange={(date) => setSelectedDate(date)}
                className="p-3 placeholder-black w-full rounded-xl outline-none bg-opacity-50 focus:bg-opacity-70 transition duration-300"
                placeholderText="Date"
                showYearDropdown
              />
            </div>
            <button
              onClick={handleCreateExpense}
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
              <Items key={item._id} data={item} />
            ))}
          </div>
          {/* Display summary string */}
          <div className="text-white text-lg mt-4 text-center">
            <pre>{generateExpenseSummary()}</pre>
          </div>
          {/* Button for fetching financial advice */}
          <button
            onClick={handleFetchAdviceClick}
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
            </div>
          </div>
        )}
        {!fetchingAdvice && financialAdvice && (
          <div className='w-full max-w-7xl px-4 py-8 mt-8 bg-green-500 rounded-3xl shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center justify-center'>
            <div className='font-bold text-4xl text-white mb-6 text-center'>Financial Advice</div>
            <div className="text-white text-lg mt-4 text-center">
              <p>{financialAdvice}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Home;
