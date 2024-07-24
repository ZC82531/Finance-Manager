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
      toast.success("Logout Successfully!!");
      ref.current.complete();
      navigate('/login');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='flex justify-between items-center h-24 bg-neutral-950 px-6'>
      {/* Logo */}
      <div className='text-white font-bold text-3xl'>
        <span className='text-green-600'>Expense</span> Tracker
      </div>

      {/* Logout Button */}
      <a href="#_" onClick={logoutHandle} className='ml-6 text-lg text-white'>
        Log Out
      </a>

      {/* Loading Bar */}
      <LoadingBar color='orange' ref={ref} />
    </div>
  );
}

export default NavBar;
