import React from 'react'
import Lottie from 'lottie-react';
import collaborate from '../../assets/collaborate.json';
function Wait() {
  return (
    <div className='flex flex-col sm:flex-row justify-center items-center py-12'>
        <div className='w-full sm:w-1/3'>
          <Lottie animationData={collaborate} loop={true} />
        </div>
        <div className='w-full sm:w-1/2 px-6 sm:px-12 mb-6 sm:mb-0'>
          <h2 className='text-3xl font-bold text-blue-600 mb-4'>Why wait?</h2>
          <p className='text-lg'>
            Join CodeBuddy today and supercharge your coding experience! Collaborate in real-time, get AI-powered suggestions, and take your projects to the next level.
          </p>
          <div className="mt-8">
            <a href="/signup" className="bg-blue-600 text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-blue-700 mt-4">
              Join Now
            </a>
          </div>
        </div>
    </div>
  )
}

export default Wait
