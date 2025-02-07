import React, { useState, useEffect } from 'react';
import Typewriter from 'typewriter-effect'; 
import Lottie from 'lottie-react';          
import scroll from '../assets/scroll.json'; 
import '../styles/blob.css'; 

function Welcome() {
  const [currentText, setCurrentText] = useState(0);

  useEffect(() => {
    if (currentText === 0) {
      setTimeout(() => setCurrentText(1), 1000);
    } else if (currentText === 1) {
      setTimeout(() => setCurrentText(2), 1000);
    } else if (currentText === 2) {
      setTimeout(() => setCurrentText(3), 1000);
    }
  }, [currentText]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative overflow-hidden flex-col">
      <div className="rotating-oval"></div>

      <h1 className="absolute top-[2rem] left-10 text-8xl font-bold text-blue-600 z-10">
        {currentText >= 0 && (
          <Typewriter
            options={{
              strings: ['Welcome'],
              autoStart: true,
              loop: false,
              delay: 100,
              pauseFor: 1000000,
              cursor: '', 
            }}
          />
        )}
      </h1>

      <h2 className="absolute top-[12rem] left-10 text-8xl font-bold text-blue-600 z-10">
        {currentText >= 1 && (
          <Typewriter
            options={{
              strings: ['To'],
              autoStart: true,
              loop: false,
              delay: 100,
              pauseFor: 1000000,
              cursor: '',
            }}
          />
        )}
      </h2>

      <h3 className="absolute  top-[22rem] left-10 text-8xl font-bold text-blue-600 z-10">
        {currentText >= 2 && (
          <Typewriter
            options={{
              strings: ['CodeBuddy'],
              autoStart: true,
              loop: false,
              delay: 100,
              pauseFor: 1000000,
              cursor: '',
            }}
          />
        )}
      </h3>
      <h3 className="absolute top-[32rem] left-10 text-7xl font-bold text-gray-600 z-10">
        {currentText >= 3 && (
          <Typewriter
            options={{
              strings: ['Where collaboration is made easy'],
              autoStart: true,
              loop: false,
              delay: 100,
              pauseFor: 1000000,
              cursor: '',
            }}
          />
        )}
      </h3>

      <div className='absolute top-[32rem] right-[9rem]'>
        <Lottie animationData={scroll} loop={true} />
      </div>
    </div>
  );
}

export default Welcome;
