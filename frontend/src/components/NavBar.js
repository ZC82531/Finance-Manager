import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import { useRef } from 'react';

function NavBar() {
  const ref = useRef(null);
  const navigate = useNavigate();

  const logoutHandle = async () => {
    try {
      ref.current.staticStart();
      localStorage.removeItem('User');
      toast.success('Logged out');
      ref.current.complete();
      navigate('/login');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <nav className='flex justify-between items-center h-16 bg-gray-900 border-b border-gray-800 px-6'>
      <div className='text-white font-bold text-2xl tracking-tight'>
        <span className='text-indigo-400'>Expense</span> Tracker
      </div>
      <button
        onClick={logoutHandle}
        className='text-sm text-gray-400 hover:text-white transition'
      >
        Log Out
      </button>
      <LoadingBar color='#6366f1' ref={ref} />
    </nav>
  );
}

export default NavBar;

