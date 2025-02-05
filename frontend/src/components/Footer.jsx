import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className='bg-[#BBE0F4] flex flex-col items-center mt-20 p-6'>
      <div className='text-4xl font-bold text-[#2563EB] mb-4'>CodeBuddy</div>
      <div className='flex justify-center space-x-10'>
        <div className='flex flex-col items-center space-y-2'>
          <Link to='#' className='text-gray-700 hover:text-[#2563EB]'>GitHub</Link>
          <Link to='/about' className='text-gray-700 hover:text-[#2563EB]'>About</Link>
        </div>
        <div className='flex flex-col items-center space-y-2'>
          <Link to='/contact' className='text-gray-700 hover:text-[#2563EB]'>Contact Us</Link>
          <Link to='/features' className='text-gray-700 hover:text-[#2563EB]'>Features</Link>
        </div>
      </div>
      <div className='text-center text-gray-600 mt-6'>
        Made with <span className='text-red-500'>❤️</span> by{' '}
        <Link to='#' className='text-[#2563EB] hover:underline'>Pushpesh</Link>{' '} 
        and{' '}
        <Link to='#' className='text-[#2563EB] hover:underline'>Sameer</Link>.
      </div>
    </div>
  );
}

export default Footer;
