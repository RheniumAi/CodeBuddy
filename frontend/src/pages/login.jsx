import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null); // For error handling

  const handleChange = (e) => {
    // Clear error message on input change
    setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form data:', formData);  // Log the form data being submitted

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      alert(response.data.message);  // Show success message
    } catch (err) {
      console.error('Error during login:', err);  // Log error if there's an issue
      setError(err.response ? err.response.data.message : 'An error occurred');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}  {/* Show error if exists */}
    </div>
  );
};

export default Login;
