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
  const [financialAdvice, setFinancialAdvice] = useState('');
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
        console.error('Error fetching user expenses:', error);
      }
    };
    fetchData();
  }, [userdata._id, navigate]);

  const getTotal = () => {
    if (!Array.isArray(userexp)) return 0;
    return userexp.reduce((total, item) => total + item.amount, 0);
  };

  const handleCreateExpense = () => {
    const expInfo = { usersid: userdata._id, category, date: selectDate, amount };
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
        console.error('Error creating expense:', error);
        loadingBarRef.current.complete();
      });
  };

  const fetchFinancialAdvice = async () => {
    try {
      setFetchingAdvice(true);
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

      let prompt;
      if (!userexp || userexp.length === 0) {
        prompt =
          'The user has no recorded expenses yet. Give them a warm, encouraging 1-2 sentence response and suggest they start tracking their spending to receive personalised financial advice. No asterisks or markdown.';
      } else {
        const total = getTotal().toFixed(2);
        const summary = userexp
          .map((i) => `- $${i.amount} on ${i.category}`)
          .join('\n');
        prompt = `Here is the user's expense history (total: $${total}):\n${summary}\n\nProvide specific, actionable financial advice in 2-3 sentences. Include recommended budget percentages per category where relevant. No asterisks or markdown formatting.`;
      }

      const result = await model.generateContent(prompt);
      setFinancialAdvice(result.response.text());
    } catch (error) {
      console.error('Error generating financial advice:', error);
      setFinancialAdvice('Unable to fetch advice right now. Please try again later.');
    } finally {
      setFetchingAdvice(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-950'>
      <LoadingBar color='#6366f1' ref={loadingBarRef} />
      <NavBar data={userexp} />

      <main className='max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6'>

        {/* Spending Breakdown */}
        <section className='bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800'>
          <h2 className='text-white font-bold text-xl mb-5'>Spending Breakdown</h2>
          <Chartss exdata={userexp} />
        </section>

        {/* Create Transaction */}
        <section className='bg-indigo-700 rounded-2xl p-6 shadow-lg'>
          <h2 className='text-white font-bold text-xl mb-5'>Create Transaction</h2>
          <div className='flex flex-wrap gap-3 items-center'>
            <input
              type='number'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='Amount'
              className='h-11 w-36 text-sm px-4 rounded-xl outline-none bg-white/20 text-white placeholder-white/70 focus:bg-white/30 transition'
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='h-11 w-40 text-sm px-3 rounded-xl outline-none bg-white text-gray-800 border-0 cursor-pointer'
            >
              <option value=''>-- Category --</option>
              <option value='Grocery'>Grocery</option>
              <option value='Vehicle'>Vehicle</option>
              <option value='Shopping'>Shopping</option>
              <option value='Travel'>Travel</option>
              <option value='Food'>Food</option>
              <option value='Fun'>Fun</option>
              <option value='Other'>Other</option>
            </select>
            <DatePicker
              selected={selectDate}
              onChange={(date) => setSelectedDate(date)}
              className='h-11 w-36 text-sm px-4 rounded-xl outline-none bg-white/20 text-white placeholder-white/70 focus:bg-white/30 transition'
              placeholderText='Date'
              showYearDropdown
            />
            <button
              onClick={handleCreateExpense}
              className='h-11 px-6 rounded-xl bg-white text-indigo-700 font-bold text-sm hover:bg-indigo-50 transition'
            >
              Add Expense
            </button>
          </div>
        </section>

        {/* Summary */}
        <section className='bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-800'>
          <div className='flex items-center justify-between mb-5 flex-wrap gap-3'>
            <div>
              <h2 className='text-white font-bold text-xl'>Summary of Expenses</h2>
              <p className='text-gray-400 text-sm mt-1'>
                Total: <span className='text-indigo-400 font-semibold'>${getTotal().toFixed(2)}</span>
              </p>
            </div>
            <button
              onClick={fetchFinancialAdvice}
              className='h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition'
            >
              Get AI Advice
            </button>
          </div>
          {userexp.length === 0 ? (
            <p className='text-gray-500 text-sm text-center py-8'>No expenses yet. Add one above.</p>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {userexp.map((item) => (
                <Items key={item._id} data={item} />
              ))}
            </div>
          )}
        </section>

        {/* Financial Advice */}
        {fetchingAdvice && (
          <section className='bg-gray-900 rounded-2xl p-6 border border-gray-800 flex flex-col items-center gap-4'>
            <p className='text-gray-400 text-sm'>Generating advice…</p>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400' />
          </section>
        )}
        {!fetchingAdvice && financialAdvice && (
          <section className='bg-gray-900 rounded-2xl p-6 border border-indigo-800 shadow-lg'>
            <h2 className='text-indigo-400 font-bold text-lg mb-3'>AI Financial Advice</h2>
            <p className='text-gray-300 text-sm leading-relaxed'>{financialAdvice}</p>
          </section>
        )}

      </main>
    </div>
  );
}

export default Home;
