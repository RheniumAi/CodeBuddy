import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Welcome to CodeBuddy</h1>
      <button className="button" onClick={() => navigate('/signup')}>
        Signup
      </button>
      <button className="button" onClick={() => navigate('/login')}>
        Login
      </button>
    </div>
  );
};

export default Home;
