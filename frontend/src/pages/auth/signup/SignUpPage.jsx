import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';



import { signUpUser } from '../../../services/AuthApi.js';
function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await signUpUser(formData);
      console.log('Signup successful:', response)
      toast.success("User signed up successfully! Navigationg to login page");
      setTimeout(()=>{
        navigate('/login');
      }, 1000)
    } catch (error) {
      console.error('Signup failed:', error);
      const errorMessage = error?.error || "SignUp failed. Please try again."; 
      toast.error(errorMessage);
    }
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl transform transition-transform duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Sign Up</h2>

        <label className="flex flex-col gap-1 mb-4">
          <span className="font-medium text-gray-700">Username</span>
          <input
            type="text"
            className="p-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:shadow-md transition duration-300"
            placeholder="BugHunter"
            name="username"
            onChange={handleChange}
            value={formData.username}
            required

          />
        </label>

        <label className="flex flex-col gap-1 mb-4">
          <span className="font-medium text-gray-700">Email</span>
          <input
            type="email"
            className="p-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:shadow-md transition duration-300"
            placeholder="hunter@site.com"
            name="email"
            onChange={handleChange}
            value={formData.email}
            required
          />
        </label>

        <label className="flex flex-col gap-1 mb-6">
          <span className="font-medium text-gray-700">Password</span>
          <input
            type="password"
            className="p-2 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:shadow-md transition duration-300"
            placeholder="••••••••"
            name="password"
            onChange={handleChange}
            value={formData.password}
            required
          />
        </label>

        <button
          className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 hover:shadow-xl transition duration-300"  onClick={handleSubmit}
        >
          Submit
        </button>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500 hover:underline hover:text-blue-700 transition duration-300">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
