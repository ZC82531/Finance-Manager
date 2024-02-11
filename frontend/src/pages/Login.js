import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../utils/axiosClient';
import { toast } from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';

function Login() {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const [email, setEmail] = useState(''); // State for email input
  const [password, setPassword] = useState(''); // State for password input
  const [isHovered, setIsHovered] = useState(false); // State to track hover effect
  const ref = useRef(null); // Ref for loading bar

  // Function to handle mouse hover effect
  const handleHover = () => {
    setIsHovered(true);
  };

  // Function to reset hover state on mouse leave
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Function to handle form submission
  const submitForm = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      ref.current.staticStart(); // Start the loading bar
      const response = await axiosClient.post('/auth/login', {
        email, // Email from state
        password // Password from state
      });

      // Check server response status
      if (response.data.statusCode !== 201) {
        toast.error(response.data.message); // Show error if login fails
      } else {
        toast.success('Successfully Logged In !!'); // Show success message
        localStorage.setItem('User', JSON.stringify(response.data.message)); // Store user info in local storage
        navigate('/'); // Redirect to home page
      }
    } catch (error) {
      console.log(error.message); // Log error to console
      toast.error('Failed to log in'); // Show error message
    } finally {
      if (ref.current) {
        ref.current.complete(); // Complete loading bar
      }
    }
  };

  return (
    <div className='bg-gradient-to-r from-blue-400 to-indigo-500 min-h-screen flex flex-col justify-center items-center'>
      {/* Top Section with Background Text */}
      <div className='text-white text-center p-8'>
        <h1 className='text-4xl font-bold mb-6'>Manage Your Expenses</h1>
        <p className='text-lg'>Track your spending and stay organized with our easy-to-use Expense Tracker App.</p>
        <p className='text-lg mt-4'>New User? <a href='/signup' className='text-yellow-500 hover:underline'>Sign Up Now</a></p>
      </div>

      {/* Bottom Section with Login Box */}
      <div
        className={`relative bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-md hover:shadow-lg transition duration-300 transform ${
          isHovered ? 'scale-105' : ''
        }`}
        onMouseEnter={handleHover} // Trigger hover effect
        onMouseLeave={handleMouseLeave} // Reset hover effect
        style={{ maxWidth: '400px' }} 
      >
        <h1 className='text-4xl text-white font-bold mb-6 text-center'>Welcome</h1>
        <form className='flex flex-col gap-4 items-center'>
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
              ref={ref} 
              onLoaderFinished={() => ref.current.complete()} 
              style={{ position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0 }} 
            />
          </div>
          {/* Login Button */}
          <button
            onClick={submitForm} // Call submit function on click
            className={`w-72 h-12 rounded-lg font-bold focus:outline-none transition duration-300 relative overflow-hidden ${
              isHovered ? 'hover:bg-gradient-animation' : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white'
            }`}
          >
            {/* Gradient Overlay */}
            <span className='absolute left-0 top-0 w-full h-full bg-gradient-to-r from-pink-500 to-pink-600 transition duration-300'></span>
            <span className='relative z-10'>Login</span>
          </button>
        </form>
      </div>

      {/* Additional Text */}
    </div>
  );
}

export default Login;
