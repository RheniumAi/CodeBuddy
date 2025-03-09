import React from 'react'
import Lottie from 'lottie-react';
import codeAnimation from '../../assets/code.json';
function About() {
  return (
    
      <div className='flex flex-col sm:flex-row justify-center items-center py-12'>
        <div className='w-full sm:w-1/2 px-6 sm:px-12 mb-6 sm:mb-0'>
          <h2 className='text-3xl font-bold text-blue-600 mb-4'>What is CodeBuddy?</h2>
          <p className='text-lg'>
            CodeBuddy – the ultimate platform for seamless collaborative coding! Whether you're debugging, brainstorming ideas, or coding together, CodeBuddy brings your team closer.
          </p>
          <p className='mt-4 text-lg'>
            With real-time collaboration, AI-powered code suggestions, and built-in audio calling, working on projects has never been this efficient. Join CodeBuddy today and make your coding experience smoother, faster, and more fun!
          </p>
          <div className="mt-8">
            <a href="/features" className="bg-blue-600 text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-blue-700 mt-4">
              Features
            </a>
          </div>
        </div>
        <div className='w-full sm:w-1/3'>
          <Lottie animationData={codeAnimation} loop={true} />
        </div>
      </div>
  )
}

export default About
