import React from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { deleteExpense } from '../utils/renders';

function Items({ data }) {
  const exp = data;

  function getDate() {
    const d = new Date(Date.parse(exp.date));
    const txt = d.toString();
    return txt.substring(8, 10) + ' ' + txt.substring(4, 7);
  }

  return (
    <div className='flex bg-gray-800 border border-gray-700 rounded-2xl p-5 justify-between items-center gap-4 hover:border-gray-600 transition'>
      <div className='flex flex-col gap-2'>
        <p className='text-white font-bold text-xl'>${exp.amount}</p>
        <span className='text-xs text-indigo-400 border border-indigo-800 rounded-full px-2.5 py-0.5 w-fit'>
          {exp.category}
        </span>
      </div>
      <div className='flex flex-col items-end gap-3'>
        <span className='text-gray-400 text-sm'>{getDate()}</span>
        <button
          onClick={() => deleteExpense({ expenseId: exp._id, userId: exp.usersid })}
          className='p-2 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 transition'
          aria-label='Delete expense'
        >
          <AiFillDelete />
        </button>
      </div>
    </div>
  );
}

export default Items;
