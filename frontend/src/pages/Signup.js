import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../utils/axiosClient';
import { toast } from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false); 
  const ref = useRef(null);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      ref.current.staticStart();
      await axiosClient.post('/auth/signup', {
        username,
        email,
        password
      });

      toast.success('Registered Successfully !!');
      ref.current.complete();
      navigate('/login');
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to register');
    } finally {
      if (ref.current) {
        ref.current.complete(); 
      }
    }
  };

  return (
    <div className='bg-gradient-to-r from-blue-400 to-indigo-500 min-h-screen flex flex-col justify-center items-center'>
      {/* Top Section with Background Text */}
      <div className='text-white text-center p-8'>
        <h1 className='text-4xl font-bold mb-6'>Expense Tracker App</h1>
        <p className='text-lg'>Sign up to manage your expenses and stay organized.</p>
        <p className='text-lg mt-4'>Already have an account? <a href='/login' className='text-yellow-500 hover:underline'>Log In Now</a></p>
      </div>

      {/* Bottom Section with Signup Box */}
      <div
        className={`relative bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-md hover:shadow-lg transition duration-300 transform ${
          isHovered ? 'scale-105' : ''
        }`}
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseLeave}
        style={{ maxWidth: '400px' }} 
      >
        <h1 className='text-4xl text-white font-bold mb-6 text-center'>Sign Up</h1>
        <form className='flex flex-col gap-4 items-center'>
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-72 h-12 px-4 rounded-lg outline-none bg-opacity-50 focus:bg-opacity-70 transition duration-300'
          />
          <input
            type='text'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-72 h-12 px-4 rounded-lg outline-none bg-opacity-50 focus:bg-opacity-70 transition duration-300'
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-72 h-12 px-4 rounded-lg outline-none bg-opacity-50 focus:bg-opacity-70 transition duration-300'
          />
          <div style={{ marginTop: '10px', position: 'relative' }}>
            <LoadingBar
              color='green'
              ref={ref}
              onLoaderFinished={() => ref.current.complete()}
              style={{ position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0 }}
            />
          </div>
          {/* Signup Button */}
          <button
            onClick={submitForm}
            className={`w-72 h-12 rounded-lg font-bold focus:outline-none transition duration-300 relative overflow-hidden ${
              isHovered ? 'hover:bg-gradient-animation' : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
            }`}
          >
            {/* Gradient Overlay */}
            <span className='absolute left-0 top-0 w-full h-full bg-gradient-to-r from-pink-500 to-pink-600 transition duration-300'></span>
            <span className='relative z-10'>Submit</span>
          </button>
        </form>
      </div>

      {/* Additional Text */}
    </div>
  );
}

export default Signup;
