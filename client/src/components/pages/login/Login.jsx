import React, { useState } from 'react';
import logo from '../../../assets/logo_cap.png'
import illustration from '../../../assets/login_ill.png'
import google_logo from '../../../assets/google_icon.png'

import { useNavigate } from 'react-router';

const Login = () => {

  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [showPassword,setShowPassword]=useState(false);

  const navigate=useNavigate();
  
  

 

  return (
    <>
     <header className="flex justify-around items-center mb-8">
          {/* Logo */}
          <div className="text-3xl font-bold text-gray-700 flex items-center">
            <img src={logo} alt="Logo" className="h-8 w-8 mr-2 mt-2" />
            Codemy
          </div>
          {/* Create Account Link */}
          <div>
            <span className="text-gray-500 mr-2">Don’t have an account?</span>
            <button onClick={()=>navigate('/signup')} className="text-orange-500 font-semibold hover:underline">Create Account</button>
          </div>
        </header>
    <div className="flex flex-grow grid-cols-2 bg-white">
      {/* Left Section - Illustration */}
      <div className="hidden lg:flex w-1/2  items-center justify-center">
        <div className="w-3/4">
          <img
            src={illustration} // Placeholder for illustration image
            alt="Illustration"
            className="mx-auto"
          />
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-10 relative">
        {/* Header */}
       

        {/* Sign In Form */}
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sign in to your account</h2>
          <form  className="space-y-5">
            <div>
              <label className="block text-gray-600 mb-2">Email</label>
              <input
              onChange={(e)=>setEmail(e.target.value)}
                type="email"
                placeholder="Username or email address..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Password</label>
              <div className="relative">
                <input
                onChange={(e)=>setPassword(e.target.value)}
                  type={showPassword?"text":"password"}
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-400"
                />
                <span onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3 cursor-pointer">
                <i className={`ri-${showPassword ? "eye" : "eye-off"}-line`}></i>
                </span>
              </div>
              <div className="flex justify-end">
                <a href="#" className="text-sm text-orange-500 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-gray-600">Remember me</label>
            </div>

            <button className="w-full py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600">
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="mt-3 text-center text-gray-500">or</div>
          <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase mt-3 mb-4">
                  <span className="bg-[#F8F7FF] px-2 text-gray-500">Sign 
                    In with</span>
                </div>
              </div> 

          {/* Google Sign-In Button */}
          <div className="w-full flex justify-center mt-2">
                <button
                
                  type="button"
                  className="flex w-50 items-center justify-around rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <img src={google_logo} alt=""  className='w-[25px]'/>
                  <span className="ml-2 border-l-2 pl-2">Google</span>
                </button>
              </div>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default Login;
