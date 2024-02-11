import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../utils/axiosClient';
import { toast } from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';

function Signup() {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const [username, setUsername] = useState(''); // State for username input
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [isHovered, setIsHovered] = useState(false); // State to track hover effect
  const ref = useRef(null); // Ref for loading bar

  const handleHover = () => {
    setIsHovered(true); // Set hover state to true
  };

  const handleMouseLeave = () => {
    setIsHovered(false); // Reset hover state to false
  };

  const submitForm = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      ref.current.staticStart(); // Start the loading bar
      await axiosClient.post('/auth/signup', { // Send signup request
        username,
        email,
        password
      });

      toast.success('Registered Successfully !!'); // Show success message
      ref.current.complete(); // Complete loading bar
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.log(error.message); // Log error to console
      toast.error('Failed to register'); // Show error message
    } finally {
      if (ref.current) {
        ref.current.complete(); // Ensure loading bar is completed
      }
    }
  };

  return (
    <div className='bg-gradient-to-r from-blue-400 to-indigo-500 min-h-screen flex flex-col justify-center items-center'>
      <div className='text-white text-center p-8'>
        <h1 className='text-4xl font-bold mb-6'>Expense Tracker App</h1>
        <p className='text-lg'>Sign up to manage your expenses and stay organized.</p>
        <p className='text-lg mt-4'>Already have an account? <a href='/login' className='text-yellow-500 hover:underline'>Log In Now</a></p>
      </div>

      <div
        className={`relative bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-md hover:shadow-lg transition duration-300 transform ${
          isHovered ? 'scale-105' : ''
        }`}
        onMouseEnter={handleHover} // Trigger hover effect
        onMouseLeave={handleMouseLeave} // Reset hover effect
        style={{ maxWidth: '400px' }} 
      >
        <h1 className='text-4xl text-white font-bold mb-6 text-center'>Sign Up</h1>
        <form className='flex flex-col gap-4 items-center'>
          <input
            type='text'
            placeholder='Username'
            value={username} // Bind state to input value
            onChange={(e) => setUsername(e.target.value)} // Update state on change
            className='w-72 h-12 px-4 rounded-lg outline-none bg-opacity-50 focus:bg-opacity-70 transition duration-300'
          />
          <input
            type='text'
            placeholder='Email'
            value={email} // Bind state to input value
            onChange={(e) => setEmail(e.target.value)} // Update state on change
            className='w-72 h-12 px-4 rounded-lg outline-none bg-opacity-50 focus:bg-opacity-70 transition duration-300'
          />
          <input
            type='password'
            placeholder='Password'
            value={password} // Bind state to input value
            onChange={(e) => setPassword(e.target.value)} // Update state on change
            className='w-72 h-12 px-4 rounded-lg outline-none bg-opacity-50 focus:bg-opacity-70 transition duration-300'
          />
          <div style={{ marginTop: '10px', position: 'relative' }}>
            <LoadingBar
              color='green'
              ref={ref} // Ref for loading bar
              onLoaderFinished={() => ref.current.complete()} 
              style={{ position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0 }}
            />
          </div>
          <button
            onClick={submitForm} // Call submit function on click
            className={`w-72 h-12 rounded-lg font-bold focus:outline-none transition duration-300 relative overflow-hidden ${
              isHovered ? 'hover:bg-gradient-animation' : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
            }`}
          >
            <span className='absolute left-0 top-0 w-full h-full bg-gradient-to-r from-pink-500 to-pink-600 transition duration-300'></span>
            <span className='relative z-10'>Submit</span> // Submit button text
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
